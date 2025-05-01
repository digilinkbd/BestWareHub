"use client"

import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, Clock, Sparkles, Store } from "lucide-react"
import { useVendorStatus } from "@/hooks/useVendorStatus"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Session } from "next-auth"
import { usePathname } from "next/navigation"

export default function MobileVendorStatus({ session }: { session: Session }) {
  const { vendorStatus, isLoading } = useVendorStatus()
  const pathname = usePathname()

  // Check if user is admin
  const isAdmin = session?.user?.roles?.some((role) => role.roleName === "admin")
  const isUser = session?.user?.roles?.some((role) => role.roleName === "user")

  // If user is admin, show a small indicator with sparkles
  if (isAdmin) {
    return (
    <div>
      <motion.div 
        className="hidden md:flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div 
          className="flex items-center gap-1 rounded-md bg-yellow-500 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              repeatDelay: 5,
              duration: 0.5 
            }}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1 text-white" />
          </motion.div>
          <span className="hidden lg:inline">Current Path:</span> 
          <span className="font-semibold">{pathname.split("/").pop() || "dashboard"}</span>
        </motion.div>
      </motion.div>
    </div>
     
    )
  }

  if (isLoading) {
    return <Skeleton className="h-7 w-7 rounded-full md:hidden" />
  }

  // Define status-specific properties with different colors
  const statusConfig = {
    NORMAL: {
      icon: Store,
      bgColor: "bg-blue-500",
      pulseColor: "rgba(59, 130, 246, 0.5)",
    },
    PENDING: {
      icon: Clock,
      bgColor: "bg-[#9333ea]",
      pulseColor: "#db2777",
    },
    REJECTED: {
      icon: AlertCircle,
      bgColor: "bg-red-500",
      pulseColor: "rgba(239, 68, 68, 0.5)",
    },
    APPROVED: {
      icon: CheckCircle,
      bgColor: "bg-green-500",
      pulseColor: "rgba(34, 197, 94, 0.5)",
    },
  }

  const config = statusConfig[vendorStatus?.status || "NORMAL"]
  const StatusIcon = config.icon

  return (
    <TooltipProvider>
      <Tooltip>
      <TooltipTrigger asChild>
        <div>
        <motion.div
     className="relative flex items-center justify-center md:hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
   >
    {/* Pulsing background */}
    <motion.div
      className={`absolute rounded-full ${config.bgColor} opacity-75`}
      initial={{ width: 24, height: 24 }}
      animate={{
        width: [24, 32, 24],
        height: [24, 32, 24],
        opacity: [0.5, 0.2, 0.5],
      }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration: 2,
        ease: "easeInOut",
      }}
    />

    {/* Icon container */}
    <motion.div
      className={`relative z-10 flex items-center justify-center rounded-full ${config.bgColor} w-8 h-8`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <StatusIcon className="h-4 w-4 text-black" />
    </motion.div>
  </motion.div>

  <motion.div
    className={`hidden md:flex items-center gap-1 rounded-md ${config.bgColor} backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <motion.div
      animate={{
        rotate: [0, 5, -5, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        repeat: Infinity,
        repeatDelay: 5,
        duration: 0.5,
      }}
    >
      <Sparkles className="h-3.5 w-3.5 mr-1 text-white" />
    </motion.div>
    <span className="hidden lg:inline">Store Status:</span>
    <span className="font-semibold">{vendorStatus?.status}</span>
  </motion.div>
        </div>
  
</TooltipTrigger>

        <TooltipContent side="bottom" className="bg-white border border-yellow-200 text-sm">
          <div className="font-medium text-yellow-700 mb-1">Store Status: {vendorStatus?.status}</div>
          <p className="text-gray-600">{vendorStatus?.message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

