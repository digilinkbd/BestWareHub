import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { 
  addToWishlist, 
  removeFromWishlist, 
  isInWishlist, 
  getOrCreateWishlist,
  createWishlist,
  updateWishlistVisibility,
  getUserWishlists
} from "@/actions/wishlist"
import toast from "react-hot-toast"

// Hook to fetch user's wishlists
export const useWishlists = () => {
  const wishlistsQuery = useQuery({
    queryKey: ["wishlists"],
    queryFn: async () => {
      const data = await getUserWishlists()
      return data || []
    }
  })

  return {
    wishlists: wishlistsQuery.data || [],
    isLoading: wishlistsQuery.isPending,
    error: wishlistsQuery.error,
    refetch: wishlistsQuery.refetch
  }
}

// Hook to get or create default wishlist
export const useWishlist = () => {
  const wishlistQuery = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const data = await getOrCreateWishlist()
      return data || null
    }
  })

  return {
    wishlist: wishlistQuery.data,
    items: wishlistQuery.data?.products || [],
    isLoading: wishlistQuery.isPending,
    error: wishlistQuery.error,
    refetch: wishlistQuery.refetch
  }
}

// Hook to check if a product is in wishlist
export const useIsInWishlist = (productId: string) => {
  const productInWishlistQuery = useQuery({
    queryKey: ["wishlist", "isInWishlist", productId],
    queryFn: async () => {
      const isInList = await isInWishlist(productId)
      return isInList
    }
  })

  return {
    isInWishlist: productInWishlistQuery.data || false,
    isLoading: productInWishlistQuery.isPending,
    error: productInWishlistQuery.error,
    refetch: productInWishlistQuery.refetch
  }
}

// Hook to add product to wishlist
export const useAddToWishlist = () => {
  const queryClient = useQueryClient()
  
  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await addToWishlist(productId)
    },
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error)
      } else {
        if (data.added) {
          toast.success("Added to wishlist")
        } else {
          toast.dismiss(data.message)
        }
        queryClient.invalidateQueries({ queryKey: ["wishlist"] })
        queryClient.invalidateQueries({ queryKey: ["wishlists"] })
        queryClient.invalidateQueries({ queryKey: ["wishlist", "isInWishlist"] })
      }
    },
    onError: () => {
      toast.error("Failed to add to wishlist")
    }
  })

  return addToWishlistMutation
}

// Hook to remove product from wishlist
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient()
  
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await removeFromWishlist(productId)
    },
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error)
      } else {
        toast.success("Removed from wishlist")
        queryClient.invalidateQueries({ queryKey: ["wishlist"] })
        queryClient.invalidateQueries({ queryKey: ["wishlists"] })
        queryClient.invalidateQueries({ queryKey: ["wishlist", "isInWishlist"] })
      }
    },
    onError: () => {
      toast.error("Failed to remove from wishlist")
    }
  })

  return removeFromWishlistMutation
}

// Hook to create new wishlist
export const useCreateWishlist = () => {
  const queryClient = useQueryClient()
  
  const createWishlistMutation = useMutation({
    mutationFn: async (name: string) => {
      return await createWishlist(name)
    },
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error)
      } else {
        toast.success("Wishlist created")
        queryClient.invalidateQueries({ queryKey: ["wishlists"] })
      }
    },
    onError: () => {
      toast.error("Failed to create wishlist")
    }
  })

  return createWishlistMutation
}

// Hook to update wishlist visibility
export const useUpdateWishlistVisibility = () => {
  const queryClient = useQueryClient()
  
  const updateVisibilityMutation = useMutation({
    mutationFn: async ({ wishlistId, isPublic }: { wishlistId: string, isPublic: boolean }) => {
      return await updateWishlistVisibility(wishlistId, isPublic)
    },
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error)
      } else {
        toast.success(data.message)
        queryClient.invalidateQueries({ queryKey: ["wishlist"] })
        queryClient.invalidateQueries({ queryKey: ["wishlists"] })
      }
    },
    onError: () => {
      toast.error("Failed to update wishlist visibility")
    }
  })

  return updateVisibilityMutation
}