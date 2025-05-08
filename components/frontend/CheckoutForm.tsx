"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Check, CreditCard, Truck, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { toast } from "react-hot-toast"
import { useCartStore } from "@/hooks/cart-store"
import { createStripeCheckoutSession } from "@/actions/strip"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  postalCode: z.string().min(3, { message: "Postal code is required" }),
  shippingMethod: z.enum(["standard", "express"]),
})

type FormValues = z.infer<typeof formSchema>

export function CheckoutForm({ userId, userData }: { userId: string; userData?: { email?: string; name?: string } }) {
  const { items, getTotal, getItemCount, clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState<"shipping" | "payment">("shipping")
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      shippingMethod: "standard",
    },
  })

  const handleContinueToPayment = async () => {
    const result = await form.trigger()

    if (result) {
      setCurrentStep("payment")
    } else {
      toast.error("Please fill in all required fields")
    }
  }

  const handlePaymentSubmit = async () => {
    try {
      setIsSubmitting(true)

      const formData = form.getValues()

      const emailToUse = userData?.email || formData.email

      const { sessionUrl } = await createStripeCheckoutSession(
        {
          ...formData,
          email: emailToUse, 
        },
        items.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        userId,
      )

      if (sessionUrl) {
        window.location.href = sessionUrl
      } else {
        throw new Error("Failed to create checkout session")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Payment failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex items-center space-x-2">
          <div
            className={`w-10 h-8 rounded-full flex items-center justify-center ${
              currentStep === "shipping" ? "bg-[#f7b614]" : "bg-green-500"
            } text-white`}
          >
            {currentStep === "payment" ? <Check className="w-5 h-5" /> : "1"}
          </div>
          <span className="font-medium">Shipping Information</span>
          <Separator className="flex-grow" />
          <div
            className={`w-10 h-8 rounded-full flex items-center justify-center ${
              currentStep === "payment" ? "bg-[#f7b614]" : "bg-gray-200"
            } text-white`}
          >
            2
          </div>
          <span className={`font-medium ${currentStep === "payment" ? "text-black" : "text-gray-400"}`}>Payment</span>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          {currentStep === "shipping" && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
              <Card>
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#f7b614]" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+971 50 123 4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, Apt 4B" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Dubai" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="Dubai" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Uganda" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-[#f7b614]" />
                    Shipping Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="shippingMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <FormItem className="flex flex-col space-y-1 rounded-md border p-4 cursor-pointer [&:has([data-state=checked])]:border-[#f7b614] [&:has([data-state=checked])]:bg-yellow-50">
                              <FormControl>
                                <RadioGroupItem value="standard" className="sr-only" />
                              </FormControl>
                              <div className="flex justify-between">
                                <FormLabel className="font-semibold cursor-pointer">Standard Shipping</FormLabel>
                                <span className="text-green-600 font-medium">FREE</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Delivery in 3-5 business days</p>
                            </FormItem>
                            <FormItem className="flex flex-col space-y-1 rounded-md border p-4 cursor-pointer [&:has([data-state=checked])]:border-[#f7b614] [&:has([data-state=checked])]:bg-yellow-50">
                              <FormControl>
                                <RadioGroupItem value="express" className="sr-only" />
                              </FormControl>
                              <div className="flex justify-between">
                                <FormLabel className="font-semibold cursor-pointer">Express Shipping</FormLabel>
                                <span className="font-medium">BDT 25.00</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Delivery in 1-2 business days</p>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="bg-[#f7b614] hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg"
                  onClick={handleContinueToPayment}
                >
                  Continue to Payment
                </motion.button>
              </div>
            </motion.div>
          )}

          {currentStep === "payment" && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
              <Card>
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-[#f7b614]" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="bg-muted/20 p-4 rounded-lg border">
                      <p className="text-sm text-muted-foreground mb-4">
                        You will be redirected to Stripe's secure payment page to complete your purchase.
                      </p>

                      <div className="flex items-center space-x-4 mb-4">
                        <img src="/master.png" alt="Mastercard" className="h-4" />
                        <img src="/visa.png" alt="Visa" className="h-4" />
                        <img src="/express.png" alt="American Express" className="h-4" />
                      </div>

                      <div className="flex items-center text-sm text-green-600">
                        <Check className="h-4 w-4 mr-2" />
                        Your payment information is secure and encrypted
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <img
                            src="https://f.nooncdn.com/s/app/com/noon/images/tabby.svg"
                            alt="Tabby"
                            className="h-6"
                          />
                        </div>
                        <div className="text-sm">
                          Pay 4 interest free payments of BDT {(getTotal() / 4).toFixed(2)}
                          <a href="#" className="block text-blue-500">
                            Learn more
                          </a>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <img
                            src="https://k.nooncdn.com/s/app/com/noon/images/tamara_logo.svg"
                            alt="Tamara"
                            className="h-6"
                          />
                        </div>
                        <div className="text-sm">
                          Split in 4 payments of BDT {(getTotal() / 4).toFixed(2)}. No interest. No late fees.
                          <a href="#" className="block text-blue-500">
                            Learn more
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentStep("shipping")}>
                  Back to Shipping
                </Button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="bg-[#f7b614] hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg flex items-center"
                  onClick={handlePaymentSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </form>
      </Form>
    </div>
  )
}

