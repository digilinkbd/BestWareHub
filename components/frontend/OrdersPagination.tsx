"use client"

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { motion } from "framer-motion";

interface OrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function OrdersPagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: OrdersPaginationProps) {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Calculate page numbers to show
  const getPaginationItems = () => {
    // Always include first and last page
    const items = new Set<number>([1, totalPages]);
    
    // Add current page and neighbors
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.add(i);
    }
    
    // Convert to sorted array
    return Array.from(items).sort((a, b) => a - b);
  };

  const pages = getPaginationItems();

  return (
    <motion.div 
      className="flex justify-center items-center space-x-2 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* First page */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        className="hidden sm:flex items-center justify-center"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* Previous page */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page numbers */}
      {pages.map((page, index) => {
        // Add ellipsis
        const showEllipsisBefore = index > 0 && pages[index - 1] !== page - 1;
        const showEllipsisAfter = index < pages.length - 1 && pages[index + 1] !== page + 1;

        return (
          <div key={page} className="flex items-center">
            {showEllipsisBefore && (
              <span className="px-2 text-gray-500">...</span>
            )}
            
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={currentPage === page ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
            >
              {page}
            </Button>
            
            {showEllipsisAfter && (
              <span className="px-2 text-gray-500">...</span>
            )}
          </div>
        );
      })}

      {/* Next page */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last page */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
        className="hidden sm:flex items-center justify-center"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}