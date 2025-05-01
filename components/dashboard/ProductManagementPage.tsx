"use client"


import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { getVendorProducts } from '@/actions/products'
import ProductSkeleton from '@/components/dashboard/product-approvals/ProductSkeleton'
import ProductCard from '@/components/dashboard/product-approvals/ProductCard'
import EmptyState from '@/components/dashboard/product-approvals/EmptyState'

interface ProductManagementPageProps {
    initialStatus: string;
  }
  
  export default function ProductManagementPage({ initialStatus }: ProductManagementPageProps) {
    const router = useRouter();
    const [status, setStatus] = useState(initialStatus);
    const [searchTerm, setSearchTerm] = useState("");
  
    const handleTabChange = (value: string) => {
      setStatus(value);
      router.push(`?status=${value}`);
    };
  
    const { data: products, isLoading, error } = useQuery({
      queryKey: ["vendor-products", status],
      queryFn: async () => {
        return await getVendorProducts(status);
      },
    });
  
    const filteredProducts = products?.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.department?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handleProductClick = (id: string) => {
      router.push(`/dashboard/product-approvals/${id}`);
    };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Button 
          onClick={() => router.push('/dashboard/products/new')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          Add New Product
        </Button>
      </div>
      
      <div className="w-full flex flex-col md:flex-row justify-between gap-4">
        <Tabs 
          defaultValue={status} 
          value={status}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger 
              value="DRAFT" 
              className={`${status === 'DRAFT' ? 'bg-yellow-500 text-white' : ''}`}
            >
              Draft
            </TabsTrigger>
            <TabsTrigger 
              value="PENDING" 
              className={`${status === 'PENDING' ? 'bg-yellow-500 text-white' : ''}`}
            >
              Pending
            </TabsTrigger>
            <TabsTrigger 
              value="ACTIVE" 
              className={`${status === 'ACTIVE' ? 'bg-yellow-500 text-white' : ''}`}
            >
              Active
            </TabsTrigger>
            <TabsTrigger 
              value="INACTIVE" 
              className={`${status === 'INACTIVE' ? 'bg-yellow-500 text-white' : ''}`}
            >
              Inactive
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {isLoading ? (
            Array(8).fill(0).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : error ? (
            <div className="col-span-full py-10 text-center">
              <p className="text-red-500">Error loading products. Please try again</p>
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((product:any) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => handleProductClick(product.id)} 
              />
            ))
          ) : (
            <EmptyState 
              title={`No ${status.toLowerCase()} products found`}
              description="You don't have any products in this status yet."
              className="col-span-full"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}