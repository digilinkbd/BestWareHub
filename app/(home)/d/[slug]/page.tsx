import DepartmentPage from '@/components/frontend/department-page'
import React from 'react'

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  return (
    <div>
      <DepartmentPage slug={slug}/>
    </div>
  )
}
