import { CheckoutForm } from "@/components/frontend/CheckoutForm"
import { OrderSummary } from "@/components/frontend/OrderSummary"
import { authOptions } from "@/config/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation"


export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth?returnUrl=/checkout")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <CheckoutForm userId={session.user.id} />
        </div>

        <div className="lg:col-span-4">
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}

