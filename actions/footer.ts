"use server"

import { db } from "@/prisma/db"


export async function fetchDepartmentsWithCategories() {
  
  try {
    
    const departments = await db.department.findMany({
      where: { 
        isActive: true 
      },
      select: {
        id: true,
        title: true,
        slug: true,
        categories: {
          where: { 
            isActive: true 
          },
          select: {
            id: true,
            title: true,
            slug: true,
            subCategories: {
              where: { 
                isActive: true 
              },
              select: {
                id: true,
                title: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: {
        position: "asc"
      }
    })
    
    return departments
  } catch (error) {
    console.error("Failed to fetch departments and categories:", error)
    return []
  }
}
