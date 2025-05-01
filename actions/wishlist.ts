"use server"

import { authOptions } from "@/config/auth";
import { db } from "@/prisma/db"
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getOrCreateWishlist() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null
  }
  
  const userId = session.user.id
  
  try {
    // Check if user already has a default wishlist
    let wishlist = await db.wishlist.findFirst({
      where: { userId },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    })
    
    // If no wishlist exists, create one
    if (!wishlist) {
      const slug = `wishlist-${userId}-${Date.now()}`
      wishlist = await db.wishlist.create({
        data: {
          name: "My Wishlist",
          slug,
          userId,
          shareLink: `/wishlist/shared/${slug}`
        },
        include: {
          products: {
            include: {
              product: true
            }
          }
        }
      })
    }
    
    return wishlist
  } catch (error) {
    console.error("Failed to get or create wishlist:", error)
    throw new Error("Failed to get or create wishlist")
  }
}

// Add product to wishlist
export async function addToWishlist(productId: string) {
    const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { error: "Please login to add items to your wishlist" }
  }
  
  try {
    // Get or create the user's wishlist
    const wishlist = await getOrCreateWishlist()
    
    if (!wishlist) {
      return { error: "Could not find or create wishlist" }
    }
    
    // Check if product already exists in wishlist
    const existingItem = await db.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId
        }
      }
    })
    
    if (existingItem) {
      // Product already in wishlist - could remove it here if you want toggle behavior
      return { success: true, added: false, message: "Product already in wishlist" }
    }
    
    // Add product to wishlist
    await db.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId
      }
    })
    
    revalidatePath("/wishlist")
    revalidatePath("/products")
    revalidatePath(`/p/[slug]`, "page")
    
    return { success: true, added: true, message: "Added to wishlist" }
  } catch (error) {
    console.error("Failed to add to wishlist:", error)
    return { error: "Failed to add product to wishlist" }
  }
}

// Remove product from wishlist
export async function removeFromWishlist(productId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { error: "Please login to manage your wishlist" }
  }
  
  try {
    const wishlist = await getOrCreateWishlist()
    
    if (!wishlist) {
      return { error: "Could not find wishlist" }
    }
    
    await db.wishlistItem.deleteMany({
      where: {
        wishlistId: wishlist.id,
        productId
      }
    })
    
    revalidatePath("/wishlist")
    revalidatePath("/products")
    revalidatePath(`/p/[slug]`, "page")
    
    return { success: true, message: "Removed from wishlist" }
  } catch (error) {
    console.error("Failed to remove from wishlist:", error)
    return { error: "Failed to remove product from wishlist" }
  }
}

// Check if product is in wishlist
export async function isInWishlist(productId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return false
  }
  
  try {
    const wishlist = await getOrCreateWishlist()
    
    if (!wishlist) {
      return false
    }
    
    const item = await db.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId
      }
    })
    
    return !!item
  } catch (error) {
    console.error("Failed to check if product is in wishlist:", error)
    return false
  }
}

// Create a new wishlist
export async function createWishlist(name: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { error: "Please login to create a wishlist" }
  }
  
  try {
    const slug = `wishlist-${session.user.id}-${Date.now()}`
    
    const wishlist = await db.wishlist.create({
      data: {
        name,
        slug,
        userId: session.user.id,
        shareLink: `/wishlist/shared/${slug}`
      }
    })
    
    revalidatePath("/wishlist")
    
    return { success: true, wishlist }
  } catch (error) {
    console.error("Failed to create wishlist:", error)
    return { error: "Failed to create wishlist" }
  }
}

// Get shared wishlist by slug
export async function getSharedWishlist(slug: string) {
  try {
    const wishlist = await db.wishlist.findUnique({
      where: { 
        slug,
        isPublic: true 
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        },
        products: {
          include: {
            product: true
          }
        }
      }
    })
    
    return wishlist
  } catch (error) {
    console.error("Failed to get shared wishlist:", error)
    return null
  }
}

// Update wishlist visibility
export async function updateWishlistVisibility(wishlistId: string, isPublic: boolean) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { error: "Please login to update your wishlist" }
  }
  
  try {
    const wishlist = await db.wishlist.findUnique({
      where: { id: wishlistId, userId: session.user.id }
    })
    
    if (!wishlist) {
      return { error: "Wishlist not found" }
    }
    
    await db.wishlist.update({
      where: { id: wishlistId },
      data: { isPublic }
    })
    
    revalidatePath("/wishlist")
    
    return { success: true, message: `Wishlist is now ${isPublic ? 'public' : 'private'}` }
  } catch (error) {
    console.error("Failed to update wishlist visibility:", error)
    return { error: "Failed to update wishlist visibility" }
  }
}

// Get all wishlists for user
export async function getUserWishlists() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return []
  }
  
  try {
    const wishlists = await db.wishlist.findMany({
      where: { userId: session.user.id },
      include: {
        products: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })
    
    return wishlists
  } catch (error) {
    console.error("Failed to get user wishlists:", error)
    return []
  }
}