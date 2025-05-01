import { OrderStatus, PaymentStatus, ProductStatus, UserRole, VendorStatus } from "@prisma/client"

export interface DashboardMetric {
  title: string
  value: number | string
  icon: React.ComponentType<any>
  description: string
  trend: number
  prefix?: string
  trendHidden?: boolean
  trendInverted?: boolean
}

export interface ChartData {
  date: string
  value: number
  [key: string]: any
}

export interface RecentOrderData {
  id: string
  orderNumber: string
  customerName: string
  amount: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  date: string
}

export interface ProductTableData {
  id: string
  image: string
  name: string
  price: number
  stock: number
  sales: number
  status: ProductStatus
}

export interface VendorTableData {
  id: string
  name: string
  storeId: string
  storeName: string
  totalProducts: number
  totalSales: number
  status: VendorStatus
  joinedDate: string
}

export interface DateFilter {
  label: string
  value: string
}