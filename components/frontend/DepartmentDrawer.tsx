"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ChevronRight, X } from "lucide-react"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { Department } from "@prisma/client"

// Define TypeScript interfaces for the data structure
interface Brand {
  id: string
  title: string
  slug: string
  imageUrl: string
  logo: string
  featured: boolean
}

interface SubCategory {
  id: string
  title: string
  slug: string
  image: string
  description: string
  brands: Brand[]
}

interface Category {
  id: string
  title: string
  slug: string
  image: string
  description: string
  featured: boolean
  icon: string
  subCategories: SubCategory[]
}



// Type for our hook result
interface UseFetchDepartmentsResult {
  departments: Department[]
  isLoading: boolean
  error: Error | null
}

// The DepartmentDrawer component
export default function DepartmentDrawer({ 
  departments,
  isLoading,
  error
}: UseFetchDepartmentsResult) {
  const [isOpen, setIsOpen] = useState(false)

  if (isLoading) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <button className="flex items-center">
            <span className="sr-only">Open menu</span>
            <div className="flex items-center justify-center h-10 w-10 rounded-full">
              <motion.div whileTap={{ scale: 0.95 }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-menu"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </motion.div>
            </div>
          </button>
        </DrawerTrigger>
        <DrawerContent className="h-screen flex flex-col">
          <div className="flex justify-between items-center p-4">
            <DrawerTitle className="text-lg font-bold">Loading departments...</DrawerTitle>
            <DrawerClose asChild>
              <button className="rounded-full p-2 hover:bg-gray-100">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </DrawerClose>
          </div>
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  if (error) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <button className="flex items-center">
            <span className="sr-only">Open menu</span>
            <div className="flex items-center justify-center h-10 w-10 rounded-full">
              <motion.div whileTap={{ scale: 0.95 }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-menu"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </motion.div>
            </div>
          </button>
        </DrawerTrigger>
        <DrawerContent className="h-screen flex flex-col">
          <div className="flex justify-between items-center p-4">
            <DrawerTitle className="text-lg font-bold">Error</DrawerTitle>
            <DrawerClose asChild>
              <button className="rounded-full p-2 hover:bg-gray-100">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </DrawerClose>
          </div>
          <div className="p-4">
            <p className="text-red-500">Failed to load departments. Please try again later.</p>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button className="flex items-center">
          <span className="sr-only">Open menu</span>
          <div className="flex items-center justify-center h-10 w-10 rounded-full">
            <motion.div whileTap={{ scale: 0.95 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </motion.div>
          </div>
        </button>
      </DrawerTrigger>
      <DrawerContent className="h-screen flex flex-col">
        <div className="flex justify-between items-center p-4 bg-mainPrimary">
          <DrawerTitle className="text-lg font-bold">Departments</DrawerTitle>
          <DrawerClose asChild>
            <button className="rounded-full p-2 hover:bg-yellow-100">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </DrawerClose>
        </div>
        <div className="flex-1 overflow-auto">
          <nav className="px-2">
            {departments.map((department) => (
              <div key={department.id} className="py-2">
                <DrawerClose asChild>
                  <Link
                    href={`/d/${department.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-yellow-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {department.icon && (
                        <span className="text-yellow-600 flex-shrink-0">
                          <img 
                            src={department.icon} 
                            alt={department.title} 
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              // Fallback if icon fails to load
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </span>
                      )}
                      <span className="font-medium">{department.title}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                </DrawerClose>
                <Separator className="my-2" />
              </div>
            ))}
          </nav>
        </div>
        <DrawerFooter className="px-4 py-3 border-t">
          <div className="flex flex-col space-y-3">
            <DrawerClose asChild>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-sm hover:text-yellow-600 transition-colors"
              >
                <span>My Account</span>
              </Link>
            </DrawerClose>
            <DrawerClose asChild>
              <Link 
                href="/help" 
                className="flex items-center gap-2 text-sm hover:text-yellow-600 transition-colors"
              >
                <span>Help Center</span>
              </Link>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}