import { useQuery } from "@tanstack/react-query"
import { getAdminDashboardStats, getUserDashboardStats, getVendorDashboardStats } from "@/actions/dashboard"

// Admin Dashboard Hooks
export const useAdminDashboardStats = (dateRange: string = "all") => {
  const query = useQuery({
    queryKey: ["adminDashboard", dateRange],
    queryFn: async () => {
      const data = await getAdminDashboardStats(dateRange)
      console.log(data , "this is the data")

      return data
    }
  })

  return {
    data: query.data,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch
  }
}

// Vendor Dashboard Hooks
export const useVendorDashboardStats = (vendorId: string, dateRange: string = "all") => {
  const query = useQuery({
    queryKey: ["vendorDashboard", vendorId, dateRange],
    queryFn: async () => {
      const data = await getVendorDashboardStats(vendorId, dateRange)
      console.log(data , "this is the data")
      return data
    },
    enabled: !!vendorId
  })

  return {
    data: query.data,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch
  }
}

// User Dashboard Hooks
export const useUserDashboardStats = (userId: string, dateRange: string = "all") => {
  const query = useQuery({
    queryKey: ["userDashboard", userId, dateRange],
    queryFn: async () => {
      const data = await getUserDashboardStats(userId, dateRange)
      console.log(data , "this is the data")

      return data
    },
    enabled: !!userId
  })

  return {
    data: query.data,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch
  }
}