"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderFilter, getOrders, getOrderById, updateOrderStatus } from "@/actions/orders";
import { OrderStatus, PaymentStatus, UserRole } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export function useOrders(userId: string, isAdmin: boolean | undefined) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // Parse search params
  const dateRange = searchParams.get("dateRange") as OrderFilter["dateRange"] || undefined;
  const amountSort = searchParams.get("amountSort") as OrderFilter["amountSort"] || undefined;
  const status = searchParams.get("status") as OrderStatus || undefined;
  const paymentStatus = searchParams.get("paymentStatus") as PaymentStatus || undefined;
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10;

  const filter: OrderFilter = {
    dateRange,
    amountSort,
    status,
    paymentStatus,
    page,
    limit,
  };

  const ordersQuery = useQuery({
    queryKey: ["orders", filter, userId],
    queryFn: async () => {
      const userIdToUse = isAdmin && searchParams.get("userId")
        ? searchParams.get("userId")!
        : !isAdmin
        ? userId
        : undefined;
  
      return getOrders(filter, userIdToUse);
    },
  });
  

  // Function to update filters
  const updateFilters = (newFilter: Partial<OrderFilter>) => {
    const params = new URLSearchParams(searchParams);
    
    // Update params
    Object.entries(newFilter).forEach(([key, value]) => {
      if (value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });
    
    // Reset page to 1 if filters change (except when updating page)
    if (!("page" in newFilter)) {
      params.set("page", "1");
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // Function to reset filters
  const resetFilters = () => {
    router.push(pathname);
  };

  return {
    orders: ordersQuery.data?.orders || [],
    pagination: ordersQuery.data?.pagination,
    isLoading: ordersQuery.isPending,
    error: ordersQuery.error,
    filters: filter,
    updateFilters,
    resetFilters,
  };
}
export function useOrderDetails(orderId: string) {
  const queryClient = useQueryClient();

  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => 
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      toast.success("Order status has been updated");
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    orderDetails: orderQuery.data,
    isLoading: orderQuery.isPending,
    error: orderQuery.error,
    updateOrderStatus: updateStatusMutation,
    isUpdating: updateStatusMutation.isPending,
  };
}
  