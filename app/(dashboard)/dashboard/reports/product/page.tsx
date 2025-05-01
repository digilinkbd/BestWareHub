"use client"

import type React from "react"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  DollarSign,
  Filter,
  Package,
  PackageX,
  ShoppingBag,
  TrendingUp,
} from "lucide-react"
import {
  Area,
  Bar,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  AreaChart,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DateRangeFilter } from "@/types/types"
import { getProductAnalytics } from "@/actions/product-reports"



export default function ProductAnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRangeFilter>("month")

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["productAnalytics", dateRange],
    queryFn: async () => {
      const data = await getProductAnalytics({ dateRange })
      return data
    },
  })

  const handleDateRangeChange = (value: string) => {
    setDateRange(value as DateRangeFilter)
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Product Analytics</h1>
          <p className="text-muted-foreground text-base">Comprehensive insights into your product performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <MetricsCardsSkeleton />
      ) : error ? (
        <div className="text-center p-8 text-red-500">Failed to load analytics data</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Products"
              value={data?.overview.totalProducts || 0}
              icon={<Package className="h-5 w-5 text-primary" />}
              description="Total active products"
              trend={data?.overview.productsTrend || 0}
            />
            <MetricCard
              title="Total Sales"
              value={data?.overview.totalSales || 0}
              icon={<ShoppingBag className="h-5 w-5 text-indigo-500" />}
              description="Products sold"
              trend={data?.overview.salesTrend || 0}
              prefix=""
            />
            <MetricCard
              title="Revenue"
              value={data?.overview.totalRevenue || 0}
              icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
              description="From product sales"
              trend={data?.overview.revenueTrend || 0}
              prefix="$"
            />
            <MetricCard
              title="Out of Stock"
              value={data?.overview.outOfStockCount || 0}
              icon={<PackageX className="h-5 w-5 text-rose-500" />}
              description="Products needing restock"
              trend={0}
              prefix=""
              trendHidden
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Product sales over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <SalesTrendChart data={data?.salesTrend || []} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Products by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <CategoryDistributionChart data={data?.categoryDistribution || []} />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="top-selling">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="top-selling">Top Selling</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
                <TabsTrigger value="by-vendor">By Vendor</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="top-selling" className="space-y-4">
              <TopSellingProductsTable products={data?.topSellingProducts || []} />
            </TabsContent>

            <TabsContent value="trending" className="space-y-4">
              <TrendingProductsTable products={data?.trendingProducts || []} />
            </TabsContent>

            <TabsContent value="low-stock" className="space-y-4">
              <LowStockProductsTable products={data?.lowStockProducts || []} />
            </TabsContent>

            <TabsContent value="by-vendor" className="space-y-4">
              <VendorProductsTable vendors={data?.vendorProducts || []} />
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Products and sales by department</CardDescription>
              </CardHeader>
              <CardContent>
                <DepartmentPerformanceChart data={data?.departmentPerformance || []} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Brand Performance</CardTitle>
                <CardDescription>Top performing brands</CardDescription>
              </CardHeader>
              <CardContent>
                <BrandPerformanceChart data={data?.brandPerformance || []} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon,
  description,
  trend,
  prefix = "",
  trendHidden = false,
}: {
  title: string
  value: number
  icon: React.ReactNode
  description: string
  trend: number
  prefix?: string
  trendHidden?: boolean
}) {
  const formattedValue =
    typeof value === "number"
      ? value >= 1000
        ? `${prefix}${(value / 1000).toFixed(1)}k`
        : `${prefix}${value.toLocaleString()}`
      : `${prefix}0`

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline">
              <h2 className="text-xl font-bold">{formattedValue}</h2>
              {!trendHidden && (
                <div className={`ml-2 flex items-center text-sm ${trend >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  {trend >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                  {Math.abs(trend)}%
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="p-2 rounded-full bg-primary/10">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function MetricsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

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
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          tick={{ fontSize: 12 }}
          dx={-10}
        />
        <Tooltip
          formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
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

function TopSellingProductsTable({ products }: { products: any[] }) {
  if (!products.length) {
    return <div className="text-center p-8">No data available</div>
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Units Sold</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">{product.unitsSold}</TableCell>
              <TableCell className="text-right">${product.revenue.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function TrendingProductsTable({ products }: { products: any[] }) {
  if (!products.length) {
    return <div className="text-center p-8">No data available</div>
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Growth</TableHead>
            <TableHead>Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <span className={product.growth >= 0 ? "text-emerald-500" : "text-rose-500"}>
                  {product.growth >= 0 ? "+" : ""}
                  {product.growth}%
                </span>
              </TableCell>
              <TableCell>
                <TrendingUp className={`h-4 w-4 ${product.growth >= 0 ? "text-emerald-500" : "text-rose-500"}`} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function LowStockProductsTable({ products }: { products: any[] }) {
  if (!products.length) {
    return <div className="text-center p-8">No data available</div>
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Current Stock</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">{product.stock}</TableCell>
              <TableCell>
              <span
  className={
    product.stock === 0
      ? "bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium"
      : "bg-yellow-500 text-black px-2 py-1 rounded-md text-xs font-medium"
  }
>
  {product.stock === 0 ? "Out of Stock" : "Low Stock"}
</span>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function VendorProductsTable({ vendors }: { vendors: any[] }) {
  if (!vendors.length) {
    return <div className="text-center p-8">No data available</div>
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor</TableHead>
            <TableHead className="text-right">Total Products</TableHead>
            <TableHead className="text-right">Active Products</TableHead>
            <TableHead className="text-right">Total Sales</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell className="font-medium">{vendor.name}</TableCell>
              <TableCell className="text-right">{vendor.totalProducts}</TableCell>
              <TableCell className="text-right">{vendor.activeProducts}</TableCell>
              <TableCell className="text-right">{vendor.totalSales}</TableCell>
              <TableCell className="text-right">${vendor.revenue.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function DepartmentPerformanceChart({ data }: { data: any[] }) {
  if (!data.length) {
    return <div className="flex items-center justify-center h-full">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} dy={10} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} dx={-10} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "0.375rem",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        />
        <Legend />
        <Bar dataKey="products" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Products" />
        <Bar dataKey="sales" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Sales" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function BrandPerformanceChart({ data }: { data: any[] }) {
  if (!data.length) {
    return <div className="flex items-center justify-center h-full">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} dy={10} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          tick={{ fontSize: 12 }}
          dx={-10}
        />
        <Tooltip
          formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "0.375rem",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        />
        <Legend />
        <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Revenue" />
      </BarChart>
    </ResponsiveContainer>
  )
}

