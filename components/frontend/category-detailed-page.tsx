"use client"
import React, { useMemo, useRef, useCallback } from 'react'
import DetailedCatHero from '@/components/frontend/detailed-cat-hero'
import Products from '@/components/frontend/products'
import SubCategoryCards from '@/components/frontend/sub-category-cards'
import { useFetchCategoryBySlugAndSubCategories } from '@/hooks/useCategory'
import { useQueries } from '@tanstack/react-query'
import { ProductsGridSkeleton } from '@/components/frontend/ProductSkeleton'
import HomeCategories from './home-categories'
import { getCategorySubcategoryProducts } from '@/actions/categories'

type SlugTypes = {
    slug: string;
  }
export default function CategoryDetailedPage({ slug }: SlugTypes) {
  const { category, isLoading, error } = useFetchCategoryBySlugAndSubCategories(slug)
  const images = category?.images || []
  
  const topSubCategories = useMemo(() => 
    category?.subCategories?.slice(0, 7) || [], 
    [category?.subCategories]
  )

  const subCategoryQueries = useQueries({
    queries: topSubCategories.map(subCategory => ({
      queryKey: ["categoryProducts", slug, subCategory.id, 12],
      queryFn: async () => {
        return await getCategorySubcategoryProducts(slug, subCategory.id, null, 12)
      },
      staleTime: 1000 * 60 * 5, 
      enabled: !!slug && !!subCategory.id
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

  const loadMoreRef = useRef<HTMLDivElement>(null)
  
  
  return (
    <div className='min-h-screen bg-[#ffffff]'>
      <DetailedCatHero images={images} isLoading={isLoading} />
      
      <HomeCategories 
        departments={category?.subCategories ?? []} 
        isLoading={isLoading}
        error={error}
        linkPrefix="/s-c/"
      />
      
      <div className="container mx-auto md:px-4 md:py-6 py-4 px-1">
        <SubCategoryCards 
          categories={[
            { 
              title: category?.title || "a moment...", 
              isActive: true,
              slug: category?.slug
            },
            ...(category?.subCategories?.map(subCat => ({
              title: subCat.title,
              icon: subCat.image,
              slug: subCat.slug
            })) || [])
          ]} 
          linkPrefix="/s-c/"
        />
      </div>
      
      {/* Map through subcategory products */}
      {subCategoryQueries.data.map((subCategoryData, index) => {
        if (!subCategoryData || !subCategoryData.products || subCategoryData.products.length === 0) return null;
        const subCategory = topSubCategories[index];
        
        return (
          <div key={`subcategory-${subCategory?.id || index}`}>
            <Products
              title={subCategoryData.subCategoryTitle || subCategory?.title || `Subcategory ${index + 1}`}
              products={subCategoryData.products || []}
            />
            
            {subCategoryQueries.isPending && (
              <div className="p-4">
                <ProductsGridSkeleton count={5} />
              </div>
            )}
          </div>
        );
      })}
       
      <div ref={loadMoreRef} className="h-4" />
    </div>
  )
}