"use server"

import { authOptions } from "@/config/auth";
import { db } from "@/prisma/db";
import { OrderStatus, PaymentStatus, UserRole } from "@prisma/client";
import { getServerSession } from "next-auth/next";

export type OrderFilter = {
  dateRange?: "today" | "week" | "month" | "year";
  amountSort?: "highest" | "lowest";
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  page?: number;
  limit?: number;
}

export async function getOrders(filter: OrderFilter = {}, userId?: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const isAdmin = session.user.roles?.some(role => role.roleName === "admin");

const page = filter.page || 1;
  const limit = filter.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (!isAdmin && userId) {
    where.userId = userId;
  } else if (userId && isAdmin) {
    // If admin and userId is provided, filter by that user
    where.userId = userId;
  }

  // Date range filter
  if (filter.dateRange) {
    const now = new Date();
    let startDate = new Date();

    switch (filter.dateRange) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    where.createdAt = {
      gte: startDate,
    };
  }

  // Status filter
  if (filter.status) {
    where.orderStatus = filter.status;
  }

  // Payment status filter
  if (filter.paymentStatus) {
    where.paymentStatus = filter.paymentStatus;
  }

  // Get total count for pagination
  const totalCount = await db.order.count({ where });

  // Get orders
  const orders = await db.order.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
            },
          },
        },
      },
    },
    orderBy: filter.amountSort === "highest" 
      ? { totalOrderAmount: "desc" } 
      : filter.amountSort === "lowest" 
        ? { totalOrderAmount: "asc" } 
        : { createdAt: "desc" },
    skip,
    take: limit,
  });

  return {
    orders,
    pagination: {
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
      page,
      limit,
    },
  };
}

export async function getOrderById(orderId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const isAdmin = session.user.roles?.some(role => role.roleName === "admin");
  const order = await db.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Check if the user is allowed to view this order
  if (!isAdmin && order.userId !== session.user.id) {
    throw new Error("Not authorized to view this order");
  }

  return order;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await getServerSession(authOptions);
  console.log(orderId , status)
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const isAdmin = session.user.roles?.some((role) => role.roleName === "admin")
  if (!isAdmin) {
    throw new Error("Not authorized to update order status");
  }

  return db.order.update({
    where: {
      id: orderId,
    },
    data: {
      orderStatus: status,
    },
  });
}