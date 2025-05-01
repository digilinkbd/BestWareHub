"use client"
import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SubCategoryCardProps {
  title: string;
  icon?: string;
  isActive?: boolean;
  slug?: string;
}

interface SubCategoryCardsProps {
  categories: SubCategoryCardProps[];
  linkPrefix?: string;
}

const SubCategoryCard: React.FC<SubCategoryCardProps & { href?: string }> = ({ 
  title, 
  icon, 
  isActive = false,
  href
}) => {
  const CardContent = () => (
    <div 
      className={`w-full h-12 sm:h-20 md:h-24 flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'bg-[#7995bd] text-white font-bold shadow-md' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 md:px-0 px-2'
      }`}
    >
      <span className="text-sm md:text-2xl font-semibold line-clamp-1">{title}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default function SubCategoryCards({ categories, linkPrefix = "/category/" }: SubCategoryCardsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full py-2">
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex md:space-x-3 space-x-1 overflow-x-auto hide-scrollbar pb-2 px-1"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
          }}
        >
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="flex-none w-[40%] sm:w-[32%] md:w-full md:max-w-sm snap-start"
            >
              <SubCategoryCard 
                title={category.title} 
                icon={category.icon} 
                isActive={category.isActive} 
                href={!category.isActive && category.slug ? `${linkPrefix}${category.slug}` : undefined}
              />
            </div>
          ))}
        </div>
        
        {categories.length > 3 && (
          <button
            onClick={scrollRight}
            className="absolute -right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 cursor-pointer z-10"
            aria-label="Scroll right"
          >
            <ArrowRight size={20} className="text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}