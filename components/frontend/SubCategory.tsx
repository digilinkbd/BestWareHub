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
import ImageUploader from "../FormInputs/ImageUploader"
import FormHeader from "../Forms/FormHeader"
import FormSelectInput from "../FormInputs/FormSelectInput"
import { useFetchCategories } from "@/hooks/useCategory"
import { useCreateSubCategory, useUpdateSubCategory } from "@/hooks/useSubCategory"
import type { Option } from "react-tailwindcss-select/dist/components/type"
import toast from "react-hot-toast"
import type { SubCategoryWithCategory } from "@/types/types"

// Form schema validation
const subCategorySchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  position: z.coerce.number().int().optional(),
  icon: z.string().optional(),
})

type FormValues = z.infer<typeof subCategorySchema>

type SubCategoryFormProps = {
  editingId?: string
  initialData?: SubCategoryWithCategory | null | undefined
}

export default function SubCategoryForm({ editingId, initialData }: SubCategoryFormProps) {
  const router = useRouter()
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || [])
  const [categoryOption, setCategoryOption] = useState<Option | null>(
    initialData?.categoryId
      ? {
          value: initialData.categoryId,
          label: initialData?.category?.title || "Unknown Category",
        }
      : null
  )

  const { createSubCategory, isCreating } = useCreateSubCategory()
  const { updateSubCategory, isUpdating } = useUpdateSubCategory()
  const { categories, isLoading: isLoadingCategories } = useFetchCategories()

  const isLoading = isCreating || isUpdating

  // Convert categories to options for select input
  const categoryOptions: Option[] = categories.map((cat) => ({
    value: cat.id,
    label: cat.title,
  }))

  const form = useForm<FormValues>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
      position: initialData?.position ?? 0,
      icon: initialData?.icon || "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      if (imageUrls.length === 0) {
        toast.error("Please upload at least one image")
        return
      }

      if (!categoryOption) {
        toast.error("Please select a category")
        return
      }

      // Generate slug from title
      const slug = generateSlug(data.title)

      // Prepare data
      const subCategoryData = {
        ...data,
        slug,
        images: imageUrls,
        image: imageUrls.length > 0 ? imageUrls[0] : "/placeholder.jpg",
        categoryId: categoryOption.value,
      }
      // console.log(subCategoryData , "this is the data")
      if (editingId) {
        // Update existing subcategory
        await updateSubCategory({
          id: editingId,
          subcategory: subCategoryData,
        })

        // Navigate back to subcategories list
        router.back()
      } else {
        // Create new subcategory
        await createSubCategory(subCategoryData)

        // Reset form and clear images
        form.reset()
        setImageUrls([])
        setCategoryOption(null)
        router.push("/dashboard/sub-categories")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("There was a problem saving the subcategory")
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
          href="/dashboard/sub-categories"
          parent="Subcategories"
          title={editingId ? "Edit Subcategory" : "New Subcategory"}
          editingId={editingId}
          loading={isLoading}
        />

        <motion.div className="grid grid-cols-12 gap-6" variants={containerVariants} initial="hidden" animate="visible">
          {/* Main content */}
          <motion.div className="lg:col-span-8 col-span-full space-y-6" variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle>Subcategory Information</CardTitle>
                <CardDescription>Create a new subcategory or update an existing one</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  {/* Title field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter subcategory title" {...field} />
                        </FormControl>
                        <FormDescription>This will be used to generate a URL-friendly slug</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category Select */}
                  <FormItem>
                    <FormSelectInput
                      options={categoryOptions}
                      label="Category"
                      option={categoryOption}
                      setOption={setCategoryOption}
                      href="/dashboard/categories/new"
                      toolTipText="Add New Category"
                    />
                    {!categoryOption && <p className="text-sm text-destructive mt-1">Please select a category</p>}
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
                            placeholder="Enter subcategory description"
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
                <CardTitle>Subcategory Status</CardTitle>
                <CardDescription>Control subcategory visibility and features</CardDescription>
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
                          Subcategory will be {field.value ? "visible" : "hidden"} to users
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
                <ImageUploader
                  label="Subcategory Images"
                  imageUrls={imageUrls}
                  setImageUrls={setImageUrls}
                  endpoint="subcategoryImage"
                  description="Upload subcategory images (first image will be the main image)"
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
            onClick={() => router.push("/dashboard/sub-categories")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingId ? "Update" : "Create"} Subcategory
          </Button>
        </motion.div>
      </form>
    </Form>
  )
}