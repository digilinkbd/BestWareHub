"use client"
import { useMemo, useRef } from "react"
import DetailedCatHero from "@/components/frontend/detailed-cat-hero"
import Products from "@/components/frontend/products"
import SubCategoryCards from "@/components/frontend/sub-category-cards"
import { useQueries, useQuery } from "@tanstack/react-query"
import { ProductsGridSkeleton } from "@/components/frontend/ProductSkeleton"
import HomeCategories from "@/components/frontend/home-categories"
import { getContentBySlug, getContentProducts, getAllCategories, getAllDepartments } from "@/actions/content"
import type { Category, Department, Promotion, Campaign, NavigationItem } from "@/types/content"
import { SlugTypes } from "./department-page"


interface ContentPageProps extends SlugTypes {
  contentType?: string;
}

export default function ContentPage({
  slug,
  contentType = "category",
  
}: ContentPageProps) {

  const loadMoreRef = useRef<HTMLDivElement>(null)

  const {
    data: content,
    isLoading: isContentLoading,
    error: contentError,
  } = useQuery({
    queryKey: ["content", contentType, slug],
    queryFn: async () => {
      if (contentType === "category") {
        // For categories, fetch all categories
        const categories = await getAllCategories()
        return categories.find((cat) => cat.slug === slug) || null
      } else if (contentType === "department") {
        // For departments, fetch all departments
        const departments = await getAllDepartments()
        return departments.find((dept) => dept.slug === slug) || null
      } else {
        // For promotions and campaigns, fetch by slug
        return await getContentBySlug(contentType, slug)
      }
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!slug,
  })

  // Get images for the hero section
  const heroImages = useMemo(() => {
    if (!content) return []

    if (contentType === "promotion" || contentType === "campaign") {
      // Convert imageUrl to an array for promotions and campaigns
      const imageUrl = (content as Promotion | Campaign).imageUrl
      return imageUrl ? [imageUrl] : []
    } else {
      // For categories and departments, use the images array
      return (content as Category | Department).images || []
    }
  }, [content, contentType])

  // Determine what to show in the subcategory/navigation area
  const navigationItems = useMemo((): NavigationItem[] => {
    if (isContentLoading || !content) return []

    switch (contentType) {
      case "promotion":
      case "campaign":
        return [
          {
            title: content.title || "Loading...",
            isActive: true,
            slug: content.slug,
          },
        ]

      case "category":
        return [
          {
            title: content.title || "Loading...",
            isActive: true,
            slug: content.slug,
          },
          ...((content as Category).subCategories?.map((subCat) => ({
            title: subCat.title,
            icon: subCat.image || undefined, 
            slug: subCat.slug,
            isActive: subCat.isActive,
          })) || []),
        ]

      case "department":
        return [
          {
            title: content.title || "Loading...",
            isActive: true,
            slug: content.slug,
          },
          ...((content as Department).categories?.map((cat) => ({
            title: cat.title,
            icon: cat.image || "", // Fix: Convert null/undefined to empty string
            slug: cat.slug,
            isActive: cat.isActive,
          })) || []),
        ]

      default:
        return []
    }
  }, [content, contentType, isContentLoading])

  // Determine what to show in the subcategory area for HomeCategories
  const subItems = useMemo(() => {
    if (isContentLoading || !content) return []

    switch (contentType) {
      case "category":
        // Ensure all properties match the expected DepartmentData type
        return ((content as Category).subCategories || []).map(item => ({
          ...item,
          image: item.image || "", // Ensure image is never null
        }))
      case "department":
        // Ensure all properties match the expected DepartmentData type
        return ((content as Department).categories || []).map(item => ({
          ...item,
          image: item.image || "", // Ensure image is never null
        }))
      default:
        return []
    }
  }, [content, contentType, isContentLoading])

  const subItemQueries = useQueries({
    queries:
      (contentType === "category" || contentType === "department") && subItems.length > 0
        ? subItems.slice(0, 7).map((subItem) => ({
            queryKey: ["contentProducts", contentType, slug, subItem.id, 12],
            queryFn: async () => {
              return await getContentProducts(contentType, slug, subItem.id, null, 12)
            },
            staleTime: 1000 * 60 * 5,
            enabled: !!slug && !!subItem.id,
          }))
        : [],
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        isPending: results.some((result) => result.isPending),
        isError: results.some((result) => result.isError),
        isSuccess: results.every((result) => result.isSuccess),
      }
    },
  })

  const { data: promotionProducts, isLoading: isPromotionProductsLoading } = useQuery({
    queryKey: ["contentProducts", contentType, slug, null, 24],
    queryFn: async () => {
      return await getContentProducts(contentType, slug, null, null, 24)
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!slug && (contentType === "promotion" || contentType === "campaign"),
  })

  // Determine the link prefix for navigation
  const getLinkPrefix = () => {
    switch (contentType) {
      case "category":
        return "/s-c/"
      case "department":
        return "/d/"
      case "promotion":
        return "/promo/"
      case "campaign":
        return "/campaign/"
      default:
        return "/"
    }
  }

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* Hero Banner */}
      <DetailedCatHero images={heroImages} isLoading={isContentLoading} />

      {(contentType === "category" || contentType === "department") && (
        <HomeCategories
          departments={subItems}
          isLoading={isContentLoading}
          error={contentError}
          linkPrefix={contentType === "category" ? "/s-c/" : "/d/"}
        />
      )}

      {/* Navigation Cards */}
      <div className="container mx-auto md:px-4 md:py-6 py-4 px-1">
        <SubCategoryCards categories={navigationItems} linkPrefix={getLinkPrefix()} />
      </div>

      {/* For promotions and campaigns, show all products in one section */}
      {(contentType === "promotion" || contentType === "campaign") && (
        <div>
          <Products title={`${content?.title || contentType} Products`} products={promotionProducts?.products || []} />

          {isPromotionProductsLoading && (
            <div className="p-4">
              <ProductsGridSkeleton count={5} />
            </div>
          )}
        </div>
      )}

      {(contentType === "category" || contentType === "department") &&
        subItemQueries.data.map((subItemData, index) => {
          if (!subItemData || !subItemData.products || subItemData.products.length === 0) return null
          const subItem = subItems[index]

          return (
            <div key={`subitem-${subItem?.id || index}`}>
              <Products
                title={subItemData.subCategoryTitle || subItem?.title || `Section ${index + 1}`}
                products={subItemData.products || []}
              />

              {subItemQueries.isPending && (
                <div className="p-4">
                  <ProductsGridSkeleton count={5} />
                </div>
              )}
            </div>
          )
        })}

      <div ref={loadMoreRef} className="h-4" />
    </div>
  )
}