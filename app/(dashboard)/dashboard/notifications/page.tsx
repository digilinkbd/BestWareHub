import NotificationsPage from '@/components/NotificationsPage'
import { authOptions } from '@/config/auth'
import { getServerSession } from 'next-auth'
import React from 'react'

export default async function page() {
const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }
    
    const userId = session.user.id
  return (
    <div>
      <NotificationsPage userId={userId}/>
    </div>
  )
}
