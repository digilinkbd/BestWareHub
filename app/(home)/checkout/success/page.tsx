import { redirect } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { processSuccessfulPayment } from "@/actions/strip"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config/auth"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import CheckoutSuccessSkeleton from "@/components/frontend/CheckoutSuccessSkeleton"



// Create a component to handle the actual payment processing
const PaymentProcessor = async ({ sessionId }: { sessionId: string }) => {
  try {
    const { success, orderId } = await processSuccessfulPayment(sessionId)
    
    if (!success) {
      redirect("/checkout/cancel")
    }
    
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="mb-8 flex justify-center">
          <CheckCircle className="h-20 w-20 text-green-500 animate-bounce" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-lg mb-8">Thank you for your purchase. Your order has been confirmed.</p>
        
        <div className="bg-muted/30 p-6 rounded-lg mb-2">
          <p className="text-base font-medium mb-2">Order ID: {orderId}</p>
          <p className="text-gray-600">We've sent a confirmation email with your order details.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-[#f7b614] hover:bg-yellow-600">
            <Link href="/dashboard/orders">View My Orders</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error processing payment:", error)
    redirect("/checkout/cancel")
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth");
  }
  
  const params = await searchParams;
  const sessionId = params.session_id;
  
  if (!sessionId) {
    redirect("/checkout")
  }
  
  return (
    <Suspense fallback={<CheckoutSuccessSkeleton />}>
      <PaymentProcessor sessionId={sessionId} />
    </Suspense>
  )
}



