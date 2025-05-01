import { Skeleton } from "@/components/ui/skeleton"

export default function BannerSkeleton() {
  return (
    <div className="w-full bg-white p-4">
      <Skeleton className="h-40 md:h-64 w-full rounded-lg" />
    </div>
  )
}

