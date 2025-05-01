"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function SalesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>

      {/* Filters skeleton */}
      <Skeleton className="h-16 w-full" />

      {/* Overview cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-white border-yellow-200 shadow-md">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px] mb-2" />
              <Skeleton className="h-3 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-lg border border-yellow-200 overflow-hidden">
        <div className="p-4 bg-yellow-50">
          <Skeleton className="h-6 w-full" />
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-6 w-[80px] ml-auto" />
              <Skeleton className="h-6 w-[100px]" />
              <Skeleton className="h-6 w-[80px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

