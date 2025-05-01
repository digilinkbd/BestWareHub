"use server"

import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"
import { Banner, Store, User, VendorStatus } from "@prisma/client"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config/auth"
import { StoreQueryResult } from "@/types/types"
import { Resend } from "resend"
import ApprovalEmail from "@/components/email-templates/ApprovalEmail"
import RejectionEmail from "@/components/email-templates/RejectionEmail"

// Define the StoreFormData type based on your form data
export type StoreFormData = {
  storeName: string
  storeEmail: string
  storePhone: string
  storeWebsite?: string
  logoUrl: string
  businessName: string
  address: string
  city: string
  state: string
  country: string
  vatNumber?: string
  hasGst: string
  idProofUrl: string
  licenseUrl: string
  description: string
  facebook?: string
  instagram?: string
  twitter?: string
  themeColor: string
  bannerUrl: string
}
interface FetchStoresParams {
  page?: number;
  limit?: number;
  status?: VendorStatus;
  search?: string;
}
// Types for store data
export type StoreDetails = {
  id: string
  storeName: string
  slug: string
  description: string | null
  logo: string | null
  bannerUrl: string | null
  storeEmail: string | null
  storePhone: string | null
  storeAddress: string | null
  isActive: boolean
  isVerified: boolean
}

// Type for store products
export type StoreProduct = {
  id: string
  title: string
  price: number
  oldPrice: number | null
  discount: number
  rating: number
  slug: string
  reviews: number
  image: string
  isBestSeller: boolean
  category: string
  categoryRank: number
  deliveryOptions: string[]
  promotionType?: string
  isActive: boolean
  status: string
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createStore(formData: StoreFormData): Promise<{ success: boolean; data?: Store; error?: string }> {
  try {
   
     const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        error: "You must be logged in to create a store"
      }
    }

    const userId = session.user.id

    // Check if user already has a store
    const existingStore = await db.store.findUnique({
      where: {
        userId: userId
      }
    })

    if (existingStore) {
      return {
        success: false,
        error: "You already have a store. Please update your existing store."
      }
    }

    // Create slug from store name
    const slug = formData.storeName
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')

    // Check if slug already exists
    const existingSlug = await db.store.findUnique({
      where: {
        slug
      }
    })

    if (existingSlug) {
      return {
        success: false,
        error: "Store name already exists. Please choose a different name."
      }
    }

    // Prepare social links JSON
    const socialLinks = {
      facebook: formData.facebook || "",
      instagram: formData.instagram || "",
      twitter: formData.twitter || "",
    }

    // Create the store
    const newStore = await db.store.create({
      data: {
        storeName: formData.storeName,
        slug,
        licenseUrl: formData.licenseUrl,
        idProofUrl: formData.idProofUrl,
        logo: formData.logoUrl,
        bannerUrl: formData.bannerUrl,
        description: formData.description,
        storeEmail: formData.storeEmail,
        storePhone: formData.storePhone,
        storeAddress: formData.address,
        storeCity: formData.city,
        storeState: formData.state,
        storeCountry: formData.country,
        storeZip: "",  
        storeWebsite: formData.storeWebsite || "",
        hasGst: formData.hasGst === "yes",
        socialLinks: socialLinks as any,
        isVerified: false,
        isActive: true,
        featuredProducts: [],
        userId: userId
      }
    })

    // Update user's role and vendor status
    await db.user.update({
      where: {
        id: userId
      },
      data: {
        vendorStatus: "PENDING" as VendorStatus
      }
    })

    // Create a notification for the admin
    await db.notification.create({
      data: {
        title: "New Vendor Registration",
        message: `${formData.storeName} has registered as a vendor and is awaiting approval.`,
        type: "info",
        isRead: false,
        userId: userId, 
        link: `/store/${slug}`
      }
    })

    // Find admin users to notify them
    const adminUsers = await db.user.findMany({
      where: {
        role: "ADMIN"
      },
      select: {
        id: true
      }
    })

    // Notify all admins
    for (const admin of adminUsers) {
      await db.notification.create({
        data: {
          title: "New Vendor Registration",
          message: `${formData.storeName} has registered as a vendor and is awaiting your approval.`,
          type: "info",
          isRead: false,
          userId: admin.id,
          link: `/dashboard/vendors/${newStore.id}`
        }
      })
    }

    revalidatePath("/dashboard")
    revalidatePath(`/store/${slug}`)
    revalidatePath("/dashboard/vendors")
    
    return {
      success: true,
      data: newStore
    }
  } catch (error) {
    console.error("Failed to create store:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create store"
    }
  }
}


export async function getStoreByUserId(userId: string): Promise<Store | null> {
  try {
    const store = await db.store.findUnique({
      where: {
        userId: userId
      }
    })
    
    return store
  } catch (error) {
    console.error("Failed to get store:", error)
    return null
  }
}



export async function fetchStores({
  page = 1,
  limit = 10,
  status,
  search = "",
}: FetchStoresParams): Promise<StoreQueryResult> {
  try {
    const where: any = {
      isActive: true,
    };

    if (status) {
      where.user = {
        vendorStatus: status,
      };
    }

    if (search) {
      where.OR = [
        { storeName: { contains: search, mode: "insensitive" } },
        { storeEmail: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const total = await db.store.count({ where });

    const stores = await db.store.findMany({
      where,
      select: {
        id: true,
        storeName: true,
        slug: true,
        logo: true,
        description: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
  
        user: {
          select: {
            id: true,
            name: true,
            vendorStatus: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { stores, total };
  } catch (error) {
    console.error("Error fetching stores:", error);
    return { stores: [], total: 0 };
  }
}


export async function getStoreStats() {
  try {
    // Get total count of all stores
    const all = await db.store.count();

    // Get count of pending stores
    const pending = await db.store.count({
      where: {
        user: {
          vendorStatus: "PENDING",
        },
      },
    });

    // Get count of approved stores
    const approved = await db.store.count({
      where: {
        user: {
          vendorStatus: "APPROVED",
        },
      },
    });

    // Get count of rejected stores
    const rejected = await db.store.count({
      where: {
        user: {
          vendorStatus: "REJECTED",
        },
      },
    });

    return { all, pending, approved, rejected };
  } catch (error) {
    console.error("Error fetching store stats:", error);
    throw new Error("Failed to fetch store statistics");
  }
}

export async function getStoreById(id: string) {
  try {
    const store = await db.store.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image:true,
            email: true,
            vendorStatus: true,
          },
        },
      },
    });

    return store;
  } catch (error) {
    console.error("Error fetching store:", error);
    throw new Error("Failed to fetch store details");
  }
}

export async function updateStoreStatus(id: string, status: VendorStatus, reason?: string) {
  
  try {
    // Fetch store data in a single query to reduce database calls
    const store = await db.store.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!store) {
      throw new Error("Store not found");
    }

    const { user } = store;
    const userId = user.id;
    // Use a database transaction for atomic operations
    return await db.$transaction(async (tx) => {
      if (status === "APPROVED") {
        // Generate token and update store status
        const approvalToken = Buffer.from(`${userId}:${id}:${Date.now() + 86400000}`).toString("base64");
        
        await tx.store.update({
          where: { id },
          data: { isVerified: true },
        });

        await tx.user.update({
          where: { id: userId },
          data: { approvalToken }
        });
        
        const approvalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth?vendor=approve&token=${approvalToken}`;
        
        // Send email with proper error handling
        try {
          const emailResult = await resend.emails.send({
            from: 'BestWareHub Store Approval <info@mimos.com.bd>', 
            to: user.email,
            subject: "Your Store Application Has Been Approved",
            react: await ApprovalEmail({
              storeName: store.storeName,
              userName: user.name,
              approvalUrl,
            }),
          });
          
        } catch (emailError) {
          // Log but don't fail the transaction
          console.error("Failed to send approval email:", emailError);
        }
        
        // Create notification regardless of email status
        await tx.notification.create({
          data: {
            title: "Store approved",
            message: "Your store application has been approved!",
            type: "success",
            userId,
            link: "/auth?vendor=approve",
          },
        });
      } 
      else if (status === "REJECTED") {
        // Delete store
        await tx.store.delete({
          where: { id },
        });
        
        // Send rejection email with proper error handling
        try {
          const emailResult = await resend.emails.send({
            from: 'BestWareHub Store Status <info@mimos.com.bd>', 
            to: user.email,
            subject: "Your Store Application Status Update",
            react: await RejectionEmail({
              userName: user.name,
              storeName: store.storeName,
              reason,
            }),
          });
          
        } catch (emailError) {
          // Log but don't fail the transaction
          console.error("Failed to send rejection email:", emailError);
        }
        
        // Create notification regardless of email status
        await tx.notification.create({
          data: {
            title: "Store rejected",
            message: "Your store application has been rejected.",
            type: "error",
            userId,
            link: "/dashboard",
          },
        });
      } 
      else {
        throw new Error("Invalid status provided");
      }
      
      return { success: true };
    });
  } catch (error) {
    console.error("Error updating store status:", error);
    throw new Error("Failed to update store status");
  } 
  finally {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/vendors");
  }
}




export async function getStoreBySlug(slug: string): Promise<StoreDetails | null> {
  try {
    const store = await db.store.findUnique({
      where: { 
        slug,
        isActive: true ,
        isVerified:true
      },
      select: {
        id: true,
        storeName: true,
        slug: true,
        description: true,
        logo: true,
        bannerUrl: true,
        storeEmail: true,
        storePhone: true,
        storeAddress: true,
        isActive: true,
        isVerified: true
      }
    })
    
    return store
  } catch (error) {
    console.error("Failed to fetch store:", error)
    throw new Error("Failed to fetch store details")
  }
}


export async function getStoreBanners(storeId: string): Promise<Banner[]> {
  try {
    const store = await db.store.findUnique({
      where: { id: storeId },
      select: { bannerUrl: true },
    });

    if (!store || !store.bannerUrl) {
      return [];
    }

    return [{ imageUrl: store.bannerUrl } as Banner];
  } catch (error) {
    console.error("Failed to fetch store banners:", error);
    return [];
  }
}




export async function getStoreProducts(storeId: string): Promise<StoreProduct[]> {
  try {
    const products = await db.product.findMany({
      where: {
        storeId,
        isActive: true,
        status: "ACTIVE"
      },
      include: {
        reviews: true,
        subCategory: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    
    return products.map(product => ({
      id: product.id,
      title: product.title,
      price: product.salePrice || product.productPrice,
      oldPrice: product.isDiscount ? product.productPrice : null,
      discount: product.discount || 0,
      rating: product.rating || 0,
      slug: product.slug,
      reviews: product.reviews.length,
      image: product.imageUrl || "",
      isBestSeller: false,
      category: product.subCategory?.title || "",
      categoryRank: 0,
      deliveryOptions: ["Free Delivery", "Express Delivery Available", "Same Day Delivery"],
      promotionType: product.isFeatured ? "express" : "super-mart",
      isActive: true,
      status: "ACTIVE"
    }))
  } catch (error) {
    console.error("Failed to fetch store products:", error)
    return []
  }
}