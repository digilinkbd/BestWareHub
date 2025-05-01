"use client"

import { useState } from "react"
import { OrderStatus } from "@prisma/client"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Package, RefreshCw } from "lucide-react"
import Image from "next/image"
import { OrderSkeleton } from "./OrderSkeleton"
import { UpdateOrderStatusDialog } from "../Forms/UpdateOrderStatusDialog"

interface OrdersListProps {
  orders: any[]
  isLoading: boolean
  onOrderClick: (orderId: string) => void
  isAdmin?: boolean
  updateOrderStatus?: (orderId: string, status: OrderStatus) => Promise<void>
  isUpdating?: boolean
}

export function OrdersList({
  orders,
  isLoading,
  onOrderClick,
  isAdmin = false,
  
}: OrdersListProps) {
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<string | null>(null)
  const statusColors = {
    [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    [OrderStatus.PROCESSING]: "bg-blue-100 text-blue-800",
    [OrderStatus.SHIPPED]: "bg-purple-100 text-purple-800",
    [OrderStatus.DELIVERED]: "bg-green-100 text-green-800",
    [OrderStatus.CANCELED]: "bg-red-100 text-red-800",
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const handleUpdateStatus = (orderId: string) => {
    setSelectedOrderForStatus(orderId)
  }

  const handleCloseStatusDialog = () => {
    setSelectedOrderForStatus(null)
  }

  const getSelectedOrder = () => {
    return orders.find((order) => order.id === selectedOrderForStatus)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <OrderSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-16 w-16 text-yellow-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  const selectedOrder = getSelectedOrder()

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <motion.div
          key={order.id}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
         <Card
  className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-l-4"
  style={{
    borderLeftColor:
      {
        [OrderStatus.PENDING]: "#facc15",
        [OrderStatus.PROCESSING]: "#2563eb",
        [OrderStatus.SHIPPED]: "#9333ea",
        [OrderStatus.DELIVERED]: "#16a34a",
        [OrderStatus.CANCELED]: "#dc2626",
      }[order.orderStatus as OrderStatus] || "#e5e7eb", 
  }}
>  

            <CardContent className="p-0">
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Order Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{order.orderNumber}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${statusColors[order.orderStatus as keyof typeof statusColors]}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Placed on {format(new Date(order.createdAt), "MMM d, yyyy")}</p>
                  <p className="text-sm text-gray-500">
                    {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* User/Customer Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {order.user.image ? (
                      <div className="relative w-6 h-6 rounded-full overflow-hidden">
                        <Image
                          src={order.user.image || "/placeholder.jpg"}
                          alt={order.user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                        <span className="text-xs text-yellow-800">{order.user.name?.[0] || "U"}</span>
                      </div>
                    )}
                    <p className="font-medium">{order.name}</p>
                  </div>
                  <p className="text-sm text-gray-500">{order.email}</p>
                  <p className="text-sm text-gray-500">{order.phone}</p>
                </div>

                {/* Payment Info */}
                <div className="space-y-2">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Payment</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${order.totalOrderAmount.toFixed(2)}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${statusColors[order.orderStatus as keyof typeof statusColors]}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">via {order.paymentMethod}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2">
                  {isAdmin && (
                    <Button
                      onClick={() => handleUpdateStatus(order.id)}
                      variant="outline"
                      className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Update Status
                    </Button>
                  )}
                  <Button
                    onClick={() => onOrderClick(order.id)}
                    className="bg-[#1d4ed8] hover:bg-yellow-600 text-white"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Order
                  </Button>
                </div>
              </div>

              {/* Preview of order items */}
              <div className="bg-gray-50 p-4 border-t border-gray-100">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {order.orderItems.slice(0, 5).map((item: any) => (
                    <div key={item.id} className="flex-shrink-0">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-200">
                        {item.product?.imageUrl ? (
                          <Image
                            src={item.product.imageUrl || "/placeholder.svg"}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {order.orderItems.length > 5 && (
                    <div className="flex-shrink-0 w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                      <span className="text-xs text-gray-600">+{order.orderItems.length - 5}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {selectedOrder  && (
        <UpdateOrderStatusDialog
          isOpen={!!selectedOrderForStatus}
          onClose={handleCloseStatusDialog}
          currentStatus={selectedOrder.orderStatus}
          orderId={selectedOrder.id}
          orderNumber={selectedOrder.orderNumber}
        />
      )}
    </div>
  )
}

