"use client"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ShoppingCart, Bell, Menu, Heart } from "lucide-react"
import { Separator } from "../ui/separator"
import Logo from "../global/Logo"
import CategoryNav from "../frontend/CategoryNav"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/hooks/cart-store"
import SearchInput from "../frontend/SearchInput"
import type { User } from "next-auth"
import { UserDropdownMenu } from "../frontend/UserDropdownMenu"
import DepartmentDrawer from "../frontend/DepartmentDrawer"
import { useFetchDepartments } from "@/hooks/useDepartment"

export interface NavProps {
  searchQuery?: string
  user?: User
}

export default function HomeHeader({ searchQuery, user }: NavProps) {
  const { getItemCount } = useCartStore()
  const cartCount = getItemCount()
  const departmentsData = useFetchDepartments()

  const cartCountVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
      },
    },
    exit: { scale: 0.8, opacity: 0 },
  }

  return (
    <header className="w-full bg-mainPrimary sticky top-0 z-40 shadow-sm">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-8 justify-center">
         

            {/* Logo */}
            <Logo />

            {/* Location Selector */}
            <motion.button
              className="flex items-start gap-2 text-sm justify-items-start cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="https://flagcdn.com/bd.svg"
                alt=""
                width={8}
                height={8}
                className="h-8 w-8"
              />
              <div className="flex flex-col font-medium items-start text-sm">
                <span className="flex flex-col font-thin items-start text-sm">Deliver to</span>
                <span className="flex flex-col font-semibold items-start text-sm">BANGLADESH</span>
              </div>
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </motion.button>

            {/* Search Bar */}
            <div className="w-[50%] gap-3">
              <SearchInput initialQuery={searchQuery} />
            </div>

            {/* Right Section */}
            <div className="flex h-5 items-center space-x-4 text-sm">
              <motion.button
                className="text-sm hover:text-orange-500 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                bangla
             </motion.button>
              <Separator orientation="vertical" />
                
              <div className="md:flex hidden">
              {user ? (
                    <UserDropdownMenu
                  username={user.name || "User"}
                  email={user.email || ""}
                  avatarUrl={user.image || undefined}
                />
              
              ) : (
                <Link href="/auth" className="relative font-bold flex items-center gap-2">
                  <motion.button
                    className="text-sm h-auto p-0 font-semibold hover:text-orange-500 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Log in
                  </motion.button>
                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-user text-[#8d871c]"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </motion.div>
                </Link>
              )}
              </div>
              
              <Separator orientation="vertical" />
              <Link href="/wishlist" className="relative font-bold flex items-center gap-2">
                <motion.button
                  className="text-sm h-auto p-0 font-semibold hover:text-orange-500 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Wishlist
                </motion.button>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-[#8d871c]"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </motion.div>
              </Link>
              <Separator orientation="vertical" />
              <Link href="/cart" className="relative">
                <span className="sr-only">Cart</span>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <ShoppingCart className="h-6 w-6" />
                </motion.div>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={cartCount}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#3866df] text-xs text-white"
                    variants={cartCountVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {cartCount}
                  </motion.span>
                </AnimatePresence>
              </Link>
            </div>
          </div>
        </div>

        <CategoryNav />
      </div>

      {/* Mobile Header */}
      <div className="block md:hidden">
        <div className="flex flex-col relative">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3">
              {/* Department Drawer for Mobile */}
              <DepartmentDrawer 
                departments={departmentsData.departments}
                isLoading={departmentsData.isLoading}
                error={departmentsData.error}
              />
              <Logo />
            </div>
            <div className="flex items-center gap-4">
            
              <Link href="/cart" className="relative">
                <span className="sr-only">Cart</span>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <ShoppingCart className="h-7 w-7" />
                </motion.div>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={cartCount}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#3866df] text-xs text-white"
                    variants={cartCountVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {cartCount}
                  </motion.span>
                </AnimatePresence>
              </Link>

              {
                user &&(
                  <UserDropdownMenu
                username={user.name || "User"}
                email={user.email || ""}
                avatarUrl={user.image || undefined}
              />
                )
              }
            </div>
          </div>
          <div className="px-4 py-2">
            <SearchInput initialQuery={searchQuery} />
          </div>
        
        </div>
      </div>
    </header>
  )
}