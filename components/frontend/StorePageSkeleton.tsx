import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

export function StorePageSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Store header skeleton */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto py-6 px-4">
          {/* Store name and logo skeleton */}
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          
          {/* Store description skeleton */}
          <div className="mt-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          
          {/* Banner skeleton */}
          <div className="mt-6">
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* Store benefits skeleton */}
      <div className="bg-yellow-50 border-b border-yellow-100">
        <div className="container mx-auto py-4 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products section skeleton */}
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-20" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <Skeleton className="h-48 w-full" />
              <div className="p-3">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}