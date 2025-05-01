"use client";
import React from "react";
import { columns } from "./columns";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { PageSkeleton } from "@/components/Forms/TableSkeleton";
import { useFetchProducts } from "@/hooks/useProduct";
import { ProductWithRelations } from "@/types/types";

export default function SubCategoriesPage() {
  const { products, isLoading, error } = useFetchProducts();

  if (isLoading) {
    return <PageSkeleton rows={3} showImage={true} showStatus={true} showDate={true} showActions={true} />
  }
  if (error) return <p>Error loading products: {error.message}</p>;

  if (isLoading) {
     return <PageSkeleton rows={3} showImage={true} showStatus={true} showDate={true} showActions={true} />
   }
  if (error) return <p>Error loading products</p>;

  return (
    <div className="p-2">
      <TableHeader
        title="Products"
        linkTitle="Add Product"
        href="/dashboard/products/new"
        data={products}
        model="products"
      />
      <div className="py-8">
      <DataTable data={products as ProductWithRelations[]} columns={columns} />
      </div>
    </div>
  );
}
