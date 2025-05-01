import CampaignForm from '@/components/dashboard/CampaignForm';
import { checkPermission } from '@/config/useAuth';
import React from 'react'
export default async function page({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const id = (await params).id;
    await checkPermission("campaign.update");
  return (
    <div>
    <CampaignForm campaignId={id}/>
    </div>
  )
}
