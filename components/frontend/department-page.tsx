"use client"
import React, { useMemo } from 'react'
import DetailedDepHero, { DepartmentSkeletonLoader } from '@/components/frontend/detailed-dep-hero'
import Products from '@/components/frontend/products'
import { useDepartmentData } from '@/hooks/useDepartment'
import HomeCategories from './home-categories'
import { useQueries } from '@tanstack/react-query'
import { ProductsGridSkeleton } from './ProductSkeleton'
import { getDepartmentCategoryProducts } from '@/actions/products'
import { useSubcategoriesByDepartment } from '@/hooks/useSubCategory'
import SubcategoriesList from '@/components/frontend/secondary-categories'

// Define types
type CategoryProductsResponse = {
  categoryTitle: string;
  products: ProductType[];
  nextCursor: string | null;
  hasMore: boolean;
}

type ProductType = {
  id: string;
  title: string;
  price: number;
  oldPrice: number | null;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  isBestSeller: boolean;
  category: string;
  categoryRank: number;
  deliveryOptions: string[];
  promotionType: string;
}

type CategoryType = {
  id: string;
  title: string;
  slug: string;
  image: string;
  // Add other properties as needed
}

type DepartmentType = {
  id: string;
  title: string;
  slug: string;
  image: string;
  categories: CategoryType[];
  // Add other properties as needed
}

export type SlugTypes = {
  slug: string;
}

export default function DepartmentPage({ slug }: SlugTypes) {
  const { data, isLoading: isDepartmentLoading, error } = useDepartmentData(slug)
  const { 
    data: subcategories, 
    isLoading: isSubcategoriesLoading, 
    error: subcategoriesError 
  } = useSubcategoriesByDepartment(slug)

  const topCategories = useMemo(() => 
    data?.categories?.slice(0, 7) || [], 
    [data?.categories]
  )

  const categoryQueries = useQueries({
    queries: topCategories.map(category => ({
      queryKey: ["departmentProducts", slug, category.id, 15],
      queryFn: async () => {
        return await getDepartmentCategoryProducts(slug, category.id, null, 15)
      },
      staleTime: 1000 * 60 * 5, 
      enabled: !!slug && !!category.id
    })),
    combine: (results) => {
      return {
        data: results.map(result => result.data),
        isPending: results.some(result => result.isPending),
        isError: results.some(result => result.isError),
        isSuccess: results.every(result => result.isSuccess)
      }
    }
  })

  
 
  return (
    <div className='min-h-screen bg-[#ffffff]'>
      {data ? (
        <DetailedDepHero data={data} isLoading={isDepartmentLoading} error={error} />
      ) : (
        <DepartmentSkeletonLoader />
      )}

      <HomeCategories 
        departments={data?.categories ?? []} 
        isLoading={isDepartmentLoading}
        error={error}
        linkPrefix="/c/"
      />
      
  {categoryQueries.data.map((categoryData, index) => {
  if (!categoryData || !categoryData.products || categoryData.products.length === 0) return null;
  const category = topCategories[index];
  
  return (
    <div key={`category-${category?.id || index}`}>
      <Products
        title={categoryData.categoryTitle || category?.title || `Category ${index + 1}`}
        products={categoryData.products || []}
      />
      
      {categoryQueries.isPending && (
        <div className="p-4">
          <ProductsGridSkeleton count={5} />
        </div>
      )}
    </div>
  );
})}
      
      <div className='md:px-4 px-2'>
      <SubcategoriesList 
        subcategories={subcategories || []} 
        isLoading={isSubcategoriesLoading}
        error={subcategoriesError}
      />
      </div>
    </div>
  )
}