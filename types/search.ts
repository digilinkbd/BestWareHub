// Type for search suggestions (lightweight)
export interface ProductSuggestion {
    id: string
    title: string
    slug: string
    image: string
    category?: string
  }
  
  // Type for search filters
  export interface SearchFilter {
    id: string
    title: string
    slug: string
    count: number
  }
  
  // Type for search results
  export interface ProductSearchResult {
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
  
  // Type for search params
  export interface SearchParams {
    query?: string
    category?: string
    brand?: string
    sort?: string
    page?: number
    limit?: number
  }
  
  