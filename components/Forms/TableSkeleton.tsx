import { Skeleton } from "@/components/ui/skeleton"

interface TableSkeletonProps {
  rows?: number
  showImage?: boolean
  showActions?: boolean
  showStatus?: boolean
  showDate?: boolean
}

export function PageSkeleton({
  rows = 5,
  showImage = true,
  showActions = true,
  showStatus = true,
  showDate = true,
}: TableSkeletonProps) {
  return (
    <div className="w-full space-y-4">
      {/* Header section with title and buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Search and filter section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-full sm:w-64" />
      </div>

      {/* Table header */}
      <div className="hidden md:flex items-center gap-4 py-3 px-4 border-b">
        <Skeleton className="h-4 w-4 rounded-sm" />
        <Skeleton className="h-4 w-32 flex-1" />
        {showImage && <Skeleton className="h-4 w-32" />}
        {showStatus && <Skeleton className="h-4 w-20" />}
        {showDate && <Skeleton className="h-4 w-28" />}
        {showActions && <Skeleton className="h-4 w-6" />}
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 py-4 px-4 border-b">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-6 w-full md:w-32 flex-1" />
          </div>

          {showImage && (
            <div className="mt-2 md:mt-0">
              <Skeleton className="h-12 w-16" />
            </div>
          )}

          {showStatus && (
            <div className="mt-2 md:mt-0">
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          )}

          {showDate && (
            <div className="mt-2 md:mt-0">
              <Skeleton className="h-6 w-28" />
            </div>
          )}

          {showActions && (
            <div className="mt-2 md:mt-0 ml-auto">
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          )}
        </div>
      ))}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
        <Skeleton className="h-5 w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  )
}

