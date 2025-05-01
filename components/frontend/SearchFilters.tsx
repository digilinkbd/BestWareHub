"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { SearchFilter } from "@/types/search"
import { getSearchFilters } from "@/actions/search"

export function SearchFilters({
  query,
  selectedCategory,
  selectedBrand,
  sort,
  page,
  allSearchParams = {},
}: {
  query: string
  selectedCategory: string
  selectedBrand: string
  sort?: string
  page?: number
  allSearchParams?: Record<string, string>
}) {
  const router = useRouter()
  const [categories, setCategories] = useState<SearchFilter[]>([])
  const [brands, setBrands] = useState<SearchFilter[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFilters = async () => {
      setIsLoading(true)
      try {
        const { categories, brands } = await getSearchFilters(query)
        setCategories(categories)
        setBrands(brands)
      } catch (error) {
        console.error("Error fetching filters:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFilters()
  }, [query])

  const handleFilterChange = (type: string, value: string) => {
    const params = new URLSearchParams()
    
    Object.entries(allSearchParams).forEach(([key, value]) => {
      params.set(key, value)
    })

    // Update or remove the specific filter
    if (params.get(type) === value) {
      params.delete(type)
    } else {
      params.set(type, value)
    }

    // Reset to page 1 when filters change
    params.delete("page")

    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    // Create a new URLSearchParams object from the current search params
    const params = new URLSearchParams()
    
    // Add all current search params except filters
    Object.entries(allSearchParams).forEach(([key, value]) => {
      if (key !== "category" && key !== "brand" && key !== "page") {
        params.set(key, value)
      }
    })

    router.push(`/search?${params.toString()}`)
  }

  const hasActiveFilters = selectedCategory || selectedBrand


  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <Accordion type="single" collapsible defaultValue="categories">
            <AccordionItem value="categories" className="border-b">
              <AccordionTrigger className="text-sm font-medium">Categories</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategory === category.slug}
                        onCheckedChange={() => handleFilterChange("category", category.slug)}
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="text-sm cursor-pointer flex items-center justify-between w-full"
                      >
                        <span>{category.title}</span>
                        <span className="text-xs text-gray-500">({category.count})</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="brands" className="border-b">
              <AccordionTrigger className="text-sm font-medium">Brands</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`brand-${brand.id}`}
                        checked={selectedBrand === brand.slug}
                        onCheckedChange={() => handleFilterChange("brand", brand.slug)}
                      />
                      <Label
                        htmlFor={`brand-${brand.id}`}
                        className="text-sm cursor-pointer flex items-center justify-between w-full"
                      >
                        <span>{brand.title}</span>
                        <span className="text-xs text-gray-500">({brand.count})</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  )
}

