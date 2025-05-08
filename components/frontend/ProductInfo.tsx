"use client"

import { useState } from "react"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ProductWithRelations3 } from "@/types/types"

interface ProductInfoProps {
  product: ProductWithRelations3
  onAddToCart: () => void
}

export default function ProductInfo({ product, onAddToCart }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  // Calculate discount percentage
  const discountPercentage =
    product.isDiscount && product.discount
      ? Math.round(product.discount)
      : product.salePrice && product.productPrice
        ? Math.round(((product.productPrice - product.salePrice) / product.productPrice) * 100)
        : 0

  // Calculate savings amount
  const savingsAmount =
    product.isDiscount && product.productPrice && product.salePrice ? product.productPrice - product.salePrice : 0

  return (
    <div className="space-y-6">
      <div>
        {product.brand && (
          <Badge variant="outline" className="mb-2">
            {product.brand.title}
          </Badge>
        )}
        <p className="text-xl font-normal leading-normal text-[#4b505d]">{product.title}</p>
      </div>

      <div className="space-y-2">
        {(product.isDiscount || product.salePrice) && (
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">Was:</span>
            <span className="ml-2 text-sm line-through text-muted-foreground">
              BDT {product.productPrice.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex items-center">
          <span className="text-sm text-muted-foreground">Now:</span>
          <span className="ml-2 text-xl font-bold">BDT {(product.salePrice || product.productPrice).toFixed(2)}</span>
          <span className="ml-2 text-sm text-muted-foreground">Inclusive of VAT</span>
        </div>

        {savingsAmount > 0 && (
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">Saving:</span>
            <span className="ml-2 text-sm">BDT {savingsAmount.toFixed(2)}</span>
            <span className="ml-2 text-sm bg-green-100 text-green-800 px-1 rounded">{discountPercentage}% OFF</span>
          </div>
        )}
      </div>

      {product.rating && (
        <div className="flex items-center text-amber-600">
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <p className="text-sm">
            {product.rating.toFixed(1)} ({product.reviews.length} reviews)
          </p>
        </div>
      )}

      {product.productStock && product.productStock < 10 && (
        <div className="flex items-center text-amber-600">
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <p className="text-sm">Only {product.productStock} left in stock</p>
        </div>
      )}

      <div className="flex items-center gap-2 bg-green-50 p-3 rounded-md">
        <div className="bg-green-100 p-2 rounded-full">
          <ShoppingCart className="h-4 w-4 text-green-700" />
        </div>
        <div>
          <p className="text-sm font-medium">Get it by {getDeliveryDate()}</p>
          <p className="text-xs text-muted-foreground">Order in 20 h 24 m</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ShoppingCart className="h-4 w-4" />
        <p className="text-sm">10 BDT shipping fee applies per seller</p>
      </div>

      <div className="bg-green-100 p-4 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-700" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            <p className="font-medium">Earn 5% CASHBACK</p>
          </div>
          <p className="text-sm text-blue-600 cursor-pointer">Apply now</p>
        </div>
        <p className="text-sm">with the noon One Credit Card</p>
      </div>

      <div className="md:hidden">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Button
              className="w-full bg-[#2b4cd7] hover:bg-blue-800 h-[47px] text-base font-bold"
              onClick={onAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add To Cart
            </Button>
          </div>
          <Button variant="outline" size="icon" className="h-[47px] w-[42px]">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Helper function to get delivery date (3 days from now)
function getDeliveryDate() {
  const date = new Date()
  date.setDate(date.getDate() + 3)
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" })
}

