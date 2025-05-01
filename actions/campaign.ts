"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export type CampaignData = {
  id: string;
  slug: string;
  imageUrl: string | null;
  title: string;
}

export async function getActiveCampaigns(): Promise<CampaignData[]> {
  try {
    const currentDate = new Date();
    
    const campaigns = await db.campaign.findMany({
      where: {
        isActive: true,
        startDate: { lte: currentDate },
        endDate: { gte: currentDate },
        imageUrl: { not: null },
      },
      select: {
        id: true,
        slug: true,
        imageUrl: true,
        title: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return campaigns as CampaignData[];
  } catch (error) {
    console.error("Failed to fetch active campaigns:", error);
    throw new Error("Failed to fetch active campaigns");
  }
}

export async function getFeatureBanner(): Promise<CampaignData | null> {
  try {
    const currentDate = new Date();
 
    const featureBanner = await db.campaign.findFirst({
      where: {
        isActive: true,
        startDate: { lte: currentDate },
        endDate: { gte: currentDate },
        imageUrl: { not: null },
      },
      select: {
        id: true,
        slug: true,
        imageUrl: true,
        title: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: 8,
    });

    return featureBanner as CampaignData | null;
  } catch (error) {
    console.error("Failed to fetch feature banner:", error);
    throw new Error("Failed to fetch feature banner");
  }
}