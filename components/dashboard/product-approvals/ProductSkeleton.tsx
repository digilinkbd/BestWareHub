"use client"

import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductSkeleton() {
  return (
    <Card className="overflow-hidden border border-gray-200">
      <Skeleton className="h-48 w-full rounded-none" />
      
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-10" />
      </CardFooter>
    </Card>
  )
}