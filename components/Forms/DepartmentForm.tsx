"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

import { generateSlug } from "@/lib/generateSlug";
import ImageUploader from "../FormInputs/ImageUploader";
import FormHeader from "./FormHeader";
import { Department } from "@prisma/client";
import { useCreateDepartment, useUpdateDepartment } from "@/hooks/useDepartment";
import toast from "react-hot-toast";

// Form schema validation
const departmentSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof departmentSchema>;

type DepartmentFormProps = {
  editingId?: string;
  initialData?: Department | null;
};

export default function DepartmentForm({
  editingId,
  initialData,
}: DepartmentFormProps) {
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData?.images || []
  );
  
  const { createDepartment, isCreating } = useCreateDepartment();
  const { updateDepartment, isUpdating } = useUpdateDepartment();
  
  const isLoading = isCreating || isUpdating;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
        if (imageUrls.length === 0) {
            toast.error("Please upload at least one image");
            return;
          }
      // Generate slug from title
      const slug = generateSlug(data.title);
      
      // Prepare data
      const departmentData = {
        ...data,
        slug,
        images: imageUrls,
        image: imageUrls.length > 0 ? imageUrls[0] : "/placeholder.jpg",
      };
      console.log(departmentData , "this is the department data")
      if (editingId) {
        // Update existing department
        await updateDepartment({
          id: editingId,
          department: departmentData,
        });
        
        // Navigate back to departments list
        router.back()
      } else {
        // Create new department
        await createDepartment(departmentData);
        
        // Reset form and clear images
        form.reset();
        setImageUrls([]);
        router.push("/dashboard/departments");

      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was a problem saving the department");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="md:space-y-8 space-y-4">
        <FormHeader
          href="/dashboard/departments"
          parent="Departments"
          title={editingId ? "Edit Department" : "New Department"}
          editingId={editingId}
          loading={isLoading}
        />

        <motion.div 
          className="grid grid-cols-12 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main content */}
          <motion.div 
            className="lg:col-span-8 col-span-full space-y-6"
            variants={itemVariants}
          >
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle>Department Information</CardTitle>
                <CardDescription>
                  Create a new department or update an existing one
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  {/* Title field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter department title" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will be used to generate a URL-friendly slug
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter department description"
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
                <CardTitle>Department Status</CardTitle>
                <CardDescription>
                  Control whether this department is active
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Active Status
                        </FormLabel>
                        <FormDescription>
                          Department will be {field.value ? "visible" : "hidden"} to users
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="lg:col-span-4 col-span-full"
            variants={itemVariants}
          >
            <Card>
              <CardContent className="pt-6">
                <ImageUploader
                  label="Department Images"
                  imageUrls={imageUrls}
                  setImageUrls={setImageUrls}
                  endpoint="departmentImage"
                  description="Upload department images (first image will be the main image)"
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
            onClick={() => router.push("/dashboard/departments")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {editingId ? "Update" : "Create"} Department
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}