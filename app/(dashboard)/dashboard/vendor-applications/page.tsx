import StoreListPage from "@/components/dashboard/store/StoreListPage"
import { checkPermission } from "@/config/useAuth"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vendor Stores Management",
  description: "Manage vendor stores in the marketplace",
}

export default async function StoresPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>
}) {
  await checkPermission("vendor-applications.read")

  const resolvedParams = await searchParams
  const page = Number(resolvedParams.page) || 1
  const status = resolvedParams.status || "all"
  const search = resolvedParams.search || ""

  return <StoreListPage initialPage={page} initialStatus={status} search={search} />
}
