"use client"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton" 
import { DepartmentPageDataType } from "@/types/types"

type DepartmentProps = {
  data: DepartmentPageDataType;
  isLoading: boolean;
  error?: any;
}

export default function DetailedDepHero({ data, isLoading, error }: DepartmentProps) {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [current, setCurrent] = useState(0)
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null)
  const [activeDepartment, setActiveDepartment] = useState<string | null>(null)
  
  // Generate category data with discounts
  const departments = data ? [
    // Add main department as first item
    {
      id: "department-main",
      name: data.title,
      discount: `Up to ${Math.floor(Math.random() * 20) + 60}% off`, 
      link: `/department/${data.slug}`,
      isMainDepartment: true
    },
    ...data.categories.map(category => ({
      id: category.id,
      name: category.title,
      discount: `Up to ${Math.floor(Math.random() * 30) + 30}% off`,
      link: `/category/${category.slug}`,
      isMainDepartment: false
    }))
  ] : []
  
  const slides = data?.images.map(image => ({
    image
  })) || []

  useEffect(() => {
    if (departments.length > 0 && !activeDepartment) {
      const mainDept = departments.find(dept => dept.isMainDepartment)
      setActiveDepartment(mainDept?.name || departments[0].name)
    }
  }, [departments, activeDepartment])

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", onSelect)

    onSelect()

    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  useEffect(() => {
    if (!api || slides.length === 0) return

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        api.scrollNext()
      }, 5000) 
    }

    startAutoScroll()

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current)
    }
  }, [api, slides.length])

  const pauseAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
    }
  }

  const resumeAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
    }
    if (api) {
      autoScrollRef.current = setInterval(() => {
        api.scrollNext()
      }, 5000)
    }
  }

  if (isLoading) {
    return <DepartmentSkeletonLoader />
  }

  if (error || !data) {
    return (
      <div className="w-full max-w-[1400px] mx-auto p-4 text-center">
        <p className="text-red-500">Failed to load department data</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-4">
      <ScrollArea className="w-full whitespace-nowrap py-2 px-2 md:px-6">
        <div className="flex space-x-2">
          {departments.map((dept) => (
            <Link
              href={dept.link}
              key={dept.id}
              className={cn(
                "inline-flex flex-col items-center justify-center transition-colors rounded-xl py-2 text-center min-w-[150px] h-full",
                activeDepartment === dept.name 
                  ? dept.isMainDepartment 
                    ? "bg-[#222222] shadow-md"
                    : "bg-[#343434] shadow-md" 
                  : "bg-[#ebebeb] hover:bg-gray-200",
              )}
              onClick={() => setActiveDepartment(dept.name)}
            >
              <span
                className={cn(
                  "font-bold text-sm sm:text-base",
                  activeDepartment === dept.name ? "text-gray-100" : "text-[#444444]",
                  dept.isMainDepartment ? "uppercase" : "" 
                )}
              >
                {dept.name}
              </span>
              <span
                className={cn(
                  "text-xs sm:text-sm line-clamp-1",
                  activeDepartment === dept.name ? "text-gray-100" : "text-[#444444]"
                )}
              >
                {dept.discount}
              </span>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      {/* Main Carousel */}
      {slides.length > 0 ? (
        <div className="w-full relative mb-6" onMouseEnter={pauseAutoScroll} onMouseLeave={resumeAutoScroll}>
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            setApi={setApi}
            className="w-full shadow-sm"
          >
            <CarouselContent className="-ml-1 md:-ml-4">
              {slides.map((slide, index) => (
                <CarouselItem
                  key={index}
                  className="pl-1 md:pl-4 md:basis-full basis-[92%] transition-all duration-300 ease-in-out"
                >
                  <div className="relative w-full h-[180px] sm:h-[250px] md:h-[280px] overflow-hidden rounded-lg">
                    <Image
                      src={slide.image || "/placeholder.svg"}
                      alt={`${data.title} slide ${index + 1}`}
                      fill
                      priority={index === 0}
                      className="object-cover object-center"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Arrows */}
            <button
              onClick={() => api?.scrollPrev()}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-r-full bg-white/70 flex items-center justify-center transition-all hover:bg-white z-10 shadow-md"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-l-full bg-white/70 flex items-center justify-center transition-all hover:bg-white z-10 shadow-md"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    current === index ? "w-8 bg-mainPrimary" : "w-2 bg-white/50 hover:bg-white/75",
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </div>
      ) : (
        <div className="w-full h-[180px] sm:h-[250px] md:h-[280px] bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      )}
    </div>
  )
}

// Skeleton loader component
export function DepartmentSkeletonLoader() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-4">
      {/* Categories skeleton */}
      <div className="w-full overflow-hidden py-2 px-2 md:px-6">
        <div className="flex space-x-2">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <Skeleton className="h-14 w-[150px] rounded-xl bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Carousel skeleton */}
      <Skeleton className="w-full h-[180px] sm:h-[250px] md:h-[280px] rounded-lg bg-gray-200" />
      
      {/* Indicators skeleton */}
      <div className="flex justify-center gap-2 mt-2">
        {Array(5).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-1 w-2 rounded-full bg-gray-300" />
        ))}
      </div>
    </div>
  )
}