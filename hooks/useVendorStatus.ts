"use client"

import { getVendorStatus, VendorStatusResponse } from "@/actions/vendor-status"
import { useQuery } from "@tanstack/react-query"

export const useVendorStatus = () => {
  const vendorStatusQuery = useQuery({
    queryKey: ["vendorStatus"],
    queryFn: async (): Promise<VendorStatusResponse> => {
      const data = await getVendorStatus()
      return data
    },
    // Refresh every 5 minutes
    staleTime: 5 * 60 * 1000,
    // If the query fails, retry up to 3 times
    retry: 3,
    // Return a default value if the query fails
    placeholderData: {
      status: "NORMAL",
      message: "Loading vendor status...",
    },
  })

  return {
    vendorStatus: vendorStatusQuery.data,
    isLoading: vendorStatusQuery.isPending,
    error: vendorStatusQuery.error,
    refetch: vendorStatusQuery.refetch,
  }
}

