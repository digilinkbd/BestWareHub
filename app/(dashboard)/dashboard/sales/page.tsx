import { Suspense } from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

import { authOptions } from "@/config/auth"
import { SalesPageSkeleton } from "@/components/sales/SalesPageSkeleton"
import { SalesDashboard } from "@/components/sales/SalesDashboard"


export default async function SalesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth")
  }

  const isAdmin = session.user.roles?.some((role) => role.roleName === "admin")
  const isVendor = session.user.roles?.some((role) => role.roleName === "vendor")

  if (!isAdmin && !isVendor) {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Suspense fallback={<SalesPageSkeleton />}>
        <SalesDashboard userRole={isAdmin ? "admin" : "vendor"} userId={session.user.id} />
      </Suspense>
    </div>
  )
}

