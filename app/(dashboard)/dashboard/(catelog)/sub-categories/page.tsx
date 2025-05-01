"use client";
import React from "react";
import { columns } from "./columns";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { PageSkeleton } from "@/components/Forms/TableSkeleton";
import { useFetchSubCategories } from "@/hooks/useSubCategory";

export default function SubCategoriesPage() {
  const { subcategories, isLoading, error } = useFetchSubCategories();
  // console.log(subcategories)
  if (isLoading) {
     return <PageSkeleton rows={3} showImage={true} showStatus={true} showDate={true} showActions={true} />
   }
  if (error) return <p>Error loading subcategories</p>;

  return (
    <div className="p-2">
      <TableHeader
        title="Sub-Categories"
        linkTitle="Add Sub-Category"
        href="/dashboard/sub-categories/new"
        data={subcategories}
        model="subcategories"
      />
      <div className="py-8">
        <DataTable data={subcategories} columns={columns} />
      </div>
    </div>
  );
}
