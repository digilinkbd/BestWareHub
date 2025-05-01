import AuthPage from "@/components/frontend/AuthPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ 
    returnUrl?: string; 
    vendor?: string; 
    token?: string; // <-- this line!
    status?: string;
    search?: string;
  }>
}) {
  const resolvedParams = await searchParams
  const returnUrl = resolvedParams.returnUrl || "/dashboard"
  const vendor = resolvedParams.vendor || ""
  const approvalToken = resolvedParams.token || ""
  
  return (
    <div>
      <AuthPage 
        returnUrl={returnUrl}
        vendorParam={vendor}
        approvalTokenParam={approvalToken}
      />
    </div>
  )
}
