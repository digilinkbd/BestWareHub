import CampaignForm from '@/components/dashboard/CampaignForm'
import { checkPermission } from '@/config/useAuth';
import React from 'react'

export default async function page() {
      await checkPermission("campaign.create");
  
  return (
    <div>
    <CampaignForm />
    </div>
  )
}
