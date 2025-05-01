"use client"

import type { Category } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createCategory,
  deleteCategory,
  getActiveCategories,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  getCategoriesByDepartment,
  getCategoryBySlugAndSubCategory,
} from "@/actions/categories"
import type { CategoryProps, CategoryWithRelations } from "@/types/types"
import toast from "react-hot-toast"

// Fetch all categories
export const useFetchCategories = () => {
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await getAllCategories()
      return data || []
    },
  })

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isPending,
    error: categoriesQuery.error,
    refetch: categoriesQuery.refetch,
  }
}

// Fetch a single category
export const useFetchCategory = (categoryId: string) => {
  const categoryQuery = useQuery({
    queryKey: ["categories", categoryId],
    queryFn: async () => {
      const data = await getCategoryById(categoryId)
      return data
    },
    enabled: !!categoryId,
  })

  return {
    category: categoryQuery.data,
    isLoading: categoryQuery.isPending,
    error: categoryQuery.error,
  }
}

// Delete a category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteCategory(id)
    },
    onSuccess: (deletedCategory) => {
      queryClient.setQueryData(["categories"], (oldData: Category[] = []) =>
        oldData.filter((cat) => cat.id !== deletedCategory.id),
      )
      queryClient.invalidateQueries({ queryKey: ["categories"] })

      toast.success("Category deleted successfully")
    },
    onError: (error) => {
      toast.error("An error occurred while deleting the category")
      console.error(error)
    },
  })

  return {
    deleteCategory: deleteCategoryMutation.mutate,
    isDeleting: deleteCategoryMutation.isPending,
    error: deleteCategoryMutation.error,
  }
}

// Create a category
export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  const createCategoryMutation = useMutation({
    mutationFn: async (category: CategoryProps) => {
      const result = await createCategory(category)
      return result
    },
    onSuccess: (newCategory) => {
      queryClient.setQueryData(["categories"], (oldData: Category[] = []) => [...oldData, newCategory])
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Category created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred while creating the category")
    },
  })

  return {
    createCategory: createCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,
    error: createCategoryMutation.error,
  }
}

// Update a category
export const useUpdateCategory = () => {
    const queryClient = useQueryClient()
  
    const updateCategoryMutation = useMutation({
      mutationFn: async ({ id, category }: { id: string; category: CategoryProps }) => {
        return await updateCategory(id, category)
      },
      onSuccess: (updatedCategory) => {
        queryClient.setQueryData(["categories"], (oldData: Category[] | undefined) => {
          if (!oldData) return [updatedCategory]
          return oldData.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
        })
  
        queryClient.invalidateQueries({ queryKey: ["categories"] })
        queryClient.invalidateQueries({ queryKey: ["categories", updatedCategory.id] })
        toast.success("Category updated successfully")
      },
      onError: (error) => {
        toast.error("An error occurred while updating the category")
        console.error(error)
      },
    })
  
    return {
      updateCategory: updateCategoryMutation.mutate,
      isUpdating: updateCategoryMutation.isPending,
      error: updateCategoryMutation.error,
    }
  }
  

// Get category by slug
export const useCategoryDetails = (slug: string) => {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: () => getCategoryBySlug(slug),
    enabled: !!slug,
  })
}

// Get active categories
export const useActiveCategories = () => {
  return useQuery({
    queryKey: ["active-categories"],
    queryFn: () => getActiveCategories(),
  })
}

// Get categories by department
export const useCategoriesByDepartment = (departmentId: string) => {
  return useQuery({
    queryKey: ["categories-by-department", departmentId],
    queryFn: () => getCategoriesByDepartment(departmentId),
    enabled: !!departmentId,
  })
}

export const useFetchCategoryBySlugAndSubCategories = (slug: string) => {
  const categoryQuery = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const data = await getCategoryBySlugAndSubCategory(slug)
      return data as CategoryWithRelations | null
    },
    enabled: !!slug,
  })

  return {
    category: categoryQuery.data,
    isLoading: categoryQuery.isPending,
    error: categoryQuery.error,
    refetch: categoryQuery.refetch,
  }
}