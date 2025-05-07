"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DEFAULT_BLUR } from "@/lib/lazyLoading"
import { useActivePromotions, useFeaturedCategories, useFeaturedProducts } from "@/hooks/useFeaturedCat"
import { CategorySkeleton, ProductSkeleton, PromotionSkeleton } from "./featured-loaders"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useAddToWishlist, useIsInWishlist, useRemoveFromWishlist } from "@/hooks/wishlist"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"

// Heart button component for reusability
const WishlistHeartButton = ({ productId }: { productId: string }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const { isInWishlist: isInWishlistServer, isLoading: isCheckingWishlist } = useIsInWishlist(productId)
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
      addToWishlistMutation.mutate(productId, {
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
      removeFromWishlistMutation.mutate(productId, {
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

  // Heart button animation
  const heartButtonVariants = {
    initial: { scale: 1 },
    liked: {
      scale: [1, 1.3, 1],
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.button 
      onClick={handleToggleFavorite}
      className="shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors absolute -top-10 right-2 shadow"
      whileTap={{ scale: 0.9 }}
      variants={heartButtonVariants}
      initial="initial"
      animate={isInWishlistLocal ? "liked" : "initial"}
      disabled={isPendingWishlist}
    >
      <Heart 
        className={`h-4 w-4 ${isInWishlistLocal ? "fill-red-500 text-red-500" : ""} ${isPendingWishlist ? "opacity-50" : ""}`} 
      />
    </motion.button>
  )
}

export default function MegaCategory() {
  const { categories, isLoading: isCategoriesLoading } = useFeaturedCategories()
  const { products, isLoading: isProductsLoading } = useFeaturedProducts()
  const { promotions, isLoading: isPromotionsLoading } = useActivePromotions()

  return (
    <div className="flex flex-col md:flex-row gap-4 md:p-4 w-full md:h-[490px] min-h-[500px]">
      {/* More Reasons to Shop Section */}
      <div className="bg-[#ffe367] p-4 w-full md:w-1/3 h-full">
        <h2 className="text-base font-bold mb-4">MORE REASONS TO <span className="text-red-600 font-black">SHOP</span></h2>
        
        {isCategoriesLoading ? (
          <CategorySkeleton />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {categories.slice(0, 4).map((category) => (
              <Link href={`/c/${category.slug}`} key={category.id} className="relative h-[190px] rounded-lg overflow-hidden">
                <Image 
                  src={category.image || "/placeholder.jpg"} 
                  alt={category.title} 
                  fill 
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={DEFAULT_BLUR}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <h3 className="text-sm font-bold uppercase text-white">{category.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Mega Deals Section */}
      <div
        className="w-full md:w-1/3 h-full overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #f47d51 0%, #FFE872 100%)",
        }}
      >
        <div className="md:px-4 p-2 pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-white font-bold text-xl tracking-wide">MEGA DEALS</h2>
              <span className="text-[#801402] font-black hidden lg:block">24 HOURS ONLY</span>
            </div>
            <Button size="sm" className="bg-white hover:bg-gray-50 text-black font-semibold rounded-md px-4">
              VIEW ALL
            </Button>
          </div>
          
          {isProductsLoading ? (
            <ProductSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              {products.slice(0, 4).map((product) => (
                <Link href={`/p/${product.id}`} key={product.id} className="bg-white rounded-lg relative cursor-pointer">
                  <div className="absolute -top-[1px] right-0 z-10">
                    <span className="bg-[#e42921] text-white text-xs px-3 py-1.5 rounded-bl-md rounded-tr-lg">
                      {product.departmentName}
                    </span>
                  </div>
                  <div className="relative h-[110px] w-full">
                    <Image
                      src={product.imageUrl || "/placeholder.jpg"}
                      alt={product.title}
                      fill
                      className="object-cover w-full h-full rounded-t-lg"
                      placeholder="blur"
                      blurDataURL={DEFAULT_BLUR}
                    />
                  </div>
                  <div className="space-y-2 p-2 bg-[#ececec] rounded-b-lg relative">
                    <p className="text-xs text-gray-600 leading-tight flex-1">{product.title}</p>
                    <div className="flex items-baseline gap-2">
                      {product.isDiscount && product.salePrice ? (
                        <>
                          <span className="text-gray-400 text-xs line-through">{product.productPrice} AED</span>
                          <span className="text-base font-bold">{product.salePrice} AED</span>
                        </>
                      ) : (
                        <span className="text-base font-bold">{product.productPrice} AED</span>
                      )}
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <WishlistHeartButton productId={product.id} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* In Focus Section */}
      <div className="bg-[#ce4830] p-4 w-full md:w-1/3 h-full md:block hidden">
        <h2 className="text-base font-bold mb-4">
          IN <span className="text-[#144ce4] font-black">FOCUS</span>
        </h2>
        
        {isPromotionsLoading ? (
          <PromotionSkeleton />
        ) : (
          <div className="space-y-4 h-[calc(100%-3rem)]">
            {promotions.length > 0 ? (
              promotions.slice(0, 2).map((promotion) => (
                <Link href={`/content/${promotion.slug}?type=promotion`}
                  key={promotion.id} 
                  className="relative h-[48%] rounded-lg overflow-hidden cursor-pointer block"
                >
                  <Image
                    src={promotion.imageUrl || "/placeholder.jpg"}
                    alt={promotion.title}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={DEFAULT_BLUR}
                  />
                </Link>
              ))
            ) : (
              <>
                <div className="relative h-[48%] rounded-lg overflow-hidden cursor-pointer">
                  <Image
                    src="https://f.nooncdn.com/mpcms/EN0001/assets/5f1945b8-0966-4817-86e9-83c051f7cf0c.png?format=avif"
                    alt="Promotional banner"
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={DEFAULT_BLUR}
                  />
                </div>
                <div className="relative h-[48%] rounded-lg overflow-hidden cursor-pointer">
                  <Image
                    src="https://f.nooncdn.com/ads/banner-410x410/en_dk_uae-top-02.1740135597.1301847.png?format=avif"
                    alt="Promotional banner"
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={DEFAULT_BLUR}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}