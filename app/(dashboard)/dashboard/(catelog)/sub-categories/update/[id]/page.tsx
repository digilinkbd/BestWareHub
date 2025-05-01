import { getSubCategoryById } from "@/actions/subcategories";
import SubCategoryForm from "@/components/frontend/SubCategory";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const subCategory = await getSubCategoryById(id);
  return (
    <div className="p-8">
      <SubCategoryForm initialData={subCategory} editingId={id} />
    </div>
  );
}
