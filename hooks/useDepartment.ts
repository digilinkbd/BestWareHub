"use client";

import { Department } from "@prisma/client";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  createDepartment, 
  deleteDepartment, 
  DepartmentWithCategories, 
  getActiveDepartments, 
  getAllDepartments, 
  getDepartmentById, 
  getDepartmentBySlug, 
  getDepartmentsWithCategories, 
  getDepartmentWithCategories, 
  getHomeDepartments, 
  updateDepartment 
} from "@/actions/departments";
import { DepartmentProps } from "@/types/types";
import toast from "react-hot-toast";

type ActiveDepartment = {
  id: string;
  title: string;
  image: string;
  slug: string;
};

// Fetch all departments
export const useFetchDepartments = () => {
  const departmentsQuery = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const data = await getAllDepartments();
      return data || [];
    },
  });

  return {
    departments: departmentsQuery.data || [],
    isLoading: departmentsQuery.isPending,
    error: departmentsQuery.error,
    refetch: departmentsQuery.refetch,
  };
};

// Fetch a single department
export const useFetchDepartment = (departmentId: string) => {
  const departmentQuery = useQuery({
    queryKey: ['departments', departmentId],
    queryFn: async () => {
      const data = await getDepartmentById(departmentId);
      return data;
    },
    enabled: !!departmentId,
  });

  return {
    department: departmentQuery.data,
    isLoading: departmentQuery.isPending,
    error: departmentQuery.error,
  };
};

// Delete a department
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  const deleteDepartmentMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteDepartment(id);
    },
    onSuccess: (deletedDepartment) => {
      queryClient.setQueryData(['departments'], (oldData: Department[] = []) =>
        oldData.filter((dept) => dept.id !== deletedDepartment.id)
      );
      queryClient.invalidateQueries({ queryKey: ['departments'] });

      toast.success('Department deleted successfully');
    },
    onError: (error) => {
      toast.error('An error occurred while deleting the department');
      console.error(error);
    },
  });

  return {
    deleteDepartment: deleteDepartmentMutation.mutate,
    isDeleting: deleteDepartmentMutation.isPending,
    error: deleteDepartmentMutation.error,
  };
};

// Create a department
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  const createDepartmentMutation = useMutation({
    mutationFn: async (department: DepartmentProps) => {
      const result = await createDepartment(department);
      return result;
    },
    onSuccess: (newDepartment) => {
      queryClient.setQueryData(["departments"], (oldData: Department[] = []) => [
        ...oldData,
        newDepartment,
      ]);
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred while creating the department");
    },
  });

  return {
    createDepartment: createDepartmentMutation.mutate,
    isCreating: createDepartmentMutation.isPending,
    error: createDepartmentMutation.error,
  };
};

// Update a department
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  const updateDepartmentMutation = useMutation({
    mutationFn: async ({ id, department }: { id: string; department: DepartmentProps }) => {
      return await updateDepartment(id, department);
    },
    onSuccess: (updatedDepartment) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['departments', updatedDepartment.id] });
      toast.success('Department updated successfully');
    },
    onError: (error) => {
      toast.error('An error occurred while updating the department');
      console.error(error);
    },
  });

  return {
    updateDepartment: updateDepartmentMutation.mutate,
    isUpdating: updateDepartmentMutation.isPending,
    error: updateDepartmentMutation.error,
  };
};

// Get department by slug
export const useDepartmentDetails = (slug: string) => {
  return useQuery({
    queryKey: ['department', slug],
    queryFn: () => getDepartmentBySlug(slug),
    enabled: !!slug,
  });
};

// Get active departments
export const useActiveDepartments = () => {
  return useQuery<ActiveDepartment[]>({
    queryKey: ['active-departments'],
    queryFn: () => getActiveDepartments(),
  });
};


export function useInfiniteDepartments() {
  const query = useInfiniteQuery({
    queryKey: ["departments-infinite"],
    queryFn: async ({ pageParam }) => {
      const result = await getDepartmentsWithCategories(pageParam as string)
      return result
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  })

  // Map the infinite query data to a flat array of departments
  const departments: DepartmentWithCategories[] = query.data?.pages.flatMap(
    (page) => page.departments
  ) || []

  return {
    departments,
    isLoading: query.isLoading,
    isError: query.isError,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage
  }
}

export const useDepartmentData = (slug: string) => {
  return useQuery({
    queryKey: ["department", slug],
    queryFn: async () => {
      return await getDepartmentWithCategories(slug)
    },
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    enabled: !!slug
  })
}
