// app/wishlist/WishlistSkeleton.tsx
"use client"

import React from "react"
import { motion } from "framer-motion"

export default function WishlistSkeleton() {
  return (
    <div className="container px-4 py-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
        </div>
        
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
          <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
          <div className="h-10 w-36 bg-gray-200 rounded-md"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <SkeletonProductCard key={index} index={index} />
        ))}
      </div>
    </div>
  )
}

function SkeletonProductCard({ index }: { index: number }) {
  return (
    <motion.div
      className="border border-gray-200 rounded-lg overflow-hidden bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="h-48 bg-gray-200 w-full relative">
        {/* Loading shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 skeleton-animation"></div>
      </div>
      
      <div className="p-3">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      </div>
    </motion.div>
  )
}