"use client"
import Image from "next/image"
import Link from "next/link"
import { Info, Package, Truck } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { ProductWithRelations3 } from "@/types/types"
import type { Store } from "@prisma/client"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DeliveryInfoProps {
  product: ProductWithRelations3
  vendor?: {
    id: string
    name: string
    image: string | null
    store?: Store | null
  } | null
  store?: Store | null
}

export default function DeliveryInfo({ product, vendor, store }: DeliveryInfoProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 border-[1px] border-gray-200 rounded">
        <div className="flex flex-col space-y-4">
          {/* Product Title and Price */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 shrink-0">
              <Image
                src={product.imageUrl || "/placeholder.jpg"}
                alt="Product thumbnail"
                width={48}
                height={48}
                className="rounded-md object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium line-clamp-2">{product.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-medium">
                  AED {(product.salePrice || product.productPrice).toFixed(2)}
                </span>
                {product.isFeatured && (
                  <span className="bg-yellow-400 text-[10px] px-1.5 py-0.5 rounded font-medium">express</span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="https://f.nooncdn.com/s/app/com/noon/icons/noon-locker.svg" alt="" />
              <div>
                <p className="text-sm">Free delivery on Lockers & Pickup Points</p>
                <button className="text-sm text-blue-600 hover:underline">Learn more</button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <img src="https://f.nooncdn.com/s/app/com/noon/icons/noon-locker.svg" alt="" />
              <div>
                <p className="text-sm text-gray-600">Enjoy hassle free returns with this offer.</p>
                <button className="text-sm text-blue-600 hover:underline">Learn more</button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Store/Vendor Info */}
          {(vendor || store) && (
            <>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-100 overflow-hidden relative">
                  <Image
                    src={store?.logo || vendor?.image || "/placeholder.jpg"}
                    alt={`${store?.storeName || vendor?.name} logo`}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="text-sm flex-1">
                  Sold by{" "}
                  <Link
                    href={store ? `/store/${store.slug}` : `/vendor/${vendor?.id}`}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    {store?.storeName || vendor?.name}
                  </Link>
                </div>
             


<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <span>
        {store ? (
          <Link
            href={`/store/${store.slug}`}
            className="text-sm text-blue-600 hover:underline"
          >
            View all
          </Link>
        ) : (
          <span className="text-sm text-gray-400 cursor-not-allowed">View all</span>
        )}
      </span>
    </TooltipTrigger>
    {!store && <TooltipContent>Unable to access store currently</TooltipContent>}
  </Tooltip>
</TooltipProvider>

              </div>
              <Separator />
            </>
          )}

          {/* Shipping Features */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">FREE RETURNS</p>
                <p className="text-sm text-muted-foreground">Get free returns on eligible items</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">TRUSTED SHIPPING</p>
                <p className="text-sm text-muted-foreground">
                  Free shipping when you spend AED 100 and above on express items
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">CONTACTLESS DELIVERY</p>
                <p className="text-sm text-muted-foreground">
                  Your delivery will be left at your door, valid on prepaid orders only
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

