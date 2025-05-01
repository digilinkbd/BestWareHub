"use server"

import { db } from "@/prisma/db"
import type { CategoryProps, CategoryWithDepartment, SubCategoryProductsResponse } from "@/types/types"
import { revalidatePath } from "next/cache"
import type { Category } from "@prisma/client"

export async function createCategory(data: CategoryProps): Promise<Category> {
  const slug = data.slug
  try {
    const existingCategory = await db.category.findUnique({
      where: {
        slug,
      },
    })

    if (existingCategory) {
      return existingCategory
    }

    const newCategory = await db.category.create({
      data,
    })

    revalidatePath("/dashboard/categories")
    return newCategory
  } catch (error) {
    console.error(error)
    throw new Error("Failed to create category")
  }
}

export async function getAllCategories(): Promise<CategoryWithDepartment[]> {
  try {
    const categories = await db.category.findMany({
      include: {
        department: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return categories.map(category => ({
      ...category,
      department: category.department || { id: '', title: 'Unknown' },
    } as CategoryWithDepartment))
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch categories")
  }
}

export async function getActiveCategories() {
  try {
    const categories = await db.category.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        image: true,
        slug: true,
        images: true,
        departmentId: true,
        department: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return categories
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch active categories")
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const category = await db.category.findUnique({
      where: {
        id,
      },
      include: {
        department: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
    return category
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch category")
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const category = await db.category.findUnique({
      where: {
        slug,
      },
      include: {
        department: {
          select: {
            title: true,
          },
        },
      },
    })

    return category
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch category by slug")
  }
}

export async function updateCategory(id: string, data: CategoryProps): Promise<Category> {
  try {
    const updatedCategory = await db.category.update({
      where: {
        id,
      },
      data,
    })

    revalidatePath("/dashboard/categories")
    return updatedCategory
  } catch (error) {
    console.error(error)
    throw new Error("Failed to update category")
  }
}

export async function deleteCategory(id: string): Promise<Category> {
  try {
    const deletedCategory = await db.category.delete({
      where: {
        id,
      },
    })

    revalidatePath("/dashboard/categories")
    return deletedCategory
  } catch (error) {
    console.error(error)
    throw new Error("Failed to delete category")
  }
}

export async function getCategoriesByDepartment(departmentId: string) {
  try {
    const categories = await db.category.findMany({
      where: {
        departmentId,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        image: true,
        slug: true,
      },
      orderBy: {
        position: "asc",
      },
    })

    return categories
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch categories by department")
  }
}

export async function getCategoryBySlugAndSubCategory(slug: string) {
  try {
    const category = await db.category.findUnique({
      where: { slug },
      select: {
        id: true,
        images: true,
        slug:true,
        title:true,
        subCategories: {
          select: {
            id: true,
            title: true,
            slug:true,
            image:true
          }
        }
      }
    })
    
    return category
  } catch (error) {
    console.error("Error fetching category:", error)
    throw new Error("Failed to fetch category")
  }
}

export async function getCategorySubcategoryProducts(
  categorySlug: string,
  subCategoryId?: string,
  cursor?: string | null, 
  limit: number = 12
): Promise<SubCategoryProductsResponse> {
  try {
    let targetSubCategoryId = subCategoryId
    let subCategoryTitle = ""
    
    if (!targetSubCategoryId) {
      const category = await db.category.findUnique({
        where: { slug: categorySlug },
        select: {
          subCategories: {
            take: 1,
            where: { isActive: true },
            select: { id: true, title: true }
          }
        }
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
        select: { title: true }
      })
      subCategoryTitle = subCategory?.title || "Products"
    }
    
    const products = await db.product.findMany({
      where: {
        isActive: true,
        subCategoryId: targetSubCategoryId,
        status:"ACTIVE",
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        productPrice: true,
        salePrice: true,
        discount: true,
        slug:true,
        rating: true,
        isFeatured: true,
        isDiscount: true,
        reviews: {
          select: {
            id: true
          }
        },
        subCategory: {
          select: {
            title: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit + 1, 
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {})
    })
    
    const hasMore = products.length > limit
    const nextCursor = hasMore ? products[limit - 1].id : null
    
    const finalProducts = products.slice(0, limit).map(product => ({
      id: product.id,
      title: product.title,
      price: product.salePrice || product.productPrice,
      oldPrice: product.isDiscount ? product.productPrice : null,
      discount: product.discount || 0,
      rating: product.rating || 0,
      slug:product.slug,
      reviews: product.reviews.length,
      image: product.imageUrl || "",
      isBestSeller: false,
      category: product.subCategory?.title || subCategoryTitle,
      categoryRank: 0,
      deliveryOptions: ["Free Delivery", "Express Delivery Available", "Same Day Delivery"],
      promotionType: product.isFeatured ? "express" : "super-mart"
    }))
    
    return {
      subCategoryTitle,
      products: finalProducts,
      nextCursor: hasMore ? nextCursor : null,
      hasMore
    }
  } catch (error) {
    console.error("Error fetching category subcategory products:", error)
    throw new Error("Failed to fetch category products")
  }
}