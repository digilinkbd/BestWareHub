"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Heart, ShoppingCart, Check, Plus, Minus } from "lucide-react"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import AnimatedText from "./AnimatedText"
import { useCartStore } from "@/hooks/cart-store"
import { DEFAULT_BLUR, DEFAULT_IMAGE } from "@/lib/lazyLoading"
import Link from "next/link"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useAddToWishlist, useIsInWishlist, useRemoveFromWishlist } from "@/hooks/wishlist"
import toast from "react-hot-toast"

export interface Product {
  id: string
  title: string
  price: number
  oldPrice: number | null
  discount: number
  rating: number
  reviews: number
  slug: string
  image: string
  isBestSeller: boolean
  category: string
  categoryRank: number
  deliveryOptions: string[]
  promotionType?: any
}

const ProductCard = ({
  product
}: {
  product: Product
}) => {
  const { items, addItem, incrementQuantity, decrementQuantity } = useCartStore()
  const [showQuantityControls, setShowQuantityControls] = useState(false)
  const controlsRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const router = useRouter()

  // Find if this product is in the cart
  const cartItem = items.find((item) => item.id === product.id)
  const isInCart = !!cartItem

  // Check if the product is in wishlist
  const { isInWishlist: isInWishlistServer, isLoading: isCheckingWishlist } = useIsInWishlist(product.id)
  const addToWishlistMutation = useAddToWishlist()
  const removeFromWishlistMutation = useRemoveFromWishlist()
  
  // Local state for optimistic UI updates
  const [isInWishlistLocal, setIsInWishlistLocal] = useState(false)
  const [isPendingWishlist, setIsPendingWishlist] = useState(false)

  // Sync local state with server state when it loads
  useEffect(() => {
    if (!isCheckingWishlist) {
      setIsInWishlistLocal(isInWishlistServer)
    }
  }, [isInWishlistServer, isCheckingWishlist])

  // Function to handle clicking outside the quantity controls
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (controlsRef.current && !controlsRef.current.contains(event.target as Node)) {
        setShowQuantityControls(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault() // Prevent the Link navigation

    if (!isInCart) {
      // Add item to cart immediately on first click
      addItem(product)
      // Show quantity controls right after adding
      setShowQuantityControls(true)
    } else {
      // Toggle controls visibility if item is already in cart
      setShowQuantityControls(!showQuantityControls)
    }
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault() // Prevent the Link navigation
    incrementQuantity(product.id)
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault() // Prevent the Link navigation
    decrementQuantity(product.id)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault() // Prevent the Link navigation
    
    if (!session) {
      // Redirect to login if not logged in
      router.push('/auth/?returnUrl=/wishlist')
      return
    }
    
    // Set pending state to true
    setIsPendingWishlist(true)
    
    // Optimistic UI update
    const newWishlistState = !isInWishlistLocal
    setIsInWishlistLocal(newWishlistState)
    
    // Show a loading toast that we'll dismiss on completion
    // const loadingToastId = toast.loading(newWishlistState ? "Adding to wishlist..." : "Removing from wishlist...")
    
    if (newWishlistState) {
      // Add to wishlist
      addToWishlistMutation.mutate(product.id, {
        onSuccess: () => {
          // toast.dismiss(loadingToastId)
          setIsPendingWishlist(false)
        },
        onError: () => {
          // Revert on error
          setIsInWishlistLocal(!newWishlistState)
          // toast.dismiss(loadingToastId)
          setIsPendingWishlist(false)
        }
      })
    } else {
      // Remove from wishlist
      removeFromWishlistMutation.mutate(product.id, {
        onSuccess: () => {
          // toast.dismiss(loadingToastId)
          setIsPendingWishlist(false)
        },
        onError: () => {
          // Revert on error
          setIsInWishlistLocal(!newWishlistState)
          // toast.dismiss(loadingToastId)
          setIsPendingWishlist(false)
        }
      })
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

  // Heart button animation
  const heartButtonVariants = {
    initial: { scale: 1 },
    liked: {
      scale: [1, 1.3, 1],
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      className="relative md:h-full h-full border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg cursor-pointer"
      animate={{ boxShadow: ["0 1px 2px rgba(0,0,0,0.05)", "0 4px 8px rgba(0,0,0,0.1)", "0 1px 2px rgba(0,0,0,0.05)"] }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration: 2.5,
        ease: "easeInOut",
      }}
    >
      {/* Favorite Button - Moved outside Link */}
      <motion.button
        onClick={handleToggleFavorite}
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 transition-transform hover:scale-110 shadow"
        whileTap={{ scale: 0.9 }}
        variants={heartButtonVariants}
        initial="initial"
        animate={isInWishlistLocal ? "liked" : "initial"}
        disabled={isPendingWishlist}
      >
        <Heart 
          size={18} 
          className={`${isInWishlistLocal ? "fill-red-500 text-red-500" : "text-gray-400"} ${isPendingWishlist ? "opacity-50" : ""}`} 
        />
      </motion.button>

      <Link href={`/p/${product.slug}`}>
        {/* Category Tag (Replaces Best Seller Tag) */}
        {product.category && (
          <div className="absolute top-2 left-2 z-10 bg-gray-700 text-white text-xs font-medium px-2 py-0.5 rounded">
            {product.category}
          </div>
        )}

        {/* Product Image */}
        <div className="relative h-48 overflow-hidden bg-[#f8f8f9] rounded-md">
          <Image
            src={product.image ?? DEFAULT_IMAGE}
            alt={product.title}
            fill
            style={{ objectFit: "cover" }}
            className="p-2 transition-transform hover:scale-110"
            placeholder="blur"
            blurDataURL={DEFAULT_BLUR}
          />

          {/* Rating and Cart positioned at the bottom of image area */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-2">
            <div className="flex items-center">
              <div className="bg-white/90 backdrop-blur-sm shadow-sm px-2 rounded-full">
                <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                <span className="ml-1 text-yellow-400">★</span>
                <span className="ml-1 text-xs text-gray-500">({product.reviews.toLocaleString()})</span>
              </div>
            </div>

            {/* Cart Button with Quantity Controls - Moved outside Link's onClick context */}
            <div className="relative z-20">
              <motion.button
                onClick={handleCartClick}
                className="bg-white rounded-full p-1.5 transition-transform shadow"
                whileTap={{ scale: 0.9 }}
                variants={cartButtonVariants}
                initial="initial"
                animate={isInCart ? "added" : "initial"}
                key={`cart-${product.id}-${cartItem?.quantity || 0}`}
              >
                {isInCart ? <Check size={20} className="text-green-500" /> : <ShoppingCart size={20} />}
              </motion.button>

              {/* Quantity Controls Popup */}
              <AnimatePresence>
                {showQuantityControls && isInCart && (
                  <motion.div
                    key={`controls-${product.id}`}
                    ref={controlsRef}
                    variants={popupVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute z-20 right-0 mt-2 bg-white rounded-lg shadow-lg p-2 w-32"
                    onClick={(e) => e.preventDefault()} // Prevent Link navigation
                  >
                    <div className="flex items-center justify-between">
                      <motion.button
                        onClick={handleDecrement}
                        className="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus size={16} />
                      </motion.button>
                      <motion.span
                        className="font-medium text-sm"
                        key={`quantity-${cartItem?.quantity || 0}`}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {cartItem?.quantity || 0}
                      </motion.span>
                      <motion.button
                        onClick={handleIncrement}
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
        </div>

        {/* Product Details */}
        <div className="md:p-3 p-2">
          {/* Title */}
          <h3 className="text-sm text-gray-700 line-clamp-2 h-10 mb-1 font-medium">{product.title}</h3>

          {/* Price */}
          <div className="mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium">BDT</span>
              <span className="text-lg font-bold">{product.price.toLocaleString()}</span>
              {product.oldPrice && (
                <span className="text-xs line-through text-gray-500">{product.oldPrice.toLocaleString()}</span>
              )}
              {product.discount > 0 && <span className="text-xs text-green-600 font-medium">{product.discount}%</span>}
            </div>
          </div>

          {/* Category and Rank */}
          {product.categoryRank > 0 && (
            <div className="text-xs text-gray-500 mb-1">
              #{product.categoryRank} in {product.category}
            </div>
          )}

          {/* Animated Delivery Options */}
          <div className="h-5 overflow-hidden relative mb-2">
            <AnimatedText options={product.deliveryOptions} />
          </div>

          {/* Promotion Tag */}
          {product.promotionType === "express" && (
            <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full inline-block border border-yellow-500">
              express
            </div>
          )}

          {product.promotionType === "super-mart" && (
            <div className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full inline-block border border-blue-700">
              super mart
            </div>
          )}

          {/* Cart Item Indicator */}
          {isInCart && (
            <motion.div
              className="mt-2 text-xs text-green-600 font-medium"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              key={`indicator-${cartItem?.quantity || 0}`}
            >
              {cartItem?.quantity} in cart
            </motion.div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard