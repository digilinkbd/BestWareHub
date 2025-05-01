"use server"

import { db } from "@/prisma/db"
import type { SubCategoryFormProps, SubCategoryProps, SubCategoryWithCategory } from "@/types/types"
import { revalidatePath } from "next/cache"
import type { SubCategory } from "@prisma/client"


export async function createSubCategory(data: SubCategoryFormProps) {
  const slug = data.slug
  try {
    const existingSubCategory = await db.subCategory.findUnique({
      where: {
        slug,
      },
    })

    if (existingSubCategory) {
      return existingSubCategory
    }
   console.log(data , "the data")
   const newSubCategory = await db.subCategory.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      isActive: data.isActive,
      icon: data.icon,
      position: data.position,
      categoryId: data.categoryId ?? null,
      image: data.image,
      images: data.images,
    },
  });
  

    revalidatePath("/dashboard/sub-categories")
    return newSubCategory
  } catch (error) {
    console.error(error)
    throw new Error("Failed to create category")
  }
}

export async function getAllSubCategories(): Promise<SubCategoryWithCategory[]> {
  try {
    const subcategories = await db.subCategory.findMany({
      include: {
        category: {
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

    return subcategories
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch subcategories")
  }
}

export async function getActiveSubCategories(): Promise<SubCategory[]> {
  try {
    const subcategories = await db.subCategory.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return subcategories
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch active subcategories")
  }
}

export async function getSubCategoryById(id: string): Promise<SubCategoryWithCategory | null> {
  try {
    const subcategory = await db.subCategory.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
    return subcategory
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch subcategory")
  }
}

export async function getSubCategoryBySlug(slug: string): Promise<SubCategory | null> {
  try {
    const subcategory = await db.subCategory.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            title: true,
          },
        },
      },
    })

    return subcategory
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch subcategory by slug")
  }
}

export async function updateSubCategory(id: string, data: SubCategoryFormProps): Promise<SubCategory> {
  try {
    const updatedSubCategory = await db.subCategory.update({
      where: { id },
      data,
    })

    revalidatePath("/dashboard/sub-categories")
    return updatedSubCategory
  } catch (error) {
    console.error(error)
    throw new Error("Failed to update subcategory")
  }
}

export async function deleteSubCategory(id: string): Promise<SubCategory> {
  try {
    const deletedSubCategory = await db.subCategory.delete({
      where: { id },
    })

    revalidatePath("/dashboard/sub-categories")
    return deletedSubCategory
  } catch (error) {
    console.error(error)
    throw new Error("Failed to delete subcategory")
  }
}

export async function getSubCategoriesByCategory(categoryId: string): Promise<SubCategory[]> {
  try {
    const subcategories = await db.subCategory.findMany({
      where: {
        categoryId,
        isActive: true,
      },
      orderBy: {
        position: "asc",
      },
    })

    return subcategories
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch subcategories by category")
  }
}

