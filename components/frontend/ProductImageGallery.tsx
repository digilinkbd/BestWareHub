"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ShoppingCart, Heart } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "../ui/button"

interface ProductImageGalleryProps {
  images: string[]
  onAddToCart: () => void
}

export default function ProductImageGallery({ images, onAddToCart }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [showAllThumbnails, setShowAllThumbnails] = useState(false)

  const visibleThumbnails = showAllThumbnails ? images : images.slice(0, 4)

  const productImages = images.length > 0 ? images : ["/placeholder.jpg"]

  return (
    <div className="flex flex-col md:flex-row gap-4 relative border-r border-gray-100 pr-2">
      <div className="order-2 md:order-1 w-full md:w-20">
        <div className="relative">
          <button
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-full p-1 shadow-md md:hidden"
            onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : productImages.length - 1))}
          >
            <ChevronUp className="h-4 w-4" />
          </button>

          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[500px] py-2 md:py-0 scrollbar-hide">
            {visibleThumbnails.map((image, index) => (
              <div
                key={index}
                className={`border-2 rounded cursor-pointer transition-all duration-300 ${
                  selectedImage === index ? "border-blue-700 border-[2px]" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <div className="relative w-16 h-16 md:w-full md:h-20 ">
                  <Image
                    src={image || "/placeholder.svg?height=80&width=80"}
                    alt={`Product thumbnail ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 64px, 80px"
                    className="object-cover rounded"
                  />
                </div>
              </div>
            ))}
          </div>

          {productImages.length > 4 && (
            <button
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
              onClick={() => {
                if (showAllThumbnails) {
                  setShowAllThumbnails(false)
                } else {
                  setSelectedImage((prev) => (prev < productImages.length - 1 ? prev + 1 : 0))
                }
              }}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Image */}
      <div className="order-1 md:order-2 flex-1">
        <div className="relative aspect-square bg-white rounded-md overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Image
                src={productImages[selectedImage] || "/placeholder.jpg"}
                alt="Product main image"
                fill
                sizes="(max-width: 768px) 100vw, 70vw"
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Navigation Arrows */}
        <div className="md:hidden flex justify-between absolute top-1/2 left-0 right-0 -translate-y-1/2">
          <button
            className="bg-white/80 rounded-full p-2 shadow-md ml-2 hover:bg-white transition-colors"
            onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : productImages.length - 1))}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="bg-white/80 rounded-full p-2 shadow-md mr-2 hover:bg-white transition-colors"
            onClick={() => setSelectedImage((prev) => (prev < productImages.length - 1 ? prev + 1 : 0))}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="md:flex items-center gap-4 mt-[10%] mr-5 hidden ">
          <div className="flex-1">
            <Button
              className="w-full bg-[#2b4cd7] hover:bg-blue-800 h-[47px] mt-6 text-base font-bold"
              onClick={onAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add To Cart
            </Button>
          </div>

          <Button variant="outline" size="icon" className="h-[47px] w-[42px] mt-6">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

