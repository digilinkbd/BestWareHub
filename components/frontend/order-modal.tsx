"use client"

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Loader2 } from 'lucide-react';
import { format } from "date-fns";
import { useOrderDetails } from "@/hooks/useOrders";

type OrderModalProps = {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean | undefined;
};

export function OrderModal({ orderId, isOpen, onClose, isAdmin }: OrderModalProps) {
  const { orderDetails, isLoading, error, updateOrderStatus } = useOrderDetails(orderId);

  const getStatusColor = (status: OrderStatus) => {
    const statusColors: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
      [OrderStatus.PROCESSING]: "bg-blue-100 text-blue-800",
      [OrderStatus.SHIPPED]: "bg-purple-100 text-purple-800",
      [OrderStatus.DELIVERED]: "bg-green-100 text-green-800",
      [OrderStatus.CANCELED]: "bg-red-100 text-red-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    const statusColors: Record<PaymentStatus, string> = {
      [PaymentStatus.PENDING]: "bg-yellow-100 text-yellow-800",
      [PaymentStatus.COMPLETED]: "bg-green-100 text-green-800",
      [PaymentStatus.FAILED]: "bg-red-100 text-red-800",
      [PaymentStatus.REFUNDED]: "bg-purple-100 text-purple-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };



  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl overflow-y-auto max-h-[90vh]">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            Failed to load order details: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : orderDetails ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold flex justify-between items-center">
                <span>Order #{orderDetails.orderNumber}</span>
                <Badge className={getStatusColor(orderDetails.orderStatus)}>
                  {orderDetails.orderStatus}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Placed on {format(new Date(orderDetails.createdAt), "MMM d, yyyy")}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                <p className="text-sm">{orderDetails.name}</p>
                <p className="text-sm">{orderDetails.email}</p>
                <p className="text-sm">{orderDetails.phone}</p>
              </div>

              {/* Shipping Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                <p className="text-sm">{orderDetails.address}</p>
                <p className="text-sm">
                  {orderDetails.city}, {orderDetails.state} {orderDetails.postalCode}
                </p>
                <p className="text-sm">{orderDetails.country}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
              <div className="bg-white border rounded-lg overflow-hidden">
                {orderDetails.orderItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center p-4 border-b last:border-b-0"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl || "/placeholder.jpg"}
                          alt={item.title}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <div className="mt-1 flex justify-between text-sm">
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-gray-500">
                          ${item.price.toFixed(2)} × {item.quantity} = ${item.total.toFixed(2)}
                        </p>
                      </div>
                      {item.attributes && (
                        <div className="mt-1 text-xs text-gray-500">
                          {Object.entries(item.attributes as Record<string, string>).map(
                            ([key, value]) => (
                              <span key={key} className="mr-2">
                                {key}: {value}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${(orderDetails.totalOrderAmount - orderDetails.taxAmount - orderDetails.shippingCost + orderDetails.discountAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${orderDetails.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${orderDetails.taxAmount.toFixed(2)}</span>
                </div>
                {orderDetails.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Discount</span>
                    <span>-${orderDetails.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${orderDetails.totalOrderAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Payment Information</h3>
                <Badge className={getPaymentStatusColor(orderDetails.paymentStatus)}>
                  {orderDetails.paymentStatus}
                </Badge>
              </div>
              <div className="mt-2 text-sm">
                <p><span className="font-medium">Method:</span> {orderDetails.paymentMethod}</p>
                {orderDetails.transactionId && (
                  <p><span className="font-medium">Transaction ID:</span> {orderDetails.transactionId}</p>
                )}
              </div>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <DialogFooter className="border-t pt-4 mt-6">
                <div className="w-full flex flex-wrap gap-2 justify-end">
                  {Object.values(OrderStatus).map((status) => (
                    <Button
                      key={status}
                      variant={orderDetails.orderStatus === status ? "default" : "outline"}
                      size="sm"
                      disabled={orderDetails.orderStatus === status}
                      className={
                        orderDetails.orderStatus === status
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : ""
                      }
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </DialogFooter>
            )}
          </>
        ) : (
          <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
            Order not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
