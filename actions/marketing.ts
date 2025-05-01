"use server"

import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"
import { Campaign, Promotion } from "@prisma/client"
import { generateSlug } from "@/lib/generateSlug"
import { PromotionTypes } from "@/types/types"


export async function getAllCampaigns() {
  try {
    const campaigns = await db.campaign.findMany({
      include: {
        products: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            productPrice: true,
            salePrice: true
          }
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return campaigns
  } catch (error) {
    console.error("Failed to fetch campaigns:", error)
    throw new Error("Failed to fetch campaigns")
  }
}

export async function getCampaignById(id: string) {
  try {
    const campaign = await db.campaign.findUnique({
      where: { id },
      include: {
        products: true,
      },
    })
    return campaign
  } catch (error) {
    console.error("Failed to fetch campaign:", error)
    throw new Error("Failed to fetch campaign")
  }
}

export async function createCampaign(data: any) {
    try {
      // Extract productIds from the data
      const { productIds, ...campaignData } = data;
      
      // Create campaign with connected products
      const campaign = await db.campaign.create({
        data: {
          ...campaignData,
          products: {
            connect: productIds && productIds.length > 0 
              ? productIds.map((id: string) => ({ id })) 
              : undefined,
          },
        },
      });
      
      revalidatePath("/dashboard/marketing");
      return campaign;
    } catch (error) {
      console.error("Failed to create campaign:", error);
      throw new Error("Failed to create campaign");
    }
  }

export async function updateCampaign(id: string, data: any) {
  
    // Guard against undefined data
    if (!data) {
      throw new Error("Campaign data is undefined");
    }
  
    try {
      // Extract productIds from the data
      const { productIds, ...campaignData } = data;
  
      // First, disconnect all existing products if productIds exists
      if (productIds) {
        await db.campaign.update({
          where: { id },
          data: {
            products: {
              set: [],
            },
          },
        });
      }
      
      // Then update with new data and connect new products
      const campaign = await db.campaign.update({
        where: { id },
        data: {
          ...campaignData,
          ...(productIds && productIds.length > 0 ? {
            products: {
              connect: productIds.map((productId: string) => ({ id: productId })),
            },
          } : {}),
        },
      });
      
      revalidatePath("/dashboard/marketing");
      return campaign;
    } catch (error) {
      console.error("Failed to update campaign:", error);
      throw new Error(`Failed to update campaign: ${error}`);
    }
}

export async function deleteCampaign(id: string) {
  try {
    await db.campaign.delete({
      where: { id },
    })
    
    revalidatePath("/dashboard/marketing")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete campaign:", error)
    throw new Error("Failed to delete campaign")
  }
}

// Promotion Server Actions
export async function getAllPromotions() {
  try {
    const promotions = await db.promotion.findMany({
      include: {
        products: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            productPrice: true,
            salePrice: true
          }
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return promotions
  } catch (error) {
    console.error("Failed to fetch promotions:", error)
    throw new Error("Failed to fetch promotions")
  }
}

export async function getPromotionById(id: string) {
  try {
    const promotion = await db.promotion.findUnique({
      where: { id },
      include: {
        products: true,
      },
    })
    return promotion as PromotionTypes
  } catch (error) {
    console.error("Failed to fetch promotion:", error)
    throw new Error("Failed to fetch promotion")
  }
}

export async function createPromotion(data: any) {
    try {
      // Generate slug if not provided
      const slug = data.slug || generateSlug(data.title)
      
      // Map form fields to schema fields
      const promotionData = {
        title: data.title,
        slug,
        description: data.description,
        imageUrl: data.imageUrl,
        discount: data.discountPercentage, 
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive,
      }
      
      const promotion = await db.promotion.create({
        data: {
          ...promotionData,
          products: {
            connect: data.productIds.map((id: string) => ({ id })),
          },
        },
      })
      
      revalidatePath("/dashboard/marketing")
      return promotion
    } catch (error) {
      console.error("Failed to create promotion:", error)
      throw new Error("Failed to create promotion")
    }
  }

  export async function updatePromotion(id: string, data: any) {
    console.log(id, data, "this is the promotion data")
    try {
      const promotionData = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        imageUrl: data.imageUrl,
        discount: data.discountPercentage, 
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive,
      }
      
      // First, disconnect all existing products
      await db.promotion.update({
        where: { id },
        data: {
          products: {
            set: [],
          },
        },
      })
      
      // Then update with new data and connect new products
      const promotion = await db.promotion.update({
        where: { id },
        data: {
          ...promotionData, // Use the mapped data
          products: {
            connect: data.productIds.map((id: string) => ({ id })),
          },
        },
      })
      
      revalidatePath("/dashboard/marketing")
      return promotion
    } catch (error) {
      console.error("Failed to update promotion:", error)
      throw new Error("Failed to update promotion")
    }
  }

export async function deletePromotion(id: string) {
  try {
    await db.promotion.delete({
      where: { id },
    })
    
    revalidatePath("/dashboard/marketing")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete promotion:", error)
    throw new Error("Failed to delete promotion")
  }
}

// Product Fetching for Campaigns/Promotions
export async function getProductsByStore(storeId?: string) {
  try {
    const whereClause = storeId 
      ? { storeId, isActive: true } 
      : { storeId: null, isActive: true };
    
    const products = await db.product.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        imageUrl: true,
        productPrice: true,
        salePrice: true,
        storeId: true,
        store: {
          select: {
            storeName: true
          }
        }
      },
      orderBy: {
        title: "asc"
      }
    });
    
    return products;
  } catch (error) {
    console.error("Failed to fetch products by store:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getAllStores() {
  try {
    const stores = await db.store.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        storeName: true,
        logo: true
      },
      orderBy: {
        storeName: "asc"
      }
    });
    
    return stores;
  } catch (error) {
    console.error("Failed to fetch stores:", error);
    throw new Error("Failed to fetch stores");
  }
}