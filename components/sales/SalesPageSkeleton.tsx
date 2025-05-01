export function SalesPageSkeleton() {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded-md"></div>
  
        <div className="h-16 w-full bg-gray-200 rounded-md"></div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
  
        <div className="h-96 bg-gray-200 rounded-lg"></div>
      </div>
    )
  }
  
  