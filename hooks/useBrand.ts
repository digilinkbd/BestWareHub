"use client"

import type { Brand } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { BrandFormProps, BrandWithRelations } from "@/types/types"
import toast from "react-hot-toast"
import { 
  createBrand, 
  deleteBrand, 
  getAllBrands, 
  getBrandsBySubCategory, 
  getBrandById, 
  updateBrand 
} from "@/actions/brands"

// Fetch all brands
export const useFetchBrands = () => {
  const brandsQuery = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const data = await getAllBrands()
      return data || []
    },
  })

  return {
    brands: brandsQuery.data || [],
    isLoading: brandsQuery.isPending,
    error: brandsQuery.error,
    refetch: brandsQuery.refetch,
  }
}

// Fetch brands by subcategory
export const useFetchBrandsBySubCategory = (subCategoryId: string) => {
  const brandsQuery = useQuery({
    queryKey: ["brands", subCategoryId],
    queryFn: async () => {
      const data = await getBrandsBySubCategory(subCategoryId)
      return data || []
    },
    enabled: !!subCategoryId,
  })

  return {
    brands: brandsQuery.data || [],
    isLoading: brandsQuery.isPending,
    error: brandsQuery.error,
  }
}

// Fetch a single brand
export const useFetchBrand = (brandId: string) => {
  const brandQuery = useQuery({
    queryKey: ["brands", brandId],
    queryFn: async () => {
      const data = await getBrandById(brandId)
      return data
    },
    enabled: !!brandId,
  })

  return {
    brand: brandQuery.data,
    isLoading: brandQuery.isPending,
    error: brandQuery.error,
  }
}

// Delete a brand
export const useDeleteBrand = () => {
  const queryClient = useQueryClient()

  const deleteBrandMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteBrand(id)
    },
    onSuccess: (deletedBrand) => {
      queryClient.setQueryData(["brands"], (oldData: Brand[] = []) =>
        oldData.filter((brand) => brand.id !== deletedBrand.id)
      )
      queryClient.invalidateQueries({ queryKey: ["brands"] })

      toast.success("Brand deleted successfully")
    },
    onError: (error) => {
      toast.error("An error occurred while deleting the brand")
      console.error(error)
    },
  })

  return {
    deleteBrand: deleteBrandMutation.mutate,
    isDeleting: deleteBrandMutation.isPending,
    error: deleteBrandMutation.error,
  }
}

// Create a brand
export const useCreateBrand = () => {
  const queryClient = useQueryClient()

  const createBrandMutation = useMutation({
    mutationFn: async (brand: BrandFormProps) => {
      const result = await createBrand(brand)
      return result
    },
    onSuccess: (newBrand) => {
      queryClient.setQueryData(["brands"], (oldData: Brand[] = []) => [...oldData, newBrand])
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      toast.success("Brand created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred while creating the brand")
    },
  })

  return {
    createBrand: createBrandMutation.mutate,
    isCreating: createBrandMutation.isPending,
    error: createBrandMutation.error,
  }
}

// Update a brand
export const useUpdateBrand = () => {
  const queryClient = useQueryClient()

  const updateBrandMutation = useMutation({
    mutationFn: async ({ id, brand }: { id: string; brand: BrandFormProps }) => {
      return await updateBrand(id, brand)
    },
    onSuccess: (updatedBrand) => {
      queryClient.setQueryData(["brands"], (oldData: Brand[] | undefined) => {
        if (!oldData) return [updatedBrand]
        return oldData.map((brand) => (brand.id === updatedBrand.id ? updatedBrand : brand))
      })

      queryClient.invalidateQueries({ queryKey: ["brands"] })
      queryClient.invalidateQueries({ queryKey: ["brands", updatedBrand.id] })
      toast.success("Brand updated successfully")
    },
    onError: (error) => {
      toast.error("An error occurred while updating the brand")
      console.error(error)
    },
  })

  return {
    updateBrand: updateBrandMutation.mutate,
    isUpdating: updateBrandMutation.isPending,
    error: updateBrandMutation.error,
  }
}