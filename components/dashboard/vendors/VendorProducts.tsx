"use client";

import { useQuery } from "@tanstack/react-query";
import { getVendorProducts } from "@/actions/vendor";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter, Grid3X3, List } from "lucide-react";
import ProductCard from "./ProductCard";

export default function VendorProducts({ vendorId }: { vendorId: string }) {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [view, setView] = useState<"grid" | "list">("grid");
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["vendorProducts", vendorId, page, limit],
    queryFn: async () => {
      return await getVendorProducts(vendorId, limit, page);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  
  const handleNextPage = () => {
    if (data && page < data.totalPages) setPage(page + 1);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-red-500">Failed to load products. Please try again.</p>
      </div>
    );
  }
  
  if (!data || data.products.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">This vendor doesn't have any products yet.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Products <span className="text-gray-500">({data.totalProducts})</span>
        </h2>
        <div className="flex items-center space-x-2">
          <button 
            className={`p-2 rounded-md ${view === 'grid' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <Grid3X3 size={18} />
          </button>
          <button 
            className={`p-2 rounded-md ${view === 'list' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <List size={18} />
          </button>
          <button className="p-2 rounded-md bg-gray-200 text-gray-600">
            <Filter size={18} />
          </button>
        </div>
      </div>
      
      <motion.div 
        layout
        className={view === "grid" 
          ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-2" 
          : "space-y-4"
        }
      >
        {data.products.map((product) => (
          <motion.div 
            key={product.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard product={product} viewType={view} />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-10 h-10 rounded-md ${
                  page === pageNum
                    ? "bg-yellow-500 text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              disabled={page === data.totalPages}
              className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}