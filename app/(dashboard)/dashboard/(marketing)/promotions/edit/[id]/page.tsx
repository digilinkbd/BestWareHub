import CampaignForm from '@/components/dashboard/CampaignForm';
import PromotionForm from '@/components/dashboard/PromotionForm';
import React from 'react'
export default async function page({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const id = (await params).id;
  return (
    <div>
    <PromotionForm promotionId={id}/>
    </div>
  )
}
