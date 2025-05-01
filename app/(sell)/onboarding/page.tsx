"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { DocumentUpload } from "@/components/onboarding/DocumentUpload"
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader"
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress"
import { StoreDetails } from "@/components/onboarding/StoreDetails"
import { BusinessDetails } from "@/components/onboarding/BusinessDetails"
import { StoreCustomization } from "@/components/onboarding/StoreCustomization"
import { VerificationPending } from "@/components/onboarding/VerificationPending"
import { FormSummary } from "@/components/onboarding/FormSummary"
import { useCreateStore } from "@/hooks/useStore"

// Define the steps without Bank Details
const steps = [
  "Store Details",
  "Business Information",
  "Document Upload",
  "Store Customization",
  "Review & Submit",
  "Verification",
]

// Define the form data structure
export type OnboardingFormData = {
  // Store Details
  storeName: string
  storeEmail: string
  storePhone: string
  storeWebsite?: string
  logoUrl: string

  // Business Details
  businessName: string
  address: string
  city: string
  state: string
  country: string
  vatNumber?: string
  hasGst: string

  // Document Upload
  idProofUrl: string
  licenseUrl: string

  // Store Customization
  description: string
  facebook?: string
  instagram?: string
  twitter?: string
  themeColor: string
  bannerUrl: string
}

export default function OnboardingPage() {
  const { createStore } = useCreateStore()

  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<OnboardingFormData>({
    // Store Details
    storeName: "",
    storeEmail: "",
    storePhone: "",
    storeWebsite: "",
    logoUrl: "",

    // Business Details
    businessName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    vatNumber: "",
    hasGst: "no",

    // Document Upload
    idProofUrl: "",
    licenseUrl: "",

    // Store Customization
    description: "",
    facebook: "",
    instagram: "",
    twitter: "",
    themeColor: "#FFD700", // Default yellow theme
    bannerUrl: "",
  })

  const updateFormData = (newData: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStepAnimation = {
        y: [20, 0],
        opacity: [0, 1],
      }

      window.scrollTo({ top: 0, behavior: "smooth" })

      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepAnimation = {
        y: [-20, 0],
        opacity: [0, 1],
      }

      window.scrollTo({ top: 0, behavior: "smooth" })

      setCurrentStep(currentStep - 1)
    }
  }


  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log(formData  ,"this is the formData")
      createStore({
        ...formData,
        // Ensure any specific transformations needed
        hasGst: formData.hasGst // "yes" or "no" string
      })
      nextStep()
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StoreDetails formData={formData} updateFormData={updateFormData} onNext={nextStep} />
      case 1:
        return (
          <BusinessDetails formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />
        )
      case 2:
        return (
          <DocumentUpload formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />
        )
      case 3:
        return (
          <StoreCustomization formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />
        )
      case 4:
        return <FormSummary formData={formData} onSubmit={handleSubmit} onBack={prevStep} isSubmitting={isSubmitting} />
      case 5:
        return <VerificationPending />
      default:
        return null
    }
  }

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative">
        {/* Background overlay image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 h-[500px]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1470&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-amber-950/50 backdrop-blur-sm"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <OnboardingHeader />

          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <OnboardingProgress currentStep={currentStep} steps={steps} />

              <motion.div
                key={currentStep}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="mt-8"
              >
                {renderStep()}
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

