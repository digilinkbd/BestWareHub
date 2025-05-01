"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { motion } from "framer-motion"
import ImageInput from "../FormInputs/ImageInput"
import { OnboardingFormData } from "@/app/(sell)/onboarding/page"
import toast from "react-hot-toast"

const formSchema = z.object({
  description: z.string().min(50, {
    message: "Store description must be at least 50 characters.",
  }),
  facebook: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
})

interface StoreCustomizationProps {
  formData: OnboardingFormData
  updateFormData: (data: Partial<OnboardingFormData>) => void
  onNext: () => void
  onBack: () => void
}

export function StoreCustomization({ formData, updateFormData, onNext, onBack }: StoreCustomizationProps) {
  const [bannerUrl, setBannerUrl] = useState(formData.bannerUrl || "")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: formData.description || "",
      facebook: formData.facebook || "",
      instagram: formData.instagram || "",
      twitter: formData.twitter || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFormData({
      ...values,
      bannerUrl,
    })

    toast.success("Store customization saved!")
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
          Store Customization
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-600">
          Make your store unique and attractive
        </motion.p>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              
          <motion.div
            className="grid grid-cols-1 md:grid-cols-1 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <ImageInput title="Store Banner" imageUrl={bannerUrl} setImageUrl={setBannerUrl} endpoint="storeBanner" />
            </motion.div>

      
          </motion.div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Store Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell customers about your store..."
                        className="min-h-[100px] border-2 border-gray-300 focus:border-yellow-500 outline-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </motion.div>


          <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
            <motion.h3 variants={itemVariants} className="font-semibold text-gray-900">
              Social Media Links
            </motion.h3>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={itemVariants}>
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Facebook</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Facebook URL"
                        {...field}
                        className="border-2 border-gray-300 focus:border-yellow-500 outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Instagram</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Instagram URL"
                        {...field}
                        className="border-2 border-gray-300 focus:border-yellow-500 outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Twitter</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Twitter URL"
                        {...field}
                        className="border-2 border-gray-300 focus:border-yellow-500 outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
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
                className="border-2 border-gray-300 hover:border-yellow-500"
              >
                Previous Step
              </Button>
            </motion.div>

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

