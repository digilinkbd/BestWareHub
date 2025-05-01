"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Clock, Package, ShoppingBag, ShoppingCart, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricCard } from "./MetricCard"
import { dateFilterOptions } from "@/lib/date-utils"
import { ChartContainer, LineChartComponent, ChartLine } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserDashboardStats } from "@/hooks/useDashboard"

export default function UserDashboard({ userName, userId }: { userName: string; userId: string }) {
  const [dateRange, setDateRange] = useState<string>("all")
  const { data, isLoading } = useUserDashboardStats(userId, dateRange)

  if (isLoading || !data) {
    return <UserDashboardSkeleton />
  }

  const metrics = [
    {
      title: "Total Orders",
      value: data.metrics.totalOrders,
      icon: ShoppingBag,
      description: "Total orders placed",
      trend: 5,
      variant: "vendor",
    },
    {
      title: "Completed Orders",
      value: data.metrics.completedOrders,
      icon: Package,
      description: "Successfully delivered",
      trend: 8,
      variant: "vendor",
    },
    {
      title: "Pending Orders",
      value: data.metrics.pendingOrders,
      icon: Clock,
      description: "In progress",
      trend: -2,
      variant: "vendor",
    },
    {
      title: "Total Spent",
      value: data.metrics.totalSpent,
      icon: ShoppingCart,
      description: "Lifetime spending",
      trend: 12,
      prefix: "$",
      variant: "vendor",
    },
  ]

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, {userName}!</h1>
          <p className="text-muted-foreground">Track your orders and shopping history</p>
        </div>

        <div className="flex justify-end">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Spending Chart */}
          <Card className="lg:col-span-8">
            <CardHeader>
              <CardTitle>Spending Overview</CardTitle>
              <CardDescription>Your spending patterns over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer>
                <LineChartComponent data={data.chartData.spendingByMonth} xAxisKey="date" showGrid={true}>
                  <ChartLine type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChartComponent>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
              <CardDescription>Current order progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Pending</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{data.metrics.pendingOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Shipped</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {data.metrics.totalOrders - data.metrics.completedOrders - data.metrics.pendingOrders}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Delivered</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{data.metrics.completedOrders}</span>
                </div>
                <Progress value={(data.metrics.completedOrders / data.metrics.totalOrders) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest purchases and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {data.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.jpg" alt={order.firstItem?.title} />
                        <AvatarFallback>P</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.amount)}</p>
                        <Badge variant="outline" className="mt-1">
                          {order.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function UserDashboardSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-[180px]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
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
                  <div key={i} className="flex items-center justify-between mb-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              <Skeleton className="h-2 w-full mt-4" />
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
                <Skeleton key={i} className="h-20 w-full mb-4" />
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

