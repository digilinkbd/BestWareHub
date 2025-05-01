"use client";

import { useQuery } from "@tanstack/react-query";
import { VendorStatus } from "@prisma/client";
import { fetchStores, getStoreStats } from "@/actions/store";
import { StoreQueryResult, StoreStats, StoreWithUser } from "@/types/types";

const ITEMS_PER_PAGE = 10;

export function useStoreData(page: number, status: string, search: string) {
    const statsQuery = useQuery<StoreStats>({
      queryKey: ["store-stats"],
      queryFn: async () => {
        const data = await getStoreStats();
        return data || { all: 0, pending: 0, approved: 0, rejected: 0 };
      },
    });
  
    const storesQuery = useQuery<StoreQueryResult>({
      queryKey: ["stores", page, status, search],
      queryFn: async (): Promise<StoreQueryResult> => {
        const vendorStatus = status !== "all" ? (status as VendorStatus) : undefined;
        return await fetchStores({ page, limit: ITEMS_PER_PAGE, status: vendorStatus, search });
      },
    });
  
    const totalPages = storesQuery.data?.total
      ? Math.ceil(storesQuery.data.total / ITEMS_PER_PAGE)
      : 1;
  
    return {
      stats: statsQuery.data,
      isLoadingStats: statsQuery.isLoading,
      stores: storesQuery.data?.stores || [],
      total: storesQuery.data?.total || 0,
      isLoading: storesQuery.isLoading,
      totalPages,
      ITEMS_PER_PAGE,
    };
  }
  
