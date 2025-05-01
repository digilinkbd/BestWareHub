"use server"

import { db } from "@/prisma/db"
import type { FilterParams, ProductCardProps2 } from "@/types/types"

export async function getProductsBySubCategory(
  params: FilterParams,
): Promise<{ products: ProductCardProps2[]; total: number; priceRange: { min: number; max: number } }> {
  try {
    const {
      subCategorySlug,
      brandId,
      minPrice,
      maxPrice,
      rating,
      sort = "recommended",
      limit = 50,
      page = 1,
      newArrivals,
      deals,
      sellers,
      deliveryModes,
    } = params

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isActive: true,
    }

    if (subCategorySlug) {
      const subCategory = await db.subCategory.findUnique({
        where: { slug: subCategorySlug },
        select: { id: true, title: true },
      })

      if (subCategory) {
        where.subCategoryId = subCategory.id
      }
    }

    if (brandId && brandId.length > 0) {
      where.brandId = { in: brandId }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.productPrice = {}

      if (minPrice !== undefined) {
        where.productPrice.gte = minPrice
      }

      if (maxPrice !== undefined) {
        where.productPrice.lte = maxPrice
      }
    }

    if (rating !== undefined) {
      where.rating = { gte: rating }
    }

    // Handle new arrivals filter
    if (newArrivals) {
      const date = new Date()
      if (newArrivals === "last-7") {
        date.setDate(date.getDate() - 7)
      } else if (newArrivals === "last-30") {
        date.setDate(date.getDate() - 30)
      } else if (newArrivals === "last-60") {
        date.setDate(date.getDate() - 60)
      }
      where.createdAt = { gte: date }
    }

    // Handle deals filter
    if (deals && deals.length > 0) {
      where.isDiscount = true
      // Additional deal-specific filters could be added here
    }

    // Handle sellers filter
    if (sellers && sellers.length > 0) {
      where.vendorId = { in: sellers }
    }

    // Handle delivery modes filter
    if (deliveryModes && deliveryModes.includes("express")) {
      where.isFeatured = true // Assuming express delivery is for featured products
    }

    // Build orderBy
    let orderBy: any = {}
    switch (sort) {
      case "price-low-high":
        orderBy = { productPrice: "asc" }
        break
      case "price-high-low":
        orderBy = { productPrice: "desc" }
        break
      case "newest":
        orderBy = { createdAt: "desc" }
        break
      case "recommended":
      default:
        orderBy = [{ isFeatured: "desc" }, { rating: "desc" }]
        break
    }

    // Get total count for pagination
    const total = await db.product.count({ where })

    // Get price range for filters
    const priceRange = await db.product.aggregate({
      where: { subCategoryId: where.subCategoryId },
      _min: { productPrice: true },
      _max: { productPrice: true },
    })

    // Get products
    const products = await db.product.findMany({
      where,
      include: {
        subCategory: {
          select: { id: true, title: true },
        },
        brand: {
          select: { id: true, title: true },
        },
        reviews: {
          select: { id: true },
        },
      },
      orderBy,
      skip,
      take: limit,
    })

    // Transform products to ProductCardProps
    const transformedProducts: ProductCardProps2[] = products.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.salePrice || product.productPrice,
      oldPrice: product.isDiscount ? product.productPrice : null,
      discount: product.discount || 0,
      slug:product.slug,
      rating: product.rating || 0,
      reviews: product.reviews.length,
      image: product.imageUrl || "",
      isBestSeller: false,
      category: product.subCategory?.title || "",
      categoryRank: 0,
      deliveryOptions: ["Free Delivery", "Express Delivery Available", "Same Day Delivery"],
      promotionType: product.isFeatured ? "express" : "super-mart",
    }))

    return {
      products: transformedProducts,
      total,
      priceRange: {
        min: priceRange._min.productPrice || 0,
        max: priceRange._max.productPrice || 1000,
      },
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    return { products: [], total: 0, priceRange: { min: 0, max: 1000 } }
  }
}

export async function getBrandsForSubCategory(subCategorySlug: string) {
  try {
    const subCategory = await db.subCategory.findUnique({
      where: { slug: subCategorySlug },
      select: { id: true },
    })

    if (!subCategory) {
      return []
    }

    // Get all products in this subcategory
    const products = await db.product.findMany({
      where: { subCategoryId: subCategory.id },
      select: { brandId: true },
    })

    // Extract unique brand IDs
    const brandIds = [...new Set(products.map((p) => p.brandId).filter(Boolean))]

    // Get brand details
    const brands = await db.brand.findMany({
      where: { id: { in: brandIds as string[] } },
      select: { id: true, title: true, slug: true },
    })

    // Count products per brand
    const brandCounts = await Promise.all(
      brands.map(async (brand) => {
        const count = await db.product.count({
          where: {
            subCategoryId: subCategory.id,
            brandId: brand.id,
            status:"ACTIVE",

          },
        })
        return { ...brand, count }
      }),
    )

    return brandCounts
  } catch (error) {
    console.error("Error fetching brands:", error)
    return []
  }
}

export async function getBreadcrumbPath(subCategorySlug: string) {
  try {
    const subCategory = await db.subCategory.findUnique({
      where: { slug: subCategorySlug },
      include: {
        category: {
          include: {
            department: true,
          },
        },
      },
    })

    if (!subCategory) {
      return []
    }

    const breadcrumb = [{ label: "Home", href: "/" }]

    if (subCategory.category?.department) {
      breadcrumb.push({
        label: subCategory.category.department.title,
        href: `/d/${subCategory.category.department.slug}`,
      })
    }

    if (subCategory.category) {
      breadcrumb.push({
        label: subCategory.category.title,
        href: `/c/${subCategory.category.slug}`,
      })
    }

    breadcrumb.push({
      label: subCategory.title,
      href: `/s-c/${subCategory.slug}`,
    //   isCurrentPage: true,
    })

    return breadcrumb
  } catch (error) {
    console.error("Error fetching breadcrumb:", error)
    return [{ label: "Home", href: "/" }]
  }
}

// New function to get category hierarchy
export async function getCategoryHierarchy(subCategorySlug: string) {
  try {
    const subCategory = await db.subCategory.findUnique({
      where: { slug: subCategorySlug },
      include: {
        category: {
          include: {
            department: true,
            subCategories: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    })

    if (!subCategory || !subCategory.category) {
      return null
    }

    // Get all categories in the same department
    const departmentCategories = await db.category.findMany({
      where: {
        departmentId: subCategory.category.departmentId,
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    })

    return {
      department: {
        id: subCategory.category.department.id,
        title: subCategory.category.department.title,
        slug: subCategory.category.department.slug,
      },
      category: {
        id: subCategory.category.id,
        title: subCategory.category.title,
        slug: subCategory.category.slug,
      },
      subCategory: {
        id: subCategory.id,
        title: subCategory.title,
        slug: subCategory.slug,
      },
      departmentCategories,
      siblingSubCategories: subCategory.category.subCategories,
    }
  } catch (error) {
    console.error("Error fetching category hierarchy:", error)
    return null
  }
}

// New function to get vendors/sellers for the current subcategory
export async function getVendorsForSubCategory(subCategorySlug: string) {
  try {
    const subCategory = await db.subCategory.findUnique({
      where: { slug: subCategorySlug },
      select: { id: true },
    })

    if (!subCategory) {
      return []
    }

    // Get all products in this subcategory
    const products = await db.product.findMany({
      where: {
        subCategoryId: subCategory.id,
        isActive: true,
        status:"ACTIVE",
      },
      select: {
        vendorId: true,
        storeId: true,
      },
    })

    // Extract unique vendor IDs
    const vendorIds = [...new Set(products.map((p) => p.vendorId).filter(Boolean))]
    const storeIds = [...new Set(products.map((p) => p.storeId).filter(Boolean))]

    // Get store details
    const stores = await db.store.findMany({
      where: {
        OR: [{ id: { in: storeIds as string[] } }, { userId: { in: vendorIds as string[] } }],
      },
      select: {
        id: true,
        storeName: true,
        slug: true,
        userId: true,
      },
    })

    // Count products per store
    const vendorCounts = await Promise.all(
      stores.map(async (store) => {
        const count = await db.product.count({
          where: {
            subCategoryId: subCategory.id,
            OR: [{ storeId: store.id }, { vendorId: store.userId }],
            status:"ACTIVE",
          },
        })
        return {
          id: store.id,
          title: store.storeName,
          slug: store.slug,
          count,
        }
      }),
    )

    // Sort by product count (descending)
    return vendorCounts.sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error("Error fetching vendors:", error)
    return []
  }
}

