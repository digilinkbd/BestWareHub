"use client"

import React, { useEffect, useState } from 'react'
import { Bell, Check, Info, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react'

import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from 'framer-motion'
import { getUserNotifications, markAllNotificationsAsRead, markNotificationAsRead, NotificationWithCategory } from '@/actions/notifications'
import { RiCheckboxBlankCircleLine } from 'react-icons/ri'

export default function NotificationsPage({ userId }: { userId: string }) {
    const [notifications, setNotifications] = useState<NotificationWithCategory[]>([])
//   console.log(notifications , "these are notifcations")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()


  useEffect(() => {
    async function loadNotifications() {
      try {
        setLoading(true)
        const data = await getUserNotifications(userId)
        setNotifications(data)
      } catch (err) {
        setError("Failed to load notifications")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [])

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id)
      // Update local state instead of refetching
      setNotifications(prev => prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      ))
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      // Update local state
      setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })))
    } catch (err) {
      console.error("Error marking all notifications as read:", err)
    }
  }

  const handleNotificationClick = (notification: NotificationWithCategory) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id)
    }
    
    // Navigate to the link if provided
    if (notification.link) {
      router.push(notification.link)
    }
  }

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  }

  // Group notifications by category
  const notificationsByCategory = notifications.reduce<Record<string, NotificationWithCategory[]>>((acc, notification) => {
    const category = notification.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(notification);
    return acc;
  }, {});

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-lg font-medium text-gray-800">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Your Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with the latest information</p>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button 
              onClick={handleMarkAllAsRead}
              className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <RiCheckboxBlankCircleLine className="h-5 w-5" />
              <span>Mark All as Read</span>
            </Button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card className="w-full bg-yellow-50 border-yellow-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-16 w-16 text-yellow-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-800">No Notifications Yet</h3>
            <p className="text-gray-500 text-center mt-2">
              You don't have any notifications at the moment.
              <br />We'll notify you when there's something new.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 bg-yellow-100 text-yellow-800 rounded-lg mb-6">
            <TabsTrigger value="all" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              All
              {notifications.length > 0 && (
                <Badge className="ml-2 bg-yellow-600">{notifications.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-yellow-600">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            {['info', 'success', 'warning', 'error'].map(type => {
              const count = notifications.filter(n => n.type === type).length;
              return count > 0 ? (
                <TabsTrigger 
                  key={type} 
                  value={type}
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  <Badge className="ml-2 bg-yellow-600">{count}</Badge>
                </TabsTrigger>
              ) : null;
            })}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <AnimatePresence>
              {Object.entries(notificationsByCategory).map(([category, items]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">{category}</h2>
                  <div className="space-y-3">
                    {items.map(notification => (
                      <NotificationCard 
                        key={notification.id} 
                        notification={notification} 
                        onClick={() => handleNotificationClick(notification)}
                        getIcon={getNotificationIcon}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            <AnimatePresence>
              {notifications.filter(n => !n.isRead).length > 0 ? (
                notifications
                  .filter(n => !n.isRead)
                  .map(notification => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <NotificationCard 
                        notification={notification} 
                        onClick={() => handleNotificationClick(notification)}
                        getIcon={getNotificationIcon}
                      />
                    </motion.div>
                  ))
              ) : (
                <Card className="w-full bg-gray-50 border-gray-200">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Check className="h-12 w-12 text-green-500 mb-3" />
                    <h3 className="text-lg font-medium text-gray-800">All Caught Up!</h3>
                    <p className="text-gray-500 text-center mt-1">
                      You have no unread notifications.
                    </p>
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>
          </TabsContent>

          {['info', 'success', 'warning', 'error'].map(type => (
            <TabsContent key={type} value={type} className="space-y-4">
              <AnimatePresence>
                {notifications.filter(n => n.type === type).length > 0 ? (
                  notifications
                    .filter(n => n.type === type)
                    .map(notification => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <NotificationCard 
                          notification={notification} 
                          onClick={() => handleNotificationClick(notification)}
                          getIcon={getNotificationIcon}
                        />
                      </motion.div>
                    ))
                ) : (
                  <Card className="w-full bg-gray-50 border-gray-200">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Info className="h-12 w-12 text-blue-500 mb-3" />
                      <h3 className="text-lg font-medium text-gray-800">No {type} notifications</h3>
                      <p className="text-gray-500 text-center mt-1">
                        You don't have any {type} notifications at the moment.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}

interface NotificationCardProps {
  notification: NotificationWithCategory;
  onClick: () => void;
  getIcon: (type: string) => any;
}

function NotificationCard({ notification, onClick, getIcon }: NotificationCardProps) {
  return (
    <Card 
      className={`w-full cursor-pointer transition-all hover:shadow-md ${
        notification.isRead 
          ? 'bg-white border-gray-200' 
          : 'bg-yellow-50 border-yellow-300'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="p-2 rounded-full bg-white shadow-sm mr-4">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className={`text-lg font-medium ${notification.isRead ? 'text-gray-800' : 'text-gray-900'}`}>
                {notification.title}
                {!notification.isRead && (
                  <span className="inline-block ml-2 w-2 h-2 bg-yellow-500 rounded-full"></span>
                )}
              </h3>
              <span className="text-xs text-gray-500">
                {format(new Date(notification.createdAt), 'MMM dd, yyyy · h:mm a')}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{notification.message}</p>
            {notification.link && (
              <div className="mt-2">
                <Button variant="link" className="p-0 h-auto text-yellow-600 hover:text-yellow-700">
                  View details
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}