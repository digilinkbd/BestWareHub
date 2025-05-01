"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X, Tag, Store, ArrowLeft, Box, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import FormSelectInput from "@/components/FormInputs/FormSelectInput";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCreatePromotion, useFetchPromotion, useFetchProductsByStore, useFetchStores, useUpdatePromotion } from "@/hooks/useCampaignAndPromotions";
import { generateSlug } from "@/lib/generateSlug";
import ImageUploader from "@/components/FormInputs/ImageUploader";
import toast from "react-hot-toast";
import { DEFAULT_BLUR, DEFAULT_IMAGE } from "@/lib/lazyLoading";

// Define proper types
interface Product {
  id: string;
  title: string;
  imageUrl?: string | null;
  productPrice: number;
  salePrice?: number | null;
  storeId?: string | null;
  store?: {
    storeName: string;
  };
}

interface Store {
  id: string;
  storeName: string;
  logo?: string | null;
}

interface SelectOption {
  value: string;
  label: string;
}

// Form schema with proper validation
const formSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters" }),
    slug: z.string().min(3, { message: "Slug must be at least 3 characters" }),
    description: z.string().optional(),
    imageUrl: z.string().optional().nullable(),
  
    discountPercentage: z.coerce.number().min(1, { message: "Discount must be at least 1%" }).max(100, { message: "Discount cannot exceed 100%" }),
    startDate: z.date(),
    endDate: z.date(),
    isActive: z.boolean().default(true),
    productIds: z.array(z.string()).min(1, { message: "At least one product must be selected" }),
  });

type PromotionFormValues = z.infer<typeof formSchema>;

export default function PromotionForm({ promotionId }: { promotionId?: string }) {
  const router = useRouter();
  const isEditMode = !!promotionId;

  // Queries and mutations
  const { promotion, isLoading: isFetchingPromotion } = useFetchPromotion(promotionId);
  const { createPromotion, isCreating } = useCreatePromotion();
  const { updatePromotion, isUpdating } = useUpdatePromotion();
  const { stores, isLoading: isLoadingStores } = useFetchStores();

  // Local state
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [storeOption, setStoreOption] = useState<SelectOption | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState("details");
  const [storeOptions, setStoreOptions] = useState<SelectOption[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products based on selected store
  const { products, isLoading: isLoadingProducts } = useFetchProductsByStore(selectedStoreId || undefined);

  // Set up the form
  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      imageUrl: null,
      discountPercentage: 10,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      isActive: true,
      productIds: [],
    },
  });

  // Load promotion data when in edit mode
  useEffect(() => {
    if (promotion && isEditMode) {
      form.reset({
        title: promotion.title,
        slug: promotion.slug,
        description: promotion.description || "",
        imageUrl: promotion.imageUrl || null,
        discountPercentage: promotion?.discountPercentage ?? 10 as any,
        startDate: new Date(promotion.startDate),
        endDate: new Date(promotion.endDate),
        isActive: promotion.isActive,
        productIds: promotion.products.map((product) => product.id),
      });
      
      if (promotion.imageUrl) {
        setImageUrls([promotion.imageUrl]);
      }
      
      setSelectedProducts(promotion.products);
    }
  }, [promotion, isEditMode, form]);

  // Convert stores for dropdown
  useEffect(() => {
    if (stores && stores.length > 0) {
      const storeOptions = stores.map((store) => ({
        value: store.id,
        label: store.storeName,
      }));
      
      // Add "All Products" option
      const allProductsOption = { value: "", label: "All Products" };
      
      // Update store options
      setStoreOptions([allProductsOption, ...storeOptions]);
    }
  }, [stores]);

  // Generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    if (!isEditMode || !form.getValues("slug")) {
      const slug = generateSlug(title);
      form.setValue("slug", slug);
    }
  };

  // Handle form submission
  const onSubmit = async (values: PromotionFormValues) => {
    // Update imageUrl from the first image in imageUrls
    const finalValues = {
      ...values,
      imageUrl: imageUrls.length > 0 ? imageUrls[0] : null,
    };

    try {
      if (isEditMode) {
        await updatePromotion({ id: promotionId!, data: finalValues });
      } else {
        await createPromotion(finalValues);
      }
      router.push("/dashboard/marketing?tab=promotions");
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? "update" : "create"} promotion`);
      console.error(error);
    }
  };

  // Handle store selection
  const handleStoreChange = (option: SelectOption | null) => {
    setStoreOption(option);
    setSelectedStoreId(option?.value || null);
  };

  // Add/remove products
  const toggleProductSelection = (product: Product) => {
    const isSelected = selectedProducts.some((p) => p.id === product.id);
    
    if (isSelected) {
      // Remove product
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
      form.setValue(
        "productIds",
        form.getValues("productIds").filter((id) => id !== product.id)
      );
    } else {
      // Add product
      setSelectedProducts([...selectedProducts, product]);
      form.setValue("productIds", [...form.getValues("productIds"), product.id]);
    }
  };

  // Filter products based on search term
  const filteredProducts = products?.filter((product) => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isFetchingPromotion && isEditMode) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-3">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push("/dashboard/marketing?tab=promotions")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Promotions
      </Button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? "Edit Promotion" : "Create Promotion"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode
            ? "Update your promotion details and product selections"
            : "Set up a new promotion with discount codes and product selections"}
        </p>
      </div>
      
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100">
          <TabsTrigger value="details" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
            Promotion Details
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
            Select Products {selectedProducts.length > 0 && `(${selectedProducts.length})`}
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="details">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Promotion Information</CardTitle>
                    <CardDescription>
                      Enter the basic information for your promotion
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Promotion Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Summer Sale"
                              {...field}
                              onChange={handleTitleChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 ">
                      
                      <FormField
                        control={form.control}
                        name="discountPercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Percentage</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  min="1"
                                  max="100"
                                  {...field}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <span className="text-gray-500">%</span>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter promotion description..."
                              {...field}
                              className="min-h-[120px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                                    (form.getValues("startDate") &&
                                      date < form.getValues("startDate"))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Active Promotion</FormLabel>
                            <FormDescription>
                              This promotion will be visible to customers if active
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <ImageUploader
                        imageUrls={imageUrls}
                        setImageUrls={setImageUrls}
                        maxImages={1}
                        label="Promotion Banner"
                        endpoint="campaign"
                        className="h-64"
                      />
                    </div>
                    
                    {selectedProducts.length > 0 && (
                      <div>
                        <h3 className="font-medium text-sm mb-2 text-gray-700">
                          Selected Products Preview
                        </h3>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                          {selectedProducts.slice(0, 4).map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50"
                            >
                              {product.imageUrl ? (
                                <div className="relative h-8 w-8 rounded overflow-hidden">
                                  <Image
                                    src={product.imageUrl ?? DEFAULT_IMAGE}
                                    alt={product.title}
                                    fill
                                    sizes="32px"
                                    className="object-cover"
                                    placeholder="blur"
                                    blurDataURL={DEFAULT_BLUR}
                                  />
                                </div>
                              ) : (
                                <Box className="h-8 w-8 text-gray-400" />
                              )}
                              <span className="text-xs truncate">
                                {product.title}
                              </span>
                            </div>
                          ))}
                          {selectedProducts.length > 4 && (
                            <div className="flex items-center justify-center p-2 border rounded-md bg-gray-50">
                              <span className="text-xs text-gray-500">
                                +{selectedProducts.length - 4} more
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <FormMessage>
                      {form.formState.errors.productIds?.message}
                    </FormMessage>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Select Products</CardTitle>
                  <CardDescription>
                    Choose products to include in this promotion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="w-full md:w-1/3">
                        <FormSelectInput
                          options={storeOptions}
                          label="Filter by Store"
                          option={storeOption}
                          setOption={handleStoreChange}
                          labelShown={true}
                        />
                      </div>
                      <div className="w-full md:w-2/3">
                        <FormLabel className="pb-2 block text-sm font-medium leading-6 text-gray-900">
                          Search Products
                        </FormLabel>
                        <Input
                          placeholder="Search by product name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    {isLoadingProducts ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                      </div>
                    ) : filteredProducts && filteredProducts.length > 0 ? (
                      <div>
                        <div className="mb-4 flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {filteredProducts.length} products found
                          </span>
                          {selectedProducts.length > 0 && (
                            <Badge variant="outline" className="bg-yellow-50">
                              {selectedProducts.length} selected
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          <AnimatePresence>
                            {filteredProducts.map((product) => {
                              const isSelected = selectedProducts.some(
                                (p) => p.id === product.id
                              );
                              return (
                                <motion.div
                                  key={product.id}
                                  layout
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div
                                    className={cn(
                                      "border rounded-lg overflow-hidden cursor-pointer transition-all duration-200",
                                      isSelected
                                        ? "border-yellow-500 shadow-md ring-2 ring-yellow-200"
                                        : "hover:border-yellow-200"
                                    )}
                                    onClick={() => toggleProductSelection(product as Product)}
                                  >
                                    <div className="relative h-40 bg-gray-100">
                                      {product.imageUrl ? (
                                        <Image
                                          src={product.imageUrl ?? DEFAULT_IMAGE}
                                          alt={product.title}
                                          fill
                                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                          className="object-cover"
                                          placeholder="blur"
                                          blurDataURL={DEFAULT_BLUR}
                                        />
                                      ) : (
                                        <div className="flex h-full items-center justify-center">
                                          <Box className="h-16 w-16 text-gray-300" />
                                        </div>
                                      )}
                                      {isSelected && (
                                        <div className="absolute top-2 right-2">
                                          <Badge className="bg-yellow-500 hover:bg-yellow-600">
                                            Selected
                                          </Badge>
                                        </div>
                                      )}
                                      {product.storeId && product.store && (
                                        <div className="absolute bottom-2 left-2">
                                          <Badge variant="outline" className="bg-white bg-opacity-70">
                                            {product.store.storeName}
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                    <div className="p-3">
                                      <h3 className="font-medium text-sm truncate">
                                        {product.title}
                                      </h3>
                                      <div className="flex items-center justify-between mt-2">
                                        <div className="text-sm">
                                          {product.salePrice ? (
                                            <div className="flex items-center gap-2">
                                              <span className="font-medium">
                                                ${product.salePrice.toFixed(2)}
                                              </span>
                                              <span className="text-gray-500 line-through text-xs">
                                                ${product.productPrice.toFixed(2)}
                                              </span>
                                            </div>
                                          ) : (
                                            <span className="font-medium">
                                              ${product.productPrice.toFixed(2)}
                                            </span>
                                          )}
                                        </div>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className={cn(
                                            "rounded-full p-0 h-7 w-7",
                                            isSelected
                                              ? "text-yellow-500 hover:text-yellow-600"
                                              : "text-gray-400 hover:text-gray-500"
                                          )}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleProductSelection(product as Product);
                                          }}
                                        >
                                          {isSelected ? (
                                            <X className="h-4 w-4" />
                                          ) : (
                                            <Tag className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 border rounded-lg bg-gray-50">
                        <Box className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700">
                          No products found
                        </h3>
                        <p className="text-gray-500 mt-1">
                          Try changing your search or select a different store
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <div className="mt-8 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/marketing?tab=promotions")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                disabled={isCreating || isUpdating}
              >
                {(isCreating || isUpdating) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditMode ? "Update Promotion" : "Create Promotion"}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}