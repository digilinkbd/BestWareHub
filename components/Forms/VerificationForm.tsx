"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { verifyEmail } from "@/actions/auth" 

interface VerificationFormProps {
  email: string
  onSwitchToLogin: () => void
}

interface VerificationData {
  code: string[]
}

export default function VerificationForm({ email, onSwitchToLogin }: VerificationFormProps) {
  const [loading, setLoading] = useState(false)
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationData>()

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6)
  }, [])

  const handleCodeChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return

    // Update the code array
    const newCode = [...verificationCode]
    newCode[index] = value.slice(0, 1) // Only take the first character
    setVerificationCode(newCode)

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim()

    // Check if pasted content is a number and has the right length
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("").slice(0, 6)
      const newCode = [...verificationCode]

      digits.forEach((digit, index) => {
        if (index < 6) {
          newCode[index] = digit
        }
      })

      setVerificationCode(newCode)

      // Focus the next empty input or the last one if all filled
      const nextEmptyIndex = newCode.findIndex((val) => !val)
      if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
        inputRefs.current[nextEmptyIndex]?.focus()
      } else {
        inputRefs.current[5]?.focus()
      }
    }
  }

  const onSubmit = async () => {
    const code = verificationCode.join("")
    if (code.length !== 6) {
      toast.error("Please enter the complete verification code")
      return
    }

    setLoading(true)

    try {
      // Uncomment for actual implementation
      const res = await verifyEmail({ email, code });
      if (res.success) {
        setLoading(false);
        toast.success("Email verified successfully");
        onSwitchToLogin();
      } else {
        setLoading(false);
        toast.error(res.error || "Invalid verification code");
      }
    } catch (error) {
      setLoading(false)
      console.error("Verification Error:", error)
      toast.error("Something went wrong. Please try again.")
    }
  }

  const handleResendCode = () => {
    toast.success("Verification code resent to your email")
    // Implement actual resend code functionality here
  }
  return (
    <motion.div
      key="verification"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold">Verify Your Email</h1>
        <p className="text-center text-sm text-gray-600">
          We've sent a verification code to <span className="font-medium">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="verificationCode" className="text-base font-bold">
              Verification Code
            </Label>
            <div className="flex justify-between gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
               <Input
               key={index}
               ref={(el) => {
                 inputRefs.current[index] = el;
               }}
               type="text"
               inputMode="numeric"
               maxLength={1}
               value={verificationCode[index]}
               onChange={(e) => handleCodeChange(index, e.target.value)}
               onKeyDown={(e) => handleKeyDown(index, e)}
               onPaste={index === 0 ? handlePaste : undefined}
               className={cn(
                 "h-14 w-14 text-center text-xl font-medium border-2 shadow-sm focus:ring-2 focus:ring-yellow-200",
                 "border-gray-300 focus:border-yellow-500",
               )}
             />
             
              ))}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-base font-medium bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          {loading ? (
            <div className="flex space-x-2 items-center justify-center">
              <motion.div
                className="h-2 w-2 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
              />
              <motion.div
                className="h-2 w-2 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.2 }}
              />
              <motion.div
                className="h-2 w-2 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.4 }}
              />
            </div>
          ) : (
            "Verify Email"
          )}
        </Button>

        <div className="text-center">
          <button type="button" onClick={handleResendCode} className="text-sm text-yellow-600 hover:text-yellow-700">
            Resend code
          </button>
        </div>
      </form>

      <div className="text-center">
        <button type="button" onClick={onSwitchToLogin} className="text-sm text-gray-600 hover:text-gray-800">
          Back to login
        </button>
      </div>
    </motion.div>
  )
}

