"use server"

import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"
import { Notification } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config/auth"

// Define the notification types for better categorization
export type NotificationType = "info" | "success" | "warning" | "error"

// Interface for better TypeScript support
export interface NotificationWithCategory extends Notification {
  category?: string;
}

// Fetch all notifications for the current user
export async function getUserNotifications(userId:string): Promise<NotificationWithCategory[]> {
  try {
    const notifications = await db.notification.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    
    // Categorize notifications based on their type
    return notifications.map(notification => ({
      ...notification,
      category: getCategoryFromType(notification.type as NotificationType)
    }))
  } catch (error) {
    console.error("Failed to fetch notifications:", error)
    throw new Error("Failed to fetch notifications")
  }
}

// Mark a notification as read
export async function markNotificationAsRead(notificationId: string): Promise<Notification> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }
    
    const updatedNotification = await db.notification.update({
      where: {
        id: notificationId,
        userId: session.user.id // Ensure user can only update their own notifications
      },
      data: {
        isRead: true
      }
    })
    
    revalidatePath("/notifications")
    return updatedNotification
  } catch (error) {
    console.error("Failed to mark notification as read:", error)
    throw new Error("Failed to mark notification as read")
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(): Promise<{ count: number }> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }
    
    const result = await db.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false
      },
      data: {
        isRead: true
      }
    })
    
    revalidatePath("/notifications")
    return { count: result.count }
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error)
    throw new Error("Failed to mark all notifications as read")
  }
}

// Helper function to categorize notifications based on type
function getCategoryFromType(type: NotificationType): string {
  switch (type) {
    case "info":
      return "General Information"
    case "success":
      return "Success"
    case "warning":
      return "Important"
    case "error":
      return "Urgent"
    default:
      return "Other"
  }
}