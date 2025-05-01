"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { motion } from "framer-motion"
import ImageInput from "../FormInputs/ImageInput"
import type { OnboardingFormData } from "@/app/(sell)/onboarding/page"
import toast from "react-hot-toast"

const formSchema = z.object({
  storeName: z.string().min(2, {
    message: "Store name must be at least 2 characters.",
  }),
  storeEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  storePhone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  storeWebsite: z.string().url().optional().or(z.literal("")),
})

interface StoreDetailsProps {
  formData: OnboardingFormData
  updateFormData: (data: Partial<OnboardingFormData>) => void
  onNext: () => void
}

export function StoreDetails({ formData, updateFormData, onNext }: StoreDetailsProps) {
  const [logoUrl, setLogoUrl] = useState(formData.logoUrl || "")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeName: formData.storeName || "",
      storeEmail: formData.storeEmail || "",
      storePhone: formData.storePhone || "",
      storeWebsite: formData.storeWebsite || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!logoUrl) {
      toast.error("Please upload a store logo")
      return
    }

    updateFormData({
      ...values,
      logoUrl,
    })

    toast.success("Store details saved!")
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
          Store Details
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-600">
          Let's get started with your store setup
        </motion.p>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-1 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <ImageInput title="Store Logo" imageUrl={logoUrl} setImageUrl={setLogoUrl} endpoint="storeLogo" />
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="storeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Store Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your store name"
                        {...field}
                        className="border-[1px] border-gray-200 focus:border-yellow-100 outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="storeEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Store Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter store email"
                        {...field}
                        className="border-[1px] border-gray-200 focus:border-yellow-100 outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="storePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Store Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter store phone number"
                        {...field}
                        className="border-[1px] border-gray-200 focus:border-yellow-100 outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="storeWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Store Website (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter store website"
                        {...field}
                        className="border-[1px] border-gray-200 focus:border-yellow-100 outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </motion.div>

          <motion.div className="flex justify-end" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Next Step
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </Form>
    </Card>
  )
}

