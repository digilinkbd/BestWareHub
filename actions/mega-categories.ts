"use server"

import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"

// Types
export type FeaturedCategory = {
  id: string
  title: string
  image: string
  slug: string
}

export type FeaturedProduct = {
  id: string
  title: string
  imageUrl: string
  productPrice: number
  salePrice: number | null
  isDiscount: boolean
  departmentName: string
}

export type FeaturedPromotion = {
  id: string
  title: string
  imageUrl: string
  slug: string
}

// Fetch featured categories from specific departments
export async function getFeaturedCategories(): Promise<FeaturedCategory[]> {
  try {
    // First try to get categories from specific departments
    const categories = await db.category.findMany({
      where: {
        isActive: true,
        department: {
          title: {
            in: ["Electronics", "Men's Fashion", "Beauty & Fragrance"]
          }
        }
      },
      select: {
        id: true,
        title: true,
        image: true,
        slug: true,
        department: {
          select: {
            title: true
          }
        }
      },
      take: 4,
    });
    
    // If we don't have enough categories, get random active ones
    if (categories.length < 4) {
      const remainingCount = 4 - categories.length;
      const randomCategories = await db.category.findMany({
        where: {
          isActive: true,
          id: {
            notIn: categories.map(cat => cat.id)
          }
        },
        select: {
          id: true,
          title: true,
          image: true,
          slug: true,
          department: {
            select: {
              title: true
            }
          }
        },
        take: remainingCount,
      });
      
      return [...categories, ...randomCategories].map(cat => ({
        id: cat.id,
        title: cat.title,
        image: cat.image,
        slug: cat.slug
      }));
    }
    
    return categories.map(cat => ({
      id: cat.id,
      title: cat.title,
      image: cat.image,
      slug: cat.slug
    }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

// Fetch featured products
export async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        productPrice: true,
        salePrice: true,
        isDiscount: true,
        department: {
          select: {
            title: true
          }
        }
      },
      take: 4,
      orderBy: {
        createdAt: "desc",
      }
    });
    
    return products.map(product => ({
      id: product.id,
      title: product.title,
      imageUrl: product.imageUrl || "/placeholder.jpg",
      productPrice: product.productPrice,
      salePrice: product.salePrice,
      isDiscount: product.isDiscount,
      departmentName: product.department.title
    }));
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

// Fetch active promotions
export async function getActivePromotions(): Promise<FeaturedPromotion[]> {
  try {
    const now = new Date();
    
    const promotions = await db.promotion.findMany({
      where: {
        isActive: true,
        startDate: {
          lte: now
        },
        endDate: {
          gte: now
        }
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        slug: true
      },
      take: 2,
      orderBy: {
        createdAt: "asc"
      }
    });
    
    return promotions.map(promo => ({
      id: promo.id,
      title: promo.title,
      imageUrl: promo.imageUrl || "/placeholder.jpg",
      slug: promo.slug
    }));
  } catch (error) {
    console.error("Failed to fetch promotions:", error);
    return [];
  }
}