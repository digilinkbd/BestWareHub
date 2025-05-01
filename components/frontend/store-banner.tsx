import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { StoreDetails } from '@/actions/store'
import Link from 'next/link'

interface Banner {
  id: string
  title?: string | null
  subtitle?: string | null
  imageUrl: string
  buttonText?: string | null
  link?: string | null
}

interface StoreBannerProps {
  banners: Banner[]
  storeName: string,
    store: StoreDetails | null | undefined
}

export default function StoreBanner({ banners, storeName  ,store }: StoreBannerProps) {
  const [currentBanner, setCurrentBanner] = useState(0)
  
  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }
  
  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }
  
  // If no banners, show default banner
  if (banners.length === 0) {
    return (
      <div className="w-full h-64 bg-gradient-to-r from-yellow-300 to-yellow-400 relative overflow-hidden">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-white mb-2">{storeName}</h2>
          <p className="text-white text-lg max-w-md">
            Welcome to our store! Browse our products below.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 w-1/3 h-full opacity-20">
          <div className="w-full h-full bg-white rounded-full transform translate-x-1/4 translate-y-1/4"></div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative h-44 md:h-64 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full relative"
        >
          <Image 
            src={banners[currentBanner].imageUrl}
            alt={banners[currentBanner].title || storeName}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30">
            <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white mb-2">
                  {storeName}
            </h2>
            <p className="text-white text-lg max-w-md line-clamp-2">
                  {store?.description}
                </p>
                <div
                  className="mt-4 bg-yellow-400 text-gray-800 px-6 py-2 rounded-full font-medium inline-block hover:bg-yellow-300 transition-colors w-max"
                >
                  {store?.storeAddress}
                </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {banners.length > 1 && (
        <>
          <button 
            onClick={prevBanner}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full hover:bg-opacity-100 transition-opacity"
            aria-label="Previous banner"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextBanner}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full hover:bg-opacity-100 transition-opacity"
            aria-label="Next banner"
          >
            <ChevronRight size={20} />
          </button>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentBanner ? 'bg-yellow-400' : 'bg-white bg-opacity-50'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}