"use server"

import { authOptions } from "@/config/auth"
import { ROLES } from "@/config/permissions"
import { db } from "@/prisma/db"
import { Prisma, ProductStatus, Review } from "@prisma/client"
import type { ProductInput, ProductWithRelations3, ReviewFormData, SimilarProductType } from "@/types/types"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

export type ProductCardData = {
  id: string
  title: string
  price: number
  oldPrice: number | null
  discount: number
  rating: number
  reviews: number
  slug:string
  image: string
  isBestSeller: boolean
  category: string
  categoryRank: number
  deliveryOptions: string[]
  promotionType: string
}

export type CategoryProductsResponse = {
  categoryTitle: string
  products: ProductCardData[]
  nextCursor?: string | null
  hasMore: boolean
}

export async function createProduct(data: ProductInput) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error("Unauthorized: You must be logged in to create a product")
  }

  const isAdmin = session.user.roles?.some((role) => role.roleName === ROLES.ADMIN.roleName)
  const isVendor = session.user.roles?.some((role) => role.roleName === ROLES.VENDOR.roleName)

  if (!isAdmin && !isVendor) {
    throw new Error("Unauthorized: You don't have permission to create products")
  }

  try {
    const existingProduct = await db.product.findFirst({
      where: {
        OR: [
          { title: data.title },
          { slug: data.slug }
        ]
      },
      select: { id: true } 
    })
  
    if (existingProduct) {
      throw new Error("A product with the same title or slug already exists")
    }

    let productStatus: ProductStatus;
    
    if (isAdmin) {
      productStatus = "ACTIVE";
    } else if (session.user.store?.id) {
      productStatus = isAdmin ? "ACTIVE" : "PENDING";
    } else {
      productStatus = "PENDING";
    }

    const createInput: Prisma.ProductCreateInput = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      shortDesc: data.shortDesc,
      imageUrl: data.imageUrl,
      productImages: data.productImages || [],
      productPrice: data.productPrice,
      productStock: data.productStock ?? 0,
      isActive: data.isActive ?? true,
      isWholesale: data.isWholesale ?? false,
      isFeatured: data.isFeatured ?? false,
      isNewArrival: data.isNewArrival ?? false,
      isDiscount: data.isDiscount ?? false,
      lowStockAlert: data.lowStockAlert ?? 5,
      qty: data.qty ?? 0,
      tax: data.tax ?? 0,
      salePrice: data.salePrice,
      wholesalePrice: data.wholesalePrice,
      wholesaleQty: data.wholesaleQty,
      sku: data.sku,
      barcode: data.barcode,
      productCode: data.productCode,
      unit: data.unit,
      discount: data.discount,
      tags: data.tags || [],
      attributes: data.attributes as Prisma.InputJsonValue,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      metaKeywords: data.metaKeywords || [],
      status: productStatus,
      shopName:session.user?.store?.storeName,
      department: {
        connect: { id: data.departmentId },
      },
      vendor: {
        connect: { id: session.user.id },
      },
      ...(data.categoryId && {
        category: { connect: { id: data.categoryId } },
      }),
      ...(data.subCategoryId && {
        subCategory: { connect: { id: data.subCategoryId } },
      }),
      ...(data.brandId && {
        brand: { connect: { id: data.brandId } },
      }),
      ...(session.user?.store?.id && {
        store: { connect: { id: session.user?.store?.id } },
      }),
    }
    
    // Use a transaction for data integrity
    const newProduct = await db.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: createInput,
        select: {
          id: true,
          title: true,
          slug: true,
          imageUrl: true,
          productPrice: true,
          status: true,
          departmentId: true,
          categoryId: true,
          subCategoryId: true,
          brandId: true,
          vendorId: true,
          storeId: true,
        },
      })

      return product
    })

    revalidatePath("/dashboard/products")

    return newProduct
  } catch (error) {
    console.error("Failed to create product:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    throw new Error(`Failed to create product: ${errorMessage}`)
  }
}

export async function updateProduct(id: string, data: ProductInput) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error("Unauthorized")
  }

  // Determine if the user is an admin
  const isAdmin = session.user.roles?.some(role => 
    role.roleName === ROLES.ADMIN.roleName
  )

  try {
    const updateInput: Prisma.ProductUpdateInput = {
      title: data.title,
      description: data.description,
      shortDesc: data.shortDesc,
      productPrice: data.productPrice,
      salePrice: data.salePrice,
      productStock: data.productStock,
      lowStockAlert: data.lowStockAlert,
      sku: data.sku,
      barcode: data.barcode,
      unit: data.unit || null,
      isWholesale: data.isWholesale,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      isNewArrival: data.isNewArrival,
      isDiscount: data.isDiscount,
      tax: data.tax,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      metaKeywords: data.metaKeywords || [],
      attributes: data.attributes 
        ? JSON.parse(JSON.stringify(data.attributes)) 
        : Prisma.JsonNull,
      tags: data.tags || [],
      slug: data.slug,
      productImages: data.productImages || [],
      imageUrl: data.imageUrl || null,
      
      ...(data.departmentId && { 
        department: { connect: { id: data.departmentId } } 
      }),
      ...(data.categoryId && { 
        category: { connect: { id: data.categoryId } } 
      }),
      ...(data.subCategoryId && { 
        subCategory: { connect: { id: data.subCategoryId } } 
      }),
      ...(data.brandId && { 
        brand: { connect: { id: data.brandId } } 
      }),
      ...(isAdmin && data.status && { status: data.status }),
    }

    const updatedProduct = await db.product.update({
      where: { 
        id,
        ...(session.user.roles?.every(role => role.roleName !== ROLES.ADMIN.roleName) 
          ? { vendorId: session.user.id } 
          : {}
        )
      },
      data: updateInput,
      include: {
        department: true,
        category: true,
        subCategory: true,
        brand: true,
        vendor: true
      }
    })

    revalidatePath("/dashboard/products")
    return updatedProduct
  } catch (error) {
    console.error(error)
    throw new Error("Failed to update product")
  }
}
export async function deleteProduct(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error("Unauthorized")
  }

  // Determine if the user is an admin
  const isAdmin = session.user.roles?.some(role => 
    role.roleName === ROLES.ADMIN.roleName
  )

  try {
    const deletedProduct = await db.product.delete({
      where: { 
        id,
        // Ensure vendors can only delete their own products
        ...(isAdmin ? {} : { vendorId: session.user.id }) 
      }
    })

    revalidatePath("/dashboard/products")
    return deletedProduct
  } catch (error) {
    console.error(error)
    throw new Error("Failed to delete product")
  }
}

export async function getProducts() {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error("Unauthorized")
  }

  // Determine if the user is a vendor
  const isVendor = session.user.roles?.some(role => 
    role.roleName === ROLES.VENDOR.roleName
  )

  try {
    const products = await db.product.findMany({
      where: {
        // If vendor, only show their products
        ...(isVendor ? { vendorId: session.user.id } : {})
      },
      include: {
        department: true,
        category: true,
        subCategory: true,
        brand: true,
        vendor: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return products
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch products")
  }
}

export async function getProductById(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error("Unauthorized")
  }

  const isVendor = session.user.roles?.some(role => 
    role.roleName === ROLES.VENDOR.roleName
  )

  try {
    const product = await db.product.findUnique({
      where: { 
        id,
        ...(isVendor ? { vendorId: session.user.id } : {})
      },
      include: {
        department: true,
        category: true,
        subCategory: true,
        brand: true,
        vendor: true
      }
    })

    return product
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch product")
  }
}

export async function getActiveProducts() {
  try {
    const products = await db.product.findMany({
      where: { 
        isActive: true,
        status: 'ACTIVE'
      },
      include: {
        department: true,
        category: true,
        subCategory: true,
        brand: true,
        vendor: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return products
  } catch (error) {
    console.error(error)
    throw new Error("Failed to fetch active products")
  }
}


export async function getVendorProducts(status: string) {
  try {
  
    const products = await db.product.findMany({
      where: {
        status: status as ProductStatus,
      },
      include: {
        department: true,
        category: true,
        subCategory: true,
        brand: true,
        store: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return products
  } catch (error) {
    console.error("Error fetching vendor products:", error)
    throw new Error("Failed to fetch vendor products")
  }
}

export async function getAllProductById(id: string) {
  try {
  
    const product = await db.product.findUnique({
      where: {
        id,
      },
      include: {
        department: true,
        category: true,
        subCategory: true,
        brand: true,
        store: true,
      },
    })

    if (!product) {
      throw new Error("Product not found")
    }

    return product
  } catch (error) {
    console.error("Error fetching product:", error)
    throw new Error("Failed to fetch product details")
  }
}

export async function updateProductStatus(productId: string, status: string) {
  try {
    // Validate the input status matches one of the enum values
    const validStatuses = ["DRAFT", "PENDING", "ACTIVE", "INACTIVE"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    
    // Create update data based on the status
    let updateData: any = {
      status: status as ProductStatus,
    };
    
    // Additional status-specific updates
    if (status === "ACTIVE") {
      updateData.isActive = true;
    } else if (status === "INACTIVE") {
      updateData.isActive = false;
    } else if (status === "DRAFT") {
      
    } else if (status === "PENDING") {
    }
        
    // Update the product
    const product = await db.product.update({
      where: {
        id: productId,
      },
      data: updateData,
    });

    revalidatePath(`/dashboard/product-approvals/${productId}`);
    revalidatePath(`/dashboard/product-approvals`);
    revalidatePath(`/dashboard/products`);
    return product;
  } catch (error) {
    console.error("Error updating product status:", error);
    throw new Error(`Failed to update product status: ${error}`);
  }
}
export async function getNewArrivalProducts() {
  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
        isNewArrival: true,
        status:"ACTIVE",
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        productPrice: true,
        slug:true,
        salePrice: true,
        discount: true,
        rating: true,
        reviews: {
          select: {
            id: true
          }
        },
        category: {
          select: {
            title: true
          }
        },
        isDiscount: true,
        isFeatured: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    return products.map(product => ({
      id: product.id,
      title: product.title,
      price: product.salePrice || product.productPrice,
      oldPrice: product.isDiscount ? product.productPrice : null,
      discount: product.discount || 0,
      rating: product.rating || 0,
      slug:product.slug,
      reviews: product.reviews.length,
      image: product.imageUrl || "",
      isBestSeller: false,
      category: product.category?.title || "",
      categoryRank: 0,
      deliveryOptions: ["Free Delivery", "Express Delivery Available", "Same Day Delivery"],
      promotionType: product.isFeatured ? "express" : "super-mart"
    }))
  } catch (error) {
    console.error("Error fetching new arrival products:", error)
    throw new Error("Failed to fetch new arrival products")
  }
}

export async function getFeaturedProducts() {
  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
        status:"ACTIVE",
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        productPrice: true,
        salePrice: true,
        slug:true,
        discount: true,
        rating: true,
        reviews: {
          select: {
            id: true
          }
        },
        category: {
          select: {
            title: true
          }
        },
        isDiscount: true,
        isFeatured: true
      },
      orderBy: {
        rating: 'desc'
      },
      take: 10
    })

    return products.map(product => ({
      id: product.id,
      title: product.title,
      price: product.salePrice || product.productPrice,
      oldPrice: product.isDiscount ? product.productPrice : null,
      discount: product.discount || 0,
      slug:product.slug,
      rating: product.rating || 0,
      reviews: product.reviews.length,
      image: product.imageUrl || "",
      isBestSeller: true,
      category: product.category?.title || "",
      categoryRank: 0,
      deliveryOptions: ["Free Delivery", "Express Delivery Available", "Same Day Delivery"],
      promotionType: product.isFeatured ? "express" : "super-mart"
    }))
  } catch (error) {
    console.error("Error fetching featured products:", error)
    throw new Error("Failed to fetch featured products")
  }
}


export async function getDepartmentCategoryProducts(
  departmentSlug: string,
  categoryId?: string,
  cursor?: string | null, 
  limit: number = 15
): Promise<CategoryProductsResponse> {
  try {
    let targetCategoryId = categoryId
    let categoryTitle = ""
    
    if (!targetCategoryId) {
      const department = await db.department.findUnique({
        where: { slug: departmentSlug },
        select: {
          categories: {
            take: 1,
            where: { isActive: true },
            select: { id: true, title: true }
          }
        }
      })
      
      if (!department?.categories[0]) {
        throw new Error("Department or category not found")
      }
      
      targetCategoryId = department.categories[0].id
      categoryTitle = department.categories[0].title
    } else {
      // Get category title
      const category = await db.category.findUnique({
        where: { id: targetCategoryId },
        select: { title: true }
      })
      categoryTitle = category?.title || "Products"
    }
    
    // Then find products with cursor-based pagination, featured first
    const products = await db.product.findMany({
      where: {
        isActive: true,
        status:"ACTIVE",
        categoryId: targetCategoryId,
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        productPrice: true,
        salePrice: true,
        discount: true,
        slug:true,
        rating: true,
        isFeatured: true,
        isDiscount: true,
        reviews: {
          select: {
            id: true
          }
        },
        category: {
          select: {
            title: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit + 1, // Get one extra to check if there are more
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {})
    })
    
    // Check if we have more products
    const hasMore = products.length > limit
    const nextCursor = hasMore ? products[limit - 1].id : null
    
    // Return only requested amount
    const finalProducts = products.slice(0, limit).map(product => ({
      id: product.id,
      title: product.title,
      price: product.salePrice || product.productPrice,
      oldPrice: product.isDiscount ? product.productPrice : null,
      discount: product.discount || 0,
      rating: product.rating || 0,
      reviews: product.reviews.length,
      slug:product.slug,
      image: product.imageUrl || "",
      isBestSeller: false,
      category: product.category?.title || categoryTitle,
      categoryRank: 0,
      deliveryOptions: ["Free Delivery", "Express Delivery Available", "Same Day Delivery"],
      promotionType: product.isFeatured ? "express" : "super-mart"
    }))
    
    return {
      categoryTitle,
      products: finalProducts,
      nextCursor: hasMore ? nextCursor : null,
      hasMore
    }
  } catch (error) {
    console.error("Error fetching department category products:", error)
    throw new Error("Failed to fetch department products")
  }
}


// Get product by slug with all relations
export async function getProductBySlug(slug: string): Promise<ProductWithRelations3 | null> {
  try {
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        department: true,
        category: true,
        subCategory: true,
        brand: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        store: true,
        vendor: {
          select: {
            id: true,
            name: true,
            image: true,
            store: true,
          },
        },
      },
    })

    return product as ProductWithRelations3 | null;

  } catch (error) {
    console.error("Error fetching product:", error)
    throw new Error("Failed to fetch product")
  }
}

// Get similar products
export async function getSimilarProducts(
  productId: string,
  categoryId?: string,
  subCategoryId?: string,
): Promise<SimilarProductType[]> {
  try {
    const whereClause: any = {
      id: { not: productId },
      isActive: true,
      status:"ACTIVE",
    }

    if (subCategoryId) {
      whereClause.subCategoryId = subCategoryId
    } else if (categoryId) {
      whereClause.categoryId = categoryId
    }

    const products = await db.product.findMany({
      where: whereClause,
      take: 8,
      include: {
        reviews: true,
        subCategory: {
          select: {
            title: true,
          },
        },
      },
    })

    return products.map((product) => ({
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
    }))
  } catch (error) {
    console.error("Error fetching similar products:", error)
    throw new Error("Failed to fetch similar products")
  }
}

// Add a review
export async function addProductReview(data: ReviewFormData): Promise<Review> {
  try {
    const review = await db.review.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        productId: data.productId,
        userId: data.userId,
        isApproved: true, 
      },
    })

    // Update product rating
    const productReviews = await db.review.findMany({
      where: {
        productId: data.productId,
        isApproved: true,
      },
    })

    if (productReviews.length > 0) {
      const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / productReviews.length

      await db.product.update({
        where: { id: data.productId },
        data: { rating: averageRating },
      })
    }

    revalidatePath(`/p/${data.productSlug}`)
    return review
  } catch (error) {
    console.error("Error adding review:", error)
    throw new Error("Failed to add review")
  }
}