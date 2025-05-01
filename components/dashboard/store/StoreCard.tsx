"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Eye, ShoppingBag } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { StoreWithUser } from "@/types/types"

// interface StoreCardProps {
//   store: StoreWithUser
// }

export function StoreCard({ store }: any) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <div className="p-6 flex gap-4">
        <div className="h-16 w-16 rounded-md bg-amber-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {store.logo ? (
            <img src={store.logo || "/placeholder.svg"} alt={store.storeName} className="h-full w-full object-cover" />
          ) : (
            <ShoppingBag className="h-8 w-8 text-amber-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-base line-clamp-1">{store.storeName}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">by {store.user.name}</p>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="gap-1 h-8" asChild>
                <Link href={`/dashboard/stores/${store.id}`}>
                  <Eye className="h-3.5 w-3.5" />
                  <span>View</span>
                </Link>
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {store.description || "No description provided"}
          </p>

          <p className="text-xs text-muted-foreground">Created {format(new Date(store.createdAt), "MMM d, yyyy")}</p>
        </div>
      </div>
    </Card>
  )
}

