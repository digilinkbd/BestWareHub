import { ProductCardData } from "@/actions/products";
import { StoreProduct } from "@/actions/store";
import { Category, Department, Notification, Prisma, Product, ProductStatus, Review, Role, Store, User, VendorStatus } from "@prisma/client";
export type DateRangeFilter = "today" | "week" | "month" | "year"

// export type CategoryProps = {
//   title: string;
//   slug: string;
//   imageUrl: string;
//   description: string;
// };
export type SavingProps = {
  amount: number;
  month: string;
  name: string;
  userId: string;
  paymentDate: any;
};
export type UserProps = {
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  image: string;
  email: string;
  password: string;
};
export type LoginProps = {
  email: string;
  password: string;
};
export type ForgotPasswordProps = {
  email: string;
};

// types/types.ts

export interface RoleFormData {
  displayName: string;
  description?: string;
  permissions: string[];
}

export interface UserWithRoles extends User {
  roles: Role[];
}

export interface RoleOption {
  label: string;
  value: string;
}

export interface UpdateUserRoleResponse {
  error: string | null;
  status: number;
  data: UserWithRoles | null;
}

export interface RoleResponse {
  id: string;
  displayName: string;
  description?: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Brand {
  title: string
  logo: string
  slug:String
}

export type DepartmentFormProps = {
  editingId?: string;
  initialData?: Department | null;
};

export type DepartmentProps = {
  title: string;
  slug: string;
  description?: string;
  images?: string[];
  isActive?: boolean;
  image:string
};

export interface CategoryProps {
  title: string
  slug: string
  image: string
  images: string[]
  description?: string
  isActive: boolean
  icon?: string
  position?: number
  featured: boolean
  departmentId: string
}
export interface SubCategoryFormProps {
  title: string
  slug: string
  image: string
  images: string[]
  description?: string
  isActive: boolean
  icon?: string
  position?: number
  categoryId: string
}
export interface DepartmentOption {
  value: string
  label: string
}
export interface CategoryByDepartmentType {
  id: string
  title: string
  image: string
  slug: string
  departmentId:string

}

export interface CategoryWithDepartment extends Category {
  id: string
  title: string
  image: string
  slug: string
  departmentId:string
  images:string[]
  description :string | null,
  isActive: boolean,
  featured: boolean,
  department: {
    id: string
    title: string
  }| null;
}





// Props for creating/updating SubCategory
export type SubCategoryProps = Prisma.SubCategoryCreateInput & {
  categoryId: string
  images?: string[]
}

// Options type for select inputs
export type SubCategoryOption = {
  value: string
  label: string
}

// Base SubCategory type from Prisma schema
export type SubCategory = {
  id: string
  title: string
  slug: string
  image?: string | null  // Allow null values here
  images: string[]
  description?: string | null
  isActive: boolean
  icon?: string | null
  position?: number | null
  categoryId?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

// Input type for creating a SubCategory
export type SubCategoryCreateInput = Omit<SubCategory, 'id' | 'createdAt' | 'updatedAt'> & {
  category?: { connect: { id: string } }
}

// Input type for updating a SubCategory
export type SubCategoryUpdateInput = Partial<SubCategoryCreateInput>

// Type for SubCategory with populated category
export type SubCategoryWithCategory = SubCategory & {
  category?: {
    id: string
    title: string
  } | null
}

// Validation type for creating/updating SubCategory
export type SubCategoryValidationSchema = {
  title: string
  slug: string
  image: string
  images?: string[]
  description?: string
  isActive?: boolean
  icon?: string
  position?: number
  categoryId?: string
}
export type BrandFormProps = {
  title: string
  slug: string
  imageUrl?: string | null
  logo?: string | null
  description?: string | null
  featured?: boolean
  isActive?: boolean
  subCategoryId?: string | null
}

export type BrandWithRelations = BrandFormProps & {
  id: string
  createdAt: Date
  updatedAt: Date
  subCategory?: SubCategory | null
}

// Types derived from Prisma Product model and its relations
export type ProductWithRelations = {
  id: string
  title: string
  slug: string
  imageUrl?: string | null
  productImages: string[]
  description?: string | null
  shortDesc?: string | null
  isActive: boolean
  isWholesale: boolean | undefined
  isFeatured: boolean
  isNewArrival: boolean
  sku?: string | null
  barcode?: string | null
  productCode?: string | null
  isApproved?: boolean; // ✅ Add this property
  isDraft?: boolean; // ✅ Add this property
  unit?: string | null
  productPrice: number
  salePrice?: number | null
  wholesalePrice?: number | null
  wholesaleQty?: number | null
  productStock?: number | null
  lowStockAlert?: number | null
  qty?: number | null
  isDiscount: boolean
  discount?: number | null
  tax?: number | null
  tags: string[]
  attributes?:any
  metaTitle?: string | null
  metaDescription?: string | null
  metaKeywords: string[]
  rating?: number | null
  type?: string | null
  status?: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'INACTIVE'

  // Relation Types
  categoryId?: string | null
  category?: {
    id: string
    title: string
    slug: string
  } | null

  subCategoryId?: string | null
  subCategory?: {
    id: string
    title: string
    slug: string
  } | null

  departmentId: string
  department: {
    id: string
    title: string
    slug: string
  }

  brandId?: string | null
  brand?: {
    id: string
    title: string
    slug: string
  } | null

  vendorId?: string | null
  vendor?: {
    id: string
    name: string
    email: string
  } | null

  // Audit Fields
  createdAt: Date
  updatedAt?: Date | null
}

// Type for Product Creation/Update Input
export type ProductInput = Omit<ProductWithRelations, 
  'id' | 'createdAt' | 'updatedAt' | 
  'category' | 'subCategory' | 'department' | 
  'brand' | 'vendor'> & {
  departmentId: string
  categoryId?: string | null
  subCategoryId?: string | null
  brandId?: string | null
  vendorId?: string | null
  status?: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'INACTIVE'
  tags?: string[]
  attributes?: Record<string, any> | null
  isWholesale?: boolean; // ✅ Make it optional if necessary

}

// Utility type for form handling
export type ProductFormData = Partial<ProductInput> & {
  imageUrl?: string
  productImages?: string[]
}


export interface StoreWithUser extends Store {
  user: Pick<User, "id" | "name" | "email" | "vendorStatus">;
}

export interface FetchStoresParams {
  page?: number;
  limit?: number;
  status?: VendorStatus;
  search?: string;
}

export interface StoreStats {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
}


export interface StoreQueryItem {
  id: string;
  storeName: string;
  slug: string;
  logo: string | null;
  description: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    vendorStatus: VendorStatus | null;
  };
}

export interface StoreQueryResult {
  stores: StoreQueryItem[];
  total: number;
}
export interface VendorProduct {
  id: string
  title: string
  slug: string
  imageUrl?: string | null
  productImages: string[]
  description?: string | null
  shortDesc?: string | null
  isActive: boolean
  sku?: string | null
  productPrice: number
  salePrice?: number | null
  productStock?: number | null
  isDiscount: boolean
  discount?: number | null
  status: ProductStatus
  department?: Department | null
  departmentId: string
  category?: Category | null
  categoryId?: string | null
  subCategory?: SubCategory | null
  subCategoryId?: string | null
  brand?: Brand | null
  brandId?: string | null
  store?: Store | null
  storeId?: string | null
  createdAt: Date
  updatedAt?: Date | null
  rating?: number | null
  isApproved?: boolean
  isDraft?: boolean
}

// First, let's define a proper Promotion interface
export interface PromotionTypes {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  discountPercentage?: number; 
  startDate: string | Date;
  endDate: string | Date;
  isActive: boolean;
  products: Product[];
}

export interface NotificationWithMetadata extends Notification {
  category?: string;
}

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
}

export interface NotificationsCountResponse {
  total: number;
  unread: number;
}


export interface CampaignProps {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarouselSlide {
  slug: string;
  imageUrl: string;
  title: string;
}

export interface ApiInstance {
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  selectedScrollSnap: () => number;
  on: (event: string, callback: () => void) => void;
  off: (event: string) => void;
}

export interface CategoryWithDetails {
  id: string;
  title: string;
  slug: string;
  image: string;
  fromPrice?: string | null;
  discount?: string | null;
  currency?: string;
}

export interface DepartmentWithCategories {
  id: string;
  title: string;
  slug: string;
  categories: CategoryWithDetails[];
}
export type CategoryType = {
  id: string;
  title: string;
  slug: string;
  image: string;
  departmentId: string;
}
export interface DepartmentsPaginatedResponse {
  departments: DepartmentWithCategories[];
  nextCursor: string | null;
  hasMore: boolean;
}

export type DepartmentWithCategoriesType = Department & {
  categories: CategoryType[];
}

export type DepartmentSliderType = {
  image: string;
}

export type DepartmentMenuType = {
  name: string;
  discount: string;
  price?: string;
  link: string;
}

export type DepartmentPageDataType = {
  id: string
  title: string
  slug: string
  images: string[]
  categories: {
    title: string;
    id: string;
    slug: string;
    
  }[];
}

export type CategoryWithRelations = {
  id: string
  title: string
  images: string[]
  slug:string
  subCategories?: {
    id: string
    title: string
    slug:string,
    image:string
  }[] | null
}

export type SubCategoryProductsResponse = {
  subCategoryTitle: string;
  products: ProductCardData[];
  nextCursor: string | null;
  hasMore: boolean;
}

export type SubCategoryType = {
  id: string;
  title: string;
  slug: string;
  image?: string;
  isActive?: boolean;
}


export type ProductWithRelations2 = Product & {
  category?: Category | null
  subCategory?: SubCategory | null
  department?: Department
  brand?: Brand | null
  reviews: { length: number }
}

export type FilterParams = {
  subCategorySlug?: string
  categorySlug?: string
  departmentSlug?: string
  brandId?: string[]
  minPrice?: number
  maxPrice?: number
  rating?: number
  sort?: string
  limit?: number
  page?: number
  search?: string
  newArrivals?: string
  deals?: string[]
  sellers?: string[]
  deliveryModes?: string[]
}

export type ProductCardProps2 = {
  id: string
  title: string
  price: number
  oldPrice: number | null
  discount: number
  rating: number
  reviews: number
  image: string
  slug:string
  isBestSeller: boolean
  category: string
  categoryRank: number
  deliveryOptions: string[]
  promotionType: string
}

export type BreadcrumbItem = {
  label: string
  href: string
  isCurrentPage?: boolean
}

export type SubCategory2 = {
  id: string
  title: string
  images: string[]
  image: string
  position: number | null
  createdAt: Date
  updatedAt: Date | null
  slug: string
  description: string | null
  isActive: boolean
  categoryId: string | null
  icon: string | null
}

export type ProductWithRelations3 = Product & {
  department: Department
  category?: Category | null
  subCategory?: SubCategory2 | null
  brand?: Brand | null
  reviews: (Review & {
    user: {
      id: string
      name: string
      image: string | null
    }
  })[]
  store?: Store | null
  vendor?: {
    id: string
    name: string
    image: string | null
    store?: Store | null
  } | null
}

// Similar product type for product cards
export type SimilarProductType = {
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
}

// Review form data
export type ReviewFormData = {
  productId: string
  productSlug: string
  userId: string
  rating: number
  comment: string
}
// Brand form props
export type BrandFormProps2 = {
  title: string
  slug: string
  imageUrl?: string
  logo?: string
  description?: string
  featured?: boolean
  isActive?: boolean
  subCategoryId: string
}

// Brand with relations
export type BrandWithRelations2 = Brand & {
  SubCategory?: {
    id: string
    title: string
  } | null
}
export function adaptStoreProductsToCardProps(products: StoreProduct[]): ProductCardProps2[] {
  return products.map((product) => ({
    ...product,
    promotionType: product.promotionType || "standard", 
  }))
}

// Add this to your types.ts or similar file
export type Sale = {
  id: string
  total: number
  commission: number
  productTitle: string
  productImage: string
  productPrice: number
  productQty: number
  isPaid: boolean
  createdAt: string 
  vendorId?: string // Changed from string | null to string | undefined
  order: {
    id: string
    orderNumber: string
    orderStatus: string
    paymentStatus: string
    createdAt: string 
  }
  product?: {
    id: string
    title: string
    imageUrl: string | null
  }
}



export interface ProductAnalyticsFilter {
  dateRange?: DateRangeFilter
  userId?: string
  categoryId?: string
  departmentId?: string
  brandId?: string
  page?: number
  limit?: number
}

export interface ProductAnalyticsData {
  overview: {
    totalProducts: number
    totalSales: number
    totalRevenue: number
    outOfStockCount: number
    productsTrend: number
    salesTrend: number
    revenueTrend: number
  }
  salesTrend: Array<{
    date: string
    revenue: number
    units: number
  }>
  categoryDistribution: Array<{
    name: string
    count: number
  }>
  topSellingProducts: Array<{
    id: string
    title: string
    category: string
    price: number
    unitsSold: number
    revenue: number
  }>
  trendingProducts: Array<{
    id: string
    title: string
    category: string
    price: number
    growth: number
  }>
  lowStockProducts: Array<{
    id: string
    title: string
    category: string
    price: number
    stock: number
  }>
  vendorProducts: Array<{
    id: string
    name: string
    totalProducts: number
    activeProducts: number
    totalSales: number
    revenue: number
  }>
  departmentPerformance: Array<{
    id: string
    name: string
    products: number
    sales: number
  }>
  brandPerformance: Array<{
    id: string
    name: string
    products: number
    revenue: number
  }>
}

export interface ProductAnalyticsFilter {
  dateRange?: DateRangeFilter
  userId?: string
  categoryId?: string
  departmentId?: string
  brandId?: string
  page?: number
  limit?: number
}

export interface ProductAnalyticsData {
  overview: {
    totalProducts: number
    totalSales: number
    totalRevenue: number
    outOfStockCount: number
    productsTrend: number
    salesTrend: number
    revenueTrend: number
  }
  salesTrend: Array<{
    date: string
    revenue: number
    units: number
  }>
  categoryDistribution: Array<{
    name: string
    count: number
  }>
  topSellingProducts: Array<{
    id: string
    title: string
    category: string
    price: number
    unitsSold: number
    revenue: number
  }>
  trendingProducts: Array<{
    id: string
    title: string
    category: string
    price: number
    growth: number
  }>
  lowStockProducts: Array<{
    id: string
    title: string
    category: string
    price: number
    stock: number
  }>
  vendorProducts: Array<{
    id: string
    name: string
    totalProducts: number
    activeProducts: number
    totalSales: number
    revenue: number
  }>
  departmentPerformance: Array<{
    id: string
    name: string
    products: number
    sales: number
  }>
  brandPerformance: Array<{
    id: string
    name: string
    products: number
    revenue: number
  }>
}

