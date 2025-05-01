import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/config/auth";
import AdminDashboard from "@/components/dashboard/DashboardMain";
import VendorDashboard from "@/components/dashboard/VendorDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/auth");
  }

  const userName = session?.user.name || "";
  
  // Determine user role
  const isAdmin = session.user.roles?.some(role => role.roleName === "admin");
  const isVendor = session.user.roles?.some(role => role.roleName === "vendor");
  console.log(isVendor , "this is vendor")
  if (isAdmin) {
    return <AdminDashboard userName={userName} />;
  } else if (isVendor) {
    return <VendorDashboard userName={userName} vendorId={session.user.id}/>;
  } else {
    // Default to user dashboard
    return <UserDashboard userName={userName} userId={session.user.id}/>;
  }
}
