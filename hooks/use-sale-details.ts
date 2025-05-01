"use client"

import { getSaleById } from "@/actions/sales"
import { useQuery } from "@tanstack/react-query"

export function useSaleDetails(saleId: string | null) {
  const query = useQuery({
    queryKey: ["sale", saleId],
    queryFn: async () => {
      if (!saleId) return null
      return getSaleById(saleId)
    },
    enabled: !!saleId,
  })

  return {
    sale: query.data,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  }
}

