import Image from "next/image";
import Link from "next/link";
import { VendorProduct } from "@/actions/vendor";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ 
  product, 
  viewType = "grid" 
}: { 
  product: VendorProduct;
  viewType: "grid" | "list";
}) {
  // Calculate discount percentage
  const discountPercentage = product.isDiscount && product.discount 
    ? Math.round(product.discount) 
    : 0;
  
  // Calculate rating stars
  const rating = product.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  if (viewType === "list") {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48">
            <Image
              src={product.imageUrl || "/placeholder.jpg"}
              alt={product.title}
              fill
              className="object-cover"
            />
            {product.isNewArrival && (
              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                New
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                -{discountPercentage}%
              </span>
            )}
          </div>
          
          <div className="p-4 flex-1">
            <div className="mb-2">
              <span className="text-xs text-gray-500">
                {product.department.title} {product.category && `/ ${product.category.title}`}
              </span>
            </div>
            
            <h3 className="font-semibold text-lg mb-2 hover:text-yellow-600 transition-colors">
              <Link href={`/product/${product.slug}`}>
                {product.title}
              </Link>
            </h3>
            
            {product.shortDesc && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.shortDesc}</p>
            )}
            
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < fullStars || (i === fullStars && hasHalfStar) ? "currentColor" : "none"}
                    strokeWidth={i < fullStars ? 0 : 1.5}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({rating.toFixed(1)})</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-baseline">
                {product.isDiscount && product.salePrice ? (
                  <>
                    <span className="text-xl font-bold text-yellow-600">${product.salePrice.toFixed(2)}</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">${product.productPrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-yellow-600">${product.productPrice.toFixed(2)}</span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button 
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  aria-label="Add to wishlist"
                >
                  <Heart size={18} />
                </button>
                <button 
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  aria-label="Quick view"
                >
                  <Eye size={18} />
                </button>
                <button 
                  className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                  aria-label="Add to cart"
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={product.imageUrl || "/placeholder.jpg"}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {product.isNewArrival && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              New
            </span>
          )}
          
          {discountPercentage > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          )}
          
          <div className="absolute inset-x-0 bottom-0 flex justify-center space-x-1 -mb-10 group-hover:mb-3 transition-all duration-300">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-white shadow-md text-gray-600 hover:text-yellow-500 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart size={18} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-white shadow-md text-gray-600 hover:text-yellow-500 transition-colors"
              aria-label="Quick view"
            >
              <Eye size={18} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} />
            </motion.button>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="mb-1">
          <span className="text-xs text-gray-500">
            {product.department.title} {product.category && `/ ${product.category.title}`}
          </span>
        </div>
        
        <h3 className="font-semibold text-sm sm:text-base mb-1 truncate hover:text-yellow-600 transition-colors">
          <Link href={`/product/${product.slug}`}>
            {product.title}
          </Link>
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < fullStars || (i === fullStars && hasHalfStar) ? "currentColor" : "none"}
                strokeWidth={i < fullStars ? 0 : 1.5}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({rating.toFixed(1)})</span>
        </div>
        
        <div className="flex items-baseline">
          {product.isDiscount && product.salePrice ? (
            <>
              <span className="text-lg font-bold text-yellow-600">${product.salePrice.toFixed(2)}</span>
              <span className="ml-2 text-sm text-gray-500 line-through">${product.productPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-yellow-600">${product.productPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}