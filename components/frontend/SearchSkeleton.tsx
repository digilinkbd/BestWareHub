export function SearchSkeleton() {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="h-5 bg-gray-200 rounded w-40 animate-pulse"></div>
          <div className="h-9 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 h-80 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded-full w-8"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  