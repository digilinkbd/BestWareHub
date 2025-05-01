"use client"

import { useState } from "react"
import ProductsHeader from "@/components/frontend/ProductsHeader"
import ProductsGrid from "@/components/frontend/ProductsGrid"
import MobileFilterBar from "@/components/frontend/MobileFilterBar"
import SidebarFilters from "@/components/frontend/SidebarFilters"
import { BreadcrumbComp } from "@/components/frontend/Breadcrumb"
import { useProducts } from "@/hooks/useProductFilters"

interface SlugTypes {
  slug: string
}

const SubCategoryDetailedPage = ({ slug }:SlugTypes) => {
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({})
  const [isGridView, setIsGridView] = useState(true)

  const {
    products,
    totalProducts,
    priceRange,
    brands,
    vendors,
    categoryHierarchy,
    breadcrumb,
    isLoading,
    isBrandsLoading,
    isCategoryLoading,
    isVendorsLoading,
    selectedFilters,
    currentParams,
    updateFilters,
    toggleFilter,
    clearAllFilters,
  } = useProducts(slug)

// Toggle favorite status
const toggleFavorite = (productId: string) => {
    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }

  // Get subcategory title from breadcrumb
  const subCategoryTitle = breadcrumb[breadcrumb.length - 1]?.label || ""

  return (
    <div className="bg-gray-50 min-h-screen md:p-2 p-0">
    {/* Breadcrumb Navigation */}
    <BreadcrumbComp items={breadcrumb} />

    <div className="container mx-auto px-4 md:py-4 py-2">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:block hidden">
          <SidebarFilters
            selectedFilters={selectedFilters}
            brands={brands}
            vendors={vendors}
            categoryHierarchy={categoryHierarchy}
            priceRange={priceRange}
            isLoading={isLoading}
            isBrandsLoading={isBrandsLoading}
            isCategoryLoading={isCategoryLoading}
            isVendorsLoading={isVendorsLoading}
            toggleFilter={toggleFilter}
            updateFilters={updateFilters}
            currentParams={currentParams}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header Section */}
          <ProductsHeader
            selectedFilters={selectedFilters}
            toggleFilter={toggleFilter}
            clearAllFilters={clearAllFilters}
            updateFilters={updateFilters}
            currentParams={currentParams}
            totalProducts={totalProducts}
            subCategoryTitle={subCategoryTitle}
          />

          {/* Products Grid/List */}
          <ProductsGrid
            isGridView={isGridView}
            setIsGridView={setIsGridView}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            products={products}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>

    <div className="md:hidden block">
      <MobileFilterBar
        selectedFilters={selectedFilters}
        brands={brands}
        vendors={vendors}
        categoryHierarchy={categoryHierarchy}
        priceRange={priceRange}
        isLoading={isLoading}
        isBrandsLoading={isBrandsLoading}
        isCategoryLoading={isCategoryLoading}
        isVendorsLoading={isVendorsLoading}
        toggleFilter={toggleFilter}
        updateFilters={updateFilters}
        currentParams={currentParams}
      />
    </div>
  </div>
  )
}

export default SubCategoryDetailedPage

