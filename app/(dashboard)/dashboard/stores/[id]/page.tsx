import { checkPermission } from '@/config/useAuth'
import { getStoreById } from '@/actions/store'
import { Metadata } from 'next'
import React from 'react'
import StoreDetailClient from '@/components/dashboard/store/StoreDetailClient'

export async function generateMetadata({
  params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const id = (await params).id;

  const store = await getStoreById(id)

  return {
    title: store ? `${store.storeName} | Admin Dashboard` : 'Store Details',
    description: store?.description || 'View and manage store details',
  }
}

export default async function page({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const id = (await params).id;
  await checkPermission("stores.read")

  return <StoreDetailClient storeId={id} />
}
