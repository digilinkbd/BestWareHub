"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Clock, Eye, BarChart, ShoppingBag, Ban } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useStoreData } from "@/hooks/useStoreData"
import { SearchBar } from "./SearchBar"
import { StoreSkeleton } from "./StoreSkeleton"
import { StoreCard } from "./StoreCard"
import { PaginationControls } from "./PaginationControls"
import { EmptyState } from "./EmptyState"
import { useRouter } from "next/navigation"

interface StoreListPageProps {
  initialPage: number
  initialStatus: string
  search:string
}

export default function StoreListPage({ initialPage, initialStatus , search }: StoreListPageProps) {
  const router = useRouter()
  const [page, setPage] = useState(initialPage)
  const [status, setStatus] = useState(initialStatus)
  const [searchInput, setSearchInput] = useState(search)

  const { stats, isLoadingStats, stores, total, isLoading, totalPages } = useStoreData(page, status, searchInput)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/dashboard/vendor-applications?page=1&status=${status}&search=${searchInput}`)
  }

  const handleStatusFilter = (newStatus: string) => {
    setStatus(newStatus)
    setPage(1)
    router.push(`/dashboard/vendor-applications?page=1&status=${newStatus}&search=${searchInput}`)
  }

  // Status card data for mapping
  const statusCards = [
    {
      id: "all",
      title: "Total Stores",
      value: stats?.all || 0,
      icon: <ShoppingBag className="h-6 w-6 text-amber-700" />,
      bgColor: "bg-amber-50",
      activeBgColor: "bg-amber-100",
      borderColor: "border-amber-400",
      hoverColor: "hover:bg-amber-100",
      iconBgColor: "bg-amber-300"
    },
    {
      id: "PENDING",
      title: "Pending",
      value: stats?.pending || 0,
      icon: <Clock className="h-6 w-6 text-indigo-700" />,
      bgColor: "bg-indigo-50",
      activeBgColor: "bg-indigo-100",
      borderColor: "border-indigo-400",
      hoverColor: "hover:bg-indigo-100",
      iconBgColor: "bg-indigo-300"
    },
    {
      id: "APPROVED",
      title: "Approved",
      value: stats?.approved || 0,
      icon: <CheckCircle className="h-6 w-6 text-pink-700" />,
      bgColor: "bg-pink-50",
      activeBgColor: "bg-pink-100",
      borderColor: "border-pink-400",
      hoverColor: "hover:bg-pink-100",
      iconBgColor: "bg-pink-300"
    },
    {
      id: "REJECTED",
      title: "Rejected",
      value: stats?.rejected || 0,
      icon: <Ban className="h-6 w-6 text-purple-700" />,
      bgColor: "bg-purple-50",
      activeBgColor: "bg-purple-100",
      borderColor: "border-purple-400",
      hoverColor: "hover:bg-purple-100",
      iconBgColor: "bg-purple-300"
    }
  ]


  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    }
  }

  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  const statsCardVariant = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-1 space-y-4 px-4 md:px-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl font-bold text-gray-800 mb-2 md:mb-0"
        >
          Vendor Stores
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="bg-white p-2 rounded-lg shadow-sm border flex items-center text-sm">
            <BarChart className="h-4 w-4 text-gray-500 mr-2" />
            <span className="font-medium text-gray-600">
              {total} {total === 1 ? 'store' : 'stores'} total
            </span>
          </div>
        </motion.div>
      </div>

      {/* Status Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
      >
        {isLoadingStats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))
        ) : (
          statusCards.map((card) => (
            <motion.div key={card.id} variants={statsCardVariant}>
              <Card 
                className={`cursor-pointer transition-all shadow-sm hover:shadow-md ${card.bgColor} ${
                  status === card.id ? `${card.activeBgColor} ${card.borderColor}` : card.hoverColor
                }`}
                onClick={() => handleStatusFilter(card.id)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                    <p className="text-2xl font-bold">{card.value}</p>
                  </div>
                  <div className={`${card.iconBgColor} p-3 rounded-full`}>
                    {card.icon}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <SearchBar 
          value={searchInput} 
          onChange={setSearchInput} 
          onSubmit={handleSearch} 
          totalItems={total} 
        />
      </motion.div>

      {/* Store Cards */}
      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="grid md:grid-cols-2 grid-cols-1 gap-4"
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={i} variants={cardVariant}>
                <StoreSkeleton />
              </motion.div>
            ))
          : stores.map((store) => (
              <motion.div key={store.id} variants={cardVariant}>
                <StoreCard store={store} />
              </motion.div>
            ))}
      </motion.div>

      {/* Empty state */}
      {!isLoading && stores.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <EmptyState hasSearch={!!search} />
        </motion.div>
      )}

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="pt-4"
      >
        <PaginationControls 
          currentPage={page} 
          totalPages={totalPages} 
          status={status} 
          search={search} 
        />
      </motion.div>
    </motion.div>
  )
}