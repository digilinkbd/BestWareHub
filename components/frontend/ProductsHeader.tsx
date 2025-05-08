"use client"
import { ChevronDown, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface ProductsHeaderProps {
  selectedFilters: string[]
  toggleFilter: (type: string, value: string) => void
  clearAllFilters: () => void
  updateFilters: (params: any) => void
  currentParams: any
  totalProducts: number
  subCategoryTitle: string
}

const ProductsHeader = ({
  selectedFilters,
  toggleFilter,
  clearAllFilters,
  updateFilters,
  currentParams,
  totalProducts,
  subCategoryTitle,
}: ProductsHeaderProps) => {
  const sortOptions = {
    recommended: "Recommended",
    "price-low-high": "Price: Low to High",
    "price-high-low": "Price: High to Low",
    newest: "New Arrivals",
  }

  const limitOptions = {
    "20": "20 Per Page",
    "50": "50 Per Page",
    "100": "100 Per Page",
  }

  return (
    <div className="bg-white rounded-lg shadow-sm md:p-4 p-3 mb-4">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <h1 className="text-gray-700 font-medium">
          <span className="text-blue-600 font-bold">{totalProducts}</span> Results for{" "}
          <span className="font-semibold">"{subCategoryTitle} in BAN"</span>
        </h1>

        <div className="md:ml-auto flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm hidden md:inline">Sort By</span>
            <Select value={currentParams.sort} onValueChange={(value) => updateFilters({ sort: value })}>
              <SelectTrigger className="w-40 border-gray-300 text-sm">
                <SelectValue placeholder="Recommended" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(sortOptions).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm hidden md:inline">Display</span>
            <Select
              value={String(currentParams.limit)}
              onValueChange={(value) => updateFilters({ limit: Number.parseInt(value) })}
            >
              <SelectTrigger className="w-36 border-gray-300 text-sm">
                <SelectValue placeholder="50 Per Page" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(limitOptions).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-4 overflow-x-auto pb-1">
          <Badge
            variant="outline"
            className="flex items-center gap-1 border-blue-500 rounded-full px-3 py-1 bg-white text-sm"
          >
            <span>Brand</span>
            <ChevronDown className="h-4 w-4" />
          </Badge>

          {selectedFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="outline"
              className="flex items-center gap-1 rounded-full px-3 py-1 bg-white text-sm whitespace-nowrap"
            >
              <span>{filter}</span>
              <button
                onClick={() => {
                  // Extract filter type and value
                  const [type, value] = filter.split(": ")
                  if (type && value) {
                    const filterType = type.toLowerCase()
                    if (filterType === "brand") {
                      // Find the brand ID from the name
                      const brandId = currentParams.brandId?.find((id: string) => filter.includes(id))
                      if (brandId) toggleFilter("brand", brandId)
                    } else if (filterType === "price") {
                      updateFilters({ minPrice: undefined, maxPrice: undefined })
                    } else if (filterType === "rating") {
                      updateFilters({ rating: undefined })
                    } else if (filterType === "new") {
                      updateFilters({ newArrivals: undefined })
                    } else if (filterType === "deal") {
                      toggleFilter("deal", value.trim())
                    } else if (filterType === "seller") {
                      toggleFilter("seller", value.trim())
                    } else if (filter === "Express Delivery") {
                      toggleFilter("delivery", "express")
                    }
                  }
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </Badge>
          ))}

          {selectedFilters.length > 0 && (
            <button onClick={clearAllFilters} className="text-blue-600 text-sm hover:underline">
              Clear All
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductsHeader

