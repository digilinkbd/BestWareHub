"use client"
import React from "react";
import { columns } from "./columns";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { PageSkeleton } from "@/components/Forms/TableSkeleton";
import { useFetchVendors } from "@/hooks/useVendor";

export default  function BrandsPage() {
  const { vendors, isLoading, error } = useFetchVendors();

  if (isLoading) {
    return <PageSkeleton rows={3} showImage={true} showStatus={true} showDate={true} showActions={true} />
  }
  if (error) return <p>Error loading Vendors</p>;

  return (
    <div className="p-2">
      <TableHeader
        title="Vendors"
        linkTitle="Add Vendor"
        href="/dashboard/vendor/new"
        data={vendors}
        model="vendors"
      />
      <div className="py-8">
        <DataTable data={vendors} columns={columns} />
      </div>
    </div>
  )
}