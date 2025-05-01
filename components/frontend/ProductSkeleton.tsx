// components/ui/product-skeleton.tsx
import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-lg shadow-md bg-white">
      <Skeleton className="w-full h-40" />
      <div className="p-3">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-6 w-1/3 mb-1" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export function ProductsGridSkeleton({ count = 5 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array(count).fill(0).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}