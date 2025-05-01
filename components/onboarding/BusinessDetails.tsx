"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Select from "react-tailwindcss-select";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import currencyCodes from "@/lib/coutries";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { OnboardingFormData } from "@/app/(sell)/onboarding/page";

const formSchema = z.object({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
  city: z.string().min(2, {
    message: "Please enter a valid city.",
  }),
  state: z.string().min(2, {
    message: "Please enter a valid state.",
  }),
  vatNumber: z.string().optional(),
  hasGst: z.enum(["yes", "no"]),
});

interface BusinessDetailsProps {
  formData: OnboardingFormData;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BusinessDetails({ formData, updateFormData, onNext, onBack }: BusinessDetailsProps) {
  const [selectedCountry, setSelectedCountry] = useState<any>(currencyCodes[0]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: formData.businessName || "",
      address: formData.address || "",
      city: formData.city || "",
      state: formData.state || "",
      vatNumber: formData.vatNumber || "",
      hasGst: formData.hasGst as "yes" | "no" || "no",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFormData({
      ...values,
      country: selectedCountry.label,
    });
    
    toast.success("Business details saved!");
    onNext();
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl border-2 border-yellow-200">
      <motion.div 
        className="mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900">Business Information</motion.h2>
        <motion.p variants={itemVariants} className="text-gray-600">Tell us about your business</motion.p>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Business Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your business name" 
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
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <Label className="text-gray-900">Country</Label>
              <Select
                primaryColor="yellow"
                value={selectedCountry}
                onChange={(value) => setSelectedCountry(value)}
                options={currencyCodes}
                formatOptionLabel={(option: any) => (
                  <div className="flex items-center gap-2">
                    <img
                      src={option.flag || "/placeholder.jpg"}
                      alt={option.label}
                      className="w-4 h-4 object-contain"
                    />
                    <span>{option.label}</span>
                  </div>
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">City</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter city" 
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

          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your business address" 
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
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">State</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter state" 
                        {...field} 
                        className="border-2 border-gray-300 focus:border-yellow-500 outline-none" 
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
                name="vatNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900">VAT/GST Number (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter VAT/GST number" 
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

          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="hasGst"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-gray-900">Do you have GST number to sell your goods across country?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="yes" />
                          <Label htmlFor="yes" className="text-gray-900">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="no" />
                          <Label htmlFor="no" className="text-gray-900">No</Label>
                        </div>
                      </RadioGroup>
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
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="border-2 border-gray-300 hover:border-yellow-500"
              >
                Previous Step
              </Button>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Next Step
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </Form>
    </Card>
  );
}
