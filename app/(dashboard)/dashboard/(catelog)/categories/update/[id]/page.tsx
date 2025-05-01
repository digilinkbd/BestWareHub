import { getCategoryById } from "@/actions/categories";
import CategoryForm from "@/components/Forms/CategoryForm";
import { CategoryWithDepartment } from "@/types/types";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const category = await getCategoryById(id);
  return (
    <div className="md:p-2">
      <CategoryForm initialData={category as CategoryWithDepartment} editingId={id} />
    </div>
  );
}
