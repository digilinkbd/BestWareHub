"use client";

import { CampaignData, getActiveCampaigns, getFeatureBanner } from "@/actions/campaign";
import { createCampaign, createPromotion, deleteCampaign, deletePromotion, getAllCampaigns, getAllPromotions, getAllStores, getCampaignById, getProductsByStore, getPromotionById, updateCampaign, updatePromotion } from "@/actions/marketing";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


export const useFetchCampaigns = () => {
  const campaignsQuery = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const data = await getAllCampaigns();
      return data || [];
    },
  });

  return {
    campaigns: campaignsQuery.data || [],
    isLoading: campaignsQuery.isPending,
    error: campaignsQuery.error,
    refetch: campaignsQuery.refetch,
  };
};

export const useFetchCampaign = (id?: string) => {
  const campaignQuery = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      if (!id) return null;
      return await getCampaignById(id);
    },
    enabled: !!id,
  });

  return {
    campaign: campaignQuery.data,
    isLoading: campaignQuery.isPending,
    error: campaignQuery.error,
  };
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await createCampaign(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create campaign');
      console.error(error);
    },
  });

  return {
    createCampaign: createMutation.mutate,
    isCreating: createMutation.isPending,
    error: createMutation.error,
  };
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await updateCampaign(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.id] });
      toast.success('Campaign updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update campaign');
      console.error(error);
    },
  });

  return {
    updateCampaign: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    error: updateMutation.error,
  };
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteCampaign(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete campaign');
      console.error(error);
    },
  });

  return {
    deleteCampaign: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    error: deleteMutation.error,
  };
};

// Promotion Hooks
export const useFetchPromotions = () => {
  const promotionsQuery = useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const data = await getAllPromotions();
      return data || [];
    },
  });

  return {
    promotions: promotionsQuery.data || [],
    isLoading: promotionsQuery.isPending,
    error: promotionsQuery.error,
    refetch: promotionsQuery.refetch,
  };
};

export const useFetchPromotion = (id?: string) => {
  const promotionQuery = useQuery({
    queryKey: ['promotion', id],
    queryFn: async () => {
      if (!id) return null;
      return await getPromotionById(id);
    },
    enabled: !!id,
  });

  return {
    promotion: promotionQuery.data,
    isLoading: promotionQuery.isPending,
    error: promotionQuery.error,
  };
};

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await createPromotion(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promotion created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create promotion');
      console.error(error);
    },
  });

  return {
    createPromotion: createMutation.mutate,
    isCreating: createMutation.isPending,
    error: createMutation.error,
  };
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();
  
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await updatePromotion(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['promotion', variables.id] });
      toast.success('Promotion updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update promotion');
      console.error(error);
    },
  });

  return {
    updatePromotion: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    error: updateMutation.error,
  };
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deletePromotion(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promotion deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete promotion');
      console.error(error);
    },
  });

  return {
    deletePromotion: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    error: deleteMutation.error,
  };
};

// Product & Store Hooks
export const useFetchProductsByStore = (storeId?: string) => {
  const productsQuery = useQuery({
    queryKey: ['products', storeId || 'default'],
    queryFn: async () => {
      return await getProductsByStore(storeId);
    },
  });

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isPending,
    error: productsQuery.error,
  };
};

export const useFetchStores = () => {
  const storesQuery = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      return await getAllStores();
    },
  });

  return {
    stores: storesQuery.data || [],
    isLoading: storesQuery.isPending,
    error: storesQuery.error,
  };
};
export const useActiveCampaigns = () => {
  const campaignsQuery = useQuery({
    queryKey: ["active-campaigns"],
    queryFn: async (): Promise<CampaignData[]> => {
      const data = await getActiveCampaigns()
      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    campaigns: campaignsQuery.data || [],
    isLoading: campaignsQuery.isPending,
    error: campaignsQuery.error,
    refetch: campaignsQuery.refetch,
  }
}

export const useFeatureBanner = () => {
  const bannerQuery = useQuery({
    queryKey: ["feature-banner"],
    queryFn: async (): Promise<CampaignData | null> => {
      const data = await getFeatureBanner()
      return data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    banner: bannerQuery.data,
    isLoading: bannerQuery.isPending,
    error: bannerQuery.error,
    refetch: bannerQuery.refetch,
  }
}