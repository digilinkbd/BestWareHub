"use client";

import DynamicDepartments from "@/components/frontend/dynamic-departments";
import HomeCamp from "@/components/frontend/home-camp";
import HomeDepartments from "@/components/frontend/home-departments";
import HomeHero from "@/components/frontend/home-hero";
import MegaCategories from "@/components/frontend/mega-categoryies";
import RecommendedProducts from "@/components/frontend/recommended-products";
import { useDepartments, useHomeDepartments } from "@/hooks/useHomeDepartment";
import { useFeaturedProducts, useNewArrivalProducts } from "@/hooks/useProduct";

export default function HomePage() {
  const { 
    products: newArrivals, 
    isLoading: isLoadingNewArrivals 
  } = useNewArrivalProducts();
  
  const { 
    products: featuredProducts, 
    isLoading: isLoadingFeatured 
  } = useFeaturedProducts();

  // Fetch departments data for the dynamic components
  const { departments, isLoading: isLoadingDepartments } = useDepartments();
  return (
    <div className="min-h-screen md:mx-2">
      <HomeHero />
      <HomeDepartments
    />
      <MegaCategories />

      {/* New Arrivals Section */}
      <RecommendedProducts
        title={{ highlight: "NEW ARRIVALS", regular: "THIS WEEK" }}
        products={newArrivals}
        isLoading={isLoadingNewArrivals}
      />

      {/* First Dynamic Department - Using first department if available */}
      {departments && departments.length > 0 && (
        <DynamicDepartments
          departmentSlug={departments[0]?.slug}
          title={{
            mainText: "EXPLORE",
            highlightText: departments[0]?.title?.toUpperCase() || "CATEGORIES"
          }}
          bgColor="bg-amber-100"
          viewAllLink={`/department/${departments[0]?.slug}`}
          isLoading={isLoadingDepartments}
        />
      )}

      {/* Featured Products Section */}
      <RecommendedProducts
        title={{ highlight: "BEST", regular: "FEATURED ONES" }}
        products={featuredProducts}
        isLoading={isLoadingFeatured}
      />

      <HomeCamp />

      {/* Second Dynamic Department - Using second department if available */}
      {departments && departments.length > 1 && (
        <DynamicDepartments
          departmentSlug={departments[1]?.slug}
          title={{
            mainText: "TRENDING IN",
            highlightText: departments[1]?.title?.toUpperCase() || "PRODUCTS"
          }}
          bgColor="bg-[#feead5]"
          viewAllLink={`/department/${departments[1]?.slug}`}
          isLoading={isLoadingDepartments}
        />
      )}

      {/* Third Dynamic Department - Electronics */}
      {departments && departments.length > 2 && (
        <DynamicDepartments
          departmentSlug={departments[2]?.slug}
          title={{
            mainText: "EXPLORE",
            highlightText: "ELECTRONICS"
          }}
          bgColor="bg-[#fff3ba]"
          showPagination={false}
          viewAllLink={`/department/${departments[2]?.slug}`}
          isLoading={isLoadingDepartments}
        />
      )}

      {/* Fourth Dynamic Department */}
      {departments && departments.length > 3 && (
        <DynamicDepartments
          departmentSlug={departments[3]?.slug}
          title={{
            mainText: "TOP",
            highlightText: departments[3]?.title?.toUpperCase() || "SELECTIONS"
          }}
          bgColor="bg-[#feead5]"
          showPagination={false}
          viewAllLink={`/department/${departments[3]?.slug}`}
          isLoading={isLoadingDepartments}
        />
      )}

      {/* Fifth Dynamic Department - Fashion */}
      {departments && departments.length > 4 && (
        <DynamicDepartments
          departmentSlug={departments[4]?.slug}
          title={{
            mainText: "EXPLORE ",
            highlightText: "FASHION"
          }}
          viewAllLink={`/department/${departments[4]?.slug}`}
          bgColor="bg-[#fff3ba]"
          showPagination={false}
          isLoading={isLoadingDepartments}
        />
      )}
    </div>
  );
}