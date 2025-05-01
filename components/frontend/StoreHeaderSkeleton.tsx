import { Skeleton } from "@/components/ui/skeleton"

export default function StoreHeaderSkeleton() {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-6 w-48" />
      </div>
    </header>
  )
}

