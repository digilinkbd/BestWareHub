"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { X, Package, ShoppingCart, User, Calendar, DollarSign, CreditCard, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getSaleById } from "@/actions/sales"

type SaleDetailsModalProps = {
  saleId: string
  isOpen: boolean
  onClose: () => void
  userRole: "admin" | "vendor"
}

export function SaleDetailsModal({ saleId, isOpen, onClose, userRole }: SaleDetailsModalProps) {
  const [sale, setSale] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && saleId) {
      setLoading(true)
      getSaleById(saleId)
        .then((data) => {
          setSale(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Error loading sale details:", err)
          setError("Failed to load sale details")
          setLoading(false)
        })
    }
  }, [isOpen, saleId])

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "SHIPPED":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200"
      case "CANCELED":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200"
      case "REFUNDED":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-yellow-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-yellow-600" />
            Sale Details
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 rounded-full border-4 border-yellow-200 border-t-yellow-600 animate-spin"></div>
            <p className="mt-4 text-yellow-800">Loading sale details...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : sale ? (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid gap-6">
                {/* Order Info */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <h3 className="font-medium text-yellow-800 flex items-center gap-1">
                        <ShoppingCart className="w-4 h-4" />
                        Order #{sale.order.orderNumber}
                      </h3>
                      <div className="text-sm text-yellow-600 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {sale.order.createdAt ? format(new Date(sale.order.createdAt), "PPP") : "N/A"}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={getOrderStatusColor(sale.order.orderStatus)}>
                        {sale.order.orderStatus}
                      </Badge>
                      <Badge variant="outline" className={getPaymentStatusColor(sale.order.paymentStatus)}>
                        {sale.order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-800 mb-3 flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    Product Details
                  </h3>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      {sale.product.imageUrl ? (
                        <Image
                          src={sale.product.imageUrl || "/placeholder.svg"}
                          alt={sale.product.title}
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{sale.product.title}</h4>
                      <p className="text-sm text-yellow-600 mt-1">{sale.product.description?.substring(0, 100)}...</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-yellow-600" />
                          <span className="font-medium">${sale.productPrice.toFixed(2)}</span>
                        </div>
                        <div>Quantity: {sale.productQty}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Details */}
                <div className="border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-800 mb-3 flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    Financial Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-yellow-600">Subtotal:</span>
                      <span>${(sale.productPrice * sale.productQty).toFixed(2)}</span>
                    </div>
                    {userRole === "admin" && (
                      <div className="flex justify-between">
                        <span className="text-yellow-600">Commission:</span>
                        <span className="text-yellow-700">${sale.commission.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator className="my-2 bg-yellow-100" />
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>${sale.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                {sale.order.orderItems && sale.order.orderItems.length > 0 && (
                  <div className="border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-800 mb-3 flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      All Items in This Order
                    </h3>
                    <div className="space-y-3">
                      {sale.order.orderItems.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 py-2 border-b border-yellow-100 last:border-0"
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-yellow-100 flex items-center justify-center">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl || "/placeholder.svg"}
                                alt={item.title}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <Package className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs text-yellow-600">
                              ${item.price.toFixed(2)} x {item.quantity}
                            </div>
                          </div>
                          <div className="font-medium">${item.total.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vendor Info (Admin Only) */}
                {userRole === "admin" && sale.vendorId && (
                  <div className="border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-800 mb-3 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Vendor Information
                    </h3>
                    <div className="flex justify-between items-center">
                      <div>Vendor ID: {sale.vendorId}</div>
                      <Link
                        href={`/dashboard/vendors/${sale.vendorId}`}
                        className="text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md transition-colors"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                  >
                    Close
                  </Button>
                  <Link href={`/dashboard/orders/${sale.order.id}`}>
                    <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">View Full Order</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-8 text-yellow-800">No sale data found</div>
        )}
      </DialogContent>
    </Dialog>
  )
}

