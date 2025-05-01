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
import FormHeader from "./FormHeader"
import FormSelectInput from "../FormInputs/FormSelectInput"
import type { CategoryWithDepartment } from "@/types/types"
import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategory"
import { useFetchDepartments } from "@/hooks/useDepartment"
import type { DepartmentOption } from "@/types/types"
import toast from "react-hot-toast"
import type { Option } from "react-tailwindcss-select/dist/components/type"
import { Category } from "@prisma/client"

// Form schema validation
const categorySchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
  position: z.coerce.number().int().optional(),
  icon: z.string().optional(),
})

type FormValues = z.infer<typeof categorySchema>

type CategoryFormProps = {
  editingId?: string
  initialData?: CategoryWithDepartment | null
}

export default function CategoryForm({ editingId, initialData }: CategoryFormProps) {
  const router = useRouter()
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || [])
  const [departmentOption, setDepartmentOption] = useState<Option | null>(
    initialData?.departmentId
      ? {
          value: initialData.departmentId,
          label: initialData?.department?.title || "Unknown Department",
        }
      : null
  );
  
  

  const { createCategory, isCreating } = useCreateCategory()
  const { updateCategory, isUpdating } = useUpdateCategory()
  const { departments, isLoading: isLoadingDepartments } = useFetchDepartments()

  const isLoading = isCreating || isUpdating

  // Convert departments to options for select input
  const departmentOptions: DepartmentOption[] = departments.map((dept) => ({
    value: dept.id,
    label: dept.title,
  }))

  const form = useForm<FormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
      featured: initialData?.featured ?? false,
   
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      if (imageUrls.length === 0) {
        toast.error("Please upload at least one image")
        return
      }

      if (!departmentOption) {
        toast.error("Please select a department")
        return
      }

      // Generate slug from title
      const slug = generateSlug(data.title)

      // Prepare data
      const categoryData = {
        ...data,
        slug,
        images: imageUrls,
        image: imageUrls.length > 0 ? imageUrls[0] : "/placeholder.jpg",
        departmentId: departmentOption.value as string,
      }

      if (editingId) {
        // Update existing category
        await updateCategory({
          id: editingId,
          category: categoryData,
        })

        // Navigate back to categories list
        router.back()
      } else {
        // Create new category
        await createCategory(categoryData)

        // Reset form and clear images
        form.reset()
        setImageUrls([])
        setDepartmentOption(null)
        router.push("/dashboard/categories")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("There was a problem saving the category")
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
          href="/dashboard/categories"
          parent="Categories"
          title={editingId ? "Edit Category" : "New Category"}
          editingId={editingId}
          loading={isLoading}
        />

        <motion.div className="grid grid-cols-12 gap-6" variants={containerVariants} initial="hidden" animate="visible">
          {/* Main content */}
          <motion.div className="lg:col-span-8 col-span-full space-y-6" variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle>Category Information</CardTitle>
                <CardDescription>Create a new category or update an existing one</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  {/* Title field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category title" {...field} />
                        </FormControl>
                        <FormDescription>This will be used to generate a URL-friendly slug</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Department Select */}
                  <FormItem>
                    <FormSelectInput
                      options={departmentOptions}
                      label="Department"
                      option={departmentOption}
                      setOption={setDepartmentOption}
                      href="/dashboard/departments/new"
                      toolTipText="Add New Department"
                    />
                    {!departmentOption && <p className="text-sm text-destructive mt-1">Please select a department</p>}
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
                            placeholder="Enter category description"
                            className="resize-none min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Icon field */}
                  {/* <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter icon class or URL" {...field} />
                        </FormControl>
                        <FormDescription>You can use a CSS class name or an icon URL</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  {/* Position field */}
                  {/* <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Position</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter display position" {...field} />
                        </FormControl>
                        <FormDescription>Lower numbers will be displayed first</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>
              </CardContent>
            </Card>

            {/* Status section */}
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle>Category Status</CardTitle>
                <CardDescription>Control category visibility and features</CardDescription>
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
                          Category will be {field.value ? "visible" : "hidden"} to users
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
                        <FormLabel className="text-base">Featured Category</FormLabel>
                        <FormDescription>Featured categories may be highlighted in special sections</FormDescription>
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
                  label="Category Images"
                  imageUrls={imageUrls}
                  setImageUrls={setImageUrls}
                  endpoint="categoryImage"
                  description="Upload category images (first image will be the main image)"
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
            onClick={() => router.push("/dashboard/categories")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingId ? "Update" : "Create"} Category
          </Button>
        </motion.div>
      </form>
    </Form>
  )
}

