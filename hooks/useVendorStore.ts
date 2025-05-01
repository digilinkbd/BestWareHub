"use client"

import { useQuery } from "@tanstack/react-query"
import { 
  getStoreBySlug, 
  getStoreBanners, 
  getStoreProducts,
  type StoreDetails,
  type StoreProduct
} from "@/actions/store"

export function useStoreDetails(slug: string) {
  const storeQuery = useQuery({
    queryKey: ["store", slug],
    queryFn: async () => {
      const data = await getStoreBySlug(slug)
      return data
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    store: storeQuery.data,
    isLoading: storeQuery.isPending,
    error: storeQuery.error,
  }
}

/**
 * Hook to fetch store banners
 */
export function useStoreBanners(storeId: string | undefined) {
  const bannersQuery = useQuery({
    queryKey: ["storeBanners", storeId],
    queryFn: async () => {
      if (!storeId) return []
      const data = await getStoreBanners(storeId)
      return data
    },
    enabled: !!storeId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  return {
    banners: bannersQuery.data || [],
    isLoading: bannersQuery.isPending,
    error: bannersQuery.error,
  }
}

/**
 * Hook to fetch store products
 */
export function useStoreProducts(storeId: string | undefined) {
  const productsQuery = useQuery({
    queryKey: ["storeProducts", storeId],
    queryFn: async () => {
      if (!storeId) return []
      const data = await getStoreProducts(storeId)
      return data
    },
    enabled: !!storeId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isPending,
    error: productsQuery.error,
  }
}