"use server"
import { db } from "@/prisma/db"

export interface CategoryWithDepartment {
  id: string
  title: string
  slug: string
  image: string
  images: string[]
  description: string | null
  isActive: boolean
  icon: string | null
  position: number | null
  featured: boolean
  departmentId: string
  department: {
    id: string
    title: string
  }
  createdAt: Date
  updatedAt: Date | null
}

export interface DepartmentWithCategories {
  id: string
  title: string
  slug: string
  image: string
  images: string[]
  description: string | null
  isActive: boolean
  icon: string | null
  position: number | null
  featured: boolean
  categories: {
    id: string
    title: string
    slug: string
    image: string
    description: string | null
    icon: string | null
    isActive: boolean
  }[]
  createdAt: Date
  updatedAt: Date
}


export async function getDepartmentsWithCategories(departmentSlugs: string[]): Promise<Record<string, DepartmentWithCategories>> {
  try {
    const departments = await db.department.findMany({
      where: {
        slug: {
          in: departmentSlugs,
        },
        isActive: true,
      },
      include: {
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
            icon: true,
            isActive: true,
          },
          orderBy: {
            position: "desc",
          },
          take: 8, 
        },
      },
    });

    const departmentMap = departments.reduce((acc, dept) => {
      acc[dept.slug] = dept;
      return acc;
    }, {} as Record<string, DepartmentWithCategories>);

    return departmentMap;
  } catch (error) {
    console.error("Failed to fetch departments with categories:", error);
    throw new Error("Failed to fetch departments with categories");
  }
}

// Fetch departments with pagination
export async function getDepartments(page = 1, limit = 5): Promise<DepartmentWithCategories[]> {
  try {
    const skip = (page - 1) * limit
    
    const departments = await db.department.findMany({
      where: {
        isActive: true,
      },
      include: {
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
            icon: true,
            isActive: true,
          },
          orderBy: {
            position: "desc",
          },
          take: 8, // Limit to 8 categories per department
        },
      },
      orderBy: {
        position: "desc",
      },
      skip,
      take: limit,
    })

    return departments
  } catch (error) {
    console.error("Failed to fetch departments:", error)
    throw new Error("Failed to fetch departments")
  }
}