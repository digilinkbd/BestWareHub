"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { adaptStoreProductsToCardProps } from "@/types/types"

import type { SlugTypes } from "./department-page"
import { useStoreBanners, useStoreDetails, useStoreProducts } from "@/hooks/useVendorStore"
import ProductsGrid from "./ProductsGrid"
import StoreHeader from "./StoreHeader"
import StoreBanner from "./store-banner"
import StoreHeaderSkeleton from "./StoreHeaderSkeleton"
import StoreInfoSkeleton from "./StoreInfoSkeleton"
import StoreInfo from "./StoreInfo"
import BannerSkeleton from "./BannerSkeleton"

export default function StorePage({ slug }: SlugTypes) {
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({})
  const [isGridView, setIsGridView] = useState(true)

  const { store, isLoading: isStoreLoading } = useStoreDetails(slug)
  const { banners, isLoading: isBannersLoading } = useStoreBanners(store?.id)
  const { products, isLoading: isProductsLoading } = useStoreProducts(store?.id)
  // Toggle favorite function
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  // Convert StoreProduct[] to ProductCardProps2[] to fix the type error
  const adaptedProducts = adaptStoreProductsToCardProps(products || [])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {isStoreLoading ? <StoreHeaderSkeleton /> : <StoreHeader storeName={store?.storeName || ""} logo={store?.logo} />}

      {isBannersLoading ? <BannerSkeleton /> : <StoreBanner banners={banners} storeName={store?.storeName || ""} store={store}/>}

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Products</h2>

          <ProductsGrid
            products={adaptedProducts}
            isGridView={isGridView}
            setIsGridView={setIsGridView}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            isLoading={isProductsLoading}
          />
        </motion.div>

        {isStoreLoading ? <StoreInfoSkeleton /> : <StoreInfo store={store} />}
      </main>
    </div>
  )
}

