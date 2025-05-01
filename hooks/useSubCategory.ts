"use client"

import type { SubCategory } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { SubCategoryFormProps, SubCategoryProps } from "@/types/types"
import toast from "react-hot-toast"
import { createSubCategory, deleteSubCategory, getAllSubCategories, getSubCategoriesByCategory, getSubCategoryById, updateSubCategory } from "@/actions/subcategories"
import { getSubcategoriesByDepartment } from "@/actions/departments"

// Fetch all subcategories
export const useFetchSubCategories = () => {
  const subCategoriesQuery = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const data = await getAllSubCategories()
      return data || []
    },
  })

  return {
    subcategories: subCategoriesQuery.data || [],
    isLoading: subCategoriesQuery.isPending,
    error: subCategoriesQuery.error,
    refetch: subCategoriesQuery.refetch,
  }
}

// Fetch subcategories by category
export const useFetchSubCategoriesByCategory = (categoryId: string) => {
  const subCategoriesQuery = useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: async () => {
      const data = await getSubCategoriesByCategory(categoryId)
      return data || []
    },
    enabled: !!categoryId,
  })

  return {
    subcategories: subCategoriesQuery.data || [],
    isLoading: subCategoriesQuery.isPending,
    error: subCategoriesQuery.error,
  }
}

// Fetch a single subcategory
export const useFetchSubCategory = (subcategoryId: string) => {
  const subCategoryQuery = useQuery({
    queryKey: ["subcategories", subcategoryId],
    queryFn: async () => {
      const data = await getSubCategoryById(subcategoryId)
      return data
    },
    enabled: !!subcategoryId,
  })

  return {
    subcategory: subCategoryQuery.data,
    isLoading: subCategoryQuery.isPending,
    error: subCategoryQuery.error,
  }
}

// Delete a subcategory
export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient()

  const deleteSubCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteSubCategory(id)
    },
    onSuccess: (deletedSubCategory) => {
      queryClient.setQueryData(["subcategories"], (oldData: SubCategory[] = []) =>
        oldData.filter((subCat) => subCat.id !== deletedSubCategory.id)
      )
      queryClient.invalidateQueries({ queryKey: ["subcategories"] })

      toast.success("Subcategory deleted successfully")
    },
    onError: (error) => {
      toast.error("An error occurred while deleting the subcategory")
      console.error(error)
    },
  })

  return {
    deleteSubCategory: deleteSubCategoryMutation.mutate,
    isDeleting: deleteSubCategoryMutation.isPending,
    error: deleteSubCategoryMutation.error,
  }
}

// Create a subcategory
export const useCreateSubCategory = () => {
  const queryClient = useQueryClient()

  const createSubCategoryMutation = useMutation({
    mutationFn: async (subcategory: SubCategoryFormProps) => {
      const result = await createSubCategory(subcategory)
      return result
    },
    onSuccess: (newSubCategory) => {
      queryClient.setQueryData(["subcategories"], (oldData: SubCategory[] = []) => [...oldData, newSubCategory])
      queryClient.invalidateQueries({ queryKey: ["subcategories"] })
      toast.success("Subcategory created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred while creating the subcategory")
    },
  })

  return {
    createSubCategory: createSubCategoryMutation.mutate,
    isCreating: createSubCategoryMutation.isPending,
    error: createSubCategoryMutation.error,
  }
}

// Update a subcategory
export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient()

  const updateSubCategoryMutation = useMutation({
    mutationFn: async ({ id, subcategory }: { id: string; subcategory: SubCategoryFormProps }) => {
      return await updateSubCategory(id, subcategory)
    },
    onSuccess: (updatedSubCategory) => {
      queryClient.setQueryData(["subcategories"], (oldData: SubCategory[] | undefined) => {
        if (!oldData) return [updatedSubCategory]
        return oldData.map((subCat) => (subCat.id === updatedSubCategory.id ? updatedSubCategory : subCat))
      })

      queryClient.invalidateQueries({ queryKey: ["subcategories"] })
      queryClient.invalidateQueries({ queryKey: ["subcategories", updatedSubCategory.id] })
      toast.success("Subcategory updated successfully")
    },
    onError: (error) => {
      toast.error("An error occurred while updating the subcategory")
      console.error(error)
    },
  })

  return {
    updateSubCategory: updateSubCategoryMutation.mutate,
    isUpdating: updateSubCategoryMutation.isPending,
    error: updateSubCategoryMutation.error,
  }
}

export const useSubcategoriesByDepartment = (slug?: string) => {
  return useQuery({
    queryKey: ["subcategories-by-department", slug],
    queryFn: () => getSubcategoriesByDepartment(slug as string),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}