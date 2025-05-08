"use client"
import { Grid, List, Heart, ShoppingCart, Check, Plus, Minus } from "lucide-react"
import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/frontend/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/hooks/cart-store"
import type { ProductCardProps2 } from "@/types/types"
import Link from "next/link"

interface ProductsGridProps {
  isGridView: boolean
  setIsGridView: (isGrid: boolean) => void
  favorites: { [key: string]: boolean }
  toggleFavorite: (productId: string) => void
  products: ProductCardProps2[]
  isLoading: boolean
}

const ProductsGrid = ({
  isGridView,
  setIsGridView,
  favorites,
  toggleFavorite,
  products,
  isLoading,
}: ProductsGridProps) => {
  // Cart functionality
  const { items, addItem, incrementQuantity, decrementQuantity } = useCartStore()
  const [activeControls, setActiveControls] = useState<string | null>(null)
  const controlsRef = useRef<HTMLDivElement>(null)

  // Function to handle clicking outside the quantity controls
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (controlsRef.current && !controlsRef.current.contains(event.target as Node)) {
        setActiveControls(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleCartClick = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation()
    e.preventDefault()

    const cartItem = items.find((item) => item.id === productId)
    const isInCart = !!cartItem

    if (!isInCart) {
      // Add item to cart immediately on first click
      const product = products.find((p) => p.id === productId)
      if (product) {
        addItem(product)
      }
      // Show quantity controls right after adding
      setActiveControls(productId)
    } else {
      // Toggle controls visibility if item is already in cart
      setActiveControls(activeControls === productId ? null : productId)
    }
  }

  // Animation variants for the quantity controls
  const popupVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  }

  // Cart button animation
  const cartButtonVariants = {
    initial: { scale: 1 },
    added: {
      scale: [1, 1.3, 1],
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="mb-4">
      <div className="flex justify-end gap-2 mb-2">
        <Button
          onClick={() => setIsGridView(true)}
          variant={isGridView ? "default" : "ghost"}
          size="sm"
          className={`p-2 ${isGridView ? "bg-blue-600" : "bg-gray-100 text-gray-500"}`}
        >
          <Grid className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => setIsGridView(false)}
          variant={!isGridView ? "default" : "ghost"}
          size="sm"
          className={`p-1 ${!isGridView ? "bg-blue-600" : "bg-gray-100 text-gray-500"}`}
        >
          <List className="h-5 w-5" />
        </Button>
      </div>

      {isLoading ? (
        <div
          className={isGridView ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-4"}
        >
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className={
                  isGridView ? "bg-white rounded-lg shadow-sm p-4" : "bg-white rounded-lg shadow-sm p-4 flex gap-4"
                }
              >
                {isGridView ? (
                  <div className="space-y-3">
                    <Skeleton className="h-40 w-full rounded-md" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                ) : (
                  <>
                    <Skeleton className="h-24 w-24 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
        </div>
      ) : (
        <div
          className={isGridView ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-4"}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className={isGridView ? "" : "bg-white rounded-lg shadow-sm p-4 transition-all hover:shadow-md"}
            >
              {isGridView ? (
                <ProductCard
                  product={product}
                 
                />
              ) : (
                <Link href={`/p/${product.slug}`} className="flex gap-4">
                  <Link href={`/p/${product.slug}`} className="relative w-24 h-24">
                    <img
                      src={product.image || "/placeholder.jpg"}
                      alt={product.title}
                      className="object-cover w-full h-full rounded-md"
                    />
                    <Badge className="absolute top-0 left-0 bg-yellow-300 text-black text-xs px-1">
                      {product.promotionType}
                    </Badge>
                  </Link>
                  <Link href={`/p/${product.slug}`} className="flex-1">
                    <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">{product.title}</h3>
                    <div className="flex items-center text-xs mb-1">
                      <span className="text-[#82ae04]">★</span>
                      <span className="ml-1">{product.rating}</span>
                      <span className="ml-1 text-gray-500">({product.reviews.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">BDT</span>
                      <span className="text-lg font-bold">{product.price.toLocaleString()}</span>
                      {product.oldPrice && (
                        <>
                          <span className="text-xs line-through text-gray-500">
                            {product.oldPrice.toLocaleString()}
                          </span>
                          <span className="text-xs text-green-600 font-medium">{product.discount}%</span>
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.deliveryOptions.map((option, idx) => (
                        <span key={idx} className="text-xs text-gray-600">
                          {option}
                        </span>
                      ))}
                    </div>

                    {/* Cart Item Indicator */}
                    {items.find((item) => item.id === product.id) && (
                      <div className="mt-1 text-xs text-green-600 font-medium">
                        {items.find((item) => item.id === product.id)?.quantity} in cart
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      onClick={() => toggleFavorite(product.id)}
                      variant="ghost"
                      size="sm"
                      className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                      <Heart
                        size={18}
                        className={favorites[product.id] ? "fill-red-500 text-red-500" : "text-gray-400"}
                      />
                    </Button>

                    {/* Cart Button with Quantity Controls */}
                    <div className="relative" ref={controlsRef}>
                      <motion.button
                        onClick={(e) => handleCartClick(e, product.id)}
                        className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
                        whileTap={{ scale: 0.9 }}
                        variants={cartButtonVariants}
                        initial="initial"
                        animate={items.find((item) => item.id === product.id) ? "added" : "initial"}
                      >
                        {items.find((item) => item.id === product.id) ? (
                          <Check size={18} className="text-green-500" />
                        ) : (
                          <ShoppingCart size={18} className="text-gray-600" />
                        )}
                      </motion.button>

                      {/* Quantity Controls Popup */}
                      <AnimatePresence>
                        {activeControls === product.id && items.find((item) => item.id === product.id) && (
                          <motion.div
                            variants={popupVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute z-20 right-0 mt-2 bg-white rounded-lg shadow-lg p-2 w-32"
                          >
                            <div className="flex items-center justify-between">
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  decrementQuantity(product.id)
                                }}
                                className="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
                                whileTap={{ scale: 0.9 }}
                              >
                                <Minus size={16} />
                              </motion.button>
                              <motion.span
                                className="font-medium text-sm"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                {items.find((item) => item.id === product.id)?.quantity || 0}
                              </motion.span>
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  incrementQuantity(product.id)
                                }}
                                className="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
                                whileTap={{ scale: 0.9 }}
                              >
                                <Plus size={16} />
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductsGrid

