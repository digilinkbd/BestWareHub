"use server"

import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"

// Type definitions
export type PromotionResponse = {
  id: string;
  title: string;
  imageUrl: string | null;
  description: string | null;
}


export async function getActivePromotions(): Promise<PromotionResponse[]> {
    const currentDate = new Date();
    try {
      const promotions = await db.promotion.findMany({
        where: {
          isActive: true,
          startDate: { lte: currentDate },
          endDate: { gte: currentDate },
          imageUrl: { not: null } 
        },
        select: {
          id: true,
          title: true,
          imageUrl: true,
          description: true,
        },
        // orderBy: {
        //   endDate: "asc", // Show promotions ending soon first
        // },
        skip: 2, // Skip the first two promotions
      
      });
      return promotions;
    } catch (error) {
      console.error("Failed to fetch active promotions:", error);
      return [];
    }
  }
  
