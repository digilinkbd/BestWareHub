"use client";
import React from "react";
import { columns } from "./columns";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { PageSkeleton } from "@/components/Forms/TableSkeleton";
import { useFetchBrands } from "@/hooks/useBrand";

export default function BrandsPage() {
  const { brands, isLoading, error } = useFetchBrands();

  if (isLoading) {
    return <PageSkeleton rows={3} showImage={true} showStatus={true} showDate={true} showActions={true} />
  }
  if (error) return <p>Error loading brands</p>;

  return (
    <div className="p-2">
      <TableHeader
        title="Brands"
        linkTitle="Add Brand"
        href="/dashboard/brands/new"
        data={brands}
        model="brands"
      />
      <div className="py-8">
        <DataTable data={brands} columns={columns} />
      </div>
    </div>
  )
}