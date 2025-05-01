"use client"

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { VendorProduct } from '@/types/types'

interface ProductCardProps {
  product: VendorProduct
  onClick: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const statusColor = {
    DRAFT: 'bg-gray-200 text-gray-800',
    PENDING: 'bg-yellow-200 text-yellow-800',
    ACTIVE: 'bg-green-200 text-green-800',
    INACTIVE: 'bg-red-200 text-red-800'
  }
  
  // Determine product status from various fields
  const getProductStatus = () => {
    if (!product.isActive) return 'INACTIVE'
    if (!product.isApproved) return 'PENDING'
    if (product.isDraft) return 'DRAFT'
    return 'ACTIVE'
  }
  
  const status = getProductStatus()
  
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card 
        className="cursor-pointer h-full flex flex-col overflow-hidden border border-gray-200 hover:border-yellow-500 transition-all duration-300"
        onClick={onClick}
      >
        <div className="relative h-48 w-full overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">No image</p>
            </div>
          )}
          <Badge className={`absolute top-2 right-2 ${statusColor[status]}`}>
            {status}
          </Badge>
          {product.isDiscount && product.discount && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
              {product.discount}% OFF
            </Badge>
          )}
        </div>
        
        <CardContent className="flex-grow p-4">
          <h3 className="font-semibold line-clamp-2 mb-1">{product.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>{product.department?.title}</span>
            {product.category && (
              <>
                <span>•</span>
                <span>{product.category.title}</span>
              </>
            )}
          </div>
          <p className="text-gray-500 text-sm line-clamp-2">
            {product.shortDesc || product.description || 'No description available'}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div>
            {product.isDiscount && product.salePrice ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-yellow-600">${product.salePrice.toFixed(2)}</span>
                <span className="text-gray-500 line-through text-sm">${product.productPrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="font-bold">${product.productPrice.toFixed(2)}</span>
            )}
          </div>
          {product.rating && (
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm">{product.rating}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}