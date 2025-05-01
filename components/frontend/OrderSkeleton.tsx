"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OrderSkeleton() {
  return (
    <Card className="overflow-hidden border-l-4 border-l-yellow-300">
      <CardContent className="p-0">
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Order Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* User/Customer Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Payment Info */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-28" />
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Preview of order items */}
        <div className="bg-gray-50 p-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-12 w-12 rounded-md flex-shrink-0" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}