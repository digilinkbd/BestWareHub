
export function OrdersPageSkeleton() {
    return (
      <div className="space-y-4">
        <div className="h-10 w-1/3 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-32 w-full bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }