"use client"

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { useActiveCampaigns, useFeatureBanner } from '@/hooks/useCampaignAndPromotions';
import Link from 'next/link';

// Define types
interface CarouselSlide {
  slug: string;
  imageUrl: string;
  title: string;
  // description: string;
}

function HomeHero() {
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);
  
  // Fetch campaigns data using our custom hooks
  const { campaigns, isLoading: campaignsLoading } = useActiveCampaigns();
  const { banner, isLoading: bannerLoading } = useFeatureBanner();

  // Prepare slides from campaigns or use fallback
  const slides: CarouselSlide[] = campaignsLoading 
    ? [] 
    : campaigns.map(campaign => ({
        slug: campaign.slug,
        imageUrl: campaign.imageUrl || "/front-images/default-banner.png",
        title: campaign.title,
      }));

  // Default slides when loading or no data is available
  const defaultSlides: CarouselSlide[] = [
    {
      slug: "cricket-fever",
      imageUrl: "https://f.nooncdn.com/ads/banner-1008x1008/en_dk_uae-hero-01%20(2).1738154816.2786212.png?format=avif",
      title: "Cricket Fever is On!",
      // description: "Shop jerseys, shoes, balls & more",
    },
    {
      slug: "cricket-season",
      imageUrl: "https://f.nooncdn.com/mpcms/EN0001/assets/2fe1abc5-3e4a-407b-9000-44bedc595178.png?format=avif",
      title: "Cricket Season",
      // description: "Get your gear now",
    },
    {
      slug: "limited-time",
      imageUrl: "https://f.nooncdn.com/mpcms/EN0001/assets/3339752d-5009-4ef1-8345-5df0f66fbfc6.png?format=avif",
      title: "Limited Time Offer",
      // description: "Cricket equipment on sale",
    },
  ];

  // Use actual slides if available, otherwise use default slides
  const displaySlides = slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    // Start autoplay
    const autoplayInterval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => {
      clearInterval(autoplayInterval);
      api.off("select");
    };
  }, [api]);

  return (
    <div className="w-full md:bg-gray-50 bg-[#fff4d0]">
      {/* Top Banner */}
      <div className="bg-[#14134D] w-full h-[60px] flex items-center justify-center">
        <img
          src="https://f.nooncdn.com/mpcms/EN0001/assets/280445e5-a57b-47f2-8136-83f69d4d6357.png?format=avif"
          alt="Summer Sale Going On"
          className="h-full object-contain"
        />
      </div>

      {/* Main content wrapper with fixed height */}
      <div className="w-full md:min-h-[34vh] h-[23vh]">
        <div className="relative flex flex-col md:flex-row gap-2 md:p-0 p-2 w-full mx-auto h-full">
          {/* Main Carousel - exactly 70% on desktop, full height on all devices */}
          <div className="relative w-full md:w-[70%] h-full">
            {campaignsLoading ? (
              // Simple skeleton loader that matches your exact layout
              <div className="w-full h-full overflow-hidden md:rounded-sm rounded-md bg-gray-200 animate-pulse"></div>
            ) : (
              <Carousel
                setApi={setApi}
                className="w-full h-full"
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent className="h-full">
                  {displaySlides.map((slide, index) => (
                    <CarouselItem key={index} className="relative">
                      <Link href={`/content/${slide.slug}?type=campaign`}>
                        <div className="relative md:h-[35vh] h-[23vh] w-full overflow-hidden md:rounded-sm rounded-md">
                          <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            className="w-full h-full object-cover md:rounded-sm rounded-md"
                          />
                        </div>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Navigation Arrows */}
                <button
                  onClick={() => api?.scrollPrev()}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-600/10 backdrop-blur-sm md:flex items-center justify-center transition-all hover:bg-white/30 z-10 hidden"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6 text-black" />
                </button>
                <button
                  onClick={() => api?.scrollNext()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-600/10 backdrop-blur-sm md:flex items-center justify-center transition-all hover:bg-white/30 z-10 hidden"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6 text-black" />
                </button>

                {/* Indicators - Aligned center bottom as in the image */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {displaySlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => api?.scrollTo(index)}
                      className={cn(
                        "h-1 rounded-full transition-all duration-300",
                        current === index
                          ? "w-8 bg-mainPrimary" 
                          : "w-2 bg-white/50 hover:bg-white/75"
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </Carousel>
            )}
          </div>

          {/* Right Banner - Fixed to match exact same height as carousel */}
          <div className="hidden md:block md:w-[30%] h-full bg-blue-600">
            {bannerLoading ? (
              // Simple skeleton for the right banner
              <div className="h-full w-full rounded-sm overflow-hidden bg-gray-200 animate-pulse"></div>
            ) : banner ? (
              <Link href={`/campaign/${banner.slug}`}>
                <div className="h-full w-full rounded-sm overflow-hidden">
                  <img
                    src={banner.imageUrl || "/front-images/left-banner.png"}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            ) : (
              <div className="h-full w-full rounded-sm overflow-hidden">
                <img
                  src="/front-images/left-banner.png"
                  alt="Fashion Deals"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeHero;