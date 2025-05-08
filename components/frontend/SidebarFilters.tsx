"use client"

import { useState, useEffect } from "react"
import { Minus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { Skeleton } from "@/components/ui/skeleton"

interface Brand {
  id: string
  title: string
  slug: string
  count: number
}

interface Vendor {
  id: string
  title: string
  slug: string
  count: number
}

interface CategoryHierarchy {
  department: {
    id: string
    title: string
    slug: string
  }
  category: {
    id: string
    title: string
    slug: string
  }
  subCategory: {
    id: string
    title: string
    slug: string
  }
  departmentCategories: {
    id: string
    title: string
    slug: string
  }[]
  siblingSubCategories: {
    id: string
    title: string
    slug: string
  }[]
}

interface SidebarFiltersProps {
  selectedFilters: string[]
  brands: Brand[]
  vendors: Vendor[]
  categoryHierarchy: any
  priceRange: { min: number; max: number }
  isLoading: boolean
  isBrandsLoading: boolean
  isCategoryLoading: boolean
  isVendorsLoading: boolean
  toggleFilter: (type: string, value: string) => void
  updateFilters: (params: any) => void
  currentParams: any
}

const SidebarFilters = ({
  selectedFilters,
  brands,
  vendors,
  categoryHierarchy,
  priceRange,
  isLoading,
  isBrandsLoading,
  isCategoryLoading,
  isVendorsLoading,
  toggleFilter,
  updateFilters,
  currentParams,
}: SidebarFiltersProps) => {
  const [brandSearch, setBrandSearch] = useState("")
  const [vendorSearch, setVendorSearch] = useState("")
  const [priceValues, setPriceValues] = useState<number[]>([
    currentParams.minPrice || priceRange.min,
    currentParams.maxPrice || priceRange.max,
  ])
  const [ratingValue, setRatingValue] = useState<number[]>([currentParams.rating || 0])

  // Update price slider when price range changes
  useEffect(() => {
    setPriceValues([currentParams.minPrice || priceRange.min, currentParams.maxPrice || priceRange.max])
  }, [priceRange, currentParams.minPrice, currentParams.maxPrice])

  // Filter brands based on search
  const filteredBrands = brands.filter((brand) => brand.title.toLowerCase().includes(brandSearch.toLowerCase()))

  // Filter vendors based on search
  const filteredVendors = vendors.filter((vendor) => vendor.title.toLowerCase().includes(vendorSearch.toLowerCase()))

  // Handle price range change
  const handlePriceChange = (values: number[]) => {
    setPriceValues(values)
  }

  // Apply price filter
  const applyPriceFilter = () => {
    updateFilters({
      minPrice: priceValues[0],
      maxPrice: priceValues[1],
    })
  }

  // Handle rating change
  const handleRatingChange = (values: number[]) => {
    setRatingValue(values)
    updateFilters({ rating: values[0] })
  }

  const deliveryModes = [{ id: "express", label: "Express", count: 352 }]

  const deals = [
    { id: "ramadan", label: "Ramadan Ready Deal 🌙", count: 52 },
    { id: "deal", label: "Deal", count: 26 },
  ]

  const newArrivals = [
    { id: "last-7", label: "Last 7 Days" },
    { id: "last-30", label: "Last 30 Days" },
    { id: "last-60", label: "Last 60 Days" },
  ]

  return (
    <aside className="w-64 bg-white rounded-lg shadow-sm p-4 h-fit">
      <div className="space-y-4 py-2">
        <Accordion
          type="multiple"
          defaultValue={["delivery", "category", "brand", "price", "deals", "rating", "new-arrivals", "seller"]}
        >
          {/* Delivery Mode */}
          <AccordionItem value="delivery">
            <AccordionTrigger className="text-base font-medium">Delivery Mode</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {deliveryModes.map((mode) => (
                  <div key={mode.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`delivery-${mode.id}`}
                      checked={currentParams.deliveryModes?.includes(mode.id)}
                      onCheckedChange={() => toggleFilter("delivery", mode.id)}
                    />
                    <label htmlFor={`delivery-${mode.id}`} className="text-sm cursor-pointer flex items-center">
                      <span className="bg-yellow-300 px-2 py-0.5 rounded mr-2">{mode.label}</span>
                      <span className="text-gray-500">({mode.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Category */}
          <AccordionItem value="category">
            <AccordionTrigger className="text-base font-medium">Category</AccordionTrigger>
            <AccordionContent>
              {isCategoryLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full ml-4" />
                  <Skeleton className="h-5 w-full ml-8" />
                  <Skeleton className="h-5 w-full ml-12" />
                </div>
              ) : categoryHierarchy ? (
                <div className="space-y-1 pl-2">
                  <div className="flex items-center space-x-2">
                    <Minus className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{categoryHierarchy.department.title}</span>
                  </div>

                  {categoryHierarchy.departmentCategories.map((depCategory:any) => (
                    <div key={depCategory.id} className="pl-6">
                      {depCategory.id === categoryHierarchy.category.id ? (
                        <>
                          <div className="flex items-center space-x-2">
                            <Minus className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium">{depCategory.title}</span>
                          </div>

                          {categoryHierarchy.siblingSubCategories.map((subCat:any) => (
                            <div
                              key={subCat.id}
                              className={`pl-6 text-sm py-1 ${subCat.id === categoryHierarchy.subCategory.id ? "font-medium text-blue-600" : "text-gray-600"}`}
                            >
                              {subCat.title}
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="text-sm text-gray-600 py-1">{depCategory.title}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No category data available</div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Brand */}
          <AccordionItem value="brand">
            <AccordionTrigger className="text-base font-medium">Brand</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search"
                    className="pl-8"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                  />
                </div>
                {isBrandsLoading ? (
                  <div className="space-y-2">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-8" />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {filteredBrands.length > 0 ? (
                      filteredBrands.map((brand) => (
                        <div key={brand.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`brand-${brand.id}`}
                              checked={currentParams.brandId?.includes(brand.id)}
                              onCheckedChange={() => toggleFilter("brand", brand.id)}
                            />
                            <label htmlFor={`brand-${brand.id}`} className="text-sm cursor-pointer">
                              {brand.title}
                            </label>
                          </div>
                          <span className="text-sm text-gray-500">({brand.count})</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No brands found</div>
                    )}
                  </div>
                )}
                {filteredBrands.length > 8 && (
                  <Button variant="link" className="text-gray-600 p-0 h-auto text-sm">
                    See All
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Price Range */}
          <AccordionItem value="price">
            <AccordionTrigger className="text-base font-medium">Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>BDT {priceValues[0]}</span>
                  <span>BDT {priceValues[1]}</span>
                </div>
                <Slider
                  min={priceRange.min}
                  max={priceRange.max}
                  step={1}
                  value={priceValues}
                  onValueChange={handlePriceChange}
                  className="w-full"
                />
                <Button onClick={applyPriceFilter} className="w-full text-sm" variant="outline">
                  Apply Price
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Deals */}
          <AccordionItem value="deals">
            <AccordionTrigger className="text-base font-medium">Deals</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {deals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`deal-${deal.id}`}
                        checked={currentParams.deals?.includes(deal.id)}
                        onCheckedChange={() => toggleFilter("deal", deal.id)}
                      />
                      <label htmlFor={`deal-${deal.id}`} className="text-sm cursor-pointer">
                        {deal.label}
                      </label>
                    </div>
                    <span className="text-sm text-gray-500">({deal.count})</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Product Rating */}
          <AccordionItem value="rating">
            <AccordionTrigger className="text-base font-medium">Product Rating</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="font-medium text-sm">{ratingValue[0]} Stars or more</div>
                <Slider
                  min={0}
                  max={5}
                  step={0.1}
                  value={ratingValue}
                  onValueChange={handleRatingChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0 Star</span>
                  <span>5 Star</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* New Arrivals */}
          <AccordionItem value="new-arrivals">
            <AccordionTrigger className="text-base font-medium">New Arrivals</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {newArrivals.map((arrival) => (
                  <div key={arrival.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`arrival-${arrival.id}`}
                      checked={currentParams.newArrivals === arrival.id}
                      onCheckedChange={() =>
                        updateFilters({ newArrivals: currentParams.newArrivals === arrival.id ? null : arrival.id })
                      }
                    />
                    <label htmlFor={`arrival-${arrival.id}`} className="text-sm cursor-pointer">
                      {arrival.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Seller */}
          <AccordionItem value="seller">
            <AccordionTrigger className="text-base font-medium">Seller</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search"
                    className="pl-8"
                    value={vendorSearch}
                    onChange={(e) => setVendorSearch(e.target.value)}
                  />
                </div>
                {isVendorsLoading ? (
                  <div className="space-y-2">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-8" />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {filteredVendors.length > 0 ? (
                      filteredVendors.map((vendor) => (
                        <div key={vendor.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`seller-${vendor.id}`}
                              checked={currentParams.sellers?.includes(vendor.id)}
                              onCheckedChange={() => toggleFilter("seller", vendor.id)}
                            />
                            <label htmlFor={`seller-${vendor.id}`} className="text-sm cursor-pointer">
                              {vendor.title}
                            </label>
                          </div>
                          <span className="text-sm text-gray-500">({vendor.count})</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No sellers found</div>
                    )}
                  </div>
                )}
                {filteredVendors.length > 8 && (
                  <Button variant="link" className="text-gray-600 p-0 h-auto text-sm">
                    See All
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  )
}

export default SidebarFilters

