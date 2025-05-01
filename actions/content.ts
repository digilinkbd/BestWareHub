"use server";

import { db } from "@/prisma/db"
import { Promotion, Campaign, Category, Department, ProductsResponse, SubCategory } from "@/types/content"

export async function getAllCategories(): Promise<Category[]> {
  try {
    const dbCategories = await db.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        image: true,
        images: true,
        isActive: true,
        subCategories: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
            description: true,
            isActive: true, // Add isActive to match SubCategory type
          },
          orderBy: { position: "asc" },
        },
      },
      orderBy: { position: "asc" },
    })
    
    // Transform to match exact Category type
    return dbCategories.map(cat => ({
      id: cat.id,
      title: cat.title,
      slug: cat.slug,
      description: cat.description,
      isActive: cat.isActive,
      image: cat.image,
      images: cat.images,
      subCategories: cat.subCategories as SubCategory[]
    }))
  } catch (error) {
    console.error("Error fetching all categories:", error)
    throw new Error("Failed to fetch categories")
  }
}

export async function getAllDepartments(): Promise<Department[]> {
  try {
    const dbDepartments = await db.department.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        image: true,
        images: true,
        isActive: true,
        categories: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
            description: true,
            isActive: true, // Add isActive field
            images: true, // Add images field to match Category type
            subCategories: { // Include subCategories to fully match Category type
              where: { isActive: true },
              select: {
                id: true,
                title: true,
                slug: true,
                image: true,
                description: true,
                isActive: true,
              },
            },
          },
          orderBy: { position: "asc" },
        },
      },
      orderBy: { position: "asc" },
    })
    
    // Transform to match Department type
    return dbDepartments.map(dept => ({
      id: dept.id,
      title: dept.title,
      slug: dept.slug,
      description: dept.description,
      isActive: dept.isActive,
      image: dept.image,
      images: dept.images,
      categories: dept.categories as Category[]
    }))
  } catch (error) {
    console.error("Error fetching all departments:", error)
    throw new Error("Failed to fetch departments")
  }
}

export async function getContentBySlug(contentType: string, slug: string): Promise<Promotion | Campaign | null> {
  try {
    switch (contentType) {
      case "promotion":
        return await db.promotion.findUnique({
          where: {
            slug,
            isActive: true,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            imageUrl: true,
            discount: true,
            startDate: true,
            endDate: true,
            isActive: true,
          },
        })

      case "campaign":
        return await db.campaign.findUnique({
          where: {
            slug,
            isActive: true,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            imageUrl: true,
            startDate: true,
            endDate: true,
            isActive: true,
          },
        })

      default:
        throw new Error("Invalid content type")
    }
  } catch (error) {
    console.error(`Error fetching ${contentType} by slug:`, error)
    throw new Error(`Failed to fetch ${contentType}`)
  }
}

// Generic function to fetch products based on content type
export async function getContentProducts(
  contentType: string,
  contentSlug: string,
  subItemId?: string | null,
  cursor?: string | null,
  limit = 12,
): Promise<ProductsResponse> {
  try {
    let products = []
    let subCategoryTitle = ""

    switch (contentType) {
      case "promotion": {
        // Get promotion details
        const promotion = await db.promotion.findUnique({
          where: { slug: contentSlug, isActive: true },
          select: { id: true, title: true },
        })

        if (!promotion) {
          throw new Error("Promotion not found")
        }

        subCategoryTitle = promotion.title

        // Get products in this promotion
        products = await db.product.findMany({
          where: {
            isActive: true,
            status: "ACTIVE",
            promotions: {
              some: {
                slug: contentSlug,
                isActive: true,
              },
            },
          },
          select: getProductSelectObject(),
          orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
          take: limit + 1,
          ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        })
        break
      }

      case "campaign": {
        // Get campaign details
        const campaign = await db.campaign.findUnique({
          where: { slug: contentSlug, isActive: true },
          select: { id: true, title: true },
        })

        if (!campaign) {
          throw new Error("Campaign not found")
        }

        subCategoryTitle = campaign.title

        // Get products in this campaign
        products = await db.product.findMany({
          where: {
            isActive: true,
            status: "ACTIVE",
            campaigns: {
              some: {
                slug: contentSlug,
                isActive: true,
              },
            },
          },
          select: getProductSelectObject(),
          orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
          take: limit + 1,
          ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        })
        break
      }

      case "category": {
        let targetSubCategoryId = subItemId

        if (!targetSubCategoryId) {
          // If no subcategory specified, get the first subcategory
          const category = await db.category.findUnique({
            where: { slug: contentSlug },
            select: {
              subCategories: {
                take: 1,
                where: { isActive: true },
                select: { id: true, title: true },
              },
            },
          })

          if (!category?.subCategories[0]) {
            throw new Error("Category or subcategory not found")
          }

          targetSubCategoryId = category.subCategories[0].id
          subCategoryTitle = category.subCategories[0].title
        } else {
          // Get subcategory title
          const subCategory = await db.subCategory.findUnique({
            where: { id: targetSubCategoryId },
            select: { title: true },
          })
          subCategoryTitle = subCategory?.title || "Products"
        }

        // Get products in this subcategory
        products = await db.product.findMany({
          where: {
            isActive: true,
            subCategoryId: targetSubCategoryId,
            status: "ACTIVE",
          },
          select: getProductSelectObject(),
          orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
          take: limit + 1,
          ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        })
        break
      }

      case "department": {
        if (!subItemId) {
          throw new Error("Category ID is required for department products")
        }

        // Get category title
        const category = await db.category.findUnique({
          where: { id: subItemId },
          select: { title: true },
        })

        subCategoryTitle = category?.title || "Products"

        // Get products in this category
        products = await db.product.findMany({
          where: {
            isActive: true,
            categoryId: subItemId,
            status: "ACTIVE",
          },
          select: getProductSelectObject(),
          orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
          take: limit + 1,
          ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        })
        break
      }

      default:
        throw new Error("Invalid content type")
    }

    const hasMore = products.length > limit
    const nextCursor = hasMore ? products[limit - 1].id : null

    const finalProducts = products.slice(0, limit).map((product) => ({
      id: product.id,
      title: product.title,
      price: product.salePrice || product.productPrice,
      oldPrice: product.isDiscount ? product.productPrice : null,
      discount: product.discount || 0,
      rating: product.rating || 0,
      slug: product.slug,
      reviews: product.reviews.length,
      image: product.imageUrl || "",
      isBestSeller: false,
      category: product.subCategory?.title || subCategoryTitle,
      categoryRank: 0,
      deliveryOptions: ["Free Delivery", "Express Delivery Available", "Same Day Delivery"],
      promotionType: product.isFeatured ? "express" : "super-mart",
    }))

    return {
      subCategoryTitle,
      products: finalProducts,
      nextCursor: hasMore ? nextCursor : null,
      hasMore,
    }
  } catch (error) {
    console.error(`Error fetching ${contentType} products:`, error)
    throw new Error(`Failed to fetch ${contentType} products`)
  }
}

// Helper function to define the product select object
function getProductSelectObject() {
  return {
    id: true,
    title: true,
    imageUrl: true,
    productPrice: true,
    salePrice: true,
    discount: true,
    slug: true,
    rating: true,
    isFeatured: true,
    isDiscount: true,
    reviews: {
      select: {
        id: true,
      },
    },
    subCategory: {
      select: {
        title: true,
      },
    },
  }
}

