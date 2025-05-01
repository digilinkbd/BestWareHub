"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useQuery } from "@tanstack/react-query"
import { getHomeDepartments } from "@/actions/departments"
import { Skeleton } from "@/components/ui/skeleton"
import { DEFAULT_BLUR } from "@/lib/lazyLoading"
import Link from "next/link"

// Define TypeScript interfaces for the Department data
export interface DepartmentData {
  id: string
  title: string
  slug: string
  image: string
  isActive: boolean
}

export default function HomeDepartments() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  
  const isMobile = useMediaQuery("(max-width: 767px)")

  // Fetch departments using React Query
  const { data: departments, isLoading, error } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const data = await getHomeDepartments()
      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes before refetching
  })

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    
    // Calculate active index based on screen size
    const itemsPerRow = isMobile ? 4 : 8
    setActiveIndex(Math.floor(scrollLeft / (clientWidth / itemsPerRow)))
  }, [isMobile])

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    
    const { clientWidth } = scrollRef.current
    const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  // Single useEffect for scroll event
  useEffect(() => {
    const scrollElement = scrollRef.current
    if (!scrollElement) return
    
    // Initial check
    handleScroll()
    
    scrollElement.addEventListener("scroll", handleScroll)
    return () => scrollElement.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // Calculate number of indicators based on active departments
  const activeDepartments = departments?.filter(dept => dept.isActive) || []
  const totalIndicators = Math.ceil(activeDepartments.length / (isMobile ? 8 : 8))

  return (
    <div className="relative w-full max-w-[1500px] mx-auto px-4 py-5 bg-[#fff4d0]">
      {/* Navigation Arrows */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-[38%] -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full md:block hidden hover:bg-gray-50 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
      )}
      {showRightArrow && !isLoading && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-[38%] -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg md:block hidden hover:bg-gray-50 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>
      )}

      {/* Departments Grid */}
      <div 
        ref={scrollRef}
        className={`
          overflow-x-auto scrollbar-hide snap-x snap-mandatory
          ${isMobile 
            ? "grid grid-rows-2 grid-flow-col auto-cols-[70px] gap-x-3 gap-y-4" 
            : "grid grid-flow-col auto-cols-[90px] gap-x-4 gap-y-0"
          }
        `}
      >
        {isLoading ? (
          // Loading skeleton UI
          Array.from({ length: 15 }).map((_, index) => (
            <div key={index} className="snap-start flex flex-col items-center gap-2">
              <Skeleton className="w-full aspect-square rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))
        ) : error ? (
          <div className="col-span-full text-center text-red-500">
            Failed to load departments
          </div>
        ) : (
          // Render actual departments
          activeDepartments.map((dept) => (
            <Link href={`/d/${dept.slug}`} key={dept.id} className="snap-start flex flex-col items-center gap-2 cursor-pointer group">
              <div className="relative w-full aspect-square overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <Image
                    src={dept.image || "/placeholder.jpg"}
                    alt={dept.title}
                    fill
                    className="object-cover scale-110 group-hover:scale-125 transition-transform duration-300"
                      placeholder="blur"
                      blurDataURL={DEFAULT_BLUR}
                  />
                </div>

                {/* Gradient Overlay - Transparent at top, color at bottom */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent via-transparent to-blue-500/30 group-hover:to-blue-500/60 transition-colors duration-300" />

                {/* Star-shaped Border */}
                <div className="absolute inset-0 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] border border-white/10" />
              </div>

              {/* Department name */}
              <span className="text-[10px] md:text-xs font-semibold text-gray-800 text-center leading-tight max-w-[90%] line-clamp-3">
                {dept.title}
              </span>
            </Link>
          ))
        )}
      </div>

      {/* Indicators */}
      {!isLoading && (
        <div className="flex justify-center mt-1 space-x-2">
          {Array.from({ length: totalIndicators }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? "w-7 bg-yellow-400" : "w-1.5 bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}