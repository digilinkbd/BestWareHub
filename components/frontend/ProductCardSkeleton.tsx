"use client";

import { motion } from 'framer-motion';

const ProductCardSkeleton = () => {
  return (
    <motion.div 
      className="relative md:h-full h-full border border-gray-200 rounded-lg overflow-hidden bg-white"
      animate={{ 
        boxShadow: ["0 1px 2px rgba(0,0,0,0.05)", "0 4px 8px rgba(0,0,0,0.1)", "0 1px 2px rgba(0,0,0,0.05)"] 
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 2.5,
        ease: "easeInOut" 
      }}
    >
      {/* Image Skeleton */}
      <div className="relative h-48 overflow-hidden bg-gray-200 animate-pulse rounded-md">
        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-2">
          <div className="w-16 h-6 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Product Details Skeleton */}
      <div className="md:p-3 p-2">
        {/* Title Skeleton */}
        <div className="h-10 bg-gray-200 rounded mb-1 animate-pulse"></div>
        
        {/* Price Skeleton */}
        <div className="mb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-10 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        
        {/* Category Skeleton */}
        <div className="w-24 h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
        
        {/* Delivery Options Skeleton */}
        <div className="h-5 w-full bg-gray-200 rounded mb-2 animate-pulse"></div>
        
        {/* Promotion Tag Skeleton */}
        <div className="w-16 h-5 bg-gray-200 rounded-full animate-pulse inline-block"></div>
      </div>
    </motion.div>
  );
};

export default ProductCardSkeleton;