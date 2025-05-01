"use client"

import React from "react"

export const CategorySkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="relative h-[190px] rounded-lg overflow-hidden bg-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const ProductSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="bg-white rounded-lg relative cursor-pointer">
          <div className="absolute -top-[1px] right-0 z-10">
            <div className="bg-gray-200 animate-pulse h-6 w-24 rounded-bl-md rounded-tr-lg"></div>
          </div>
          <div className="relative h-[110px] w-full bg-gray-200 animate-pulse"></div>
          <div className="space-y-2 p-2 bg-[#ececec] rounded-b-lg relative">
            <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4"></div>
            <div className="flex items-baseline gap-2">
              <div className="h-3 bg-gray-200 animate-pulse rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const PromotionSkeleton = () => {
  return (
    <div className="space-y-4 h-[calc(100%-3rem)]">
      <div className="relative h-[48%] rounded-lg overflow-hidden bg-gray-200 animate-pulse"></div>
      <div className="relative h-[48%] rounded-lg overflow-hidden bg-gray-200 animate-pulse"></div>
    </div>
  )
}