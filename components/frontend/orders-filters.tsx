"use client"

import { useState } from "react";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { OrderFilter } from "@/actions/orders";
import { motion } from "framer-motion";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OrdersFiltersProps {
  filters: OrderFilter;
  updateFilters: (newFilter: Partial<OrderFilter>) => void;
  resetFilters: () => void;
  isAdmin: boolean | undefined;
}

export function OrdersFilters({ 
  filters, 
  updateFilters, 
  resetFilters, 
  isAdmin 
}: OrdersFiltersProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="text-yellow-500 h-5 w-5" />
              <h2 className="text-lg font-semibold">Order Filters</h2>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetFilters}
                className="text-sm border-yellow-500 text-yellow-700 hover:bg-yellow-50"
              >
                Reset
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setExpanded(!expanded)}
                className="text-sm border-yellow-500 text-yellow-700 hover:bg-yellow-50"
              >
                {expanded ? "Less Filters" : "More Filters"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <Select
                value={filters.dateRange || "all_time"}
                onValueChange={(value) => updateFilters({ 
                  dateRange: value === "all_time" ? undefined : value as OrderFilter["dateRange"]
                })}
              >
                <SelectTrigger className="border-gray-300 focus:ring-yellow-500 focus:border-yellow-500">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_time">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Sort */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Sort by Amount</label>
              <Select
                value={filters.amountSort || "latest"}
                onValueChange={(value) => updateFilters({ 
                  amountSort: value === "latest" ? undefined : value as OrderFilter["amountSort"]
                })}
              >
                <SelectTrigger className="border-gray-300 focus:ring-yellow-500 focus:border-yellow-500">
                  <SelectValue placeholder="Latest First" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="highest">Highest Amount</SelectItem>
                  <SelectItem value="lowest">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {expanded && (
              <>
                {/* Order Status */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Order Status</label>
                  <Select
                    value={filters.status || "all_statuses"}
                    onValueChange={(value) => updateFilters({ 
                      status: value === "all_statuses" ? undefined : value as OrderStatus
                    })}
                  >
                    <SelectTrigger className="border-gray-300 focus:ring-yellow-500 focus:border-yellow-500">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_statuses">All Statuses</SelectItem>
                      <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                      <SelectItem value={OrderStatus.PROCESSING}>Processing</SelectItem>
                      <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                      <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                      <SelectItem value={OrderStatus.CANCELED}>Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Status */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Payment Status</label>
                  <Select
                    value={filters.paymentStatus || "all_payment_statuses"}
                    onValueChange={(value) => updateFilters({ 
                      paymentStatus: value === "all_payment_statuses" ? undefined : value as PaymentStatus
                    })}
                  >
                    <SelectTrigger className="border-gray-300 focus:ring-yellow-500 focus:border-yellow-500">
                      <SelectValue placeholder="All Payment Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_payment_statuses">All Payment Statuses</SelectItem>
                      <SelectItem value={PaymentStatus.PENDING}>Pending</SelectItem>
                      <SelectItem value={PaymentStatus.COMPLETED}>Completed</SelectItem>
                      <SelectItem value={PaymentStatus.FAILED}>Failed</SelectItem>
                      <SelectItem value={PaymentStatus.REFUNDED}>Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </div>
    </motion.div>
  );
}