"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

type SubCategoryType = {
  id: string
  title: string
  slug: string
  image: string | null
  icon: string | null
  category: {
    id: string
    title: string
    slug: string
  }| null 
}

type SubcategoriesListProps = {
  subcategories: SubCategoryType[]
  isLoading: boolean
  error: Error | null
}

export function SubcategorySkeletonLoader() {
  return (
    <div className="pt-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="flex space-x-4 overflow-hidden">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <Skeleton className="w-[180px] h-[180px] rounded-2xl" />
            <Skeleton className="w-[140px] h-6 mt-2" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SubcategoriesList({ subcategories, isLoading, error }: SubcategoriesListProps) {
  if (error) {
    return <div className="text-red-500 p-4">Failed to load subcategories</div>
  }

  if (isLoading) {
    return <SubcategorySkeletonLoader />
  }

  if (!subcategories || subcategories.length === 0) {
    return null
  }

  const groupedByCategory = subcategories.reduce((acc, subcategory) => {
    if (!subcategory.category) {
      return acc 
    }
  
    const categoryId = subcategory.category.id
    if (!acc[categoryId]) {
      acc[categoryId] = {
        categoryTitle: subcategory.category.title,
        categorySlug: subcategory.category.slug,
        subcategories: []
      }
    }
    acc[categoryId].subcategories.push(subcategory)
    return acc
  }, {} as Record<string, { categoryTitle: string, categorySlug: string, subcategories: SubCategoryType[] }>)
  

  return (
    <div className="space-y-8 py-6">
      {Object.entries(groupedByCategory).map(([categoryId, { categoryTitle, categorySlug, subcategories }]) => (
        <div key={categoryId} className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="md:text-xl text-base font-semibold text-gray-800">{categoryTitle}</h2>
            <Link href={`/c/${categorySlug}`}>
              <button className="uppercase text-xs font-semibold px-4 py-2 border border-black rounded">
                View All
              </button>
            </Link>
          </div>

          <ScrollArea className="w-full">
            <div className="flex space-x-4 pb-4">
              {subcategories.map((subcategory) => (
                <div key={subcategory.id} className="flex flex-col items-center">
                  <Link
                    href={`/c/${categorySlug}/${subcategory.slug}`}
                    className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl"
                  >
                    <div
                      className="w-[180px] h-[180px] rounded-2xl overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: "#f0f9ff" }}
                    >
                      <Image
                        src={subcategory.image || "/placeholder.svg"}
                        alt={subcategory.title}
                        width={140}
                        height={140}
                        className="object-contain max-h-[140px] max-w-[140px]"
                      />
                    </div>
                  </Link>
                  <div className="text-start mt-2 w-[180px]">
                    <p className="text-gray-700 font-semibold text-base">{subcategory.title}</p>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ))}
    </div>
  )
}