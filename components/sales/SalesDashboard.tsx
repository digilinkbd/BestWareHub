"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { getSalesData } from "@/actions/sales"
import { SalesSkeleton } from "./SalesSkeleton"
import { SalesFilters } from "./SalesFilters"
import { SalesOverview } from "./SalesOverview"
import { SalesTable } from "./SalesTable"
import { SaleDetailsModal } from "./SaleDetailsModal"



type DateRangeType = "today" | "week" | "month" | "year" | undefined

export function SalesDashboard({ userRole, userId }: { userRole: "admin" | "vendor"; userId: string }) {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeType>("month")
  const [selectedSale, setSelectedSale] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ["sales", selectedDateRange, userRole, userId],
    queryFn: async () => {
      try {
        return await getSalesData({
          dateRange: selectedDateRange,
          userId: userRole === "vendor" ? userId : undefined,
        })
      } catch (err) {
        console.error("Error fetching sales data:", err)
        return {
          sales: [],
          pagination: {
            total: 0,
            pages: 0,
            page: 1,
            limit: 10,
          },
          overview: {
            totalSalesAmount: 0,
            totalSalesCount: 0,
            totalCommission: 0,
            topVendors: [],
          },
        }
      }
    },
  })

  const handleViewSaleDetails = (saleId: string) => {
    setSelectedSale(saleId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSale(null)
  }

  if (isLoading) return <SalesSkeleton />

  if (error) return <div className="text-red-500">Error loading sales data. Please try again.</div>

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >

      <SalesFilters selectedDateRange={selectedDateRange} onDateRangeChange={setSelectedDateRange} />

      <SalesOverview
        data={
          data?.overview || {
            totalSalesAmount: 0,
            totalSalesCount: 0,
            totalCommission: 0,
            topVendors: [],
          }
        }
        userRole={userRole}
      />

      <SalesTable sales={data?.sales || []} userRole={userRole} onViewDetails={handleViewSaleDetails} />

      {isModalOpen && selectedSale && (
        <SaleDetailsModal saleId={selectedSale} isOpen={isModalOpen} onClose={handleCloseModal} userRole={userRole} />
      )}
    </motion.div>
  )
}

