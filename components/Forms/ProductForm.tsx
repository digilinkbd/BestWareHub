"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2, ArrowRight, ArrowLeft, Plus, X } from 'lucide-react'
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField
} from "@/components/ui/form"

// Custom Components
import ImageUploader from "../FormInputs/ImageUploader"
import FormSelectInput from "../FormInputs/FormSelectInput"
import ImageInput from "../FormInputs/ImageInput"

// Hooks and Utilities
import { generateSlug } from "@/lib/generateSlug"
import { useFetchCategories } from "@/hooks/useCategory"
import { useFetchSubCategories } from "@/hooks/useSubCategory"
import { useFetchDepartments } from "@/hooks/useDepartment"
import { useFetchBrands } from "@/hooks/useBrand"
// import { useCreateProduct, useUpdateProduct } from "@/hooks/useProduct"

// Types
import type { Option } from "react-tailwindcss-select/dist/components/type"
import type { ProductInput, ProductWithRelations } from "@/types/types"
import FormHeader from "./FormHeader"
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProduct"

// Validation Schema
const productSchema = z
  .object({
    // Basic Information
    title: z.string().min(3, { message: "Title must be at least 3 characters" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }).optional(),
    shortDesc: z.string().optional(),

    // Pricing and Stock
    productPrice: z.coerce.number().positive({ message: "Price must be positive" }),
    salePrice: z.coerce.number().positive({ message: "Sale price must be positive" }).optional(),
    productStock: z.coerce
      .number()
      .int({ message: "Stock must be a whole number" })
      .nonnegative({ message: "Stock cannot be negative" }),
    lowStockAlert: z.coerce.number().int().nonnegative().default(5),

    // Additional Details
    sku: z.string().optional(),
    barcode: z.string().optional(),
    unit: z.string().optional(),

    // Toggles
    isWholesale: z.boolean().default(false),
    wholesalePrice: z.coerce.number().positive().optional(),
    wholesaleQty: z.coerce.number().int().positive().optional(),

    // Categorization
    // departmentId: z.string().min(1, { message: "Department is required" }),
    categoryId:  z.string().optional(),
    subCategoryId: z.string().optional(),
    brandId: z.string().optional(),

    // Product Flags
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    isNewArrival: z.boolean().default(false),

    // Pricing Flags
    isDiscount: z.boolean().default(false),
    discount: z.coerce.number().optional(),
    tax: z.coerce.number().optional().default(0),

    // Metadata
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.array(z.string()).optional(),

    // Additional Attributes
    attributes: z.record(z.string(), z.string()).optional(),
    tags: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      // If wholesale is enabled, require wholesale price and quantity
      if (data.isWholesale) {
        return !!data.wholesalePrice && !!data.wholesaleQty
      }
      return true
    },
    {
      message: "Wholesale price and quantity are required when wholesale is enabled",
      path: ["wholesalePrice"],
    },
  )
  .refine(
    (data) => {
      // If discount is enabled, require discount amount
      if (data.isDiscount) {
        return !!data.discount
      }
      return true
    },
    {
      message: "Discount amount is required when discount is enabled",
      path: ["discount"],
    },
  )

type FormValues = z.infer<typeof productSchema>

type ProductFormProps = {
  editingId?: string
  initialData?: ProductWithRelations | null
}

export default function ProductForm({ editingId, initialData }: ProductFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.productImages || [])
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || "")
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>(
    initialData?.attributes
      ? Object.entries(initialData.attributes).map(([key, value]) => ({ key, value: value as string }))
      : [],
  )
  const [newAttributeKey, setNewAttributeKey] = useState("")
  const [newAttributeValue, setNewAttributeValue] = useState("")

  // State for Select Inputs
  const [departmentOption, setDepartmentOption] = useState<Option | null>(
    initialData?.departmentId
      ? { value: initialData.departmentId, label: initialData?.department?.title || "Select Department" }
      : null,
  )
  const [categoryOption, setCategoryOption] = useState<Option | null>(
    initialData?.categoryId
      ? { value: initialData.categoryId, label: initialData?.category?.title || "Select Category" }
      : null,
  )
  const [subCategoryOption, setSubCategoryOption] = useState<Option | null>(
    initialData?.subCategoryId
      ? { value: initialData.subCategoryId, label: initialData?.subCategory?.title || "Select Subcategory" }
      : null,
  )
  const [brandOption, setBrandOption] = useState<Option | null>(
    initialData?.brandId ? { value: initialData.brandId, label: initialData?.brand?.title || "Select Brand" } : null,
  )

  useEffect(() => {
    // Reset category when department changes
    setCategoryOption(null);
    // Also reset subcategory since it depends on category
    setSubCategoryOption(null);
  }, [departmentOption]);

  useEffect(() => {
    setSubCategoryOption(null);
  }, [categoryOption]);


  const { departments } = useFetchDepartments()
  const { categories } = useFetchCategories()
  const { subcategories } = useFetchSubCategories()
  const { brands } = useFetchBrands()

  const { createProduct, isCreating } = useCreateProduct()
  const { updateProduct, isUpdating } = useUpdateProduct()

  const isLoading = isCreating || isUpdating

  const departmentOptions: Option[] = departments.map((dept) => ({
    value: dept.id,
    label: dept.title,
  }))

  const categoryOptions: Option[] = categories
    .filter(cat => departmentOption ? cat.departmentId === departmentOption.value : true)
    .map((cat) => ({
      value: cat.id,
      label: cat.title,
    }));

  // 2. Update subcategory options to filter based on selected category
  const subCategoryOptions: Option[] = subcategories
    .filter(subCat => categoryOption ? subCat.categoryId === categoryOption.value : true)
    .map((subCat) => ({
      value: subCat.id,
      label: subCat.title,
    }));

  const brandOptions: Option[] = brands.map((brand) => ({
    value: brand.id,
    label: brand.title,
  }))

  // Add attribute function
  const addAttribute = () => {
    if (newAttributeKey.trim() === "") {
      toast.error("Attribute name cannot be empty")
      return
    }

    // Check if attribute key already exists
    if (attributes.some((attr) => attr.key === newAttributeKey)) {
      toast.error("Attribute name already exists")
      return
    }

    setAttributes([...attributes, { key: newAttributeKey, value: newAttributeValue }])
    setNewAttributeKey("")
    setNewAttributeValue("")
  }

  // Remove attribute function
  const removeAttribute = (key: string) => {
    setAttributes(attributes.filter((attr) => attr.key !== key))
  }
  const progressSteps = [
    { name: "Basic Info", step: 1 },
    { name: "Pricing", step: 2 },
    { name: "Details", step: 3 },
    { name: "Images", step: 4 },
    { name: "Attributes", step: 5 },
    { name: "Category", step: 6 }
  ]
  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      shortDesc: initialData?.shortDesc || "",
      productPrice: initialData?.productPrice || undefined,
      
      salePrice: initialData?.salePrice || undefined,
      productStock: initialData?.productStock || undefined,
      lowStockAlert: initialData?.lowStockAlert || 5,
      sku: initialData?.sku || "",
      barcode: initialData?.barcode || "",
      unit: initialData?.unit || "",
      isWholesale: initialData?.isWholesale || false,
      wholesalePrice: initialData?.wholesalePrice || undefined,
      wholesaleQty: initialData?.wholesaleQty || undefined,
      isActive: initialData?.isActive ?? true,
      isFeatured: initialData?.isFeatured || false,
      isNewArrival: initialData?.isNewArrival || false,
      isDiscount: initialData?.isDiscount || false,
      discount: initialData?.discount || undefined,
      tax: initialData?.tax || 0,
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      metaKeywords: initialData?.metaKeywords || [],
      attributes: initialData?.attributes || {},
      tags: initialData?.tags || [],
    },
  })

  // Step validation functions
  const validateStep = async () => {
    switch (currentStep) {
      case 1:
        return form.trigger(["title", "description", "shortDesc"])
      case 2:
        return form.trigger(["productPrice", "salePrice", "productStock", "lowStockAlert"])
        case 3:
          if (form.getValues("isDiscount") && !form.getValues("discount")) {
            toast.error("Please enter a discount amount");
            return false;
          }
          return form.trigger(["sku", "barcode", "unit", "isWholesale", "wholesalePrice", "wholesaleQty", "isNewArrival", "isDiscount", "discount"]);
        
      case 4:
        // Validate product images
        if (!imageUrl) {
          toast.error("Please upload a product image")
          return false
        }
        if (imageUrls.length === 0) {
          toast.error("Please upload at least one product image")
          return false
        }
        return true
      case 5:
        // Validate attributes if any are added
        return true
      case 6:
        // Set the IDs in the form data
        form.setValue("categoryId", categoryOption?.value || "")
        if (subCategoryOption) {
          form.setValue("subCategoryId", subCategoryOption.value)
        }
        if (brandOption) {
          form.setValue("brandId", brandOption.value)
        }

        // Validate department is selected
        if (!departmentOption) {
          toast.error("Please select a department")
          return false
        }
        return true;
      default:
        return true
    }
  }

  // Navigation between steps
  const nextStep = async () => {
    const isStepValid = await validateStep()
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 6))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // Form submission
  const onSubmit = async (data: FormValues) => {
    try {
      // Comprehensive validation before submission
      const isFormValid = await form.trigger()
      if (!isFormValid) {
        toast.error("Please complete all required fields")
        return
      }

      // Image validation
      if (!imageUrl) {
        toast.error("Please upload a product image")
        return
      }

      if (imageUrls.length === 0) {
        toast.error("Please upload at least one product image")
        return
      }
      if (data.isDiscount && !data.discount) {
        toast.error("Discount amount is required when discount is enabled");
        return;
      }
      // Department and Category validation
      if (!departmentOption) {
        return
      }
      if (!categoryOption) {
        toast.error("Please select a Category")
        return
      }
      
      // Wholesale validation
      if (data.isWholesale && (!data.wholesalePrice || !data.wholesaleQty)) {
        toast.error("Wholesale price and quantity are required when wholesale is enabled")
        return
      }

      // Prepare submission data
      const productData: ProductInput = {
        ...data,
        slug: generateSlug(data.title),
        productImages: imageUrls,
        imageUrl: imageUrl,
        departmentId: departmentOption.value,
        categoryId: categoryOption?.value || "",
        subCategoryId: subCategoryOption?.value,
        brandId: brandOption?.value,
        attributes:
          attributes.length > 0 ? attributes.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {}) : null,
        metaKeywords: data.metaKeywords || [],
        tags: data.tags || [],
        status: "PENDING",
        isWholesale: data.isWholesale ?? false,
        isFeatured: data.isFeatured ?? false,
      }
      
      console.log(productData , "product data")
      if (editingId) {
        // Update existing product
        await updateProduct({
            id: editingId,
            product: {
              ...data,
              slug: generateSlug(data.title),
              productImages: imageUrls,
              imageUrl: imageUrl,
              departmentId: departmentOption?.value || "",
              categoryId: categoryOption?.value,
              subCategoryId: subCategoryOption?.value,
              brandId: brandOption?.value,
              attributes: attributes.length > 0 
                ? attributes.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {}) 
                : null,
              metaKeywords: data.metaKeywords || [],
              tags: data.tags || [],
              status: "PENDING", 
            }
          })
        router.push("/dashboard/products")
      } else {
        // Create new product
        await createProduct(productData)
        router.push("/dashboard/products")
      }
    } catch (error) {
      console.error("Error submitting product:", error)
      toast.error("Failed to save product. Please try again.")
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="md:space-y-8 space-y-4">
        <FormHeader
          href="/dashboard/products"
          parent="Products"
          title={editingId ? "Edit Product" : "New Product"}
          editingId={editingId}
          loading={isLoading}
        />

        {/* Progress Bar - Top */}
        <Card className="shadow-sm">
          <CardContent className="py-4">
            <div className="space-y-2">
              <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#eab308] h-full transition-all duration-300 ease-in-out"
                  style={{ width: `${((currentStep - 1) / (progressSteps.length - 1)) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                {progressSteps.map((step) => (
                  <span 
                    key={step.step} 
                    className={currentStep === step.step ? "font-medium text-[#eab308]" : ""}
                  >
                    {step.name}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <motion.div className="grid grid-cols-12 gap-6" initial="hidden" animate="visible">
          {/* Main content */}
          <motion.div className="lg:col-span-8 col-span-full space-y-6" variants={itemVariants}>
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden shadow-sm">
                    <CardHeader className="bg-muted/50">
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>Enter the core details of your product</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid gap-6">
                        {/* Title Input */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Product Title</label>
                            <Input {...form.register("title")} placeholder="Enter product title" />
                            {form.formState.errors.title && (
                              <p className="text-destructive text-sm mt-1">{form.formState.errors.title.message}</p>
                            )}
                          </div>
                          {/* Short Description */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">Short Description</label>
                            <Input {...form.register("shortDesc")} placeholder="Brief product description" />
                          </div>
                        </div>
                        {/* Full Description */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Full Description</label>
                          <Textarea
                            {...form.register("description")}
                            placeholder="Detailed product description"
                            className="min-h-[120px] resize-none"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Pricing and Stock */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden shadow-sm">
                    <CardHeader className="bg-muted/50">
                      <CardTitle>Pricing and Inventory</CardTitle>
                      <CardDescription>Set product pricing and stock information</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Product Price */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">Product Price</label>
                            <Input type="number" {...form.register("productPrice")} placeholder="Enter product price" />
                            {form.formState.errors.productPrice && (
                              <p className="text-destructive text-sm mt-1">
                                {form.formState.errors.productPrice.message}
                              </p>
                            )}
                          </div>
                          {/* Sale Price */}
                          {/* <div>
                            <label className="text-sm font-medium mb-2 block">Sale Price (Optional)</label>
                            <Input type="number" {...form.register("salePrice")} placeholder="Discounted price" />
                          </div> */}
                          {/* Stock */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">Product Stock</label>
                            <Input type="number" {...form.register("productStock")} placeholder="Available quantity" />
                          </div>
                          {/* Low Stock Alert */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">Low Stock Alert</label>
                            <Input
                              type="number"
                              {...form.register("lowStockAlert")}
                              placeholder="Minimum stock level"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Categorization */}
              {currentStep === 3 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden shadow-sm">
                    <CardHeader className="bg-muted/50">
                      <CardTitle>Additional Product Details</CardTitle>
                      <CardDescription>Configure additional product settings</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* SKU */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">SKU (Optional)</label>
                            <Input {...form.register("sku")} placeholder="Stock Keeping Unit" />
                          </div>

                          {/* Barcode */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">Barcode (Optional)</label>
                            <Input {...form.register("barcode")} placeholder="Product Barcode" />
                          </div>
                        </div>

                        {/* Product Flags */}
                        <div className="space-y-4">
                          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <label className="text-base">Wholesale Product</label>
                              <p className="text-sm text-muted-foreground">Enable wholesale pricing for this product</p>
                            </div>
                            <Switch
                              checked={form.watch("isWholesale")}
                              onCheckedChange={(value) => form.setValue("isWholesale", value)}
                            />
                          </div>

                          <div className="flex flex-row items-center justify-between rounded-lg border p-4 opacity-50">
                            <div className="space-y-0.5">
                              <label className="text-base">Featured Product</label>
                              <p className="text-sm text-muted-foreground">Show this product in featured sections</p>
                            </div>
                            <Switch checked={form.watch("isFeatured")}
                              onCheckedChange={(value) => form.setValue("isFeatured", value)} disabled/>
                          </div>

                          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <label className="text-base">New Arrival</label>
                              <p className="text-sm text-muted-foreground">Mark this product as newly arrived</p>
                            </div>
                            <Switch
                              checked={form.watch("isNewArrival")}
                              onCheckedChange={(value) => form.setValue("isNewArrival", value)}
                            />
                          </div>
                        </div>

                        {/* Wholesale Pricing (Conditional) */}
                        {form.watch("isWholesale") && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20">
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Wholesale Price <span className="text-destructive">*</span>
                              </label>
                              <Input type="number" {...form.register("wholesalePrice")} placeholder="Wholesale price" />
                              {form.formState.errors.wholesalePrice && (
                                <p className="text-destructive text-sm mt-1">
                                  {form.formState.errors.wholesalePrice.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Wholesale Quantity <span className="text-destructive">*</span>
                              </label>
                              <Input
                                type="number"
                                {...form.register("wholesaleQty")}
                                placeholder="Minimum quantity for wholesale"
                              />
                              {form.formState.errors.wholesaleQty && (
                                <p className="text-destructive text-sm mt-1">
                                  {form.formState.errors.wholesaleQty.message}
                                </p>
                              )}
                            </div>
                          </div>
                        )}



<div className="flex flex-row items-center justify-between rounded-lg border p-4">
  <div className="space-y-0.5">
    <label className="text-base">Discount</label>
    <p className="text-sm text-muted-foreground">Apply a discount to this product</p>
  </div>
  <Switch
    checked={form.watch("isDiscount")}
    onCheckedChange={(value) => form.setValue("isDiscount", value)}
  />
</div>

{/* Discount Amount (Conditional) */}
{form.watch("isDiscount") && (
  <div className="grid grid-cols-1 gap-4 p-4 border rounded-lg bg-muted/20">
    <div>
      <label className="text-sm font-medium mb-2 block">
        Discount Amount <span className="text-destructive">*</span>
      </label>
      <Input 
        type="number" 
        {...form.register("discount")} 
        placeholder="Enter discount amount" 
      />
      {form.formState.errors.discount && (
        <p className="text-destructive text-sm mt-1">
          {form.formState.errors.discount.message}
        </p>
      )}
    </div>
  </div>
)}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 4: Product Images */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden shadow-sm">
                    <CardHeader className="bg-muted/50">
                      <CardTitle>Product Images</CardTitle>
                      <CardDescription>Upload images for your product</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid gap-8">
                        {/* Brand Image Upload - Required */}
                        <div className="border rounded-lg p-5 bg-muted/10">
                          <h3 className="text-base font-medium mb-3">
                            Product Image <span className="text-destructive">*</span>
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Upload a high-quality Product logo or image. This is required and will be displayed
                            prominently.
                          </p>
                          <div className="max-w-md mx-auto">
                            <ImageInput
                              title="Product Image"
                              imageUrl={imageUrl}
                              setImageUrl={setImageUrl}
                              endpoint="singleProductImage"
                            />
                          </div>
                          {!imageUrl && (
                            <p className="text-destructive text-sm mt-3 text-center">Product image is required</p>
                          )}
                        </div>

                        {/* Multiple Images Uploader - Required */}
                        <div className="border rounded-lg p-5 bg-muted/10">
                          <h3 className="text-base font-medium mb-3">
                            Product Gallery <span className="text-destructive">*</span>
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Upload up to 5 product images. The first image will be used as the main product image.
                          </p>
                          <ImageUploader
                            label="Product Images"
                            imageUrls={imageUrls}
                            setImageUrls={setImageUrls}
                            endpoint="productImage"
                            description="Upload high-quality product images"
                            maxFiles={5}
                          />
                          {imageUrls.length === 0 && (
                            <p className="text-destructive text-sm mt-3">Please upload at least one product image</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 5: Product Attributes (NEW) */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden shadow-sm">
                    <CardHeader className="bg-muted/50">
                      <CardTitle>Product Attributes</CardTitle>
                      <CardDescription>Add custom attributes to your product (optional)</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid gap-6">
                        {/* Add New Attribute */}
                        <div className="border rounded-lg p-5 bg-muted/10">
                          <h3 className="text-base font-medium mb-3">Add New Attribute</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Add custom attributes like size, color, material, etc. to better describe your product.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                              <label className="text-sm font-medium mb-2 block">Attribute Name</label>
                              <Input
                                value={newAttributeKey}
                                onChange={(e) => setNewAttributeKey(e.target.value)}
                                placeholder="e.g. Size, Color, Material"
                              />
                            </div>
                            <div className="md:col-span-1">
                              <label className="text-sm font-medium mb-2 block">Attribute Value</label>
                              <Input
                                value={newAttributeValue}
                                onChange={(e) => setNewAttributeValue(e.target.value)}
                                placeholder="e.g. Large, Red, Cotton"
                              />
                            </div>
                            <div className="md:col-span-1 flex items-end">
                              <Button type="button" onClick={addAttribute} className="w-full">
                                <Plus className="h-4 w-4 mr-2" /> Add Attribute
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Attributes List */}
                        <div className="border rounded-lg p-5">
                          <h3 className="text-base font-medium mb-3">Product Attributes</h3>
                          {attributes.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <p>No attributes added yet</p>
                              <p className="text-sm mt-1">Add attributes to better describe your product</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {attributes.map((attr, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 border rounded-md bg-muted/10"
                                >
                                  <div>
                                    <span className="font-medium">{attr.key}: </span>
                                    <span>{attr.value}</span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeAttribute(attr.key)}
                                    className="text-destructive hover:text-destructive/80"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 6: Additional Details and Flags (previously Step 5) */}
              {currentStep === 6 && (
                
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-sm">
                    <CardHeader className="bg-muted/50">
                      <CardTitle>Product Categorization</CardTitle>
                      <CardDescription>Organize your product in the catalog</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Department */}
                          <div>
                            <FormSelectInput
                              options={departmentOptions}
                              label="Select Department"
                              option={departmentOption}
                              setOption={setDepartmentOption}
                              href="/dashboard/departments/new"
                              toolTipText="Add New Department"
                            />
                            {!departmentOption && (
                              <p className="text-destructive text-sm mt-1">Department is required</p>
                            )}
                          </div>

                          {/* Category */}
                          <div>
                            <FormSelectInput
                              options={categoryOptions}
                              label="Select Category"
                              option={categoryOption}
                              setOption={setCategoryOption}
                              href="/dashboard/categories/new"
                              toolTipText="Add New Category"
                            />
                            {/* {!categoryOption && <p className="text-destructive text-sm mt-1">Category is required</p>} */}
                          </div>

                          {/* Subcategory */}
                          <div>
                            <FormSelectInput
                              options={subCategoryOptions}
                              label="Select Subcategory"
                              option={subCategoryOption}
                              setOption={setSubCategoryOption}
                              href="/dashboard/sub-categories/new"
                              toolTipText="Add New Subcategory"
                            />
                          </div>

                          {/* Brand */}
                          <div>
                            <FormSelectInput
                              options={brandOptions}
                              label="Select Brand"
                              option={brandOption}
                              setOption={setBrandOption}
                              href="/dashboard/brands/new"
                              toolTipText="Add New Brand"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons - Bottom */}
            <Card className="shadow-sm">
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  {currentStep > 1 ? (
                    <Button type="button" variant="outline" onClick={prevStep} disabled={isLoading}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                  ) : (
                    <div></div> 
                  )}

                 {currentStep < progressSteps.length ? (
                <Button className="bg-[#eab308]" type="button" onClick={nextStep}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingId ? "Updating..." : "Publishing..."}
                    </>
                  ) : editingId ? (
                    "Update Product"
                  ) : (
                    "Publish Product"
                  )}
                </Button>
              )} 
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar - Only Product Status */}
          <motion.div className="lg:col-span-4 col-span-full" variants={itemVariants}>
            {/* Product Status Card */}
            <Card className="shadow-sm">
              <CardHeader className="bg-muted/50">
                <CardTitle>Product Status</CardTitle>
                <CardDescription>Control product visibility</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base">Active Status</label>
                    <p className="text-sm text-muted-foreground">
                      Product will be {form.watch("isActive") ? "visible" : "hidden"} to users
                    </p>
                  </div>
                  <Switch
                    checked={form.watch("isActive")}
                    onCheckedChange={(value) => form.setValue("isActive", value)}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </form>
    </Form>
  )
}
