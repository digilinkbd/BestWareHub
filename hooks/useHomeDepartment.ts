"use client"

import { getHomeDepartments } from "@/actions/departments"
import { getDepartments, getDepartmentsWithCategories } from "@/actions/home-departments"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"


// Modified hook to support multiple department slugs
export const useDepartmentsWithCategories = (slugs: string[]) => {
  const departmentsQuery = useQuery({
    queryKey: ["departments", slugs],
    queryFn: async () => {
      try {
        const data = await getDepartmentsWithCategories(slugs);
        return data;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: slugs.length > 0,
  });

  return {
    departments: departmentsQuery.data || {},
    isLoading: departmentsQuery.isPending,
    error: departmentsQuery.error,
  };
};

// Maintain backward compatibility
export const useDepartmentWithCategories = (slug: string) => {
  const { departments, isLoading, error } = useDepartmentsWithCategories(slug ? [slug] : []);
  
  return {
    department: slug ? departments[slug] : null,
    isLoading,
    error,
  };
};
// Hook to fetch departments with infinite scrolling
export const useInfiniteDepartments = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["departments"],
    queryFn: async ({ pageParam = 1 }) => {
      const departments = await getDepartments(pageParam, 5)
      return departments
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If we received fewer items than requested, we've reached the end
      return lastPage.length === 5 ? allPages.length + 1 : undefined
    },
  })

  // Flatten the pages into a single array of departments
  const departments = data?.pages.flat() || []

  return {
    departments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  }
}

// Hook to fetch all departments (without infinite scrolling)
export const useDepartments = () => {
  const departmentsQuery = useQuery({
    queryKey: ["allDepartments"],
    queryFn: async () => {
      const data = await getDepartments(1, 50) // Limit to 50 departments
      return data
    },
  })

  return {
    departments: departmentsQuery.data || [],
    isLoading: departmentsQuery.isPending,
    error: departmentsQuery.error,
  }
}

export function useHomeDepartments() {
  const { 
    data: departments, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["departments-resuable"],
    queryFn: async () => {
      const data = await getHomeDepartments()
      return data || []
    },
    staleTime: 1000 * 60 * 5,
  })

  return {
    departments: departments || [],
    isLoading,
    error: error as Error | null
  }
}