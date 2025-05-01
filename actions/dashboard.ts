"use server"

import { dateRangeToQuery } from "@/lib/date-utils"
import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"

export async function getAdminDashboardStats(dateRange: string = "all") {
  try {
    const dateFilter = dateRangeToQuery(dateRange)
    console.log(dateFilter  ,"this is the date filter")

    const [
      totalUsers,
      totalVendors,
      totalProducts,
      pendingVendors,
      totalOrders,
      totalRevenue,
      lowStockProducts,
      productsByDepartment,
      categoriesCount,
      brandsCount,
      pendingOrders
    ] = await Promise.all([
      db.user.count({ where: { role: "USER", ...dateFilter } }),
      db.user.count({ where: { role: "VENDOR", ...dateFilter } }),
      db.product.count({ where: dateFilter }),
      db.user.count({ where: { vendorStatus: "PENDING", ...dateFilter } }),
      db.order.count({ where: dateFilter }),
      db.order.aggregate({
        where: dateFilter,
        _sum: { totalOrderAmount: true }
      }),
      db.product.count({ 
        where: { 
          productStock: { lte: 5 },
          isActive: true
        } 
      }),
      db.product.groupBy({
        by: ['departmentId'],
        _count: true,
        where: dateFilter,
        orderBy: {
          _count: {
            departmentId: 'desc'
          }
        }
      }),
      db.category.count(),
      db.brand.count(),
      db.order.count({ where: { orderStatus: "PENDING", ...dateFilter } })
    ])

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
   
const salesByMonth = await db.$queryRaw<Array<{month: number, year: number, total: string}>>`
SELECT 
  EXTRACT(MONTH FROM "createdAt") as month,
  EXTRACT(YEAR FROM "createdAt") as year,
  SUM("totalOrderAmount") as total
FROM "Order"
WHERE "createdAt" >= ${sixMonthsAgo}
GROUP BY month, year
ORDER BY year, month
`
    
    // Get top selling products
    const topProducts = await db.product.findMany({
      select: {
        id: true,
        title: true,
        imageUrl: true,
        productPrice: true,
        orderItems: {
          select: {
            quantity: true
          }
        }
      },
      orderBy: {
        orderItems: {
          _count: 'desc'
        }
      },
      take: 5
    })
    
    // Get top vendors
    const topVendors = await db.user.findMany({
      where: {
        role: "VENDOR",
        store: {
          isVerified: true,
          isActive: true
        }
      },
      select: {
        id: true,
        name: true,
        store: {
          select: {
            id: true,
            storeName: true,
            logo: true,
            Product: {  
              select: {
                id: true
              }
            }
          }
        },
        products: {
          select: {
            orderItems: {
              select: {
                total: true
              }
            }
          }
        }
      },
      orderBy: {
        products: {
          _count: 'desc'
        }
      },
      take: 5
    })
    
    // Recent orders
    const recentOrders = await db.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        name: true,
        totalOrderAmount: true,
        orderStatus: true,
        paymentStatus: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })
    
    return {
      metrics: {
        totalUsers,
        totalVendors,
        totalProducts,
        pendingVendors,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalOrderAmount || 0,
        lowStockProducts,
        categoriesCount,
        brandsCount,
        pendingOrders
      },
      chartData: {
        salesByMonth: salesByMonth.map((item: any) => ({
          date: `${item.month}/${item.year}`,
          value: parseFloat(item.total) || 0
        })),
        productsByDepartment
      },
      topProducts: topProducts.map(product => ({
        id: product.id,
        title: product.title,
        imageUrl: product.imageUrl,
        price: product.productPrice,
        salesCount: product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
      })),
      topVendors: topVendors.map(vendor => ({
        id: vendor.id,
        name: vendor.name,
        storeId: vendor.store?.id || '',
        storeName: vendor.store?.storeName || '',
        logo: vendor.store?.logo || '',
        productCount: vendor.store?.Product.length || 0,
        salesValue: vendor.products
          .flatMap(p => p.orderItems.map(item => item.total))
          .reduce((sum, val) => sum + (val || 0), 0)
      })),
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.name,
        amount: order.totalOrderAmount,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        date: order.createdAt.toISOString()
      }))
    }
  } catch (error) {
    console.error("Failed to fetch admin dashboard stats:", error)
    throw new Error("Failed to fetch admin dashboard statistics")
  }
}

// Vendor Dashboard Actions
export async function getVendorDashboardStats(vendorId: string, dateRange: string = "all") {

  try {
    const dateFilter = dateRangeToQuery(dateRange)
    console.log(dateFilter  ,"this is the date filter")
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalSales,
      totalRevenue,
      vendorDetails,
      pendingOrders
    ] = await Promise.all([
      db.product.count({ where: { vendorId, ...dateFilter } }),
      db.product.count({ 
        where: { 
          vendorId, 
          isActive: true,
          ...dateFilter 
        } 
      }),
      db.product.count({ 
        where: { 
          vendorId,
          productStock: { lte: 5 },
          isActive: true
        } 
      }),
      db.sale.count({ 
        where: { 
          vendorId,
          ...dateFilter 
        } 
      }),
      db.sale.aggregate({
        where: { 
          vendorId,
          ...dateFilter 
        },
        _sum: { total: true }
      }),
      db.user.findUnique({
        where: { id: vendorId },
        select: {
          balance: true,
          commission: true,
          store: {
            select: {
              storeName: true,
              logo: true,
              isVerified: true
            }
          }
        }
      }),
      db.orderItem.count({
        where: {
          vendorId,
          order: {
            orderStatus: "PENDING"
          },
          ...dateFilter
        }
      })
    ])
    
    // Get sales over time
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    // Fix: Using raw SQL to extract month and year from createdAt
    const salesByMonth = await db.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM "createdAt") as month,
        EXTRACT(YEAR FROM "createdAt") as year,
        SUM(total) as total
      FROM "Sale"
      WHERE "vendorId" = ${vendorId} AND "createdAt" >= ${sixMonthsAgo}
      GROUP BY month, year
      ORDER BY year, month
    `
    
    // Get top selling products
    const topProducts = await db.product.findMany({
      where: {
        vendorId
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        productPrice: true,
        productStock: true,
        isActive: true,
        orderItems: {
          select: {
            quantity: true
          }
        }
      },
      orderBy: {
        orderItems: {
          _count: 'desc'
        }
      },
      take: 5
    })
    
    // Recent orders
    const recentOrders = await db.orderItem.findMany({
      where: {
        vendorId
      },
      select: {
        id: true,
        title: true,
        price: true,
        quantity: true,
        total: true,
        order: {
          select: {
            id: true,
            orderNumber: true,
            orderStatus: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        order: {
          createdAt: 'desc'
        }
      },
      take: 10
    })
    
    return {
      metrics: {
        totalProducts,
        activeProducts,
        lowStockProducts,
        totalSales,
        totalRevenue: totalRevenue._sum.total || 0,
        balance: vendorDetails?.balance || 0,
        commission: vendorDetails?.commission || 0,
        storeName: vendorDetails?.store?.storeName || '',
        isVerified: vendorDetails?.store?.isVerified || false,
        pendingOrders
      },
      chartData: {
        salesByMonth: (salesByMonth as any[]).map(item => ({
          date: `${item.month}/${item.year}`,
          value: parseFloat(item.total) || 0
        }))
      },
      topProducts: topProducts.map(product => ({
        id: product.id,
        title: product.title,
        imageUrl: product.imageUrl,
        price: product.productPrice,
        stock: product.productStock || 0,
        status: product.isActive ? 'ACTIVE' : 'INACTIVE',
        salesCount: product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
      })),
      recentOrders: recentOrders.map(item => ({
        id: item.id,
        orderNumber: item.order.orderNumber,
        productName: item.title,
        quantity: item.quantity,
        total: item.total,
        status: item.order.orderStatus,
        date: item.order.createdAt.toISOString()
      }))
    }
  } catch (error) {
    console.error("Failed to fetch vendor dashboard stats:", error)
    throw new Error("Failed to fetch vendor dashboard statistics")
  }
}

// User Dashboard Actions
export async function getUserDashboardStats(userId: string, dateRange: string = "all") {
  try {
    const dateFilter = dateRangeToQuery(dateRange)
        console.log(dateFilter  ,"this is the date filter")

    const [
      totalOrders,
      completedOrders,
      pendingOrders,
      canceledOrders,
      totalSpent,
      userDetails
    ] = await Promise.all([
      db.order.count({ 
        where: { 
          userId,
          ...dateFilter 
        } 
      }),
      db.order.count({ 
        where: { 
          userId, 
          orderStatus: "DELIVERED",
          ...dateFilter 
        } 
      }),
      db.order.count({ 
        where: { 
          userId,
          orderStatus: {
            in: ["PENDING", "PROCESSING"]
          },
          ...dateFilter 
        } 
      }),
      db.order.count({ 
        where: { 
          userId,
          orderStatus: "CANCELED",
          ...dateFilter 
        } 
      }),
      db.order.aggregate({
        where: { 
          userId,
          ...dateFilter 
        },
        _sum: { totalOrderAmount: true }
      }),
      db.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          profile: {
            select: {
              image: true
            }
          }
        }
      })
    ])
    
    // Get spending over time
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    // Fix: Using raw SQL to extract month and year from createdAt
    const spendingByMonth = await db.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM "createdAt") as month,
        EXTRACT(YEAR FROM "createdAt") as year,
        SUM("totalOrderAmount") as total
      FROM "Order"
      WHERE "userId" = ${userId} AND "createdAt" >= ${sixMonthsAgo}
      GROUP BY month, year
      ORDER BY year, month
    `
    
    // Recent orders
    const recentOrders = await db.order.findMany({
      where: {
        userId
      },
      select: {
        id: true,
        orderNumber: true,
        totalOrderAmount: true,
        orderStatus: true,
        paymentStatus: true,
        createdAt: true,
        orderItems: {
          select: {
            id: true,
            title: true,
            imageUrl: true
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })
    
    return {
      metrics: {
        totalOrders,
        completedOrders,
        pendingOrders,
        canceledOrders,
        totalSpent: totalSpent._sum.totalOrderAmount || 0,
        userName: userDetails?.name || ''
      },
      chartData: {
        spendingByMonth: (spendingByMonth as any[]).map(item => ({
          date: `${item.month}/${item.year}`,
          value: parseFloat(item.total) || 0
        }))
      },
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        amount: order.totalOrderAmount,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        date: order.createdAt.toISOString(),
        firstItem: order.orderItems[0] || null
      }))
    }
  } catch (error) {
    console.error("Failed to fetch user dashboard stats:", error)
    throw new Error("Failed to fetch user dashboard statistics")
  }
}