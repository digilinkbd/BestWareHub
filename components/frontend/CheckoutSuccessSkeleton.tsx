import React from 'react'
import { Skeleton } from '../ui/skeleton'

export default function CheckoutSuccessSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="mb-8 flex justify-center">
        <Skeleton className="h-24 w-24 rounded-full" />
      </div>
      
      <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
      <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
      
      <div className="bg-muted/30 p-6 rounded-lg mb-8">
        <Skeleton className="h-6 w-1/2 mx-auto mb-2" />
        <Skeleton className="h-4 w-3/4 mx-auto" />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Skeleton className="h-12 w-40 rounded-md" />
        <Skeleton className="h-12 w-40 rounded-md" />
      </div>
    </div>
  )
}
