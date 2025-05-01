"use client"

import { getActivePromotions, getFeaturedCategories, getFeaturedProducts } from "@/actions/mega-categories"
import { useQuery } from "@tanstack/react-query"


export const useFeaturedCategories = () => {
  const query = useQuery({
    queryKey: ["featuredCategories"],
    queryFn: async () => {
      const data = await getFeaturedCategories()
      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
  
  return {
    categories: query.data || [],
    isLoading: query.isPending,
    error: query.error,
  }
}

export const useFeaturedProducts = () => {
  const query = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: async () => {
      const data = await getFeaturedProducts()
      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
  
  return {
    products: query.data || [],
    isLoading: query.isPending,
    error: query.error,
  }
}

export const useActivePromotions = () => {
  const query = useQuery({
    queryKey: ["activePromotions"],
    queryFn: async () => {
      const data = await getActivePromotions()
      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
  
  return {
    promotions: query.data || [],
    isLoading: query.isPending,
    error: query.error,
  }
}