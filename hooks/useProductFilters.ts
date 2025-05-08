"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"

import type { FilterParams } from "@/types/types"
import { getBrandsForSubCategory, getBreadcrumbPath, getCategoryHierarchy, getProductsBySubCategory, getVendorsForSubCategory } from "@/actions/product-filters"

export const useProducts = (subCategorySlug: string) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()

  // Parse current filter params from URL
  const currentParams = useMemo(() => {
    const params: FilterParams = {
      subCategorySlug,
      page: searchParams.get("page") ? Number.parseInt(searchParams.get("page") as string) : 1,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string) : 50,
      sort: searchParams.get("sort") || "recommended",
    }

    // Parse brand IDs
    const brandIds = searchParams.getAll("brand")
    if (brandIds.length > 0) {
      params.brandId = brandIds
    }

    // Parse price range
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    if (minPrice) params.minPrice = Number.parseFloat(minPrice)
    if (maxPrice) params.maxPrice = Number.parseFloat(maxPrice)

    // Parse rating
    const rating = searchParams.get("rating")
    if (rating) params.rating = Number.parseFloat(rating)

    // Parse new arrivals
    const newArrivals = searchParams.get("newArrivals")
    if (newArrivals) params.newArrivals = newArrivals

    // Parse deals
    const deals = searchParams.getAll("deal")
    if (deals.length > 0) params.deals = deals

    // Parse sellers
    const sellers = searchParams.getAll("seller")
    if (sellers.length > 0) params.sellers = sellers

    // Parse delivery modes
    const deliveryModes = searchParams.getAll("delivery")
    if (deliveryModes.length > 0) params.deliveryModes = deliveryModes

    return params
  }, [searchParams, subCategorySlug])

  // Create a function to update filters
  const updateFilters = useCallback(
    (newParams: Partial<FilterParams>) => {
      const params = new URLSearchParams(searchParams.toString())

      // Reset page when filters change
      params.delete("page")

      // Handle special cases for array params
      if (newParams.brandId !== undefined) {
        params.delete("brand")
        newParams.brandId?.forEach((id) => params.append("brand", id))
      }

      if (newParams.deals !== undefined) {
        params.delete("deal")
        newParams.deals?.forEach((deal) => params.append("deal", deal))
      }

      if (newParams.sellers !== undefined) {
        params.delete("seller")
        newParams.sellers?.forEach((seller) => params.append("seller", seller))
      }

      if (newParams.deliveryModes !== undefined) {
        params.delete("delivery")
        newParams.deliveryModes?.forEach((mode) => params.append("delivery", mode))
      }

      // Handle regular params
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          params.delete(key)
        } else if (!["brandId", "deals", "sellers", "deliveryModes"].includes(key)) {
          params.set(key, String(value))
        }
      })

      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router],
  )

  // Toggle a single filter
  const toggleFilter = useCallback(
    (type: string, value: string) => {
      const currentValues = searchParams.getAll(type)
      const exists = currentValues.includes(value)

      const newValues = exists ? currentValues.filter((v) => v !== value) : [...currentValues, value]

      const params = new URLSearchParams(searchParams.toString())
      params.delete(type)
      params.delete("page") // Reset page when filters change

      newValues.forEach((v) => params.append(type, v))
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router],
  )

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    router.push(pathname)
  }, [pathname, router])

  // Fetch products with optimized caching
  const productsQuery = useQuery({
    queryKey: ["products", currentParams],
    queryFn: () => getProductsBySubCategory(currentParams),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Fetch brands for this subcategory
  const brandsQuery = useQuery({
    queryKey: ["brands", subCategorySlug],
    queryFn: () => getBrandsForSubCategory(subCategorySlug),
    staleTime: 1000 * 60 * 30, // 30 minutes
  })

  // Fetch breadcrumb
  const breadcrumbQuery = useQuery({
    queryKey: ["breadcrumb", subCategorySlug],
    queryFn: () => getBreadcrumbPath(subCategorySlug),
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  // Fetch category hierarchy
  const categoryHierarchyQuery = useQuery({
    queryKey: ["categoryHierarchy", subCategorySlug],
    queryFn: () => getCategoryHierarchy(subCategorySlug),
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  // Fetch vendors/sellers
  const vendorsQuery = useQuery({
    queryKey: ["vendors", subCategorySlug],
    queryFn: () => getVendorsForSubCategory(subCategorySlug),
    staleTime: 1000 * 60 * 30, // 30 minutes
  })

  // Get all selected filters for display
  const selectedFilters = useMemo(() => {
    const filters: string[] = []

    // Add brand filters
    searchParams.getAll("brand").forEach((brandId) => {
      const brand = brandsQuery.data?.find((b) => b.id === brandId)
      if (brand) filters.push(`Brand: ${brand.title}`)
    })

    // Add price range filter
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    if (minPrice && maxPrice) {
      filters.push(`Price: BDT ${minPrice} - BDT ${maxPrice}`)
    } else if (minPrice) {
      filters.push(`Price: Min BDT ${minPrice}`)
    } else if (maxPrice) {
      filters.push(`Price: Max BDT ${maxPrice}`)
    }

    // Add rating filter
    const rating = searchParams.get("rating")
    if (rating) {
      filters.push(`Rating: ${rating}+ Stars`)
    }

    // Add new arrivals filter
    const newArrivals = searchParams.get("newArrivals")
    if (newArrivals === "last-7") {
      filters.push("New: Last 7 Days")
    } else if (newArrivals === "last-30") {
      filters.push("New: Last 30 Days")
    } else if (newArrivals === "last-60") {
      filters.push("New: Last 60 Days")
    }

    // Add deals filters
    searchParams.getAll("deal").forEach((deal) => {
      filters.push(`Deal: ${deal}`)
    })

    // Add seller filters
    searchParams.getAll("seller").forEach((sellerId) => {
      const seller = vendorsQuery.data?.find((v) => v.id === sellerId)
      if (seller) filters.push(`Seller: ${seller.title}`)
    })

    // Add delivery mode filters
    searchParams.getAll("delivery").forEach((mode) => {
      if (mode === "express") filters.push("Express Delivery")
    })

    return filters
  }, [searchParams, brandsQuery.data, vendorsQuery.data])

  return {
    products: productsQuery.data?.products || [],
    totalProducts: productsQuery.data?.total || 0,
    priceRange: productsQuery.data?.priceRange || { min: 0, max: 1000 },
    brands: brandsQuery.data || [],
    breadcrumb: breadcrumbQuery.data || [{ label: "Home", href: "/" }],
    categoryHierarchy: categoryHierarchyQuery.data,
    vendors: vendorsQuery.data || [],
    isLoading: productsQuery.isLoading,
    isBrandsLoading: brandsQuery.isLoading,
    isCategoryLoading: categoryHierarchyQuery.isLoading,
    isVendorsLoading: vendorsQuery.isLoading,
    isError: productsQuery.isError || brandsQuery.isError,
    selectedFilters,
    currentParams,
    updateFilters,
    toggleFilter,
    clearAllFilters,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  }
}

