"use server"

import { db } from "@/prisma/db"
import Stripe from "stripe"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import OrderConfirmationEmail from "@/components/email-templates/OrderConfirmationEmail"
import { Resend } from "resend"


const resend = new Resend(process.env.RESEND_API_KEY);
// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
})

// Validation schema for the checkout form
const checkoutSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  postalCode: z.string().min(3, { message: "Postal code is required" }),
  shippingMethod: z.string().optional(),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
}

export async function createStripeCheckoutSession(formData: CheckoutFormData, cartItems: CartItem[], userId: string) {
  try {
    // Validate the form data
    const validatedData = checkoutSchema.parse(formData)

    // Generate a unique order number
    const orderNumber = `ORDER-${Date.now()}-${uuidv4().substring(0, 8)}`

    // Create line items for Stripe
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "aed",
        product_data: {
          name: item.title,
          images: [item.image],
          metadata: {
            productId: item.id,
          },
        },
        unit_amount: Math.round(item.price * 100), 
      },
      quantity: item.quantity,
    }))

    // Calculate shipping cost based on shipping method
    const shippingCost = validatedData.shippingMethod === "express" ? 25 : 0

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      customer_email: validatedData.email,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: shippingCost * 100,
              currency: "aed",
            },
            display_name: validatedData.shippingMethod === "express" ? "Express Shipping" : "Standard Shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: validatedData.shippingMethod === "express" ? 1 : 3,
              },
              maximum: {
                unit: "business_day",
                value: validatedData.shippingMethod === "express" ? 2 : 5,
              },
            },
          },
        },
      ],
      metadata: {
        orderNumber,
        userId,
        shippingDetails: JSON.stringify({
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          address: validatedData.address,
          city: validatedData.city,
          state: validatedData.state,
          country: validatedData.country,
          postalCode: validatedData.postalCode,
          shippingMethod: validatedData.shippingMethod || "standard",
        }),
      },
    })

    // Return the session ID and URL
    return {
      sessionId: session.id,
      sessionUrl: session.url,
    }
  } catch (error) {
    console.error("Stripe checkout error:", error)
    throw new Error("Failed to create checkout session")
  }
}

export async function processSuccessfulPayment(sessionId: string) {
    try {
      // Retrieve the checkout session
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items", "line_items.data.price.product"],
      })
  
      if (session.payment_status !== "paid") {
        throw new Error("Payment not completed")
      }
  
      // Extract metadata
      const orderNumber = session.metadata?.orderNumber
      const userId = session.metadata?.userId
      const shippingDetails = JSON.parse(session.metadata?.shippingDetails || "{}")
  
      if (!orderNumber || !userId) {
        throw new Error("Missing order information")
      }
  
      // Calculate total amount
      const totalAmount = session.amount_total ? session.amount_total / 100 : 0
  
      // Create the order in the database
      const order = await db.order.create({
        data: {
          orderNumber,
          userId,
          name: shippingDetails.name,
          email: shippingDetails.email,
          phone: shippingDetails.phone,
          address: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state,
          country: shippingDetails.country,
          postalCode: shippingDetails.postalCode,
          shippingMethod: shippingDetails.shippingMethod,
          shippingCost: shippingDetails.shippingMethod === "express" ? 25 : 0,
          totalOrderAmount: totalAmount,
          paymentMethod: "Stripe",
          paymentStatus: "COMPLETED",
          transactionId: sessionId,
          orderStatus: "PROCESSING",
        },
      })
  
      if (session.line_items?.data) {
        for (const item of session.line_items.data) {
          const price = item.price as any
  
          let productId: string | undefined
  
          if (price?.product_data?.metadata?.productId) {
            productId = price.product_data.metadata.productId
          } else if (typeof price?.product === "object" && price?.product) {
            productId = (price.product as Stripe.Product).metadata?.productId
          } else if (typeof price?.product === "string") {
            try {
              const product = await stripe.products.retrieve(price.product)
              productId = product.metadata?.productId
            } catch (error) {
              console.error("Error retrieving product:", error)
            }
          }
  
          if (productId) {
            const product = await db.product.findUnique({
              where: { id: productId },
              include: { vendor: true },
            })
  
            if (product) {
              const orderItem = await db.orderItem.create({
                data: {
                  orderId: order.id,
                  productId: product.id,
                  vendorId: product.vendorId,
                  imageUrl: product.imageUrl,
                  title: product.title,
                  sku: product.sku,
                  quantity: item.quantity || 1,
                  price: price?.unit_amount ? price.unit_amount / 100 : 0,
                  total: (price?.unit_amount ? price.unit_amount / 100 : 0) * (item.quantity || 1),
                },
              })
  
              await db.product.update({
                where: { id: product.id },
                data: {
                  productStock: {
                    decrement: item.quantity || 1,
                  },
                  qty: {
                    decrement: item.quantity || 1,
                  },
                },
              })
  
              if (product.vendorId) {
                const amount = (price?.unit_amount ? price.unit_amount / 100 : 0) * (item.quantity || 1)
                const commissionAmount = amount * 0.1
  
                await db.sale.create({
                  data: {
                    orderId: order.id,
                    productId: product.id,
                    vendorId: product.vendorId,
                    total: amount,
                    commission: commissionAmount,
                    productTitle: product.title,
                    productImage: product.imageUrl || "",
                    productPrice: price?.unit_amount ? price.unit_amount / 100 : 0,
                    productQty: item.quantity || 1,
                  },
                })

                await db.user.update({
                  where: { id: product.vendorId },
                  data: {
                    balance: {
                      increment: amount - commissionAmount,
                    },
                    commission: {
                      increment: commissionAmount,
                    },
                  },
                })
              }
            }
          }
        }
      }
  
      await sendOrderConfirmationEmail(shippingDetails.email, {
        ...order,
        items: await db.orderItem.findMany({
          where: { orderId: order.id },
        }),
      })
  
      return { success: true, orderId: order.id }
    } catch (error) {
      console.error("Payment processing error:", error)
      throw new Error("Failed to process payment")
    }
  }
  
  async function sendOrderConfirmationEmail(email: string, orderData: any) {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY not configured")
        return { success: false, error: "Email service not configured" }
      }
  
      const response = await resend.emails.send({
        from: "Orders <orders@rwoma.com>",
        to: [email],
        subject: `Order Confirmation #${orderData.orderNumber}`,
        react: await OrderConfirmationEmail({ order: orderData }),
      })
  
      if (!response) {
        throw new Error("Failed to send email - no response from service")
      }
  
      return { success: true }
    } catch (error) {
      console.error("Failed to send order confirmation email:", error)
      return { success: false, error: "Failed to send order confirmation email" }
    }
  }
export async function handleStripeWebhook(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") as string

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      await processSuccessfulPayment(session.id)
    }

    return { received: true }
  } catch (error) {
    console.error("Webhook error:", error)
    throw new Error(`Webhook Error: ${error}`)
  }
}