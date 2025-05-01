"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface OnboardingProgressProps {
  currentStep: number
  steps: string[]
}

export function OnboardingProgress({ currentStep, steps }: OnboardingProgressProps) {
  return (
    <div className="relative">
      {/* Progress bar */}
      <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full">
        <motion.div
          className="absolute left-0 h-full bg-yellow-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <div key={step} className="flex flex-col items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted ? "bg-yellow-500" : isCurrent ? "bg-yellow-500" : "bg-gray-200"
                } ${isCurrent ? "ring-4 ring-yellow-200" : ""}`}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isCompleted || isCurrent ? "#eab308" : "#e5e7eb",
                }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.1 }}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6 text-white" />
                ) : (
                  <span className={`${isCurrent ? "text-white" : "text-gray-600"}`}>{index + 1}</span>
                )}
              </motion.div>
              <span className="mt-2 text-xs md:text-sm text-gray-200 text-center line-clamp-1">{step}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

