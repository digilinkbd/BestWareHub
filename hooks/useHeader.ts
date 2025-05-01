"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchDepartmentsWithRelations } from "@/actions/departments"

// Hook for fetching departments with their relations
export const useFetchDepartments = () => {
  const departmentsQuery = useQuery({
    queryKey: ["departments-with-relations"],
    queryFn: async () => {
      const data = await fetchDepartmentsWithRelations()
      return data || []
    },
  })

  return {
    departments: departmentsQuery.data || [],
    isLoading: departmentsQuery.isPending,
    error: departmentsQuery.error,
    refetch: departmentsQuery.refetch,
  }
}