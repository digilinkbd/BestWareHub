import { getProductById } from "@/actions/products";
import ProductForm from "@/components/Forms/ProductForm";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const subCategory = await getProductById(id);
  return (
    <div className="p-8">
      <ProductForm initialData={subCategory} editingId={id} />
    </div>
  );
}
