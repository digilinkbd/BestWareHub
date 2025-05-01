import { Skeleton } from "@/components/ui/skeleton"

export default function ProductSkeletonDetailed() {
  return (
    <div className="container mx-auto md:px-6 lg:px-9 px-2 py-0 bg-[#f7f7fa] mb-3">
      <div className="bg-white md:px-4 py-6 px-2">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Product Images Skeleton */}
          <div className="lg:col-span-5">
            <div className="flex flex-col md:flex-row gap-4 relative">
              <div className="order-2 md:order-1 w-full md:w-20">
                <div className="flex md:flex-col gap-2 py-2 md:py-0">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="w-16 h-16 md:w-full md:h-20 rounded" />
                  ))}
                </div>
              </div>
              <div className="order-1 md:order-2 flex-1">
                <Skeleton className="aspect-square w-full rounded-md" />
                <div className="lg:flex items-center gap-4 mt-[10%] mr-5 hidden">
                  <Skeleton className="h-[47px] flex-1" />
                  <Skeleton className="h-[47px] w-[42px]" />
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Product Information Skeleton */}
          <div className="lg:col-span-4">
            <div className="space-y-6">
              <div>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full mt-2" />
                <Skeleton className="h-6 w-3/4 mt-2" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-5 w-48" />
              </div>

              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
          </div>

          {/* Right Column - Delivery Info Skeleton */}
          <div className="lg:col-span-3">
            <Skeleton className="h-[400px] w-full rounded-md" />
          </div>
        </div>

        {/* Product Details Section Skeleton */}
        <div className="mt-12">
          <div className="space-y-4">
            <div className="flex gap-4 border-b">
              {["Overview", "Reviews", "Specifications"].map((tab) => (
                <Skeleton key={tab} className="h-10 w-28" />
              ))}
            </div>
            <div className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <Skeleton className="h-8 w-32 mb-4" />
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-6 w-full mb-4" />
                  ))}
                </div>
                <div>
                  <Skeleton className="h-8 w-32 mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Skeleton key={i} className="h-20 rounded" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Skeleton */}
        <div className="mt-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-64 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

