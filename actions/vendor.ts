"use server"

import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"
import type { User, Store, VendorStatus } from "@prisma/client"

export type VendorWithStore = {
    id: string
    name: string
    email: string
    status: boolean
    isVerified: boolean
    vendorStatus: VendorStatus | null
    createdAt: Date
    productCount: number  
    store: {
      id: string
      storeName: string
      slug: string
      logo: string | null
      isVerified: boolean
      isActive: boolean
    } | null
  }

  export type fullVendorWithStore = {
    id: string;
    name: string;
    email: string;
    status: boolean;
    isVerified: boolean;
    vendorStatus: VendorStatus | null;
    createdAt: Date;
    store: {
      id: string;
      storeName: string;
      slug: string;
      logo: string | null;
      bannerUrl: string | null;
      description: string | null;
      isVerified: boolean;
      isActive: boolean;
      storeEmail: string | null;
      storePhone: string | null;
      storeAddress: string | null;
      storeCity: string | null;
      storeState: string | null;
      storeCountry: string | null;
      storeZip: string | null;
      storeWebsite: string | null;
      socialLinks: any | null;
    } | null;
    _count: {
      products: number;
    };
  };
  
export type VendorProduct = {
    id: string;
    title: string;
    slug: string;
    imageUrl: string | null;
    productImages: string[];
    description: string | null;
    shortDesc: string | null;
    productPrice: number;
    salePrice: number | null;
    isDiscount: boolean;
    discount: number | null;
    rating: number | null;
    isNewArrival: boolean;
    isFeatured: boolean;
    category: {
      title: string;
    } | null;
    department: {
      title: string;
    };
    createdAt: Date;
  };
  export async function getAllVendors(): Promise<VendorWithStore[]> {
    try {
      const vendors = await db.user.findMany({
        where: {
          role: "VENDOR"
        },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          isVerified: true,
          vendorStatus: true,
          createdAt: true,
          store: {
            select: {
              id: true,
              storeName: true,
              slug: true,
              logo: true,
              isVerified: true,
              isActive: true
            }
          },
          _count: {
            select: {
              products: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      })
      
      return vendors.map(vendor => ({
        ...vendor,
        productCount: vendor._count.products
      }))
    } catch (error) {
      console.error(error)
      throw new Error("Failed to fetch vendors")
    }
  }

export async function getVendorBySlug(slug: string): Promise<fullVendorWithStore | null> {
  try {
    const vendor = await db.user.findFirst({
      where: {
        store: {
          slug: slug,
        },
        role: "VENDOR",
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        isVerified: true,
        vendorStatus: true,
        createdAt: true,
        store: {
          select: {
            id: true,
            storeName: true,
            slug: true,
            logo: true,
            bannerUrl: true,
            description: true,
            isVerified: true,
            isActive: true,
            storeEmail: true,
            storePhone: true,
            storeAddress: true,
            storeCity: true,
            storeState: true,
            storeCountry: true,
            storeZip: true,
            storeWebsite: true,
            socialLinks: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return vendor;
  } catch (error) {
    console.error("Failed to fetch vendor:", error);
    throw new Error("Failed to fetch vendor");
  }
}

export async function getVendorProducts(vendorId: string, limit: number = 12, page: number = 1): Promise<{
  products: VendorProduct[];
  totalProducts: number;
  totalPages: number;
}> {
  try {
    const skip = (page - 1) * limit;

    const [products, totalProducts] = await Promise.all([
      db.product.findMany({
        where: {
          vendorId: vendorId,
          isActive: true,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          imageUrl: true,
          productImages: true,
          description: true,
          shortDesc: true,
          productPrice: true,
          salePrice: true,
          isDiscount: true,
          discount: true,
          rating: true,
          isNewArrival: true,
          isFeatured: true,
          category: {
            select: {
              title: true,
            },
          },
          department: {
            select: {
              title: true,
            },
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.product.count({
        where: {
          vendorId: vendorId,
          isActive: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    return {
      products,
      totalProducts,
      totalPages,
    };
  } catch (error) {
    console.error("Failed to fetch vendor products:", error);
    throw new Error("Failed to fetch vendor products");
  }
}