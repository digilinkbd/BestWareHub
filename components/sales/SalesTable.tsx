"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Eye, ChevronLeft, ChevronRight, User, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Sale = {
  id: string
  total: number
  commission: number
  productTitle: string
  productImage: string
  productPrice: number
  productQty: number
  isPaid: boolean
  createdAt: string 
  vendorId?: string
  order: {
    id: string
    orderNumber: string
    orderStatus: string
    paymentStatus: string
    createdAt: string 
  }
  product?: {
    id: string
    title: string
    imageUrl: string | null
  }
}

type SalesTableProps = {
  sales: Sale[]
  userRole: "admin" | "vendor"
  onViewDetails: (saleId: string) => void
}

export function SalesTable({ sales, userRole, onViewDetails }: SalesTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(sales.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentSales = sales.slice(startIndex, startIndex + itemsPerPage)

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

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

  if (sales.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-yellow-200 p-8 text-center">
        <Package className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-yellow-800 mb-2">No Sales Found</h3>
        <p className="text-yellow-600 mb-6">There are no sales matching your current filters.</p>
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">View All Sales</Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-lg border border-blue-200 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-blue-50">
            <TableRow>
              <TableHead className="w-[100px]">Order #</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              {userRole === "admin" && <TableHead className="text-right">Commission</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              {userRole === "admin" && <TableHead>Vendor</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSales.map((sale) => (
              <TableRow key={sale.id} className="hover:bg-blue-50">
                <TableCell className="font-medium">{sale.order.orderNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-yellow-100 flex items-center justify-center">
                      {sale.productImage ? (
                        <Image
                          src={sale.productImage || "/placeholder.jpg"}
                          alt={sale.productTitle}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <div className="max-w-[200px] truncate" title={sale.productTitle}>
                      {sale.productTitle}
                      <div className="text-xs text-yellow-600">Qty: {sale.productQty}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">${sale.total.toFixed(2)}</TableCell>
                {userRole === "admin" && (
                  <TableCell className="text-right font-medium text-yellow-700">
                    ${sale.commission.toFixed(2)}
                  </TableCell>
                )}
                <TableCell>
                  <Badge variant="outline" className={getOrderStatusColor(sale.order.orderStatus)}>
                    {sale.order.orderStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getPaymentStatusColor(sale.order.paymentStatus)}>
                    {sale.order.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(sale.createdAt), "MMM dd, yyyy")}</TableCell>
                {userRole === "admin" && (
                  <TableCell>
                    {sale.vendorId ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={`/dashboard/vendors/${sale.vendorId}`}
                              className="flex items-center gap-1 text-yellow-700 hover:text-yellow-900"
                            >
                              <User className="w-4 h-4" />
                              <span className="text-xs">View</span>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View vendor profile</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-xs text-gray-500">N/A</span>
                    )}
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(sale.id)}
                    className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-yellow-200 bg-yellow-50">
          <div className="text-sm text-yellow-700">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">{Math.min(startIndex + itemsPerPage, sales.length)}</span> of{" "}
            <span className="font-medium">{sales.length}</span> results
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

