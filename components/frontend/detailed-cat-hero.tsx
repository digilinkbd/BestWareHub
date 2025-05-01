"use client"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

type DepartmentType = {
  name: string
  discount: string
  price?: string
  link: string
}

type SlideType = {
  image: string
}

type DetailedCatHeroProps = {
  images: string[]
  isLoading: boolean
}

export default function DetailedCatHero({ images, isLoading }: DetailedCatHeroProps) {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [current, setCurrent] = useState(0)
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null)
  const [activeDepartment, setActiveDepartment] = useState<string | null>("Electronics")


  // Convert the images array to slides
  const slides: SlideType[] = isLoading 
    ? Array(4).fill({ image: "" }) // Placeholder for skeleton loader
    : images.length > 0 
      ? images.map(image => ({ image }))
      : [
          { image: "https://f.nooncdn.com/mpcms/EN0001/assets/2613bec5-a1d9-4844-96f7-79f16c741d28.png?format=avif" },
          { image: "https://f.nooncdn.com/mpcms/EN0001/assets/3339752d-5009-4ef1-8345-5df0f66fbfc6.png?format=avif" },
          { image: "https://f.nooncdn.com/mpcms/EN0001/assets/92dc54a9-3dcf-4595-81ee-5b7ac78eda93.png?format=avif" },
          { image: "https://f.nooncdn.com/mpcms/EN0001/assets/b8201cbd-d71c-4896-bbce-817155ae7418.gif?format=avif" },
          { image: "https://f.nooncdn.com/mpcms/EN0001/assets/a538857d-b868-410f-b381-c793b585cea4.png?format=avif" },
        ]

  // Handle current slide change
  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", onSelect)

    // Call once to set initial index
    onSelect()

    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  // Setup auto-scrolling
  useEffect(() => {
    if (!api) return

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        api.scrollNext()
      }, 5000) // Change slide every 5 seconds
    }

    startAutoScroll()

    // Clear the interval when component unmounts
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current)
    }
  }, [api])

  // Pause auto-scroll on hover
  const pauseAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
    }
  }

  // Resume auto-scroll when mouse leaves
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

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="w-full relative mb-1" onMouseEnter={pauseAutoScroll} onMouseLeave={resumeAutoScroll}>
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
                {isLoading ? (
                  <Skeleton className="w-full h-[180px] sm:h-[250px] md:h-[230px] rounded-lg" />
                ) : (
                  <div className="relative w-full h-[180px] sm:h-[250px] md:h-[230px] overflow-hidden rounded-lg">
                    <Image
                      src={slide.image || "/placeholder.jpg"}
                      alt={`Slide ${index + 1}`}
                      fill
                      priority={index === 0}
                      className="object-cover object-center"
                    />
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          {!isLoading && (
            <>
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
            </>
          )}
        </Carousel>
      </div>
    </div>
  )
}