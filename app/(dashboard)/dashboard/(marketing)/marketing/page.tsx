import MarketingDashboard from '@/components/dashboard/MarketingDashboard';
import React from 'react'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedParams = await searchParams;
  return <MarketingDashboard searchParams={resolvedParams} />;
}