import StorePage from '@/components/frontend/store-page';
import React from 'react'


export default async function page({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }) {
    const slug = (await params).slug;
  return (
    <div>
    <StorePage slug={slug}/>
    </div>
  )
}
