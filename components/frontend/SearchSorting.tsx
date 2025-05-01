"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown } from "lucide-react"

interface SearchSortingProps {
  currentSort?: string;
  searchParamsString: string;
}

export function SearchSorting({ 
  currentSort = "relevance",
  searchParamsString
}: SearchSortingProps) {
  const router = useRouter()

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParamsString)

    if (value === "relevance") {
      params.delete("sort")
    } else {
      params.set("sort", value)
    }

    params.delete("page")

    router.push(`/search?${params.toString()}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          <span>Sort by</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuRadioGroup value={currentSort} onValueChange={handleSortChange}>
          <DropdownMenuRadioItem value="relevance">Relevance</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price-low">Price: Low to High</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="price-high">Price: High to Low</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="rating">Highest Rated</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}