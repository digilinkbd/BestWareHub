"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Box, Download, ShoppingBag, Star, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { MetricCard } from "./MetricCard"
import { dateFilterOptions } from "@/lib/date-utils"
import { ChartContainer, LineChartComponent, ChartLine } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useVendorDashboardStats } from "@/hooks/useDashboard"

export default function VendorDashboard({ userName, vendorId }: { userName: string; vendorId: string }) {
  const [dateRange, setDateRange] = useState<string>("all")
  const { data, isLoading , error } = useVendorDashboardStats(vendorId, dateRange)
  console.log(data , error , "this is vendor")
  if (isLoading || !data) {
    return <VendorDashboardSkeleton />
  }


  const metrics = [
    {
      title: "Total Revenue",
      value: data.metrics.totalRevenue,
      icon: TrendingUp,
      description: "Total revenue across all sales",
      trend: 12,
      prefix: "$",
      variant: "Vendor" as const,
    },
    {
      title: "Active Products",
      value: data.metrics.activeProducts,
      icon: Box,
      description: "Products in your store",
      trend: 12.1,
      variant: "vendor",
    },
    {
      title: "Total Sales",
      value: data.metrics.totalSales,
      icon: ShoppingBag,
      description: "Total orders received",
      trend: 5.3,
      variant: "vendor",
    },
    {
      title: "Low Stock",
      value: data.metrics.lowStockProducts,
      icon: Star,
      description: "Products low in stock",
      trend: -2,
      trendInverted: true,
      variant: "vendor",
    },
  ]
  
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

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome, {userName}</h1>
            <p className="text-muted-foreground">
              {data.metrics.isVerified ? "Verified Vendor" : "Pending Verification"} · {data.metrics.storeName}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select period" />
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
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Sales Chart */}
          <Card className="lg:col-span-8">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Your sales performance over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer>
                <LineChartComponent data={data.chartData.salesByMonth} xAxisKey="date" showGrid={true}>
                  <ChartLine type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChartComponent>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Product Performance */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best performing products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.topProducts.map((product, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.salesCount} sales · {formatCurrency(product.price)}
                      </p>
                    </div>
                    <div className="font-medium">
                      {Math.round((product.salesCount / data.metrics.totalSales) * 100)}%
                    </div>
                  </div>
                  <Progress value={(product.salesCount / data.metrics.totalSales) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <BarChart3 className="mr-2 h-4 w-4" />
                View All Products
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest orders and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden md:table-cell">Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.productName}</TableCell>
                    <TableCell className="hidden md:table-cell">{order.quantity}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-800"
                            : order.status === "SHIPPED"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "PROCESSING"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Orders
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function VendorDashboardSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[140px]" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-24 mt-2" />
                </CardContent>
              </Card>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          <Card className="lg:col-span-8">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>

          <Card className="lg:col-span-4">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2 mb-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-12 w-full mb-2" />
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

