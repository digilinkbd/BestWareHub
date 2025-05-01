"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { motion } from "framer-motion"
import ImageInput from "../FormInputs/ImageInput"
import { OnboardingFormData } from "@/app/(sell)/onboarding/page"
import toast from "react-hot-toast"

interface DocumentUploadProps {
  formData: OnboardingFormData
  updateFormData: (data: Partial<OnboardingFormData>) => void
  onNext: () => void
  onBack: () => void
}

export function DocumentUpload({ formData, updateFormData, onNext, onBack }: DocumentUploadProps) {
  const [idProofUrl, setIdProofUrl] = useState(formData.idProofUrl || "")
  const [licenseUrl, setLicenseUrl] = useState(formData.licenseUrl || "")

  const handleNext = () => {
    if (!idProofUrl || !licenseUrl) {
      toast.error("Please upload all required documents")
      return
    }

    updateFormData({
      idProofUrl,
      licenseUrl,
    })

    toast.success("Documents uploaded successfully!")
    onNext()
  }

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
          Document Upload
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-600">
          Please upload the required documents
        </motion.p>
      </motion.div>

      <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
          <ImageInput title="ID Proof" imageUrl={idProofUrl} setImageUrl={setIdProofUrl} endpoint="idProof" />
          <ImageInput
            title="Business License"
            imageUrl={licenseUrl}
            setImageUrl={setLicenseUrl}
            endpoint="businessLicense"
          />
        </motion.div>

        <motion.div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-100" variants={itemVariants}>
          <h3 className="font-semibold text-yellow-900">Document Guidelines</h3>
          <ul className="mt-2 space-y-1 text-sm text-yellow-800">
            <li>• All documents must be clear and legible</li>
            <li>• Files should be in PDF, JPG, or PNG format</li>
            <li>• Maximum file size: 5MB per document</li>
            <li>• Documents should be valid and not expired</li>
          </ul>
        </motion.div>

        <motion.div className="flex justify-between pt-4" variants={itemVariants}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="border-2 border-gray-300 hover:border-yellow-500"
            >
              Previous Step
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleNext} className="bg-yellow-500 hover:bg-yellow-600 text-white">
              Next Step
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </Card>
  )
}

