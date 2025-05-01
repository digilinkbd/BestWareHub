"use server"

import { db } from "@/prisma/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config/auth"

// Using the exact enum values from your Prisma schema
export type VendorStatus = "NORMAL" | "PENDING" | "REJECTED" | "APPROVED"

export type VendorStatusResponse = {
  status: VendorStatus
  message: string
}

export async function getVendorStatus(): Promise<VendorStatusResponse> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      throw new Error("Unauthorized")
    }
    
    // Fetch the vendor status directly from the user model
    const user = await db.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        vendorStatus: true,
        store: {
          select: {
            storeName: true
          }
        }
      }
    })
    
    if (!user) {
      return {
        status: "NORMAL",
        message: "User not found"
      }
    }
    
    // Map the status to appropriate messages
    const messages = {
      "NORMAL": "Your account is active",
      "PENDING": "Your store application is under review",
      "REJECTED": "Your store application was rejected",
      "APPROVED": `Your store is approved${user.store ? `: ${user.store.storeName}` : ''}`
    }
    
    // Handle null vendorStatus by defaulting to NORMAL
    const status = user.vendorStatus || "NORMAL"
    
    return {
      status: status as VendorStatus,
      message: messages[status as VendorStatus] || "Unknown status"
    }
  } catch (error) {
    console.error("Failed to fetch vendor status:", error)
    return {
      status: "NORMAL",
      message: "Unable to fetch vendor status"
    }
  }
}
