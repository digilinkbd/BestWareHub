"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useFetchDepartments } from "@/hooks/useHeader"
import { DEFAULT_BLUR, DEFAULT_IMAGE } from "@/lib/lazyLoading"

// Define TypeScript interfaces for our data structure
interface Brand {
  id: string
  title: string
  slug: string
  imageUrl?: string | null
  logo?: string | null
}

interface SubCategory {
  id: string
  title: string
  slug: string
  image?: string | null
  brands: Brand[]
}

interface Category {
  id: string
  title: string
  slug: string
  image: string
  subCategories: SubCategory[]
}

interface Department {
  id: string
  title: string
  slug: string
  image: string
  categories: Category[]
}

export default function CategoryNav() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [activeDepartment, setActiveDepartment] = useState<string | null>(null)
  const [activeDepartmentWidth, setActiveDepartmentWidth] = useState(0)
  const [activeDepartmentLeft, setActiveDepartmentLeft] = useState(0)
   
  // Fetch departments data using custom hook
  const { departments, isLoading, error } = useFetchDepartments()

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }, [])

  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [checkScroll])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handleMouseEnter = (departmentSlug: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    setActiveDepartment(departmentSlug);
  
    if (event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      setActiveDepartmentWidth(rect.width); 
      setActiveDepartmentLeft(rect.left); 
    }
  };
  
  const handleMouseLeave = () => {
    setActiveDepartment(null)
  }
  
  // Get active department data
  const activeDepartmentData = departments.find(dept => dept.slug === activeDepartment)

  return (
    <nav className="relative border-b border-black/10 bg-[#fcfbf4]" onMouseLeave={handleMouseLeave}>
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between">
          {isLoading ? (
            // Skeleton loader for departments
            <div className="flex items-center gap-8 py-2 pr-16">
              {[1, 2, 3, 4, 5, 6 , 7 , 8 , 10 , 11 , 12].map((i) => (
                <Skeleton key={i} className="h-6 w-24 rounded-md" />
              ))}
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="flex items-center gap-8 overflow-x-auto py-2 scrollbar-hide pr-16"
              onScroll={checkScroll}
            >
              {departments.map((department) => (
                <Link
                  key={department.id}
                  href={`/d/${department.slug}`}
                  className={cn(
                    "relative text-base font-semibold whitespace-nowrap hover:text-black/70 transition-colors pb-2",
                  )}
                  onMouseEnter={(event) => handleMouseEnter(department.slug, event)}
                >
                  {department.title}
                </Link>
              ))}
            </div>
          )}

          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 transition-all z-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 transition-all z-10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {activeDepartment && activeDepartmentData && (
          <div className="absolute left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-200">
            {/* Active department indicator */}
            <div
              className="absolute top-0 h-[1.2px] bg-black transition-all duration-200"
              style={{
                width: activeDepartmentWidth,
                left: activeDepartmentLeft,
                transform: "translateY(-100%)"
              }}
            />
            
            <div className="container mx-auto px-4 py-4">
              {/* Main content grid */}
              <div className="grid grid-cols-6 gap-8">
                {/* Categories section - spans 4 columns */}
                <div className="col-span-4 grid grid-cols-4 gap-6">
                  {activeDepartmentData.categories.map((category) => (
                    <div key={category.id} className="space-y-4">
                      <h3 className="font-semibold text-sm pb-2">
                        {category.title}
                      </h3>
                      <ul className="space-y-2.5">
                        {category.subCategories.map((subCategory) => (
                          <li key={subCategory.id}>
                            <Link 
                              href={`/s-c/${subCategory.slug}`} 
                              className="text-sm text-gray-600 hover:text-black transition-colors duration-200 block line-clamp-2"
                            >
                              {subCategory.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="col-span-2">
                  {/* Featured promo with department image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                    <Image
                      src={activeDepartmentData.image ?? DEFAULT_IMAGE}
                      alt={`${activeDepartmentData.title} promotion`}
                      fill
                      placeholder="blur"
                      blurDataURL={DEFAULT_BLUR}
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h4 className="text-lg font-bold mb-1">{activeDepartmentData.title}</h4>
                      <p className="text-sm opacity-90">Explore our collection</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brands section - only show if brands exist */}
              {activeDepartmentData.categories.some(cat => 
                cat.subCategories.some(subCat => subCat.brands.length > 0)
              ) && (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold mb-4">TOP BRANDS</h3>
                  <div className="grid grid-cols-9 gap-4">
                    {/* Get brands from all subcategories, flatten and take first 9 */}
                    {activeDepartmentData.categories
                      .flatMap(cat => cat.subCategories)
                      .flatMap(subCat => subCat.brands)
                      .slice(0, 9)
                      .map((brand) => (
                        <div key={brand.id} className="flex flex-col items-center">
                          <Link
                            href={`/brand/${brand.slug}`}
                            className="flex items-center justify-center border border-gray-200 rounded-lg hover:border-gray-300 transition-colors w-full h-16 bg-white"
                          >
                            <Image
                              src={brand.logo || brand.imageUrl || "/placeholder-brand.png"}
                              alt={brand.title}
                              width={80}
                              height={20}
                              className="object-cover h-full w-full"
                            />
                          </Link>
                          <span className="text-xs mt-2 text-center">{brand.title}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}