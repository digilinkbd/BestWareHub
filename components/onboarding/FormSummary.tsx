"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { OnboardingFormData } from "@/app/(sell)/onboarding/page"

interface FormSummaryProps {
  formData: OnboardingFormData
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
}

export function FormSummary({ formData, onSubmit, onBack, isSubmitting }: FormSummaryProps) {
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

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl border-2 border-yellow-200">
      <motion.div className="mb-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900">
          Review & Submit
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-600">
          Please review your information before submitting
        </motion.p>
      </motion.div>

      <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="font-semibold text-gray-900 border-b-2 border-yellow-200 pb-2">Store Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Store Name</p>
              <p className="font-medium">{formData.storeName || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Store Email</p>
              <p className="font-medium">{formData.storeEmail || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Store Phone</p>
              <p className="font-medium">{formData.storePhone || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Store Website</p>
              <p className="font-medium">{formData.storeWebsite || "Not provided"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Store Logo</p>
              {formData.logoUrl ? (
                <img
                  src={formData.logoUrl || "/placeholder.svg"}
                  alt="Store Logo"
                  className="h-16 w-16 object-cover rounded-md mt-1 border-2 border-gray-200"
                />
              ) : (
                <p className="font-medium">Not provided</p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="font-semibold text-gray-900 border-b-2 border-yellow-200 pb-2">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Business Name</p>
              <p className="font-medium">{formData.businessName || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Country</p>
              <p className="font-medium">{formData.country || "Not provided"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{formData.address || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">City</p>
              <p className="font-medium">{formData.city || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">State</p>
              <p className="font-medium">{formData.state || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">VAT/GST Number</p>
              <p className="font-medium">{formData.vatNumber || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Has GST</p>
              <p className="font-medium">{formData.hasGst === "yes" ? "Yes" : "No"}</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="font-semibold text-gray-900 border-b-2 border-yellow-200 pb-2">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">ID Proof</p>
              {formData.idProofUrl ? (
                <img
                  src={formData.idProofUrl || "/placeholder.svg"}
                  alt="ID Proof"
                  className="h-24 w-auto object-cover rounded-md mt-1 border-2 border-gray-200"
                />
              ) : (
                <p className="font-medium">Not provided</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Business License</p>
              {formData.licenseUrl ? (
                <img
                  src={formData.licenseUrl || "/placeholder.svg"}
                  alt="Business License"
                  className="h-24 w-auto object-cover rounded-md mt-1 border-2 border-gray-200"
                />
              ) : (
                <p className="font-medium">Not provided</p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="font-semibold text-gray-900 border-b-2 border-yellow-200 pb-2">Store Customization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{formData.description || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Theme Color</p>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="h-6 w-6 rounded-full border-2 border-gray-200"
                  style={{ backgroundColor: formData.themeColor }}
                ></div>
                <span>{formData.themeColor}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Social Media</p>
              <div className="space-y-1 mt-1">
                {formData.facebook && <p className="text-sm">Facebook: {formData.facebook}</p>}
                {formData.instagram && <p className="text-sm">Instagram: {formData.instagram}</p>}
                {formData.twitter && <p className="text-sm">Twitter: {formData.twitter}</p>}
                {!formData.facebook && !formData.instagram && !formData.twitter && (
                  <p className="font-medium">No social media provided</p>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Banner</p>
              {formData.bannerUrl ? (
                <img
                  src={formData.bannerUrl || "/placeholder.svg"}
                  alt="Store Banner"
                  className="h-32 w-full object-cover rounded-md mt-1 border-2 border-gray-200"
                />
              ) : (
                <p className="font-medium">Not provided</p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-between pt-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
              className="border-2 border-gray-300 hover:border-yellow-500"
            >
              Previous Step
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
          >
            <Button onClick={onSubmit} disabled={isSubmitting} className="bg-yellow-500 hover:bg-yellow-600 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </Card>
  )
}

