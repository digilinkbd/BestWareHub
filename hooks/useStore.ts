"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { createStore, getStoreById, getStoreByUserId, updateStoreStatus, type StoreFormData } from "@/actions/store"
import type { Store, VendorStatus } from "@prisma/client"

export const useCreateStore = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const createStoreMutation = useMutation({
    mutationFn: async (storeData: StoreFormData) => {
      const result = await createStore(storeData)
      
      if (!result.success) {
        throw new Error(result.error)
      }
      
      return result.data as Store
    },
    onSuccess: (newStore) => {
      queryClient.invalidateQueries({ queryKey: ["store"] })
      toast.success("Store created successfully! Awaiting approval.")
      router.push("/dashboard")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create store")
    },
  })

  return {
    createStore: createStoreMutation.mutate,
    isCreating: createStoreMutation.isPending,
    error: createStoreMutation.error,
  }
}

/**
 * Hook for fetching a user's store
 */
export const useFetchUserStore = (userId: string) => {
  const storeQuery = useQuery({
    queryKey: ["store", userId],
    queryFn: async () => {
      const data = await getStoreByUserId(userId)
      return data
    },
    enabled: !!userId,
  })

  return {
    store: storeQuery.data,
    isLoading: storeQuery.isPending,
    error: storeQuery.error,
    refetch: storeQuery.refetch,
  }
}

export const useStoreDetails = (storeId: string) => {
  const storeQuery = useQuery({
    queryKey: ["store", storeId],
    queryFn: async () => {
      const data = await getStoreById(storeId)
      return data
    },
    enabled: !!storeId,
  })

  return {
    store: storeQuery.data,
    isLoading: storeQuery.isPending,
    error: storeQuery.error,
    refetch: storeQuery.refetch,
  }
}


export const useUpdateStoreStatus = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: VendorStatus; reason?: string }) => {
      const result = await updateStoreStatus(id, status, reason);
      
      if (!result.success) {
        throw new Error("Failed to update store status");
      }
      
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["store", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast.success(`Store ${variables.status.toLowerCase()} successfully!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update store status");
    },
  });

  return {
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
    error: updateStatusMutation.error,
  };
};
