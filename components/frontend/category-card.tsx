import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DEFAULT_BLUR } from '@/lib/lazyLoading';

export interface Category {
  id: string;
  title: string;
  slug: string;
  image: string;
  description?: string | null;
  icon?: string | null;
}

interface CategoryCardProps {
  category: Category;
  departmentSlug?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, departmentSlug }) => {
  // Build the href for the category
  const href = `/c/${category.slug}`

  
  const hasDiscount = Math.random() > 0.5;
  const discountPercentage = Math.floor(Math.random() * 70) + 10;
  const fromPrice = Math.floor(Math.random() * 500) + 10;
  const currency = "BDT";

  return (
    <Link href={href}>
      <div className="relative h-[190px] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative w-full h-full">
          <Image 
            src={category.image ?? "/placeholder.jpg"} 
            alt={category.title}
            fill
            sizes="(max-width: 640px) 75vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover"
             placeholder="blur"
             blurDataURL={DEFAULT_BLUR}
          />
          
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent">
          <div className="absolute -bottom-1 left-0 right-0 p-4 text-center">
            {!hasDiscount ? (
              <div className="">
                <span className="text-amber-100 font-bold text-sm">FROM </span>
                <span className="text-red-500 font-extrabold text-lg">{fromPrice} {currency}</span>
              </div>
            ) : (
              <div className="">
                <span className="text-amber-100 font-bold text-sm">UP TO </span>
                <span className="text-red-500 font-extrabold text-lg">{discountPercentage}% OFF</span>
              </div>
            )}
            <h3 className="text-sm font-bold text-white">{category.title}</h3>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;