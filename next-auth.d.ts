import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { VendorStatus } from "@prisma/client";

// Role type definition
interface Role {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  displayName: string;
  roleName: string;
  permissions: string[];
}

// Store type definition
interface Store {
  id: string;
  storeName: string;
  slug: string;
  userId: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  isActive: boolean;
  licenseUrl: string;
  idProofUrl: string;
  logo: string | null;
  bannerUrl: string | null;
  storeEmail: string | null;
  storePhone: string | null;
  storeAddress: string | null;
  storeCity: string | null;
  storeState: string | null;
  storeCountry: string | null;
  storeZip: string | null;
  storeWebsite: string | null;
  hasGst: boolean;
  socialLinks: any | null;
  featuredProducts: string[];
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles?: Role[];
      permissions?: string[];
      store?: Store | null;
      vendorStatus?: VendorStatus | null;
      storeId?: string | null;
    } & DefaultSession["user"];
  }
  
  interface User {
    id: string;
    roles?: Role[];
    permissions?: string[];
    store?: Store | null;
    vendorStatus?: VendorStatus | null;
    storeId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles?: Role[];
    permissions?: string[];
    store?: Store | null;
    vendorStatus?: VendorStatus | null;
    storeId?: string | null;
    storeName?: string | null;
  }
}