"use server";

import { db } from "@/prisma/db";
import { DepartmentProps, DepartmentsPaginatedResponse } from "@/types/types";
import { revalidatePath } from "next/cache";
export interface DepartmentData {
  id: string
  title: string
  slug: string
  image: string
  isActive: boolean
}
export type CategoryBasic = {
  id: string
  title: string
  slug: string
  image: string
}

export type DepartmentWithCategories = {
  id: string
  title: string
  slug: string
  categories: CategoryBasic[]
}

export async function createDepartment(data: DepartmentProps) {
  const slug = data.slug;
  try {
    const existingDepartment = await db.department.findUnique({
      where: {
        slug,
      },
    });
    
    if (existingDepartment) {
      return existingDepartment;
    }
    
    const newDepartment = await db.department.create({
      data,
    });
    
    revalidatePath("/dashboard/departments");
    return newDepartment;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create department");
  }
}

export async function getAllDepartments() {
  try {
    const departments = await db.department.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return departments;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch departments");
  }
}

export async function getActiveDepartments() {
  try {
    const departments = await db.department.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        title: true,
        image: true,
        slug: true,
        images:true
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return departments;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch active departments");
  }
}

export async function getDepartmentById(id: string) {
  try {
    const department = await db.department.findUnique({
      where: {
        id,
      },
    });
    return department;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch department");
  }
}

export async function getDepartmentBySlug(slug: string) {
  try {
    const department = await db.department.findUnique({
      where: {
        slug,
      },
    });
    
    return department;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch department by slug");
  }
}

export async function updateDepartment(id: string, data: DepartmentProps) {
  try {
    const updatedDepartment = await db.department.update({
      where: {
        id,
      },
      data,
    });
    
    revalidatePath("/dashboard/departments");
    return updatedDepartment;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update department");
  }
}

export async function deleteDepartment(id: string) {
  try {
    const deletedDepartment = await db.department.delete({
      where: {
        id,
      },
    });
    
    revalidatePath("/dashboard/departments");
    return deletedDepartment;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete department");
  }
}

export async function getSubBySlug(slug: string) {
  // Implement based on your requirements
  return null;
}

export async function fetchDepartmentsWithRelations() {
  try {
    const departments = await db.department.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        description: true,
        featured: true,
        icon: true,
        categories: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
            description: true,
            featured: true,
            icon: true,
            subCategories: {
              where: {
                isActive: true,
              },
              select: {
                id: true,
                title: true,
                slug: true,
                image: true,
                description: true,
                brands: {
                  where: {
                    isActive: true,
                  },
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                    imageUrl: true,
                    logo: true,
                    featured: true,
                  },
                },
              },
            },
          },
        },
      },
      // orderBy: {
      //   position: '',
      // },
    })

    return departments
  } catch (error) {
    console.error("Error fetching departments with relations:", error)
    throw new Error("Failed to fetch departments")
  }
}

export async function getHomeDepartments(): Promise<DepartmentData[]> {
  try {
    const departments = await db.department.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        isActive: true,
      },
      where: {
        isActive: true,
      },
      orderBy: [
        { featured: 'desc' },
        { position: 'asc' },
        { title: 'asc' }
      ],
    })
    
    return departments
  } catch (error) {
    console.error("Failed to fetch departments:", error)
    throw new Error("Failed to fetch departments")
  }
}


const ITEMS_PER_PAGE = 5;

export async function getDepartmentsWithCategories(cursor?: string | null): Promise<DepartmentsPaginatedResponse> {
  try {
    const departments = await db.department.findMany({
      where: {
        isActive: true,
      },
      take: ITEMS_PER_PAGE,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        title: true,
        slug: true,
        categories: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
          },
          take: 10, // Limit to 10 categories per department
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const nextCursor = departments.length === ITEMS_PER_PAGE ? departments[departments.length - 1].id : null;

    return {
      departments,
      nextCursor,
      hasMore: departments.length === ITEMS_PER_PAGE,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch departments with categories");
  }
}

export async function getDepartmentWithCategories(departmentSlug: string) {
  try {
    const department = await db.department.findUnique({
      where: { 
        slug: departmentSlug,
        isActive: true
      },
      select: {
        id:true,
        slug: true,
        title:true,
        images: true,
        categories: {
          where: {
            isActive: true
          },
          select: {
            id: true,
            title: true,
            slug: true,
            image:true
          },
          orderBy: {
            position: 'desc'
          }
        }
      }
    })
    
    if (!department) {
      throw new Error(`Department with slug ${departmentSlug} not found`)
    }
    
    return department
  } catch (error) {
    console.error(`Failed to fetch department data for ${departmentSlug}:`, error)
    throw new Error("Failed to fetch department data")
  }
}

export async function getSubcategoriesByDepartment(slug: string) {
  try {
    // First, find the department by slug
    const department = await db.department.findUnique({
      where: { slug, isActive: true },
      select: { id: true }
    })

    if (!department) {
      throw new Error("Department not found")
    }

    // Find categories belonging to this department
    const categories = await db.category.findMany({
      where: { 
        departmentId: department.id,
        isActive: true
      },
      select: { id: true }
    })

    const categoryIds = categories.map(category => category.id)

    const subcategories = await db.subCategory.findMany({
      where: {
        categoryId: { in: categoryIds },
        isActive: true
      },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        icon: true,
        category: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      },
      orderBy: {
        position: "asc"
      },
    })

    return subcategories
  } catch (error) {
    console.error("Failed to fetch subcategories:", error)
    throw new Error("Failed to fetch subcategories by department")
  }
}