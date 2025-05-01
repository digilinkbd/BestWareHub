import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/config/auth";
import { OrdersPageContent } from "@/components/frontend/OrdersPageContent";
import { OrdersPageSkeleton } from "@/components/frontend/OrdersPageSkeleton";
import { checkPermission } from "@/config/useAuth";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
   await checkPermission("orders.read");
  if (!session?.user?.id) {
    redirect("/auth");
  }
  const isAdmin = session.user.roles?.some(role => role.roleName === "admin");
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
      
      <Suspense fallback={<OrdersPageSkeleton />}>
        <OrdersPageContent userId={session.user.id} isAdmin={isAdmin} />
      </Suspense>
    </div>
  );
}