"use client"

import { useState } from "react"
import { useAdminDashboardStats } from "@/hooks/useDashboard"
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Calendar,
  CircleDollarSign,
  Download,
  Filter,
  PackageCheck,
  ShoppingBag,
  Store,
  Tag,
  Users,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { dateFilterOptions } from "@/lib/date-utils"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { MetricCard } from "./MetricCard"
import { AreaChartCard } from "./AreaChartCard"
import { DataTable } from "./DataTable"
import { StatusBadge } from "./StatusBadge"
import { BarChartCard } from "./BarChartCard"
import { getProductAnalytics } from "@/actions/product-reports"
import { useQuery } from "@tanstack/react-query"




export default function AdminDashboard({ userName = "Admin" }: { userName?: string }) {
  const [dateRange, setDateRange] = useState<string>("all")
  const { data, isLoading, error } = useAdminDashboardStats(dateRange)

  const { data: ProductData, isLoading: isProductLoading, refetch } = useQuery({
    queryKey: ["productAnalytics", dateRange],
    queryFn: async () => {
      return await getProductAnalytics({ dateRange } as any);
    },
  });
  

  if (isLoading || isProductLoading || !data) {
    return <AdminDashboardSkeleton />
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Chart colors
  const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f43f5e", "#f59e0b", "#ec4899"]

  // Metrics for the dashboard
  const metrics = [
    {
      title: "Total Revenue",
      value: data.metrics.totalRevenue,
      icon: CircleDollarSign,
      description: "Total revenue across all sales",
      trend: 12,
      prefix: "Tk.",
      variant: "admin" as const,
    },
    {
      title: "Total Orders",
      value: data.metrics.totalOrders,
      icon: ShoppingBag,
      description: "Total orders processed",
      trend: 8,
      variant: "admin" as const,
    },
    {
      title: "Total Products",
      value: data.metrics.totalProducts,
      icon: Box,
      description: "Products in catalog",
      trend: 5,
      variant: "admin" as const,
    },
    {
      title: "Total Vendors",
      value: data.metrics.totalVendors,
      icon: Store,
      description: "Active vendors",
      trend: 15,
      variant: "admin" as const,
    },
  ]

  // Additional metrics
  const additionalMetrics = [
    {
      title: "Total Users",
      value: data.metrics.totalUsers,
      icon: Users,
      description: "Registered users",
      trend: 10,
      variant: "admin" as const,
    },
    {
      title: "Pending Orders",
      value: data.metrics.pendingOrders,
      icon: ShoppingBag,
      description: "Orders awaiting processing",
      trend: -2,
      trendInverted: true,
      variant: "admin" as const,
    },
    {
      title: "Low Stock",
      value: data.metrics.lowStockProducts,
      icon: PackageCheck,
      description: "Products low in stock",
      trend: 3,
      trendInverted: true,
      variant: "admin" as const,
    },
    {
      title: "Categories",
      value: data.metrics.categoriesCount,
      icon: Tag,
      description: "Product categories",
      trend: 0,
      trendHidden: true,
      variant: "admin" as const,
    },
  ]
function SalesTrendChart({ data }: { data: any[] }) {
  if (!data.length) {
    return <div className="flex items-center justify-center h-full">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} dy={10} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Tk. ${value.toLocaleString()}`}
          tick={{ fontSize: 12 }}
          dx={-10}
        />
        <Tooltip
          formatter={(value: number) => [`Tk. ${value.toLocaleString()}`, "Revenue"]}
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "0.375rem",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#8b5cf6"
          fillOpacity={1}
          fill="url(#colorRevenue)"
          name="Revenue"
        />
        <Line type="monotone" dataKey="units" stroke="#06b6d4" strokeWidth={2} name="Units Sold" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function CategoryDistributionChart({ data }: { data: any[] }) {
  if (!data.length) {
    return <div className="flex items-center justify-center h-full">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} dy={10} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} dx={-10} />
        <Tooltip
          formatter={(value: number) => [value, "Products"]}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "0.375rem",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        />
        <Legend />
        <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Products" />
      </BarChart>
    </ResponsiveContainer>
  )
}

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header with welcome and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {userName}!</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full md:w-[240px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              {dateFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="icon" className="hidden sm:flex">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle>Sales Trend</CardTitle>
                      <CardDescription>Product sales over time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <SalesTrendChart data={ProductData?.salesTrend || []} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Category Distribution</CardTitle>
                      <CardDescription>Products by category</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <CategoryDistributionChart data={ProductData?.categoryDistribution || []} />
                    </CardContent>
                  </Card>
                </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <AreaChartCard
          title="Revenue Overview"
          description="Monthly revenue trends"
          data={data.chartData.salesByMonth}
          areaKey="value"
          areaName="Revenue"
          areaColor="#8b5cf6"
          lineKey="value"
          lineName="Units Sold"
          lineColor="#06b6d4"
          xAxisKey="date"
          yAxisFormatter={(value) => `Tk. ${value.toLocaleString()}`}
          className="lg:col-span-2"
        />

        {/* Products by Department */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Products by Department</CardTitle>
            <CardDescription>Distribution across departments</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.chartData.productsByDepartment}
                  dataKey="_count"
                  nameKey="departmentId"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) =>
                    `${Math.round((entry._count / data.chartData.productsByDepartment.reduce((sum, item) => sum + item._count, 0)) * 100)}%`
                  }
                  labelLine={false}
                >
                  {data.chartData.productsByDepartment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [value, "Products"]}
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "0.375rem",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  }}
                />
                <Legend formatter={(value, entry, index) => `Department ${index + 1}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
{/* Department and Brand Performance */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard
          title="Department Performance"
          description="Products and sales by department"
          data={data.chartData.salesByMonth.map((item, index) => ({
            name: `Dept ${index + 1}`,
            products: Math.floor(Math.random() * 100) + 20,
            sales: Math.floor(Math.random() * 200) + 50,
          }))}
          dataKeys={[
            { key: "products", name: "Products", color: "#8b5cf6" },
            { key: "sales", name: "Sales", color: "#06b6d4" },
          ]}
          xAxisKey="name"
        />

        <BarChartCard
          title="Brand Performance"
          description="Top performing brands"
          data={data.chartData.salesByMonth.map((item, index) => ({
            name: `Brand ${index + 1}`,
            revenue: Math.floor(Math.random() * 10000) + 5000,
          }))}
          dataKeys={[{ key: "revenue", name: "Revenue", color: "#8b5cf6" }]}
          xAxisKey="name"
          yAxisFormatter={(value) => `Tk. ${value.toLocaleString()}`}
        />
      </div>
      

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {additionalMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest transactions across the platform</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data.recentOrders}
            columns={[
              {
                key: "orderNumber",
                title: "Order",
                render: (order) => <div className="font-medium">{order.orderNumber}</div>,
              },
              {
                key: "customerName",
                title: "Customer",
              },
              {
                key: "amount",
                title: "Amount",
                render: (order) => formatCurrency(order.amount),
                className: "text-right",
              },
              {
                key: "status",
                title: "Status",
                render: (order) => <StatusBadge status={order.status} />,
              },
              {
                key: "paymentStatus",
                title: "Payment",
                render: (order) => <StatusBadge status={order.paymentStatus} />,
              },
              {
                key: "date",
                title: "Date",
                render: (order) => formatDate(order.date),
              },
            ]}
          />
        </CardContent>
      </Card>

      

      {/* Top Products and Vendors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={product.imageUrl || "/placeholder.svg?height=48&width=48"} alt={product.title} />
                    <AvatarFallback>{product.title[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(product.price)} · {product.salesCount} sales
                    </p>
                  </div>
                  <div className="flex items-center text-sm font-medium text-emerald-600">
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                    {Math.round(Math.random() * 20 + 5)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Vendors</CardTitle>
            <CardDescription>Best performing vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.topVendors.map((vendor) => (
                <div key={vendor.id} className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={vendor.logo || "/placeholder.svg?height=48&width=48"} alt={vendor.storeName} />
                    <AvatarFallback>{vendor.storeName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{vendor.storeName}</p>
                    <p className="text-sm text-muted-foreground">
                      {vendor.productCount} products · {formatCurrency(vendor.salesValue)}
                    </p>
                  </div>
                  <Progress
                    value={Math.min((vendor.salesValue / (data.topVendors[0].salesValue || 1)) * 100, 100)}
                    className="h-2 w-24"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AdminDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Skeleton className="h-10 w-full md:w-[240px]" />
          <Skeleton className="h-10 w-full sm:w-[100px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[350px] w-full rounded-lg lg:col-span-2" />
        <Skeleton className="h-[350px] w-full rounded-lg lg:col-span-1" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
          ))}
      </div>

      <Skeleton className="h-[400px] w-full rounded-lg" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[350px] w-full rounded-lg" />
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[350px] w-full rounded-lg" />
          ))}
      </div>
    </div>
  )
}