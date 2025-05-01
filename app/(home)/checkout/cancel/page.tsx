import { redirect } from "next/navigation"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config/auth"
import { Suspense } from "react"
import CheckoutSuccessSkeleton from "@/components/frontend/CheckoutSuccessSkeleton"



const PaymentProcessor = async () => {
  try {
    
  
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="mb-4 flex justify-center">
        <XCircle className="h-16 w-16 text-red-500" />
      </div>
        
      <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
      <p className="text-xl mb-2">Your payment was not completed. No charges were made.</p>
        
      <div className="bg-muted/30 px-6 rounded-lg mb-3">
        <p className="text-gray-600">If you encountered any issues during checkout, please contact our support team.</p>
      </div>
        
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="bg-[#f7b614] hover:bg-yellow-600">
          <Link href="/checkout">Try Again</Link>
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
      <PaymentProcessor />
    </Suspense>
  )
}



