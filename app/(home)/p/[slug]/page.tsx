import ProductPage from '@/components/frontend/product-page';
import React from 'react'

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  return (
    <div>
      <ProductPage slug={slug}/>
    </div>
  )
}
