import { Suspense } from "react";
import { getVendorBySlug } from "@/actions/vendor";
import { notFound } from "next/navigation";
import PageLoader from "@/components/dashboard/vendors/PageLoader";
import VendorHeader from "@/components/dashboard/vendors/VendorHeader";
import VendorInfo from "@/components/dashboard/vendors/VendorInfo";
import VendorProducts from "@/components/dashboard/vendors/VendorProducts";
export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const vendor = await getVendorBySlug(slug);

  if (!vendor) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<PageLoader />}>
        <VendorHeader vendor={vendor} />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          <div className="lg:col-span-1">
            <VendorInfo vendor={vendor} />
          </div>
          <div className="lg:col-span-3">
            <VendorProducts vendorId={vendor.id} />
          </div>
        </div>
      </Suspense>
    </div>
  );
}