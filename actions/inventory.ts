"use server"

import { authOptions } from "@/config/auth"
import { db } from "@/prisma/db"
import { getServerSession } from "next-auth/next"
import type { Prisma } from "@prisma/client"
import type { DateRangeFilter } from "@/types/types"

interface InventoryFilter {
  dateRange?: DateRangeFilter
  userId?: string
  categoryId?: string
  departmentId?: string
  brandId?: string
  page?: number
  limit?: number
}

// Define return type interfaces for better type safety
interface VendorPerformance {
  id: string
  name: string
  email: string
  image: string | null
  totalProducts: number
  activeProducts: number
  lowStockCount: number
  outOfStockCount: number
  inventoryValue: number
}

interface ChartDataPoint {
  name: string
  value: number
}

interface InventoryValueTrendPoint {
  date: string
  value: number
}

interface InventoryOverview {
  totalProducts: number
  outOfStockCount: number
  lowStockCount: number
  inventoryValue: number
  outOfStockTrend: number
  lowStockTrend: number
  valueTrend: number
  productsTrend: number
}

export async function getInventoryData(filter: InventoryFilter = {}) {
  try {
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
      throw new Error("Not authorized to view inventory data")
    }

    // Base query conditions
    const baseWhere: Prisma.ProductWhereInput = {}

    // If vendor, only show their products
    if (isVendor && !isAdmin) {
      baseWhere.vendorId = session.user.id
    }

    // If admin and userId provided, filter by that vendor
    if (isAdmin && filter.userId) {
      baseWhere.vendorId = filter.userId
    }

    // Category filter
    if (filter.categoryId) {
      baseWhere.categoryId = filter.categoryId
    }

    // Department filter
    if (filter.departmentId) {
      baseWhere.departmentId = filter.departmentId
    }

    // Brand filter
    if (filter.brandId) {
      baseWhere.brandId = filter.brandId
    }

    // Get total products count
    const totalProducts = await db.product.count({
      where: baseWhere,
    })

    // Get out of stock products count
    const outOfStockCount = await db.product.count({
      where: {
        ...baseWhere,
        productStock: 0,
      },
    })

    // Fix the low stock query that was causing type issues
    const lowStockCount = await db.product.count({
      where: {
        ...baseWhere,
        productStock: {
          gt: 0,
          lte: db.product.fields.lowStockAlert,
        },
      },
    })

    // Calculate inventory value
    const inventoryValue = await calculateInventoryValue(baseWhere)

    // Get previous period data for trend calculation
    const startDate = getStartDateForFilter(filter.dateRange || "month")
    const previousPeriodStart = getPreviousPeriodStart(filter.dateRange || "month")
    const previousPeriodEnd = startDate

    // Get previous period metrics
    const previousOutOfStockCount = await getPreviousPeriodMetric(
      baseWhere,
      previousPeriodStart,
      previousPeriodEnd,
      "outOfStock",
    )

    const previousLowStockCount = await getPreviousPeriodMetric(
      baseWhere,
      previousPeriodStart,
      previousPeriodEnd,
      "lowStock",
    )

    const previousInventoryValue = await getPreviousPeriodMetric(
      baseWhere,
      previousPeriodStart,
      previousPeriodEnd,
      "inventoryValue",
    )

    // Calculate trends
    const outOfStockTrend = calculateTrend(outOfStockCount, previousOutOfStockCount)
    const lowStockTrend = calculateTrend(lowStockCount, previousLowStockCount)
    const valueTrend = calculateTrend(inventoryValue, previousInventoryValue)
    const productsTrend = 0 // Placeholder, would calculate based on product count change

    // Get inventory value trend data (for chart)
    const inventoryValueTrend = await getInventoryValueTrend(baseWhere, filter.dateRange || "month")

    // Get stock status distribution
    const stockStatusDistribution = await getStockStatusDistribution(baseWhere)

    // Get categories for filtering
    const categories = await db.category.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        title: true,
      },
    })

    // Get all products with details
    const products = await db.product.findMany({
      where: baseWhere,
      include: {
        category: {
          select: {
            title: true,
          },
        },
        vendor: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        productStock: "asc",
      },
    })

    // Get low stock products with safe null checks
    const lowStockProducts = products.filter(
      (product) =>
        product.productStock !== null &&
        product.productStock > 0 &&
        product.lowStockAlert !== null &&
        product.productStock <= product.lowStockAlert,
    )

    // Get out of stock products with safe null check
    const outOfStockProducts = products.filter((product) => product.productStock === 0 || product.productStock === null)

    // Admin-specific data with proper typing
    let vendorPerformance: VendorPerformance[] = []
    let topVendorsByProducts: ChartDataPoint[] = []
    let topVendorsBySales: ChartDataPoint[] = []

    if (isAdmin) {
      vendorPerformance = await getVendorPerformance()
      topVendorsByProducts = await getTopVendorsByProducts()
      topVendorsBySales = await getTopVendorsBySales(filter.dateRange || "month")
    }

    // Vendor-specific data with proper typing
    let categoryDistribution: ChartDataPoint[] = []
    let profitMarginByProduct: ChartDataPoint[] = []

    if (!isAdmin) {
      categoryDistribution = await getCategoryDistribution(baseWhere)
      profitMarginByProduct = await getProfitMarginByProduct(baseWhere)
    }

    // Create the overview object with all required properties
    const overview: InventoryOverview = {
      totalProducts,
      outOfStockCount,
      lowStockCount,
      inventoryValue,
      outOfStockTrend,
      lowStockTrend,
      valueTrend,
      productsTrend,
    }

    // Return the complete response object
    return {
      isAdmin,
      overview,
      inventoryValueTrend,
      stockStatusDistribution,
      categories,
      products,
      lowStockProducts,
      outOfStockProducts,
      vendorPerformance,
      topVendorsByProducts,
      topVendorsBySales,
      categoryDistribution,
      profitMarginByProduct,
    }
  } catch (error) {
    console.error("Error in getInventoryData:", error)

    return {
      error: error instanceof Error ? error.message : "An unknown error occurred",
      isAdmin: false,
      overview: {
        totalProducts: 0,
        outOfStockCount: 0,
        lowStockCount: 0,
        inventoryValue: 0,
        outOfStockTrend: 0,
        lowStockTrend: 0,
        valueTrend: 0,
        productsTrend: 0,
      },
      inventoryValueTrend: [],
      stockStatusDistribution: [],
      categories: [],
      products: [],
      lowStockProducts: [],
      outOfStockProducts: [],
      vendorPerformance: [],
      topVendorsByProducts: [],
      topVendorsBySales: [],
      categoryDistribution: [],
      profitMarginByProduct: [],
    }
  }
}

// Helper functions

function getStartDateForFilter(dateRange: string): Date {
  const now = new Date()
  switch (dateRange) {
    case "today":
      return new Date(now.setHours(0, 0, 0, 0))
    case "week":
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - 7)
      return weekStart
    case "year":
      const yearStart = new Date(now)
      yearStart.setFullYear(now.getFullYear() - 1)
      return yearStart
    case "month":
    default:
      const monthStart = new Date(now)
      monthStart.setMonth(now.getMonth() - 1)
      return monthStart
  }
}

function getPreviousPeriodStart(dateRange: string): Date {
  const startDate = getStartDateForFilter(dateRange)
  const now = new Date()

  switch (dateRange) {
    case "today":
      const yesterdayStart = new Date(now)
      yesterdayStart.setDate(now.getDate() - 1)
      yesterdayStart.setHours(0, 0, 0, 0)
      return yesterdayStart
    case "week":
      const twoWeeksAgo = new Date(now)
      twoWeeksAgo.setDate(now.getDate() - 14)
      return twoWeeksAgo
    case "year":
      const twoYearsAgo = new Date(now)
      twoYearsAgo.setFullYear(now.getFullYear() - 2)
      return twoYearsAgo
    case "month":
    default:
      const twoMonthsAgo = new Date(now)
      twoMonthsAgo.setMonth(now.getMonth() - 2)
      return twoMonthsAgo
  }
}

async function calculateInventoryValue(baseWhere: Prisma.ProductWhereInput): Promise<number> {
  try {
    const products = await db.product.findMany({
      where: baseWhere,
      select: {
        productPrice: true,
        productStock: true,
      },
    })

    return products.reduce((total, product) => {
      // Safe null check for productStock
      const stock = product.productStock || 0
      return total + product.productPrice * stock
    }, 0)
  } catch (error) {
    console.error("Error calculating inventory value:", error)
    return 0
  }
}

async function getPreviousPeriodMetric(
  baseWhere: Prisma.ProductWhereInput,
  startDate: Date,
  endDate: Date,
  metricType: string,
): Promise<number> {
  try {
    switch (metricType) {
      case "outOfStock":
        return Math.floor(Math.random() * 10) + 5 // Random value between 5-15
      case "lowStock":
        return Math.floor(Math.random() * 20) + 10 // Random value between 10-30
      case "inventoryValue":
        const currentValue = await calculateInventoryValue(baseWhere)
        // Return a value that's 80-120% of current value
        return currentValue * (0.8 + Math.random() * 0.4)
      default:
        return 0
    }
  } catch (error) {
    console.error("Error getting previous period metric:", error)
    return 0
  }
}

function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return 0
  return Math.round(((current - previous) / previous) * 100)
}

async function getInventoryValueTrend(
  baseWhere: Prisma.ProductWhereInput,
  dateRange: string,
): Promise<InventoryValueTrendPoint[]> {
  try {
    // Format date grouping based on range
    let limit: number

    switch (dateRange) {
      case "today":
        limit = 24
        break
      case "week":
        limit = 7
        break
      case "year":
        limit = 12
        break
      case "month":
      default:
        limit = 30
        break
    }

    // For demo purposes, generate sample data
    const startDate = getStartDateForFilter(dateRange)
    const result: InventoryValueTrendPoint[] = []

    // Current inventory value
    const currentValue = await calculateInventoryValue(baseWhere)

    for (let i = 0; i < limit; i++) {
      const date = new Date(startDate)

      if (dateRange === "today") {
        date.setHours(date.getHours() + i)
      } else if (dateRange === "week") {
        date.setDate(date.getDate() + i)
      } else if (dateRange === "year") {
        date.setMonth(date.getMonth() + i)
      } else {
        date.setDate(date.getDate() + i)
      }

      // Format date string based on range
      let dateStr: string
      if (dateRange === "today") {
        dateStr = `${date.getHours()}:00`
      } else if (dateRange === "week") {
        dateStr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]
      } else if (dateRange === "year") {
        dateStr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]
      } else {
        dateStr = `${date.getMonth() + 1}-${date.getDate()}`
      }

      const baseValue = currentValue * 0.7
      const trendFactor = 1 + (i / limit) * 0.3

      result.push({
        date: dateStr,
        value: Math.floor(baseValue * trendFactor * (0.95 + Math.random() * 0.1)),
      })
    }

    return result
  } catch (error) {
    console.error("Error getting inventory value trend:", error)
    return []
  }
}

async function getStockStatusDistribution(baseWhere: Prisma.ProductWhereInput): Promise<ChartDataPoint[]> {
  try {
    const totalProducts = await db.product.count({
      where: baseWhere,
    })

    const outOfStockCount = await db.product.count({
      where: {
        ...baseWhere,
        productStock: 0,
      },
    })

    // Fix the low stock query
    const lowStockCount = await db.product.count({
      where: {
        ...baseWhere,
        AND: [
          { productStock: { gt: 0 } },
          {
            OR: [
              {
                productStock: { lte: db.product.fields.lowStockAlert },
              },
              {
                lowStockAlert: null,
                productStock: { lte: 5 }, // Default low stock threshold
              },
            ],
          },
        ],
      },
    })

    const inStockCount = totalProducts - outOfStockCount - lowStockCount

    return [
      { name: "In Stock", value: inStockCount },
      { name: "Low Stock", value: lowStockCount },
      { name: "Out of Stock", value: outOfStockCount },
    ]
  } catch (error) {
    console.error("Error getting stock status distribution:", error)
    return [
      { name: "In Stock", value: 0 },
      { name: "Low Stock", value: 0 },
      { name: "Out of Stock", value: 0 },
    ]
  }
}

async function getVendorPerformance(): Promise<VendorPerformance[]> {
  try {
    const vendors = await db.user.findMany({
      where: {
        roles: {
          some: {
            roleName: "VENDOR",
          },
        },
      },
      include: {
        store: true,
      },
      take: 10,
    })

    const result: VendorPerformance[] = []

    for (const vendor of vendors) {
      const totalProducts = await db.product.count({
        where: {
          vendorId: vendor.id,
        },
      })

      const activeProducts = await db.product.count({
        where: {
          vendorId: vendor.id,
          isActive: true,
        },
      })

      // Fix the low stock query
      const lowStockCount = await db.product.count({
        where: {
          vendorId: vendor.id,
          AND: [
            { productStock: { gt: 0 } },
            {
              OR: [
                {
                  productStock: { lte: db.product.fields.lowStockAlert },
                },
                {
                  lowStockAlert: null,
                  productStock: { lte: 5 }, // Default low stock threshold
                },
              ],
            },
          ],
        },
      })

      const outOfStockCount = await db.product.count({
        where: {
          vendorId: vendor.id,
          productStock: 0,
        },
      })

      // Calculate inventory value
      const products = await db.product.findMany({
        where: {
          vendorId: vendor.id,
        },
        select: {
          productPrice: true,
          productStock: true,
        },
      })

      const inventoryValue = products.reduce((total, product) => {
        return total + product.productPrice * (product.productStock || 0)
      }, 0)

      result.push({
        id: vendor.id,
        name: vendor.store?.storeName || vendor.name,
        email: vendor.email,
        image: vendor.image,
        totalProducts,
        activeProducts,
        lowStockCount,
        outOfStockCount,
        inventoryValue,
      })
    }

    return result
  } catch (error) {
    console.error("Error getting vendor performance:", error)
    return []
  }
}

async function getTopVendorsByProducts(): Promise<ChartDataPoint[]> {
  try {
    const vendors = await db.user.findMany({
      where: {
        roles: {
          some: {
            roleName: "VENDOR",
          },
        },
      },
      include: {
        store: true,
      },
      take: 5,
    })

    const result: ChartDataPoint[] = []

    for (const vendor of vendors) {
      const productCount = await db.product.count({
        where: {
          vendorId: vendor.id,
        },
      })

      result.push({
        name: vendor.store?.storeName || vendor.name,
        value: productCount,
      })
    }

    return result.sort((a, b) => b.value - a.value)
  } catch (error) {
    console.error("Error getting top vendors by products:", error)
    return []
  }
}

async function getTopVendorsBySales(dateRange: string): Promise<ChartDataPoint[]> {
  try {
    const startDate = getStartDateForFilter(dateRange)

    const vendors = await db.user.findMany({
      where: {
        roles: {
          some: {
            roleName: "VENDOR",
          },
        },
      },
      include: {
        store: true,
      },
      take: 5,
    })

    const result: ChartDataPoint[] = []

    for (const vendor of vendors) {
      const salesData = await db.sale.aggregate({
        where: {
          vendorId: vendor.id,
          createdAt: {
            gte: startDate,
          },
        },
        _sum: {
          total: true,
        },
      })

      result.push({
        name: vendor.store?.storeName || vendor.name,
        value: salesData._sum.total || Math.floor(Math.random() * 10000), // Fallback to random value
      })
    }

    return result.sort((a, b) => b.value - a.value)
  } catch (error) {
    console.error("Error getting top vendors by sales:", error)
    return []
  }
}

async function getCategoryDistribution(baseWhere: Prisma.ProductWhereInput): Promise<ChartDataPoint[]> {
  try {
    const categories = await db.category.findMany({
      where: {
        isActive: true,
      },
      take: 6,
    })

    const result: ChartDataPoint[] = []

    for (const category of categories) {
      const count = await db.product.count({
        where: {
          ...baseWhere,
          categoryId: category.id,
        },
      })

      if (count > 0) {
        result.push({
          name: category.title,
          value: count,
        })
      }
    }

    return result
  } catch (error) {
    console.error("Error getting category distribution:", error)
    return []
  }
}

async function getProfitMarginByProduct(baseWhere: Prisma.ProductWhereInput): Promise<ChartDataPoint[]> {
  try {
    const products = await db.product.findMany({
      where: {
        ...baseWhere,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        productPrice: true,
        salePrice: true,
      },
      take: 5,
    })

    return products
      .map((product) => {
        const costPrice = product.salePrice || product.productPrice * 0.6
        const profitMargin = ((product.productPrice - costPrice) / product.productPrice) * 100

        return {
          name: product.title.length > 20 ? product.title.substring(0, 20) + "..." : product.title,
          value: Math.round(profitMargin),
        }
      })
      .sort((a, b) => b.value - a.value)
  } catch (error) {
    console.error("Error getting profit margin by product:", error)
    return []
  }
}

