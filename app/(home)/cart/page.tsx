'use client';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronRight, Info, Heart, Trash2, Plus, Minus } from 'lucide-react';
import emptyCartAnimation from '../../../animations/empty-cart.json';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

import dynamic from 'next/dynamic';
import { CartItem, useCartStore } from '@/hooks/cart-store';
import { useRouter } from 'next/navigation';
import React from 'react';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function CartPage() {
  const router=useRouter()
  const { 
    items, 
    removeItem, 
    incrementQuantity, 
    decrementQuantity, 
    getItemCount, 
    getTotal 
  } = useCartStore();

  const [couponCode, setCouponCode] = React.useState('');
  
  // Function to format the cart item from your store format to the display format
  const formatCartItem = (item: CartItem) => ({
    id: item.id,
    name: item.title,
    price: item.price,
    originalPrice: item.oldPrice,
    discountPercentage: item.discount,
    image: item.image,
    quantity: item.quantity,
    deliveryDate: item.deliveryDate || "Tomorrow",
    seller: item.seller || "Marketplace",
    isExpress: item.promotionType === 'express',
    freeDelivery: item.freeDelivery || true,
    isBestSeller: item.isBestSeller,
  });

  // Handle remove item with toast
  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast.error('Item removed from cart');
  };

  // Handle increase quantity with toast
  const handleIncrementQuantity = (id: string) => {
    incrementQuantity(id);
  };

  // Handle decrease quantity with toast
  const handleDecrementQuantity = (id: string) => {
    decrementQuantity(id);
  };

  // Handle move to wishlist (placeholder functionality)
  const moveToWishlist = (id: string) => {
    // This would typically call an API to move the item to a wishlist
    console.log(`Moving item ${id} to wishlist`);
    toast.success('Item moved to wishlist');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-72 h-74 mb-4">
          <Lottie animationData={emptyCartAnimation} loop={true} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Ooops cart is empty</h2>
        <p className="text-gray-600 mb-4 text-center">Looks like you haven't added anything to your cart yet.</p>
        <Button className="bg-[#3866df] hover:bg-blue-600 text-white px-8 py-2 rounded-md">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 md:px-4 md:py-6 py-6 mb-20 sm:mb-0 bg-[#f7f7fa]">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cart <span className="text-gray-500 font-normal text-base">({getItemCount()} items)</span></h1>
      
      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          {items.map((item) => {
            const formattedItem = formatCartItem(item);
            return (
              <div key={item.id} className="mb-6 border rounded-lg overflow-hidden bg-white">
                <div className="p-4 flex flex-col sm:flex-row items-start gap-4">
                  {/* Image - Same for both desktop and mobile */}
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-100 flex items-center justify-center rounded-md">
                    <img src={formattedItem.image} alt={formattedItem.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  
                  {/* Mobile layout - change to a better layout for small screens */}
                  <div className="flex-grow flex flex-col sm:hidden w-full">
                    <h3 className="text-base font-medium text-black mb-1 line-clamp-2">{formattedItem.name}</h3>
                    
                    {/* Price section for mobile */}
                    <div className="flex justify-between items-center mt-1 mb-2">
                      <div>
                        <div className="font-bold">AED {formattedItem.price}</div>
                        <div className="text-sm line-through text-gray-500">AED {formattedItem.originalPrice}</div>
                        <div className="text-sm text-green-600 font-medium">{formattedItem.discountPercentage}% OFF</div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        {formattedItem.isExpress && (
                          <span className="bg-yellow-400 text-xs px-2 py-0.5 rounded mb-1 font-medium">express</span>
                        )}
                        
                        {formattedItem.freeDelivery && (
                          <span className="flex items-center text-xs text-gray-600">
                            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 8h-3V4H3C1.9 4 1 4.9 1 6v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 19.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H15V10.5h4.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="currentColor" />
                            </svg>
                            Free Delivery
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Delivery info for mobile */}
                    <div className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Get it {formattedItem.deliveryDate}</span>
                      <span className="mx-1">•</span>
                      <span>Sold by <span className="font-medium">{formattedItem.seller}</span></span>
                    </div>
                    
                    {/* Quantity controls and actions for mobile */}
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <button
                          onClick={() => handleDecrementQuantity(item.id)}
                          className="px-2 py-1 bg-gray-200 cursor-pointer hover:bg-gray-200 text-gray-700 border-r"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button
                          onClick={() => handleIncrementQuantity(item.id)}
                          className="px-2 py-1 bg-gray-200 cursor-pointer hover:bg-gray-200 text-gray-700 border-l"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="flex items-center text-red-500 text-sm hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </button>
                        
                        <button 
                          onClick={() => moveToWishlist(item.id)}
                          className="flex items-center text-gray-500 text-sm hover:text-gray-700"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Desktop layout - keep original */}
                  <div className="hidden sm:block flex-grow">
                    <h3 className="text-base font-medium text-black mb-1">{formattedItem.name}</h3>
                    <div className="text-sm text-gray-500 mb-2">
                      Order in 4 h 5 m<br />
                      <span className="font-medium">Get it {formattedItem.deliveryDate}</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      Sold by <span className="font-medium">{formattedItem.seller}</span>
                    </div>
                    
                    {item.promotionType && (
                      <div className="inline-block border border-green-500 border-dashed text-green-600 text-xs py-1 px-2 rounded mb-3">
                        <span className="inline-flex items-center">
                          <span className="w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center mr-1 text-xs">✓</span>
                          Extra 20% off! - CODE: ENBDONE × 1
                        </span>
                      </div>
                    )}
                    
                    <div className="flex flex-col md:flex-row justify-between items-center mt-2">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="flex items-center text-red-500 text-sm hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5 mr-1" />
                          Remove
                        </button>
                        
                        <button 
                          onClick={() => moveToWishlist(item.id)}
                          className="flex items-center text-gray-500 text-sm hover:text-gray-700"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          Move to Wishlist
                        </button>
                      </div>
                      
                      <div className="flex items-center mt-3 sm:mt-0 ">
                        <span className="text-gray-600 mr-2">Qty</span>
                        <div className="flex items-center border rounded-md overflow-hidden">
                          <button
                            onClick={() => handleDecrementQuantity(item.id)}
                            className="px-2 py-2 bg-gray-200 cursor-pointer hover:bg-gray-200 text-gray-700 border-r"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <button
                            onClick={() => handleIncrementQuantity(item.id)}
                            className="px-2 py-2 bg-gray-200 cursor-pointer hover:bg-gray-200 text-gray-700 border-l"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Price section for desktop - keep original */}
                  <div className="hidden sm:flex md:flex-col items-end">
                    <div className="text-right">
                      <div className="font-bold mb-1">AED {formattedItem.price}</div>
                      <div className="text-sm line-through text-gray-500">AED {formattedItem.originalPrice}</div>
                      <div className="text-sm text-green-600 font-medium">{formattedItem.discountPercentage}% OFF</div>
                    </div>
                    
                    <div className="mt-2 flex flex-col items-end">
                      {formattedItem.isExpress && (
                        <span className="bg-yellow-400 text-xs px-2 py-0.5 rounded mb-1 font-medium">express</span>
                      )}
                      
                      {formattedItem.freeDelivery && (
                        <span className="flex items-center text-xs text-gray-600">
                          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 8h-3V4H3C1.9 4 1 4.9 1 6v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 19.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H15V10.5h4.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="currentColor" />
                          </svg>
                          Free Delivery
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Emirates NBD Promotion Banner */}
          <div className='h-[60px] w-full md:block hidden'>
            <Image src="https://f.nooncdn.com/mpcms/EN0001/assets/e2145daf-c5bc-4cb2-afa0-100b595c918a.png?format=avif" 
              alt="Emirates NBD promotion" 
              width={3000}
              height={3000}
              className='w-full h-full object-cover'
            />
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="mb-4">
            <CardContent className="p-0">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
                <div className="mb-4">
                  <div className="flex items-center">
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon Code" 
                      className="flex-grow border rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <Button 
                      className="bg-[#3866df] hover:bg-blue-600 text-white px-4 py-2 !border-none"
                      onClick={() => toast.success('Coupon applied successfully!')}
                    >
                      APPLY
                    </Button>
                  </div>
                </div>
                
                <Button variant="ghost" className="w-full justify-between border rounded-lg p-2 text-blue-500 bg-blue-50 mb-4">
                  <div className="flex items-center">
                    <Info className="w-4 h-4 mr-2 text-blue-500" />
                    View Available Offers
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({getItemCount()} items)</span>
                    <span>AED {getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t font-bold">
                    <span>Total <span className="text-gray-500 font-normal text-lg">(Inclusive of VAT)</span></span>
                    <span className='text-xl'>AED {getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-[#fcfbf5]">
                <div className="flex items-start mb-4">
                  <div className="w-6 h-6 flex-shrink-0 mr-2">
                    <img src="https://f.nooncdn.com/s/app/com/noon/icons/emi.svg" alt="EMI icon" className='w-6 h-6' />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-gray-600">
                      Monthly payment plans from AED 500
                      <span className="text-yellow-400 ml-1 cursor-pointer underline font-bold">View more details</span>
                    </p>
                  </div>
                </div>
                
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#3866df] hover:bg-blue-600 text-white font-medium py-3 rounded-lg hidden sm:block"
                  onClick={() => router.push("/checkout")}
                >
                  CHECKOUT
                </motion.button>
              </div>
            </CardContent>
          </Card>
          
          {/* Cashback Info */}
          <div className="mb-4 flex items-start">
            <img src="https://f.nooncdn.com/s/app/com/noon/icons/emi.svg" alt="EMI icon" className='w-6 h-6' />
            <div className="text-sm">
              Earn 5% cashback with Mashreq Kartify Credit Card. 
              <Link href="#" className="text-blue-500 ml-1">T&C apply.</Link>
            </div>
          </div>
          
          {/* Payment Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <img src="https://f.nooncdn.com/s/app/com/noon/images/tabby.svg" alt="Tabby" className="h-6" />
              </div>
              <div className="text-sm">
                Pay 4 interest free payments of AED {(getTotal() / 4).toFixed(2)}
                <Link href="#" className="block text-blue-500">Learn more</Link>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <img src="https://k.nooncdn.com/s/app/com/noon/images/tamara_logo.svg" alt="Tamara" className="h-6" />
              </div>
              <div className="text-sm">
                Split in 4 payments of AED {(getTotal() / 4).toFixed(2)}. No interest. No late fees.
                <Link href="#" className="block text-blue-500">Learn more</Link>
              </div>
            </div>
          </div>
          
          {/* Buy Now Pay Later */}
          <div className="mb-6 text-center">
            <div className="mb-2 font-medium">Buy Now, Pay Later With Kartify EMI</div>
            <p className="text-sm text-gray-600 mb-2">
              Available when you spend AED 500 with select cards from the banks below.
              <Link href="#" className="text-blue-500 ml-1 underline">Find out more</Link>
            </p>
            
            {/* Bank Logos */}
            <div className="grid grid-cols-3 gap-4">
              {[
                "https://f.nooncdn.com/s/app/com/common/images/bank-logos/emirates-en.png",
                "https://f.nooncdn.com/s/app/com/common/images/bank-logos/adcb.svg",
                "https://f.nooncdn.com/s/app/com/common/images/bank-logos/mashreq.svg",
                "https://f.nooncdn.com/s/app/com/common/images/bank-logos/fab.svg",
                "https://f.nooncdn.com/s/app/com/common/images/bank-logos/rak.svg",
                "https://f.nooncdn.com/s/app/com/common/images/bank-logos/emirates-islamic.svg",
                "https://f.nooncdn.com/s/app/com/common/images/bank-logos/mawarid.png",
                "https://f.nooncdn.com/s/app/com/common/images/bank-logos/samba.svg",
                "https://f.nooncdn.com/s/app/com/common/images/bank-logos/standard-chartered.svg"
              ].map((bankLogo, index) => (
                <div key={index} className="border rounded-lg p-2 flex items-center justify-center">
                  <img src={bankLogo} alt={`Bank ${index+1}`} className="w-full h-6 object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Fixed Checkout Button for Mobile */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4 sm:hidden z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Total:</span>
          <span className="font-bold text-lg">AED {getTotal().toFixed(2)}</span>
        </div>
        <motion.button 
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#3866df] hover:bg-blue-600 text-white font-medium py-3 rounded-lg"
          onClick={() => router.push("/checkout")}
          >
          CHECKOUT
        </motion.button>
      </div>
    </div>
  );
}