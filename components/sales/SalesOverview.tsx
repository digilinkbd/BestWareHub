"use client"

import { motion } from "framer-motion"
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  PercentCircle,
  Users,
  CreditCard,
  Wallet2,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type SalesOverviewProps = {
  data: {
    totalSalesAmount: number
    totalSalesCount: number
    totalCommission: number
    topVendors: any[]
  }
  userRole: "admin" | "vendor"
}

const statsConfig = {
  totalSales: { icon: DollarSign, color: "#1D4ED8" },
  totalOrders: { icon: ShoppingCart, color: "#EAB308" }, 
  totalCommission: { icon: CreditCard, color: "#16A34A" },
  avgOrderValue: { icon: TrendingUp, color: "#F43F5E" }, 
  activeVendors: { icon: Users, color: "#9333EA" },
}

export function SalesOverview({ data, userRole }: SalesOverviewProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  const StatCard = ({
    title,
    value,
    description,
    config,
  }: {
    title: string
    value: string | number
    description: string
    config: { icon: any; color: string }
  }) => {
    const Icon = config.icon

    return (
      <motion.div variants={item}>
        <Card className="bg-white border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-800">{title}</CardTitle>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
              style={{ backgroundColor: `${config.color}20` }} 
            >
              <Icon
                className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                style={{ color: config.color }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <p className="text-xs text-gray-600 mt-1">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <StatCard
        title="Total Sales"
        value={`Tk. ${data.totalSalesAmount.toFixed(2)}`}
        description={`From ${data.totalSalesCount} orders`}
        config={statsConfig.totalSales}
      />

      <StatCard
        title="Total Orders"
        value={data.totalSalesCount}
        description="Completed orders"
        config={statsConfig.totalOrders}
      />

      {userRole === "admin" ? (
        <StatCard
          title="Total Commission"
          value={`Tk. ${data.totalCommission.toFixed(2)}`}
          description="Platform earnings"
          config={statsConfig.totalCommission}
        />
      ) : (
        <StatCard
          title="Average Order Value"
          value={`Tk. ${data.totalSalesCount > 0 ? (data.totalSalesAmount / data.totalSalesCount).toFixed(2) : "0.00"}`}
          description="Per order"
          config={statsConfig.avgOrderValue}
        />
      )}

      {userRole === "admin" && (
        <StatCard
          title="Active Vendors"
          value={data.topVendors.length}
          description="With recent sales"
          config={statsConfig.activeVendors}
        />
      )}
    </motion.div>
  )
}
