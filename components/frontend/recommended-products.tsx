"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import ProductCard, { Product } from "./product-card";
import React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface RecommendedProductsProps {
  title?: {
    highlight: string;
    regular: string;
  };
  products: Product[];
  isLoading?: boolean;
}

export default function RecommendedProducts({ 
  title = { highlight: "RECOMMENDED", regular: "FOR YOU" },
  products = [],
  isLoading = false
}: RecommendedProductsProps) {
  const [favorites, setFavorites] = React.useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Create an array of 10 items for skeleton loading
  const skeletonItems = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="w-full mx-auto px-4 md:py-7 py-6 bg-gray-50">
      <div className="md:mb-7 mb-2">
        <div className="flex items-center">
          <h2 className="text-xl md:text-2xl ">
            <span className="text-red-600 font-black italic">{title.highlight}</span>
            <span className="text-gray-700 font-black ml-2">{title.regular}</span>
          </h2>
        </div>
      </div>
      
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 -mr-2">
            {isLoading ? (
              // Display skeleton loaders when loading
              skeletonItems.map((item) => (
                <CarouselItem key={`skeleton-${item}`} className="md:pl-2 pl-1 md:pr-2 sm:basis-1/2.4 md:basis-1/3 lg:basis-1/4 xl:basis-1/6 basis-[45%]">
                  <ProductCardSkeleton />
                </CarouselItem>
              ))
            ) : (
              // Display actual products when loaded
              products.map((product) => (
                <CarouselItem key={product.id} className="md:pl-2 pl-1 md:pr-2 sm:basis-1/2.4 md:basis-1/3 lg:basis-1/4 xl:basis-1/6 basis-[45%]">
                  <ProductCard 
                    product={product} 
               
                  />
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          
          {/* Navigation buttons hidden on small screens */}
          <div className="hidden sm:block">
            <CarouselPrevious className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-md border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50" />
            <CarouselNext className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-md border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}