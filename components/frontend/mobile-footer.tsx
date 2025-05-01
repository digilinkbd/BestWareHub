"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Tag, User, ShoppingCart, ShoppingBag, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { useCartStore } from "@/hooks/cart-store"

const navItems = [
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    label: "WishList",
    icon: Heart,
    href: "/wishlist",
  },
  {
    label: "Deals",
    icon: Tag,
    href: `/d/electronics`,
  },
  {
    label: "My Account",
    icon: User,
    href: "/dashboard",
  },
]

export default function MobileFooter() {
  const pathname = usePathname()
  const { getItemCount } = useCartStore()
  const cartCount = getItemCount()
  
  const cartCountVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    },
    exit: { scale: 0.8, opacity: 0 }
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 block border-t border-gray-200 bg-white md:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link 
              key={item.label} 
              href={item.href} 
              className="flex flex-col items-center gap-1"
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isActive ? [1, 1.2, 1] : 1 }}
                transition={{ 
                  duration: 0.3,
                  type: "spring", 
                  stiffness: 300
                }}
              >
                <item.icon 
                  className={`h-6 w-6 ${isActive ? "text-orange-500" : "text-gray-600"}`} 
                  strokeWidth={1.5} 
                />
              </motion.div>
              <motion.span 
                className={`text-xs ${isActive ? "text-orange-500 font-medium" : "text-gray-600"}`}
                animate={{ 
                  y: isActive ? [0, -2, 0] : 0,
                  transition: { duration: 0.3 }
                }}
              >
                {item.label}
              </motion.span>
            </Link>
          )
        })}
        <Link 
          href="/cart" 
          className="flex flex-col items-center gap-1"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ 
                scale: pathname === "/cart" ? [1, 1.2, 1] : 1
              }}
              transition={{ 
                duration: 0.3,
                type: "spring", 
                stiffness: 300
              }}
            >
              <ShoppingCart 
                className={`h-6 w-6 ${pathname === "/cart" ? "text-orange-500 font-bold" : "text-gray-600"}`} 
                strokeWidth={1.5} 
              />
            </motion.div>
            <motion.span 
              className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#2979FF] text-[10px] font-medium text-white"
              key={cartCount}
              variants={cartCountVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {cartCount}
            </motion.span>
          </div>
          <motion.span 
            className={`text-xs ${pathname === "/cart" ? "text-orange-500 font-bold" : "text-gray-600"}`}
            animate={{ 
              y: pathname === "/cart" ? [0, -2, 0] : 0,
              transition: { duration: 0.3 }
            }}
          >
            Cart
          </motion.span>
        </Link>
      </div>
    </div>
  )
}