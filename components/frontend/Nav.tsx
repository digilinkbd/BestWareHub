// Nav.jsx
import React from 'react'
import HomeHeader from '../Forms/home-header'
import { Suspense } from 'react'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/auth';

export default async function Nav({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>
}) {
    const session = await getServerSession(authOptions);
    const user=session?.user
  const resolvedSearchParams = await searchParams || {};
  const query = resolvedSearchParams.q || "";
  
  return (
    <div>
      <Suspense fallback={<div className="loader"></div>}>
        <HomeHeader searchQuery={query} user={user}/>
      </Suspense>
    </div>
  )
}