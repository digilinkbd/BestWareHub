import { handleStripeWebhook } from "@/actions/strip"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const result = await handleStripeWebhook(req)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Webhook error:", error)
    return new NextResponse(`Webhook Error: ${error}`, { status: 400 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

