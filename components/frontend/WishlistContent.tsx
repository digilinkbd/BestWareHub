// app/wishlist/WishlistContent.tsx
"use client"

import { useState } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Share, Plus, Copy, Lock, Unlock, AlertCircle } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import WishlistSkeleton from "./WishlistSkeleton"
import { useCreateWishlist, useRemoveFromWishlist, useUpdateWishlistVisibility, useWishlist } from "@/hooks/wishlist"
import ProductCard from "./product-card"

export default function WishlistContent() {
  const { wishlist, items, isLoading } = useWishlist()
  const updateVisibility = useUpdateWishlistVisibility()
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [newWishlistName, setNewWishlistName] = useState("")
  const createWishlistMutation = useCreateWishlist()
  const removeFromWishlist = useRemoveFromWishlist()
  const router = useRouter()
  const { data: session } = useSession()
  
  // Transform wishlist items to product format for ProductCard
  const wishlistProducts = items?.map((item:any)=>{
    const product = item.product
    return {
      id: product.id,
      title: product.title,
      price: product.salePrice || product.productPrice,
      oldPrice: product.isDiscount ? product.productPrice : null,
      discount: product.discount || 0,
      rating: product.rating || 0,
      slug: product.slug,
      reviews: product.reviews?.length || 0,
      image: product.imageUrl || "",
      isBestSeller: false,
      category: product.subCategory?.title || product.category?.title || "",
      categoryRank: 0,
      deliveryOptions: ["Free Delivery", "Express Delivery"],
      promotionType: product.promotionType || null,
    }
  }) || []

  const handleCreateWishlist = () => {
    if (!newWishlistName.trim()) {
      toast.error("Please enter a wishlist name")
      return
    }
    
    createWishlistMutation.mutate(newWishlistName, {
      onSuccess: () => {
        setNewWishlistName("")
        toast.success("Wishlist created successfully")
      }
    })
  }

  const handleToggleVisibility = () => {
    if (wishlist) {
      updateVisibility.mutate(
        { wishlistId: wishlist.id, isPublic: !wishlist.isPublic },
        {
          onSuccess: () => {
            toast.success(`Wishlist is now ${wishlist.isPublic ? 'private' : 'public'}`)
          }
        }
      )
    }
  }

  const copyShareLink = () => {
    if (wishlist?.shareLink) {
      const shareLink = `${process.env.NEXT_PUBLIC_APP_URL}${wishlist.shareLink}`;
      navigator.clipboard.writeText(shareLink);
      toast.success("Share link copied to clipboard");
    }
  };
  

  if (isLoading) {
    return <WishlistSkeleton />
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:px-4 text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in to view your wishlist</h2>
        <p className="text-gray-600 mb-6">Create an account or sign in to save your favorite items</p>
        <Button onClick={() => router.push('/auth?returnUrl=/wishlist')}>
          Sign in
        </Button>
      </div>
    )
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Wishlist</h1>
          <Button onClick={() => router.push('/')}>
            <Plus className="mr-2 h-4 w-4" /> Add Items
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
  <video 
    src="https://f.nooncdn.com/s/app/com/noon/images/wishlist-empty-desktop.mp4" 
    autoPlay 
    loop 
    muted 
    playsInline 
    className="mx-auto mb-4  w-64 h-64 rounded-full"
  />
  <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
  <p className="text-gray-500 mb-6">
    Start adding items to your wishlist by clicking the heart icon on products
  </p>
  <Button onClick={() => router.push('/')}>
    Browse Products
  </Button>
</div>

      </div>
    )
  }

  return (
    <div className="md:container md:px-4 md:py-8 py-2 px-1 md:max-w-6xl w-full mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{wishlist?.name || "My Wishlist"}</h1>
          <p className="text-gray-500 text-sm">{wishlistProducts.length} items</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleToggleVisibility}
            className="flex items-center"
          >
            {wishlist?.isPublic ? (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                Public
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Private
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShareDialogOpen(true)}
            disabled={!wishlist?.isPublic}
            className={cn("flex items-center", 
              !wishlist?.isPublic && "opacity-50 cursor-not-allowed"
            )}
          >
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create New Wishlist
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {wishlistProducts.map((product) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <ProductCard product={product} />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => removeFromWishlist.mutate(product.id)}
              className="absolute top-2 right-2 z-20 p-1 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </Button>
          </motion.div>
        ))}
      </div>
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Wishlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input
                  readOnly
                  value={wishlist?.shareLink ? `${process.env.NEXT_PUBLIC_APP_URL}${wishlist.shareLink}` : ""}
                  className="w-full"
                />
              </div>
              <Button 
                type="button" 
                size="sm" 
                onClick={copyShareLink}
                className="px-3"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500">
                Anyone with this link can view your wishlist
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    if (wishlist?.shareLink) {
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(wishlist.shareLink)}`, '_blank')
                    }
                  }}
                >
                  Share on Facebook
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    if (wishlist?.shareLink) {
                      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(wishlist.shareLink)}&text=Check out my wishlist!`, '_blank')
                    }
                  }}
                >
                  Share on Twitter
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Create Wishlist Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="hidden">Create New Wishlist</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Wishlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Wishlist Name"
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value)}
              />
              <Button 
                onClick={handleCreateWishlist}
                disabled={createWishlistMutation.isPending}
              >
                {createWishlistMutation.isPending ? "Creating..." : "Create Wishlist"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}