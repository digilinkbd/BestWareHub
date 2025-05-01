import { Suspense } from "react"
import { redirect } from "next/navigation"

import { authOptions } from "@/config/auth"
import { getServerSession } from "next-auth"
import WishlistSkeleton from "@/components/frontend/WishlistSkeleton"
import WishlistContent from "@/components/frontend/WishlistContent"

export const metadata = {
  title: "My Wishlist",
  description: "View and manage your wishlist items",
}

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/auth?returnUrl=/wishlist")
  }
  
  return (
    <main className="md:container mx-auto ">      
      <Suspense fallback={<WishlistSkeleton />}>
        <WishlistContent />
      </Suspense>
    </main>
  )
}