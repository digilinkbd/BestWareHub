"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

import { generateSlug } from "@/lib/generateSlug"
import ImageInput from "../FormInputs/ImageInput"
import FormHeader from "../Forms/FormHeader"
import FormSelectInput from "../FormInputs/FormSelectInput"
import { useFetchSubCategories } from "@/hooks/useSubCategory"
import { useCreateBrand, useUpdateBrand } from "@/hooks/useBrand"
import type { Option } from "react-tailwindcss-select/dist/components/type"
import toast from "react-hot-toast"
import type { BrandWithRelations } from "@/types/types"

// Form schema validation
const brandSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
  logo: z.string().optional(),
})

type FormValues = z.infer<typeof brandSchema>

type BrandFormComponentProps = {
  editingId?: string
  initialData?: BrandWithRelations | null | undefined
}

export default function BrandForm({ editingId, initialData }: BrandFormComponentProps) {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || "/placeholder.jpg")
  const [subCategoryOption, setSubCategoryOption] = useState<Option | null>(
    initialData?.subCategoryId
      ? {
          value: initialData.subCategoryId,
          label: initialData?.subCategory?.title || "Unknown Subcategory",
        }
      : null
  )

  const { createBrand, isCreating } = useCreateBrand()
  const { updateBrand, isUpdating } = useUpdateBrand()
  const { subcategories, isLoading: isLoadingSubCategories } = useFetchSubCategories()

  const isLoading = isCreating || isUpdating

  // Convert subcategories to options for select input
  const subCategoryOptions: Option[] = subcategories.map((subCat) => ({
    value: subCat.id,
    label: subCat.title,
  }))

  const form = useForm<FormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
      featured: initialData?.featured ?? false,
      logo: initialData?.logo || "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      if (!imageUrl) {
        toast.error("Please upload an image")
        return
      }

      if (!subCategoryOption) {
        toast.error("Please select a subcategory")
        return
      }

      // Generate slug from title
      const slug = generateSlug(data.title)

      // Prepare data
      const brandData = {
        ...data,
        slug,
        imageUrl,
        subCategoryId: subCategoryOption.value,
      }

      if (editingId) {
        // Update existing brand
        await updateBrand({
          id: editingId,
          brand: brandData,
        })

        // Navigate back to brands list
        router.back()
      } else {
        // Create new brand
        await createBrand(brandData)

        // Reset form and clear image
        form.reset()
        setImageUrl("/placeholder.jpg")
        setSubCategoryOption(null)
        router.push("/dashboard/brands")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("There was a problem saving the brand")
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="md:space-y-8 space-y-4">
        <FormHeader
          href="/dashboard/brands"
          parent="Brands"
          title={editingId ? "Edit Brand" : "New Brand"}
          editingId={editingId}
          loading={isLoading}
        />

        <motion.div className="grid grid-cols-12 gap-6" variants={containerVariants} initial="hidden" animate="visible">
          {/* Main content */}
          <motion.div className="lg:col-span-8 col-span-full space-y-6" variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle>Brand Information</CardTitle>
                <CardDescription>Create a new brand or update an existing one</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  {/* Title field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter brand title" {...field} />
                        </FormControl>
                        <FormDescription>This will be used to generate a URL-friendly slug</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Subcategory Select */}
                  <FormItem>
                    <FormSelectInput
                      options={subCategoryOptions}
                      label="Subcategory"
                      option={subCategoryOption}
                      setOption={setSubCategoryOption}
                      href="/dashboard/sub-categories/new"
                      toolTipText="Add New Subcategory"
                    />
                    {!subCategoryOption && <p className="text-sm text-destructive mt-1">Please select a subcategory</p>}
                  </FormItem>

                  {/* Description field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter brand description"
                            className="resize-none min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status section */}
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle>Brand Status</CardTitle>
                <CardDescription>Control brand visibility and features</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Brand will be {field.value ? "visible" : "hidden"} to users
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Status</FormLabel>
                        <FormDescription>
                          Brand will be {field.value ? "highlighted" : "regular"}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div className="lg:col-span-4 col-span-full" variants={itemVariants}>
            <Card>
              <CardContent className="pt-6">
                <ImageInput
                  title="Brand Image"
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  endpoint="brandImage"
                />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Form actions */}
        <motion.div
          className="flex md:hidden justify-end gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/brands")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingId ? "Update" : "Create"} Brand
          </Button>
        </motion.div>
      </form>
    </Form>
  )
}