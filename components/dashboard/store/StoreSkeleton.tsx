"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StoreSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 flex gap-4">
        <Skeleton className="h-16 w-16 rounded-md flex-shrink-0" />
        <div className="space-y-3 flex-1">
          <div className="flex justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    </Card>
  )
}

