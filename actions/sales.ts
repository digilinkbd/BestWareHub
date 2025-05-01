"use server"

import { authOptions } from "@/config/auth"
import { db } from "@/prisma/db"
import { getServerSession } from "next-auth/next"
import { Prisma } from "@prisma/client"

export type SalesFilter = {
  dateRange?: "today" | "week" | "month" | "year"
  userId?: string
  page?: number
  limit?: number
}

export async function getSalesData(filter: SalesFilter = {}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }

  // Check if user has roles property and it's an array
  const isAdmin =
    session.user.roles && Array.isArray(session.user.roles)
      ? session.user.roles.some((role) => role.roleName === "admin")
      : false

  const isVendor =
    session.user.roles && Array.isArray(session.user.roles)
      ? session.user.roles.some((role) => role.roleName === "vendor")
      : false

  if (!isAdmin && !isVendor) {
    throw new Error("Not authorized to view sales data")
  }

  const page = filter.page || 1
  const limit = filter.limit || 10
  const skip = (page - 1) * limit

  const where: Prisma.SaleWhereInput = {}

  // If vendor, only show their sales
  if (isVendor && !isAdmin) {
    where.vendorId = session.user.id
  }

  // If admin and userId provided, filter by that vendor
  if (isAdmin && filter.userId) {
    where.vendorId = filter.userId
  }

  // Date range filter
  if (filter.dateRange) {
    const startDate = getStartDateForFilter(filter.dateRange)
    where.createdAt = {
      gte: startDate,
    }
  }

  // Get sales with pagination
  const sales = await db.sale.findMany({
    where,
    include: {
      product: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
        },
      },
      order: {
        select: {
          id: true,
          orderNumber: true,
          orderStatus: true,
          paymentStatus: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  })

  // Get total count for pagination
  const totalCount = await db.sale.count({ where })

  // Calculate overview metrics
  const totalSalesAmount = await db.sale.aggregate({
    where,
    _sum: { total: true },
  })

  const totalSalesCount = totalCount

  const totalCommission = await db.sale.aggregate({
    where,
    _sum: { commission: true },
  })

  // For admin, get top vendors
  let topVendors: { vendorId: string; totalSales: number; salesCount: number }[] = []
  if (isAdmin) {
    // Fix: Use Prisma's parameterized queries instead of string interpolation
    const dateCondition = filter.dateRange
      ? Prisma.sql`AND "createdAt" >= ${getStartDateForFilter(filter.dateRange)}`
      : Prisma.empty

    topVendors = await db.$queryRaw`
      SELECT "vendorId", SUM(total) as "totalSales", COUNT(*) as "salesCount"
      FROM "Sale"
      WHERE "vendorId" IS NOT NULL
      ${dateCondition}
      GROUP BY "vendorId"
      ORDER BY "totalSales" DESC
      LIMIT 5
    `
  }

  // When returning the data, ensure we convert Date objects to strings
  // and handle null vendorIds properly for type safety
  return {
    sales: sales.map((sale) => ({
      ...sale,
      vendorId: sale.vendorId || undefined, // Convert null to undefined for type safety
      createdAt: sale.createdAt.toISOString(),
      order: {
        ...sale.order,
        createdAt: sale.order.createdAt.toISOString(),
      },
    })),
    pagination: {
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
      page,
      limit,
    },
    overview: {
      totalSalesAmount: totalSalesAmount._sum.total || 0,
      totalSalesCount,
      totalCommission: totalCommission._sum.commission || 0,
      topVendors: isAdmin ? topVendors : [],
    },
  }
}

export async function getSaleById(saleId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }

  const isAdmin =
    session.user.roles && Array.isArray(session.user.roles)
      ? session.user.roles.some((role) => role.roleName === "admin")
      : false

  const isVendor =
    session.user.roles && Array.isArray(session.user.roles)
      ? session.user.roles.some((role) => role.roleName === "vendor")
      : false

  if (!isAdmin && !isVendor) {
    throw new Error("Not authorized to view sale details")
  }

  const sale = await db.sale.findUnique({
    where: {
      id: saleId,
    },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
          description: true,
          productPrice: true,
        },
      },
      order: {
        include: {
          orderItems: true,
        },
      },
    },
  })

  if (!sale) {
    throw new Error("Sale not found")
  }

  // Check if the user is allowed to view this sale
  if (isVendor && !isAdmin && sale.vendorId !== session.user.id) {
    throw new Error("Not authorized to view this sale")
  }

  // Convert dates to strings and handle null vendorId before returning
  return {
    ...sale,
    vendorId: sale.vendorId || undefined, // Convert null to undefined for type safety
    createdAt: sale.createdAt.toISOString(),
    order: {
      ...sale.order,
      createdAt: sale.order.createdAt.toISOString(),
      orderItems: sale.order.orderItems.map((item) => ({
        ...item,
        vendorId: item.vendorId || undefined, // Convert null to undefined for type safety
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    },
  }
}

function getStartDateForFilter(dateRange: "today" | "week" | "month" | "year") {
  const now = new Date()
  const startDate = new Date()

  switch (dateRange) {
    case "today":
      startDate.setHours(0, 0, 0, 0)
      break
    case "week":
      startDate.setDate(now.getDate() - 7)
      break
    case "month":
      startDate.setMonth(now.getMonth() - 1)
      break
    case "year":
      startDate.setFullYear(now.getFullYear() - 1)
      break
  }

  return startDate
}