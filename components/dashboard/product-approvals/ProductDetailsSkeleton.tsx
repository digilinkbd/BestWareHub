// components/products/ProductDetailsSkeleton.tsx
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumb skeleton */}
      <div className="flex gap-2 items-center mb-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-24 rounded-md" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image skeleton */}
        <Card className="lg:col-span-1 overflow-hidden">
          <CardContent className="p-0">
            <Skeleton className="aspect-square w-full" />
            <div className="flex overflow-x-auto p-2 gap-2">
              {[1, 2, 3, 4].map((idx) => (
                <Skeleton key={idx} className="w-16 h-16 rounded-md" />
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Details skeleton */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex gap-2 mb-6">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
              
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-px w-full mb-4" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {[1, 2, 3, 4, 5, 6].map((idx) => (
                      <div key={idx}>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-6 w-32" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-px w-full mb-4" />
                  <Skeleton className="h-20 w-full" />
                </div>
                
                <div>
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-px w-full mb-4" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;