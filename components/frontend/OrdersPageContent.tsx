// app/dashboard/orders/components/orders-page-content.tsx
"use client"

import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { UserRole, OrderStatus, PaymentStatus } from "@prisma/client";
import { OrdersList } from "./orders-list";
import { motion } from "framer-motion";
import { OrdersPagination } from "./OrdersPagination";
import { OrdersFilters } from "./orders-filters";
import { OrderModal } from "./order-modal";
import toast from "react-hot-toast";

type OrdersPageContentProps = {
  userId: string;
  isAdmin: boolean | undefined;
}

export function OrdersPageContent({ userId, isAdmin }: OrdersPageContentProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  const {
    orders,
    pagination,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
  } = useOrders(userId, isAdmin);

  const handleOrderClick = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseModal = () => {
    setSelectedOrderId(null);
  };
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const orderModal = document.getElementById("order-modal")
      if (!orderModal) {
        throw new Error("Order modal not found")
      }

      const orderDetails = orderModal.getAttribute("data-order-details")
      if (!orderDetails) {
        throw new Error("Order details not found")
      }

      const { updateOrderStatus } = JSON.parse(orderDetails)
      if (!updateOrderStatus) {
        throw new Error("updateOrderStatus function not found")
      }

      await updateOrderStatus(orderId, status)

      toast.success(`Order status has been updated to ${status}`)

    } catch (error) {
      toast.error("Failed to update order status")
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <OrdersFilters 
        filters={filters} 
        updateFilters={updateFilters} 
        resetFilters={resetFilters} 
        isAdmin={isAdmin}
      />
      
      {error ? (
        <div className="bg-red-50 p-4 rounded-lg text-red-700">
          Error loading orders: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      ) : (
        <>
          <OrdersList 
            orders={orders} 
            isLoading={isLoading} 
            onOrderClick={handleOrderClick}
            isAdmin
            updateOrderStatus={handleUpdateOrderStatus}
          />
          
          <OrdersPagination 
            currentPage={pagination?.page || 1}
            totalPages={pagination?.pages || 1}
            onPageChange={(page) => updateFilters({ page })}
          />
        </>
      )}

      {selectedOrderId && (
        <OrderModal 
          orderId={selectedOrderId} 
          isOpen={!!selectedOrderId} 
          onClose={handleCloseModal}
          isAdmin={isAdmin}
        />
      )}
    </motion.div>
  );
}