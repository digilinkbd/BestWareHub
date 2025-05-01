export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4 h-80 animate-pulse"></div>
        ))}
      </>
    )
  }
  
  