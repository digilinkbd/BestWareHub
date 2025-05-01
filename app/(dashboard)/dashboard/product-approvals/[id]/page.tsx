import ProductDetailPage from '@/components/dashboard/product-approvals/ProductDetailedPage'
import { authOptions } from '@/config/auth';
import { getServerSession } from 'next-auth';
import React from 'react'

export default async function page({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const session = await getServerSession(authOptions);

    const id = (await params).id;
    const roles = session?.user.roles || [];
      
  return (
    <div>
      <ProductDetailPage productId={id} userRoles={roles} />
      </div>
  )
}
