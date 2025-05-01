"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Tag, X, ShoppingBag, Store as StoreIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FormSelectInput from "@/components/FormInputs/FormSelectInput";
import { Option } from "react-tailwindcss-select/dist/components/type";
import Image from "next/image";
import { useFetchProductsByStore, useFetchStores } from "@/hooks/useCampaignAndPromotions";

type ProductSelectorProps = {
  selectedProducts: any[];
  setSelectedProducts: (products: any[]) => void;
};

export default function ProductSelector({ selectedProducts, setSelectedProducts }: ProductSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [storeOption, setStoreOption] = useState<Option | null>(null);
  const { stores, isLoading: storesLoading } = useFetchStores();
  const { products, isLoading: productsLoading } = useFetchProductsByStore(
    storeOption ? storeOption.value.toString() : undefined
  );
  
  const storeOptions = stores.map((store) => ({
    value: store.id,
    label: store.storeName,
  }));
  
  // Add "Default Store" option
  useEffect(() => {
    if (stores.length > 0 && !storeOption) {
      const defaultOption = {
        value: "",
        label: "Default Store Products",
      };
      storeOptions.unshift(defaultOption);
    }
  }, [stores]);

  const filteredProducts = products.filter((product) => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedProducts.some((sp) => sp.id === product.id)
  );

  const handleAddProduct = (product: any) => {
    setSelectedProducts([...selectedProducts, product]);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Product Selection Panel */}
      <Card className="h-full">
        <CardHeader className="bg-muted/30">
          <CardTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-yellow-500" />
            Available Products
          </CardTitle>
          <CardDescription>
            Select products to include
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Store Selector */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <StoreIcon className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Filter by Store</span>
            </div>
            <FormSelectInput
              options={storeOptions}
              label="Store"
              option={storeOption}
              setOption={setStoreOption}
              labelShown={false}
            />
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Products List */}
          <div className="border rounded-md h-[400px] overflow-y-auto p-1">
            {productsLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <ShoppingBag className="h-10 w-10 mb-2 text-gray-300" />
                <p>No products available</p>
                <p className="text-xs">Try changing the store or search term</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    className="flex items-center justify-between p-2 border-b last:border-0 hover:bg-gray-50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 rounded-md border">
                        <AvatarImage src={product.imageUrl || "/placeholder.jpg"} alt={product.title} />
                        <AvatarFallback className="rounded-md bg-gray-100 text-sm">
                          {product.title.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{product.title}</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs text-gray-500">
                            ${product.salePrice || product.productPrice}
                          </p>
                          {product.store?.storeName && (
                            <Badge variant="outline" className="text-xs py-0 h-5">
                              {product.store.storeName}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                      onClick={() => handleAddProduct(product)}
                    >
                      Add
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Products Panel */}
      <Card className="h-full">
        <CardHeader className="bg-yellow-50">
          <CardTitle className="flex items-center text-yellow-700">
            <Tag className="mr-2 h-5 w-5" />
            Selected Products
          </CardTitle>
          <CardDescription>
            {selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""} selected
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="border rounded-md h-[495px] overflow-y-auto p-1">
            {selectedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <ShoppingBag className="h-10 w-10 mb-2 text-gray-300" />
                <p>No products selected</p>
                <p className="text-xs">Select products from the left panel</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2">
                <AnimatePresence>
                  {selectedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      className="relative rounded-lg border bg-white shadow-sm overflow-hidden"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.3 }}
                      layout
                    >
                      <div className="aspect-square relative w-full overflow-hidden bg-gray-100">
                        <Image
                          src={product.imageUrl || "/placeholder.jpg"}
                          alt={product.title}
                          fill
                          className="object-cover object-center"
                        />
                        <motion.button
                          className="absolute top-1 right-1 p-1 rounded-full bg-white shadow-md hover:bg-red-50 transition-colors"
                          onClick={() => handleRemoveProduct(product.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </motion.button>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium line-clamp-1 text-sm">{product.title}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm font-semibold text-yellow-600">
                            ${product.salePrice || product.productPrice}
                          </p>
                          {product.store?.storeName && (
                            <Badge variant="outline" className="text-xs">
                              {product.store.storeName}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}