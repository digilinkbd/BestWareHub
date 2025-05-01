"use server"

import { db } from "@/prisma/db"
import type { BrandFormProps, BrandWithRelations } from "@/types/types"
import { revalidatePath } from "next/cache"
import type { Brand } from "@prisma/client"

export async function createBrand(data: BrandFormProps) {
  const slug = data.slug
  try {
    const existingBrand = await db.brand.findUnique({
      where: { slug },
    })

    if (existingBrand) {
      return existingBrand
    }

    const newBrand = await db.brand.create({
      data: {
        title: data.title,
        slug: data.slug,
        imageUrl: data.imageUrl,
        logo: data.logo,
        description: data.description,
        featured: data.featured ?? false,
        isActive: data.isActive ?? true,
        subCategoryId: data.subCategoryId,
      },
    })

    revalidatePath("/dashboard/brands")
    return newBrand
  } catch (error) {
    console.error(error)
    throw new Error("Failed to create brand")
  }
}

export async function getAllBrands(): Promise<BrandWithRelations[]> {
  try {
    const brands = await db.brand.findMany({
      include: {
        SubCategory: {
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
    return brands
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch brands")
  }
}

export async function getActiveBrands(): Promise<Brand[]> {
  try {
    const brands = await db.brand.findMany({
      where: {
        isActive: true,
      },
      include: {
        SubCategory: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return brands
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch active brands")
  }
}

export async function getBrandById(id: string): Promise<BrandWithRelations | null> {
  try {
    const brand = await db.brand.findUnique({
      where: { id },
      include: {
        SubCategory: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
    return brand
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch brand")
  }
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  try {
    const brand = await db.brand.findUnique({
      where: { slug },
      include: {
        SubCategory: {
          select: {
            title: true,
          },
        },
      },
    })

    return brand
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch brand by slug")
  }
}

export async function updateBrand(id: string, data: BrandFormProps): Promise<Brand> {
  try {
    const updatedBrand = await db.brand.update({
      where: { id },
      data,
    })

    revalidatePath("/dashboard/brands")
    return updatedBrand
  } catch (error) {
    console.error(error)
    throw new Error("Failed to update brand")
  }
}

export async function deleteBrand(id: string): Promise<Brand> {
  try {
    const deletedBrand = await db.brand.delete({
      where: { id },
    })

    revalidatePath("/dashboard/brands")
    return deletedBrand
  } catch (error) {
    console.error(error)
    throw new Error("Failed to delete brand")
  }
}

export async function getBrandsBySubCategory(subCategoryId: string): Promise<Brand[]> {
  try {
    const brands = await db.brand.findMany({
      where: {
        subCategoryId,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return brands
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch brands by subcategory")
  }
}