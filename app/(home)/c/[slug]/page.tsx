import CategoryDetailedPage from '@/components/frontend/category-detailed-page';
import React from 'react'

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  return (
    <div>
      <CategoryDetailedPage slug={slug}/>
    </div>
  )
}
