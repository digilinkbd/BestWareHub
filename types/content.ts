// Common types
export type BaseContent = {
    id: string
    title: string
    slug: string
    description?: string | null
    isActive: boolean
  }
  
  // Promotion specific type
  export type Promotion = BaseContent & {
    imageUrl?: string | null
    discount: number
    startDate: Date
    endDate: Date
  }
  
  // Campaign specific type
  export type Campaign = BaseContent & {
    imageUrl?: string | null
    startDate: Date
    endDate: Date
  }
  
  // SubCategory type
  export type SubCategory = BaseContent & {
    image?: string | null
  }
  
  // Category type
  export type Category = BaseContent & {
    image: string
    images: string[]
    subCategories?: SubCategory[]
  }
  
  // Department type
  export type Department = BaseContent & {
    image: string
    images: string[]
    categories?: Category[]
  }
  
  // Product type
  export type Product = {
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
    promotionType: string
  }
  
  // Response types
  export type ProductsResponse = {
    subCategoryTitle: string
    products: Product[]
    nextCursor: string | null
    hasMore: boolean
  }
  
  export type NavigationItem = {
    title: string
    slug?: string
    icon?: string
    isActive?: boolean
  }
  
  