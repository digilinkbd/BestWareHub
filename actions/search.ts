"use server"

import { db } from "@/prisma/db"
import type { ProductSearchResult, ProductSuggestion, SearchFilter } from "@/types/search"

// Function to get search suggestions (lightweight, only title and slug)
export async function getSuggestions(query: string): Promise<ProductSuggestion[]> {
  if (!query || query.trim().length < 2) return []

  try {
    const products = await db.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { tags: { has: query.toLowerCase() } },
        ],
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        imageUrl: true,
        subCategory: {
          select: {
            title: true,
          },
        },
      },
      take: 8, 
    })

    const fuzzyMatched = products
      .map((product) => {
        const titleMatch = product.title.toLowerCase().includes(query.toLowerCase())
        const score = titleMatch ? 2 : 1
        return { ...product, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((product) => ({
        id: product.id,
        title: product.title,
        slug: product.slug,
        image: product.imageUrl || "",
        category: product.subCategory?.title || "",
      }))

    return fuzzyMatched
  } catch (error) {
    console.error("Error fetching search suggestions:", error)
    return []
  }
}

export async function getSearchFilters(query: string): Promise<{
  categories: SearchFilter[]
  brands: SearchFilter[]
}> {
  try {
    const categoriesWithCount = await db.subCategory.findMany({
      where: {
        products: {
          some: {
            isActive: true,
            ...(query
              ? {
                  OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { tags: { has: query.toLowerCase() } },
                  ],
                }
              : {}),
          },
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    const brandsWithCount = await db.brand.findMany({
      where: {
        products: {
          some: {
            isActive: true,
            ...(query
              ? {
                  OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { tags: { has: query.toLowerCase() } },
                  ],
                }
              : {}),
          },
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    return {
      categories: categoriesWithCount.map((cat) => ({
        id: cat.id,
        title: cat.title,
        slug: cat.slug,
        count: cat._count.products,
      })),
      brands: brandsWithCount.map((brand) => ({
        id: brand.id,
        title: brand.title,
        slug: brand.slug,
        count: brand._count.products,
      })),
    }
  } catch (error) {
    console.error("Error fetching search filters:", error)
    return { categories: [], brands: [] }
  }
}

export async function searchProducts({
  query = "",
  category = "",
  brand = "",
  sort = "relevance",
  page = 1,
  limit = 12,
}: {
  query?: string
  category?: string
  brand?: string
  sort?: string
  page?: number
  limit?: number
}): Promise<{
  products: ProductSearchResult[]
  categories: { id: string; title: string }[]
  totalProducts: number
  totalPages: number
}> {
  try {
    const skip = (page - 1) * limit

    const where: any = {
      isActive: true,
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { has: query.toLowerCase() } },
      ]
    }

    if (category) {
      where.subCategory = {
        slug: category,
      }
    }

    if (brand) {
      where.brand = {
        slug: brand,
      }
    }

    // Determine sort order
    let orderBy: any = {}

    switch (sort) {
      case "newest":
        orderBy = { createdAt: "desc" }
        break
      case "price-low":
        orderBy = { productPrice: "asc" }
        break
      case "price-high":
        orderBy = { productPrice: "desc" }
        break
      case "rating":
        orderBy = { rating: "desc" }
        break
      default:
        
        orderBy = { isFeatured: "desc" }
    }

    const totalProducts = await db.product.count({ where })
    const totalPages = Math.ceil(totalProducts / limit)

    const products = await db.product.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        imageUrl: true,
        productPrice: true,
        salePrice: true,
        isDiscount: true,
        discount: true,
        rating: true,
        isFeatured: true,
        reviews: {
          select: {
            id: true,
          },
        },
        subCategory: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        brand: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    })

    const categoriesMap = new Map()
    products.forEach((product) => {
      if (product.subCategory) {
        categoriesMap.set(product.subCategory.id, {
          id: product.subCategory.id,
          title: product.subCategory.title,
          slug: product.subCategory.slug,
        })
      }
    })
    const categories = Array.from(categoriesMap.values())

    const formattedProducts: ProductSearchResult[] = products.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.salePrice || product.productPrice,
      oldPrice: product.isDiscount ? product.productPrice : null,
      discount: product.discount || 0,
      rating: product.rating || 0,
      slug: product.slug,
      reviews: product.reviews.length,
      image: product.imageUrl || "",
      isBestSeller: false, // This could be determined by sales data
      category: product.subCategory?.title || "",
      categoryRank: 0,
      deliveryOptions: ["Free Delivery", "Express Delivery Available"],
      promotionType: product.isFeatured ? "express" : "super-mart",
    }))

    // If sorting by relevance and we have a query, do additional relevance sorting
    if (sort === "relevance" && query) {
      formattedProducts.sort((a, b) => {
        // Exact title matches get highest priority
        const aExactMatch = a.title.toLowerCase() === query.toLowerCase()
        const bExactMatch = b.title.toLowerCase() === query.toLowerCase()

        if (aExactMatch && !bExactMatch) return -1
        if (!aExactMatch && bExactMatch) return 1

        // Then title starts with query
        const aStartsWith = a.title.toLowerCase().startsWith(query.toLowerCase())
        const bStartsWith = b.title.toLowerCase().startsWith(query.toLowerCase())

        if (aStartsWith && !bStartsWith) return -1
        if (!aStartsWith && bStartsWith) return 1

        // Then contains query
        const aContains = a.title.toLowerCase().includes(query.toLowerCase())
        const bContains = b.title.toLowerCase().includes(query.toLowerCase())

        if (aContains && !bContains) return -1
        if (!aContains && bContains) return 1

        return 0
      })
    }

    return {
      products: formattedProducts,
      categories,
      totalProducts,
      totalPages,
    }
  } catch (error) {
    console.error("Error searching products:", error)
    return {
      products: [],
      categories: [],
      totalProducts: 0,
      totalPages: 0,
    }
  }
}

