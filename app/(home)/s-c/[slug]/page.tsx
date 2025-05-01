import SubCategoryDetailedPage from '@/components/frontend/subcategory-page'
import React from 'react'


export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  return (
    <div>
      <SubCategoryDetailedPage slug={slug}/>
    </div>
  )
}
