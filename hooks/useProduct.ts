"use client"

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProducts, 
  getProductById,
  getActiveProducts,
  getNewArrivalProducts,
  getFeaturedProducts,
  getDepartmentCategoryProducts,
  CategoryProductsResponse,
  getProductBySlug,
  getSimilarProducts,
  addProductReview
} from "@/actions/products"
import type { ProductInput, ProductWithRelations, ReviewFormData } from "@/types/types"
import toast from "react-hot-toast"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"

type UseDepartmentProductsProps = {
  departmentSlug: string
  categoryId?: string
  limit?: number
}
// Fetch all products
export const useFetchProducts = () => {
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const data = await getProducts()
      return data || []
    },
  })

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isPending,
    error: productsQuery.error,
    refetch: productsQuery.refetch,
  }
}

// Fetch active products
export const useFetchActiveProducts = () => {
  const activeProductsQuery = useQuery({
    queryKey: ["active-products"],
    queryFn: async () => {
      const data = await getActiveProducts()
      return data || []
    },
  })

  return {
    products: activeProductsQuery.data || [],
    isLoading: activeProductsQuery.isPending,
    error: activeProductsQuery.error,
  }
}

// Fetch a single product
export const useFetchProduct = (productId: string) => {
  const productQuery = useQuery({
    queryKey: ["products", productId],
    queryFn: async () => {
      const data = await getProductById(productId)
      return data
    },
    enabled: !!productId,
  })

  return {
    product: productQuery.data,
    isLoading: productQuery.isPending,
    error: productQuery.error,
  }
}

// Create a product
export const useCreateProduct = () => {
    const queryClient = useQueryClient()
  
    const createProductMutation = useMutation({
      mutationFn: async (product: ProductInput) => {
        if (!product) {
          throw new Error("Product data is required")
        }
        
        const result = await createProduct(product)
        return result
      },
      onSuccess: (newProduct) => {
        // Update products cache
        queryClient.setQueryData(["products"], (oldData: ProductWithRelations[] = []) => 
          [...oldData, newProduct]
        )
        
        // Invalidate queries to ensure fresh data
        queryClient.invalidateQueries({ queryKey: ["products"] })
        queryClient.invalidateQueries({ queryKey: ["active-products"] })
        
        // Success toast
        toast.success("Product Published successfully. Awaiting approval.")
        
      },
      onError: (error: Error) => {
        // More specific error handling
        if (error.message.includes("Product limit exceeded")) {
          toast.error("You've reached your product creation limit. Please upgrade your subscription.")
        } else if (error.message.includes("Unauthorized")) {
          toast.error("You must be logged in to create a product.")
        } else {
          toast.error(error.message || "An unexpected error occurred while creating the product")
        }
        console.error("Product creation error:", error)
      },
    })
  
    return {
      createProduct: createProductMutation.mutate,
      isCreating: createProductMutation.isPending,
      error: createProductMutation.error,
    }
  }

// Update a product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, product }: { id: string; product: ProductInput }) => {
      return await updateProduct(id, product)
    },
    onSuccess: (updatedProduct) => {
      // Update products cache
      queryClient.setQueryData(["products"], (oldData: ProductWithRelations[] | undefined) => {
        if (!oldData) return [updatedProduct]
        return oldData.map((product) => 
          product.id === updatedProduct.id ? updatedProduct : product
        )
      })

      // Update specific product cache
      queryClient.setQueryData(["products", updatedProduct.id], updatedProduct)

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["active-products"] })
      queryClient.invalidateQueries({ queryKey: ["products", updatedProduct.id] })
      
      toast.success("Product updated successfully")
    },
    onError: (error) => {
      toast.error("An error occurred while updating the product")
      console.error(error)
    },
  })

  return {
    updateProduct: updateProductMutation.mutate,
    isUpdating: updateProductMutation.isPending,
    error: updateProductMutation.error,
  }
}

// Delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteProduct(id)
    },
    onSuccess: (deletedProduct) => {
      // Update products cache
      queryClient.setQueryData(["products"], (oldData: ProductWithRelations[] = []) =>
        oldData.filter((product) => product.id !== deletedProduct.id)
      )

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["active-products"] })
      
      toast.success("Product deleted successfully")
    },
    onError: (error) => {
      toast.error("An error occurred while deleting the product")
      console.error(error)
    },
  })

  return {
    deleteProduct: deleteProductMutation.mutate,
    isDeleting: deleteProductMutation.isPending,
    error: deleteProductMutation.error,
  }
}


export const useNewArrivalProducts = () => {
  const query = useQuery({
    queryKey: ["products", "newArrivals"],
    queryFn: async () => {
      const data = await getNewArrivalProducts()
      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    products: query.data || [],
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  }
}

export const useFeaturedProducts = () => {
  const query = useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const data = await getFeaturedProducts()
      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    products: query.data || [],
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  }
}


export const useDepartmentProducts = ({ 
  departmentSlug, 
  categoryId,
  limit = 15 
}: UseDepartmentProductsProps) => {
  const { ref, inView } = useInView()
  
  const query = useInfiniteQuery<CategoryProductsResponse>({
    queryKey: ["departmentProducts", departmentSlug, categoryId, limit],
    queryFn: async ({ pageParam }) => {
      const data = await getDepartmentCategoryProducts(
        departmentSlug,
        categoryId,
        pageParam as string,
        limit
      )
      return data
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
  
  useEffect(() => {
    if (inView && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage()
    }
  }, [inView, query])
  
  // Flatten products from all pages
  const allProducts = query.data?.pages.flatMap(page => page.products) || []
  const categoryTitle = query.data?.pages[0]?.categoryTitle || ""
  
  return {
    products: allProducts,
    categoryTitle,
    isLoading: query.isPending,
    isLoadingMore: query.isFetchingNextPage,
    error: query.error,
    refetch: query.refetch,
    hasMore: query.hasNextPage,
    loadMoreRef: ref,
  }
}


export const useProductDetails = (slug: string) => {
  const productQuery = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const data = await getProductBySlug(slug)
      return data
    },
    enabled: !!slug,
  })

  return {
    product: productQuery.data,
    isLoading: productQuery.isPending,
    error: productQuery.error,
    refetch: productQuery.refetch,
  }
}

// Hook to fetch similar products
export const useSimilarProducts = (productId: string, categoryId?: string, subCategoryId?: string) => {
  const similarProductsQuery = useQuery({
    queryKey: ["similarProducts", productId],
    queryFn: async () => {
      const data = await getSimilarProducts(productId, categoryId, subCategoryId)
      return data || []
    },
    enabled: !!productId,
  })

  return {
    similarProducts: similarProductsQuery.data || [],
    isLoading: similarProductsQuery.isPending,
    error: similarProductsQuery.error,
  }
}

export const useAddReview = () => {
  const queryClient = useQueryClient()

  const addReviewMutation = useMutation({
    mutationFn: (reviewData: ReviewFormData) => addProductReview(reviewData),
    onSuccess: (_, variables) => {
      toast.success("Review submitted successfully! It will be visible after approval.")
      queryClient.invalidateQueries({ queryKey: ["product", variables.productSlug] })
    },
    onError: (error) => {
      toast.error(`Failed to submit review: ${error.message}`)
    },
  })

  return {
    addReview: addReviewMutation.mutate,
    isSubmitting: addReviewMutation.isPending,
    error: addReviewMutation.error,
  }
}

