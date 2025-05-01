"use client"

import { useState } from "react"
import { Info, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import Link from "next/link"
import { useCartStore } from "@/hooks/cart-store"

export function OrderSummary() {
  const { items, getTotal, getItemCount } = useCartStore()
  const [couponCode, setCouponCode] = useState("")

  return (
    <div>
      <Card className="mb-4">
        <CardContent className="p-0">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon Code"
                  className="flex-grow border rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#f7b614]"
                />
                <Button
                  className="bg-[#f7b614] hover:bg-yellow-600 text-white px-4 py-2 !border-none rounded-r-lg"
                  onClick={() => toast.success("Coupon applied successfully!")}
                >
                  APPLY
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full justify-between border rounded-lg p-2 text-[#f7b614] bg-yellow-50 mb-4"
            >
              <div className="flex items-center">
                <Info className="w-4 h-4 mr-2 text-[#f7b614]" />
                View Available Offers
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({getItemCount()} items)</span>
                <span>AED {getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Fee</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between pt-3 border-t font-bold">
                <span>
                  Total <span className="text-gray-500 font-normal text-lg">(Inclusive of VAT)</span>
                </span>
                <span className="text-xl">AED {getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#fcfbf5]">
            <div className="flex items-start mb-4">
              <div className="w-6 h-6 flex-shrink-0 mr-2">
                <img src="https://f.nooncdn.com/s/app/com/noon/icons/emi.svg" alt="EMI icon" className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <p className="text-sm text-gray-600">
                  Monthly payment plans from AED 500
                  <span className="text-[#f7b614] ml-1 cursor-pointer underline font-bold">View more details</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cashback Info */}
      <div className="mb-4 flex items-start">
        <img src="https://f.nooncdn.com/s/app/com/noon/icons/emi.svg" alt="EMI icon" className="w-6 h-6" />
        <div className="text-sm">
          Earn 5% cashback with Mashreq Kartify Credit Card.
          <Link href="#" className="text-[#f7b614] ml-1">
            T&C apply.
          </Link>
        </div>
      </div>

      {/* Buy Now Pay Later */}
      <div className="mb-6 text-center">
        <div className="mb-2 font-medium">Buy Now, Pay Later With Kartify EMI</div>
        <p className="text-sm text-gray-600 mb-2">
          Available when you spend AED 500 with select cards from the banks below.
          <Link href="#" className="text-[#f7b614] ml-1 underline">
            Find out more
          </Link>
        </p>

        {/* Bank Logos */}
        <div className="grid grid-cols-3 gap-4">
          {[
            "https://f.nooncdn.com/s/app/com/common/images/bank-logos/emirates-en.png",
            "https://f.nooncdn.com/s/app/com/common/images/bank-logos/adcb.svg",
            "https://f.nooncdn.com/s/app/com/common/images/bank-logos/mashreq.svg",
            "https://f.nooncdn.com/s/app/com/common/images/bank-logos/fab.svg",
            "https://f.nooncdn.com/s/app/com/common/images/bank-logos/rak.svg",
            "https://f.nooncdn.com/s/app/com/common/images/bank-logos/emirates-islamic.svg",
          ].map((bankLogo, index) => (
            <div key={index} className="border rounded-lg p-2 flex items-center justify-center">
              <img
                src={bankLogo || "/placeholder.svg"}
                alt={`Bank ${index + 1}`}
                className="w-full h-6 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

