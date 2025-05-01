"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { StarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Review } from "@prisma/client"
import { useAddReview } from "@/hooks/useProduct"
import {useRouter } from "next/navigation"

interface ProductReviewsProps {
  productId: string
  productSlug: string
  reviews: Array<
    Review & {
      user: {
        id: string
        name: string
        image: string | null
      }
    }
  >
}

export default function ProductReviews({ productId, productSlug, reviews }: ProductReviewsProps) {
  const { data: session } = useSession()
  console.log(session)
  const router=useRouter()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const { addReview, isSubmitting } = useAddReview()

  const handleSubmitReview = () => {
    if (!session?.user) {
      router.push(`/auth?returnUrl=${productSlug}`);
      return
    }

    addReview({
      productId,
      productSlug,
      userId: session.user.id as string,
      rating,
      comment,
    })

    // Reset form
    setRating(5)
    setComment("")
  }

  // Calculate average rating
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  // Count ratings by star level
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review) => review.rating === star).length,
  }))

  return (
    <div className="pt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Rating Summary */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">{averageRating.toFixed(1)} out of 5</span>
            </div>

            <div className="space-y-2">
              {ratingCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-8 text-sm">{star} star</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2">
          {/* Add Review Form */}
          <div className="mb-8 border p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

            {session?.user ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                        <StarIcon
                          className={`h-6 w-6 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Comment</label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="resize-none"
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || !comment.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="mb-4">Please sign in to leave a review</p>
                <Button  onClick={() => router.push(`/auth?returnUrl=/p/${productSlug}`)} className="bg-blue-600 hover:bg-blue-700">Sign In</Button>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">
              {reviews.length > 0 ? `${reviews.length} Reviews` : "No reviews yet"}
            </h3>

            {reviews.length === 0 && (
              <div className="text-center py-8 border rounded-lg bg-gray-50">
                <p className="text-gray-500">Be the first to review this product</p>
              </div>
            )}

            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.user.image || undefined} />
                    <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{review.user.name}</h4>
                      <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex my-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

