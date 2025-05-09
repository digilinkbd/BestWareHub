"use client"

import type React from "react"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Calendar,
  Check,
  ChevronDown,
  DollarSign,
  Edit,
  Package,
  PackageCheck,
  PackageX,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DateRangeFilter } from "@/types/types"
import { getInventoryData } from "@/actions/inventory"



export default function InventoryDashboard() {
  const [dateRange, setDateRange] = useState<DateRangeFilter>("month")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["inventoryData", dateRange, selectedCategory],
    queryFn: async () => {
      const data = await getInventoryData({
        dateRange,
        categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
      })
      return data
    },
  })

  const handleDateRangeChange = (value: string) => {
    setDateRange(value as DateRangeFilter)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
  }

  const filteredProducts =
    data?.products?.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground text-base">Track and manage your product inventory</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 w-full md:w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[150px]">
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
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <InventoryDashboardSkeleton />
      ) : error ? (
        <div className="text-center p-8 text-red-500">Failed to load inventory data</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Products"
              value={data?.overview.totalProducts || 0}
              icon={<Package className="h-5 w-5 text-primary" />}
              description="Products in inventory"
              trend={data?.overview.productsTrend || 0}
            />
            <MetricCard
              title="Low Stock Items"
              value={data?.overview.lowStockCount || 0}
              icon={<PackageX className="h-5 w-5 text-amber-500" />}
              description="Products below threshold"
              trend={data?.overview.lowStockTrend || 0}
              trendInverted
            />
            <MetricCard
              title="Inventory Value"
              value={data?.overview.inventoryValue || 0}
              icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
              description="Total value of inventory"
              trend={data?.overview.valueTrend || 0}
              prefix="Tk."
            />
            <MetricCard
              title="Out of Stock"
              value={data?.overview.outOfStockCount || 0}
              icon={<AlertCircle className="h-5 w-5 text-rose-500" />}
              description="Products needing restock"
              trend={data?.overview.outOfStockTrend || 0}
              trendInverted
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Inventory Value Trend</CardTitle>
                    <CardDescription>Value of inventory over time</CardDescription>
                  </div>
                  <Select defaultValue="value" disabled>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="value">Value</SelectItem>
                      <SelectItem value="quantity">Quantity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="h-[300px]">
                <InventoryValueChart data={data?.inventoryValueTrend || []} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Stock Status</CardTitle>
                <CardDescription>Distribution of product stock levels</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <StockStatusChart data={data?.stockStatusDistribution || []} />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all-products">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all-products">All Products</TabsTrigger>
                <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
                <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
                {data?.isAdmin && <TabsTrigger value="vendor-performance">Vendor Performance</TabsTrigger>}
              </TabsList>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {data?.categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="all-products" className="space-y-4">
              <ProductsTable products={filteredProducts} isAdmin={data?.isAdmin || false} onRefresh={() => refetch()} />
            </TabsContent>

            <TabsContent value="low-stock" className="space-y-4">
              <LowStockTable
                products={data?.lowStockProducts || []}
                isAdmin={data?.isAdmin || false}
                onRefresh={() => refetch()}
              />
            </TabsContent>

            <TabsContent value="out-of-stock" className="space-y-4">
              <OutOfStockTable
                products={data?.outOfStockProducts || []}
                isAdmin={data?.isAdmin || false}
                onRefresh={() => refetch()}
              />
            </TabsContent>

            {data?.isAdmin && (
              <TabsContent value="vendor-performance" className="space-y-4">
                <VendorPerformanceTable vendors={data?.vendorPerformance || []} />
              </TabsContent>
            )}
          </Tabs>

          {data?.isAdmin && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Vendors by Products</CardTitle>
                  <CardDescription>Vendors with the most products</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <TopVendorsChart data={data?.topVendorsByProducts || []} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Vendors by Sales</CardTitle>
                  <CardDescription>Vendors with the highest sales</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <TopVendorsBySalesChart data={data?.topVendorsBySales || []} />
                </CardContent>
              </Card>
            </div>
          )}

          {!data?.isAdmin && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Products by category</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <CategoryDistributionChart data={data?.categoryDistribution || []} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Profit Margin by Product</CardTitle>
                  <CardDescription>Top products by profit margin</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ProfitMarginChart data={data?.profitMarginByProduct || []} />
                </CardContent>
              </Card>
            </div>
          )}
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
  trendInverted = false,
}: {
  title: string
  value: number
  icon: React.ReactNode
  description: string
  trend: number
  prefix?: string
  trendHidden?: boolean
  trendInverted?: boolean
}) {
  const formattedValue =
    typeof value === "number"
      ? value >= 1000
        ? `${prefix}${(value / 1000).toFixed(1)}k`
        : `${prefix}${value.toLocaleString()}`
      : `${prefix}0`

  // For metrics like "Low Stock" or "Out of Stock", a decrease is actually good
  const isTrendPositive = trendInverted ? trend <= 0 : trend >= 0

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline">
              <h2 className="text-xl font-bold">{formattedValue}</h2>
              {!trendHidden && (
                <div
                  className={`ml-2 flex items-center text-sm ${isTrendPositive ? "text-emerald-500" : "text-rose-500"}`}
                >
                  {trend > 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
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

function InventoryDashboardSkeleton() {
  return (
    <>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6 lg:col-span-2">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-6" />
          <Skeleton className="h-[300px] w-full" />
        </div>
        <div className="border rounded-lg p-6">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-6" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-4">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    </>
  )
}

function InventoryValueChart({ data }: { data: any[] }) {
  if (!data.length) {
    return <div className="flex items-center justify-center h-full">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
          formatter={(value: number) => [`Tk. ${value.toLocaleString()}`, "Value"]}
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
          dataKey="value"
          stroke="#8b5cf6"
          fillOpacity={1}
          fill="url(#colorValue)"
          name="Inventory Value"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function StockStatusChart({ data }: { data: any[] }) {
  if (!data.length) {
    return <div className="flex items-center justify-center h-full">No data available</div>
  }

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
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
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

function ProductsTable({
  products,
  isAdmin,
  onRefresh,
}: {
  products: any[]
  isAdmin: boolean
  onRefresh: () => void
}) {
  if (!products.length) {
    return <div className="text-center p-8">No products found</div>
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead>Status</TableHead>
            {isAdmin && <TableHead>Vendor</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="w-10 h-10 relative rounded-md overflow-hidden">
                  <Image
                    src={product.imageUrl || "/placeholder.jpg"}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>{product.sku || "N/A"}</TableCell>
              <TableCell className="text-right">${product.productPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span
                    className={
                      product.productStock === 0
                        ? "text-red-500"
                        : product.productStock <= product.lowStockAlert
                          ? "text-amber-500"
                          : "text-green-500"
                    }
                  >
                    {product.productStock}
                  </span>
                  <UpdateStockDialog product={product} onSuccess={onRefresh} />
                </div>
              </TableCell>
              <TableCell>
              <span
  className={`px-2 py-1 rounded-md text-xs font-medium ${
    product.productStock === 0
      ? "bg-red-500 text-white" // Out of Stock (Destructive)
      : product.productStock <= product.lowStockAlert
        ? "bg-yellow-500 text-black" // Low Stock (Warning)
        : "bg-green-500 text-white" // In Stock (Success)
  }`}
>
  {product.productStock === 0
    ? "Out of Stock"
    : product.productStock <= product.lowStockAlert
      ? "Low Stock"
      : "In Stock"}
</span>

              </TableCell>
              {isAdmin && (
                <TableCell>
                  {product.vendor ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={product.vendor.image || ""} />
                        <AvatarFallback>{product.vendor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{product.vendor.name}</span>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
              )}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/products/update/${product.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Product
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UpdateStockDialog
                        product={product}
                        onSuccess={onRefresh}
                        trigger={
                          <div className="flex items-center">
                            <PackageCheck className="mr-2 h-4 w-4" />
                            Update Stock
                          </div>
                        }
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function LowStockTable({
  products,
  isAdmin,
  onRefresh,
}: {
  products: any[]
  isAdmin: boolean
  onRefresh: () => void
}) {
  if (!products.length) {
    return <div className="text-center p-8">No low stock products found</div>
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Current Stock</TableHead>
            <TableHead className="text-right">Alert Threshold</TableHead>
            {isAdmin && <TableHead>Vendor</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="w-10 h-10 relative rounded-md overflow-hidden">
                  <Image
                    src={product.imageUrl || "/placeholder.svg?height=40&width=40"}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>{product.sku || "N/A"}</TableCell>
              <TableCell className="text-right">${product.productPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right text-amber-500">{product.productStock}</TableCell>
              <TableCell className="text-right">{product.lowStockAlert}</TableCell>
              {isAdmin && (
                <TableCell>
                  {product.vendor ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={product.vendor.image || ""} />
                        <AvatarFallback>{product.vendor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{product.vendor.name}</span>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
              )}
              <TableCell className="text-right">
                <UpdateStockDialog product={product} onSuccess={onRefresh} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function OutOfStockTable({
  products,
  isAdmin,
  onRefresh,
}: {
  products: any[]
  isAdmin: boolean
  onRefresh: () => void
}) {
  if (!products.length) {
    return <div className="text-center p-8">No out of stock products found</div>
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Price</TableHead>
            {isAdmin && <TableHead>Vendor</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="w-10 h-10 relative rounded-md overflow-hidden">
                  <Image
                    src={product.imageUrl || "/placeholder.svg?height=40&width=40"}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>{product.sku || "N/A"}</TableCell>
              <TableCell className="text-right">${product.productPrice.toFixed(2)}</TableCell>
              {isAdmin && (
                <TableCell>
                  {product.vendor ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={product.vendor.image || ""} />
                        <AvatarFallback>{product.vendor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{product.vendor.name}</span>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
              )}
              <TableCell className="text-right">
                <UpdateStockDialog product={product} onSuccess={onRefresh} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function VendorPerformanceTable({ vendors }: { vendors: any[] }) {
  if (!vendors.length) {
    return <div className="text-center p-8">No vendor data available</div>
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor</TableHead>
            <TableHead className="text-right">Total Products</TableHead>
            <TableHead className="text-right">Active Products</TableHead>
            <TableHead className="text-right">Low Stock</TableHead>
            <TableHead className="text-right">Out of Stock</TableHead>
            <TableHead className="text-right">Inventory Value</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={vendor.image || ""} />
                    <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{vendor.name}</p>
                    <p className="text-xs text-muted-foreground">{vendor.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">{vendor.totalProducts}</TableCell>
              <TableCell className="text-right">{vendor.activeProducts}</TableCell>
              <TableCell className="text-right">{vendor.lowStockCount}</TableCell>
              <TableCell className="text-right">{vendor.outOfStockCount}</TableCell>
              <TableCell className="text-right">${vendor.inventoryValue.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/vendors/${vendor.id}`}>View Details</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function TopVendorsChart({ data }: { data: any[] }) {
  if (!data.length) {
    return <div className="flex items-center justify-center h-full">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={100} />
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
        <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Products" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function TopVendorsBySalesChart({ data }: { data: any[] }) {
  if (!data.length) {
    return <div className="flex items-center justify-center h-full">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `Tk. ${value.toLocaleString()}`}
        />
        <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={100} />
        <Tooltip
          formatter={(value: number) => [`Tk. ${value.toLocaleString()}`, "Sales"]}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "0.375rem",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        />
        <Legend />
        <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} name="Sales" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function CategoryDistributionChart({ data }: { data: any[] }) {
  if (!data.length) {
    return <div className="flex items-center justify-center h-full">No data available</div>
  }

  const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
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
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

function ProfitMarginChart({ data }: { data: any[] }) {
  if (!data.length) {
    return <div className="flex items-center justify-center h-full">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${value}%`}
        />
        <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={120} />
        <Tooltip
          formatter={(value: number) => [`${value}%`, "Profit Margin"]}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "0.375rem",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        />
        <Legend />
        <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} name="Profit Margin" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function UpdateStockDialog({
  product,
  onSuccess,
  trigger,
}: {
  product: any
  onSuccess: () => void
  trigger?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState(product.productStock || 0)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateStock = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be a server action to update the stock
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate success
      setIsLoading(false)
      setOpen(false)
      onSuccess()
    } catch (error) {
      console.error("Failed to update stock:", error)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Update
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Stock Quantity</DialogTitle>
          <DialogDescription>Update the stock quantity for {product.title}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative rounded-md overflow-hidden">
              <Image
                src={product.imageUrl || "/placeholder.svg?height=64&width=64"}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{product.title}</h3>
              <p className="text-sm text-muted-foreground">SKU: {product.sku || "N/A"}</p>
              <p className="text-sm text-muted-foreground">Current Stock: {product.productStock}</p>
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="quantity" className="text-sm font-medium">
              New Quantity
            </label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateStock} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Update Stock
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

