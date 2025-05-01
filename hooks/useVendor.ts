"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { 
  getAllVendors, 
  VendorWithStore
} from "@/actions/vendor"

// Fetch all vendors
export const useFetchVendors = () => {
  const vendorsQuery = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const data = await getAllVendors()
      return data || []
    },
  })

  return {
    vendors: vendorsQuery.data || [],
    isLoading: vendorsQuery.isPending,
    error: vendorsQuery.error,
    refetch: vendorsQuery.refetch,
  }
}



