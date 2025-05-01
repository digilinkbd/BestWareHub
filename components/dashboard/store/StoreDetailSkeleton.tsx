"use client"

import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const StoreDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Card>
        <CardHeader className="pb-0">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="h-40 relative w-full mt-4">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
          
          <div className="flex flex-wrap justify-between mt-6">
            <div className="flex items-center space-x-4 mb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Skeleton */}
      <Card>
        <CardHeader className="pb-0">
          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">
                <Skeleton className="h-4 w-24" />
              </TabsTrigger>
              <TabsTrigger value="documents">
                <Skeleton className="h-4 w-24" />
              </TabsTrigger>
              <TabsTrigger value="owner">
                <Skeleton className="h-4 w-24" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}