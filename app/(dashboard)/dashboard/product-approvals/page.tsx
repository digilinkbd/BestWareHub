import ProductManagementPage from "@/components/dashboard/ProductManagementPage"


export default async function ProductApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const resolvedParams = await searchParams
  const status = resolvedParams.status || 'DRAFT'
  
  return (
    <ProductManagementPage initialStatus={status} />
  )
}