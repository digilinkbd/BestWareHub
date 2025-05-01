"use client"

import { useState, useEffect } from "react"
import type { ProductSearchResult } from "@/types/search"
import ProductCard from "./product-card"

export function ProductGrid({ products }: { products: ProductSearchResult[] }) {
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])



  if (!isClient) {
    return (
      <>
        {products.map((product) => (
          <div key={product.id} className="opacity-0">
            <div className="h-[400px]"></div>
          </div>
        ))}
      </>
    )
  }

  return (
    <>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        
        />
      ))}
    </>
  )
}