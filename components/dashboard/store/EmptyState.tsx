"use client"

import { ShoppingBag } from "lucide-react"

interface EmptyStateProps {
  hasSearch: boolean
}

export function EmptyState({ hasSearch }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No stores found</h3>
      <p className="mt-1 text-muted-foreground">
        {hasSearch ? "Try different search terms or filters" : "No stores available with the selected filter"}
      </p>
    </div>
  )
}

