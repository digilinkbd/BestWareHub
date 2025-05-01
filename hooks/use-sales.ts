"use client"

import { getSalesData } from "@/actions/sales"
import { useQuery } from "@tanstack/react-query"

type UseSalesOptions = {
  dateRange?: "today" | "week" | "month" | "year"
  userId?: string
  page?: number
  limit?: number
}

export function useSales(options: UseSalesOptions = {}) {
  const { dateRange, userId, page, limit } = options

  const query = useQuery({
    queryKey: ["sales", dateRange, userId, page, limit],
    queryFn: async () => {
      return getSalesData({
        dateRange,
        userId,
        page,
        limit,
      })
    },
  })

  return {
    data: query.data,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  }
}

