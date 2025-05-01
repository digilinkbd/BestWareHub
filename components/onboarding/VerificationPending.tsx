"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, PlayCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function VerificationPending() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
      },
    },
  }

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl border-2 border-yellow-200">
      <motion.div className="text-center mb-8" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="flex justify-center mb-4" variants={itemVariants}>
          <motion.div variants={pulseVariants} animate="pulse">
            <Clock className="h-16 w-16 text-yellow-500" />
          </motion.div>
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900">
          Verification in Progress
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-600 mt-2">
          We are reviewing your application. This process usually takes 1-2 working days.
        </motion.p>
      </motion.div>

      <motion.div
        className="bg-yellow-50 p-4 rounded-lg mb-8 border-2 border-yellow-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h3 variants={itemVariants} className="font-semibold text-yellow-900">
          Current Status: Pending Verification
        </motion.h3>
        <motion.p variants={itemVariants} className="text-sm text-yellow-800 mt-1">
          We'll notify you via email once the verification is complete.
        </motion.p>
      </motion.div>

      <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.h3 variants={itemVariants} className="font-semibold text-gray-900">
          Next Steps
        </motion.h3>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900">Document Verification</h4>
              <p className="text-sm text-gray-600">Our team is reviewing your submitted documents</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900">Business Validation</h4>
              <p className="text-sm text-gray-600">Confirming your business details</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="mt-8" variants={itemVariants}>
          <h3 className="font-semibold text-gray-900 mb-4">While you wait, you can:</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-100">
              <div className="flex items-center space-x-2 mb-2">
                <PlayCircle className="h-5 w-5 text-yellow-500" />
                <h4 className="font-medium text-gray-900">Watch Tutorial</h4>
              </div>
              <p className="text-sm text-gray-600">Learn how to set up your store and list products</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-100">
              <div className="flex items-center space-x-2 mb-2">
                <PlayCircle className="h-5 w-5 text-yellow-500" />
                <h4 className="font-medium text-gray-900">Prepare Products</h4>
              </div>
              <p className="text-sm text-gray-600">Get your product information and images ready</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center mt-8"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/dashboard">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">Continue to Dashboard</Button>
          </Link>
        </motion.div>
      </motion.div>
    </Card>
  )
}

