"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  Store, 
  Box, 
  Search,
  ShoppingBag,
  Percent,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDeleteCampaign, useDeletePromotion, useFetchCampaigns, useFetchPromotions } from "@/hooks/useCampaignAndPromotions";
import { DEFAULT_BLUR, DEFAULT_IMAGE } from "@/lib/lazyLoading";


interface MarketingDashboardProps {
    searchParams: { tab?: string };
  }
  
const MarketingDashboard: React.FC<MarketingDashboardProps> = ({ searchParams }) => {
    const router = useRouter();
    const activeTab = searchParams?.tab || "campaigns";
  
  const { campaigns, isLoading: campaignsLoading } = useFetchCampaigns();
  const { promotions, isLoading: promotionsLoading } = useFetchPromotions();
  const { deleteCampaign } = useDeleteCampaign();
  const { deletePromotion } = useDeletePromotion();
  
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPromotions = promotions.filter(promotion => 
    promotion.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = (value:string) => {
    router.push(`/dashboard/marketing?tab=${value}`);
  };

  const confirmDelete = (type: "campaign" | "promotion", id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete this ${type}: "${title}"?`)) {
      if (type === "campaign") {
        deleteCampaign(id);
      } else {
        deletePromotion(id);
      }
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your campaigns and promotions</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={() => router.push(`/dashboard/${activeTab === "campaigns" ? "campaign" : "promotions"}/new`)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New {activeTab === "campaigns" ? "Campaign" : "Promotion"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-8 bg-gray-100">
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="promotions" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
            <Percent className="mr-2 h-4 w-4" />
            Promotions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="space-y-6">
          {campaignsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <Box className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No campaigns found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? "Try a different search term or" : "Get started by"} creating a new campaign.
              </p>
              <Button 
                className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => router.push('/dashboard/campaign/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredCampaigns.map((campaign) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200">
                      <div className="relative h-48 w-full bg-gray-100">
                        {campaign.imageUrl ? (
                          <Image
                            src={campaign.imageUrl ?? DEFAULT_IMAGE}
                            alt={campaign.title}
                            fill
                            placeholder="blur"
                            blurDataURL={DEFAULT_BLUR}
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gray-200">
                            <ShoppingBag className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        
                        <div className="absolute top-4 right-4">
                          <Badge 
                            className={campaign.isActive ? "bg-green-500" : "bg-gray-500"}
                          >
                            {campaign.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="text-xl font-bold line-clamp-1">
                          {campaign.title}
                        </CardTitle>
                        <CardDescription className="flex items-center text-sm">
                          <Calendar className="mr-1 h-4 w-4" />
                          {format(new Date(campaign.startDate), "MMM d, yyyy")} - {format(new Date(campaign.endDate), "MMM d, yyyy")}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-gray-600 line-clamp-2 text-sm h-10">
                          {campaign.description || "No description provided"}
                        </p>
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Products: {campaign.products.length}</h4>
                          <div className="flex -space-x-2 overflow-hidden">
                            {campaign.products.slice(0, 5).map((product) => (
                              <div key={product.id} className="inline-block h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                                {product.imageUrl ? (
                                  <Image
                                    src={product.imageUrl ?? DEFAULT_IMAGE}
                                    alt={product.title}
                                    width={32}
                                    height={32}
                                    placeholder="blur"
                                    blurDataURL={DEFAULT_BLUR}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Box className="h-full w-full p-1 text-gray-400" />
                                )}
                              </div>
                            ))}
                            {campaign.products.length > 5 && (
                              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium">
                                +{campaign.products.length - 5}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between pt-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => confirmDelete("campaign", campaign.id, campaign.title)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-yellow-600 hover:bg-yellow-50"
                          onClick={() => router.push(`/dashboard/campaign/edit/${campaign.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="promotions" className="space-y-6">
          {promotionsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : filteredPromotions.length === 0 ? (
            <div className="text-center py-12">
              <Percent className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No promotions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? "Try a different search term or" : "Get started by"} creating a new promotion.
              </p>
              <Button 
                className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => router.push('/dashboard/promotions/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Promotion
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredPromotions.map((promotion) => (
                  <motion.div
                    key={promotion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200">
                      <div className="relative h-48 w-full bg-gray-100">
                        {promotion.imageUrl ? (
                          <Image
                            src={promotion.imageUrl ??DEFAULT_IMAGE}
                            alt={promotion.title}
                            fill
                            placeholder="blur"
                            blurDataURL={DEFAULT_BLUR}
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gray-200">
                            <Percent className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        
                        <div className="absolute top-4 right-4">
                          <Badge 
                            className={promotion.isActive ? "bg-green-500" : "bg-gray-500"}
                          >
                            {promotion.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-yellow-500 text-white font-bold">
                            {promotion.discount}% OFF
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="text-xl font-bold line-clamp-1">
                          {promotion.title}
                        </CardTitle>
                        <CardDescription className="flex items-center text-sm">
                          <Calendar className="mr-1 h-4 w-4" />
                          {format(new Date(promotion.startDate), "MMM d, yyyy")} - {format(new Date(promotion.endDate), "MMM d, yyyy")}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-gray-600 line-clamp-2 text-sm h-10">
                          {promotion.description || "No description provided"}
                        </p>
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Products: {promotion.products.length}</h4>
                          <div className="flex -space-x-2 overflow-hidden">
                            {promotion.products.slice(0, 5).map((product) => (
                              <div key={product.id} className="inline-block h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                                {product.imageUrl ? (
                                  <Image
                                    src={product.imageUrl?? DEFAULT_IMAGE}
                                    alt={product.title}
                                    width={32}
                                    height={32}
                                    placeholder="blur"
                                    blurDataURL={DEFAULT_BLUR}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Box className="h-full w-full p-1 text-gray-400" />
                                )}
                              </div>
                            ))}
                            {promotion.products.length > 5 && (
                              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium">
                                +{promotion.products.length - 5}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between pt-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => confirmDelete("promotion", promotion.id, promotion.title)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-yellow-600 hover:bg-yellow-50"
                          onClick={() => router.push(`/dashboard/promotions/edit/${promotion.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketingDashboard;