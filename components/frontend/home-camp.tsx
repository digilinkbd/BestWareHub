"use client"
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getActivePromotions } from '@/actions/promotions';
import { DEFAULT_BLUR } from '@/lib/lazyLoading';

type FragranceBannerProps = {
  // Optional additional class names
  className?: string;
}

type PromotionSlide = {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
}

// Custom hook for fetching promotion data
export const usePromotions = () => {
  return useQuery({
    queryKey: ['active-promotions'],
    queryFn: async () => {
      const data = await getActivePromotions();
      return data || [];
    },
  });
};

// Skeleton loader component for the banner
const BannerSkeleton = () => {
  return (
    <div className="w-full relative mb-6">
      <div className="relative w-full h-[200px] overflow-hidden rounded-sm bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" 
             style={{ backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }}></div>
        
        {/* Placeholder content elements */}
        <div className="absolute left-6 top-10 w-40 h-8 bg-gray-300 rounded-md"></div>
        <div className="absolute left-6 top-20 w-60 h-4 bg-gray-300 rounded-md"></div>
        <div className="absolute left-6 top-28 w-32 h-8 bg-gray-300 rounded-md"></div>
        
        {/* Placeholder buttons */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-1 w-2 rounded-full bg-gray-300"></div>
          ))}
        </div>
      </div>
      
      {/* Add animation for the shimmer effect */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default function FragranceFestivalBanner({ className }: FragranceBannerProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  
  // Fetch promotions data
  const { data: promotions, isLoading, error } = usePromotions();

  // Map promotions to slides
  const slides: PromotionSlide[] = promotions?.map(promo => ({
    id: promo.id,
    imageUrl: promo.imageUrl || '',
    title: promo.title,
    subtitle: promo.description || ''
  })) || [];

  // Fallback slides in case of error or loading
  const fallbackSlides: PromotionSlide[] = [
    {
      id: 'fallback-1',
      imageUrl: "https://f.nooncdn.com/ads/banner-1440x1440/PC%20Ad%20Banner%201440x200px.1740116822.5159345.png?format=avif",
      title: "Fragrance Festival - Up to 60% Off",
      subtitle: "Elevate your scent with perfumes, mists & oils"
    }
  ];

  // Use fallback slides if no data or error
  const displaySlides = (!isLoading && slides.length > 0) ? slides : fallbackSlides;

  // Handle current slide change
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    
    // Call once to set initial index
    onSelect();

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  // Setup auto-scrolling
  useEffect(() => {
    if (!api) return;

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        api.scrollNext();
      }, 3000); // Change slide every 3 seconds
    };

    startAutoScroll();

    // Clear the interval when component unmounts
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [api]);

  // Pause auto-scroll on hover
  const pauseAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  // Resume auto-scroll when mouse leaves
  const resumeAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    if (api) {
      autoScrollRef.current = setInterval(() => {
        api.scrollNext();
      }, 5000);
    }
  };

  // Show skeleton loader while loading
  if (isLoading) {
    return <BannerSkeleton />;
  }

  return (
    <div 
      className={cn("w-full relative mb-6", className)}
      onMouseEnter={pauseAutoScroll}
      onMouseLeave={resumeAutoScroll}
    >
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {displaySlides.length > 0 ? (
            displaySlides.map((slide, index) => (
              <CarouselItem key={slide.id} className="relative">
                <div className="relative w-full h-[200px] overflow-hidden rounded-sm">
                  <Image
                    src={slide.imageUrl ?? "/placeholder.jpg"}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={DEFAULT_BLUR}
                  />
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className="relative">
              <div className="relative w-full h-[200px] overflow-hidden rounded-sm bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400">No promotions available</p>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>

        {/* Navigation Arrows - styled to match image */}
        {displaySlides.length > 1 && (
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
          </>
        )}

        {/* Indicators - styled to match the image */}
        {displaySlides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {displaySlides.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  current === index
                    ? "w-8 bg-mainPrimary" 
                    : "w-2 bg-white hover:bg-white/75"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </Carousel>
    </div>
  );
}