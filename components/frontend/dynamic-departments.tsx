"use client"
import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '../ui/button';
import CategoryCard, { Category } from './category-card';
import { useDepartmentWithCategories } from '@/hooks/useHomeDepartment';

export interface DynamicDepartmentsProps {
  departmentSlug?: string;
  title?: {
    mainText?: string;
    highlightText?: string;
  };
  bgColor?: string;
  showPagination?: boolean;
  showViewAll?: boolean;
  viewAllLink?: string;
  className?: string;
  categories?: Category[];
  isLoading?: boolean;
}

export default function DynamicDepartments({
  departmentSlug,
  title = { mainText: "GET READY FOR", highlightText: "SHOPPING" },
  bgColor = "bg-amber-100",
  showPagination = true,
  showViewAll = true,
  viewAllLink = "#",
  className = "",
  categories: propCategories,
  isLoading: propIsLoading,
}: DynamicDepartmentsProps) {
  // State for tracking carousel
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaRef, setEmblaRef] = useState<any | null>(null);
 
  const { 
    department, 
    isLoading: isDepartmentLoading 
  } = departmentSlug ? 
    useDepartmentWithCategories(departmentSlug) : 
    { department: null, isLoading: false };

  // Determine which categories to use
  const categories = propCategories || department?.categories || [];
  const isLoading = propIsLoading || isDepartmentLoading;

  // Carousel event handlers
  const onSelect = React.useCallback(() => {
    if (!emblaRef) return;
    setActiveIndex(emblaRef.selectedScrollSnap());
  }, [emblaRef]);

  React.useEffect(() => {
    if (!emblaRef) return;
    onSelect();
    emblaRef.on("select", onSelect);
    return () => {
      emblaRef.off("select", onSelect);
    };
  }, [emblaRef, onSelect]);

  // Render the loading skeleton
  if (isLoading) {
    return (
      <div className={`w-full mx-auto md:px-2 md:py-4 ${className}`}>
        <div className={`${bgColor} rounded-lg p-4 md:p-6`}>
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div className="h-8 bg-gray-200/70 rounded w-64 animate-pulse"></div>
            <div className="h-8 bg-gray-200/70 rounded w-24 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <div className="h-40 bg-gray-200/70 rounded-lg animate-pulse"></div>
                <div className="h-5 bg-gray-200/70 rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
          
          {showPagination && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-1 w-6 md:w-8 rounded-full bg-gray-200/70 animate-pulse"></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

    if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className={`w-full mx-auto md:px-2 md:py-4 ${className}`}>
      <div className={`${bgColor} rounded-lg p-4 md:p-6`}>
        <div className="flex justify-between items-center mb-4 md:mb-6">
          {(title.mainText || title.highlightText) && (
            <h2 className="text-base md:text-2xl font-bold tracking-tight">
              {title.mainText && <span className="text-gray-800 font-bold">{title.mainText} </span>}
              {title.highlightText && <span className="text-pink-600 font-bold">{title.highlightText}</span>}
            </h2>
          )}
          
          {showViewAll && (
            <Button 
              size="sm" 
              className="bg-[#283430] hover:bg-gray-700 transition-colors text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md text-sm font-medium"
              onClick={() => window.location.href = viewAllLink}
            >
              VIEW ALL
            </Button>
          )}
        </div>

        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 1,
          }}
          setApi={setEmblaRef}
          className="w-full"
        >
          <CarouselContent className="md:-ml-4">
            {categories.map((category, index) => (
              <CarouselItem 
                key={category.id} 
                className="md:pl-2 pl-1 md:pr-2 sm:basis-1/2.4 md:basis-1/3 lg:basis-1/4 xl:basis-1/6 basis-[45%]"
              >
                <CategoryCard 
                  category={category} 
                  departmentSlug={departmentSlug || department?.slug}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 bg-white/80 hover:bg-white border border-gray-200 shadow-md md:flex hidden" />
          <CarouselNext className="absolute right-2 bg-white/80 hover:bg-white border border-gray-200 shadow-md md:flex hidden" />
        </Carousel>

        {showPagination && categories.length > 0 && (
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(categories.length / 6) }, (_, i) => (
                <div
                  key={i}
                  className={`h-1 w-6 md:w-8 rounded-full transition-colors cursor-pointer ${i === activeIndex ? "bg-gray-700" : "bg-gray-300"}`}
                  onClick={() => emblaRef?.scrollTo(i)}
                ></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}