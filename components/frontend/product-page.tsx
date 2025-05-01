"use client"
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductImageGallery from '@/components/frontend/ProductImageGallery'
import DeliveryInfo from '@/components/frontend/DeliveryInfo'
import ProductInfo from '@/components/frontend/ProductInfo'
import ProductDetails from '@/components/frontend/ProductDetails'
import Products from '@/components/frontend/products'
import { SlugTypes } from './department-page'
import { useCartStore } from '@/hooks/cart-store'
import ProductSkeletonDetailed from './ProductSkeletonDetailed'
import { useProductDetails, useSimilarProducts } from '@/hooks/useProduct'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../ui/breadcrumb'


export default function ProductPage({slug}:SlugTypes) {
    const { product, isLoading } = useProductDetails(slug)
    const { addItem } = useCartStore()
  
    const { similarProducts, isLoading: loadingSimilar } = useSimilarProducts(
      product?.id || "",
      product?.categoryId || undefined,
      product?.subCategoryId || undefined,
    )
  
    const handleAddToCart = () => {
      if (product) {
        addItem({
          id: product.id,
          title: product.title,
          price: product.salePrice || product.productPrice,
          oldPrice: product.isDiscount ? product.productPrice : null,
          discount: product.discount || 0,
          rating: product.rating || 0,
          slug: product.slug,
          reviews: product.reviews.length,
          image: product.imageUrl || "",
          isBestSeller: false,
          category: product.subCategory?.title || product.category?.title || "",
          categoryRank: 0,
          deliveryOptions: ["Free Delivery", "Express Delivery Available", "Same Day Delivery"],
          promotionType: product.isFeatured ? "express" : "super-mart",
        })
      }
    }
  
    if (isLoading) {
      return <ProductSkeletonDetailed />
    }
  
    if (!product) {
      return (
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="mt-4">The product you are looking for does not exist or has been removed.</p>
        </div>
      )
    }
  
    return (
        <div className="container mx-auto md:px-6 lg:px-9 px-2 py-0 bg-[#f7f7fa] mb-3">
        <div className="bg-white md:px-4 py-6 px-2">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6 overflow-x-auto">
            <BreadcrumbList className="text-sm text-muted-foreground">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {product.department && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/d/${product.department.slug}`}>
                      {product.department.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              {product.category && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/c/${product.category.slug}`}>{product.category.title}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              {product.subCategory && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/s-c/${product.subCategory.slug}`}>
                      {product.subCategory.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              {product.brand && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/b/${product.brand.slug}`}>{product.brand.title}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbLink className="text-foreground pointer-events-none">{product.title}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
  
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Product Images */}
            <div className="lg:col-span-5">
              <ProductImageGallery
                images={product.productImages.length > 0 ? product.productImages : [product.imageUrl || ""]}
                onAddToCart={handleAddToCart}
              />
            </div>
  
            {/* Middle Column - Product Information */}
            <div className="lg:col-span-4">
              <ProductInfo product={product} onAddToCart={handleAddToCart} />
            </div>
  
            {/* Right Column - Delivery Info */}
            <div className="lg:col-span-3">
              <DeliveryInfo product={product} vendor={product.vendor} store={product.store || product.vendor?.store} />
            </div>
          </div>
  
          {/* Product Details Section */}
          <div className="mt-12 mb-8">
            <ProductDetails product={product} />
          </div>
  
          {/* Mobile Fixed Add to Cart */}
          <div className="fixed md:bottom-0 bottom-16 left-0 right-0 bg-gray-200/10 border-t p-4 flex items-center justify-between lg:hidden z-10 backdrop-blur-3xl">
            <Button className="bg-blue-600 hover:bg-blue-700 w-full text-lg py-7" onClick={handleAddToCart}>
              Add To Cart
            </Button>
          </div>
  
          <div className='mb-7'>
          {!loadingSimilar && similarProducts.length > 0 && (
            <Products title="Similar Products" products={similarProducts} />
          )}
          </div>
        </div>
      </div>
    )
  }