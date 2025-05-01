"use client"

import { Button } from "@/components/ui/button"
import { columns } from "./columns"
import DataTable from "@/components/DataTableComponents/DataTable"
import TableHeader from "@/components/dashboard/Tables/TableHeader"
import { useFetchDepartments } from "@/hooks/useDepartment"
import { PageSkeleton } from "@/components/Forms/TableSkeleton"


export default function DepartmentsPage() {
  const { departments, isLoading, error, refetch } = useFetchDepartments()

  if (error) {
    return (
      <div className="p-2">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Departments</h1>
        </div>
        <div className="p-8 text-center">
          <p className="text-red-500">Error loading departments: {error.message}</p>
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <PageSkeleton rows={3} showImage={true} showStatus={true} showDate={true} showActions={true} />
  }

  return (
    <div className="p-2">
      <TableHeader
        title="Departments"
        linkTitle="Add Department"
        href="/dashboard/departments/new"
        data={departments}
        model="department"
      />
      <div className="py-1">
        <DataTable data={departments} columns={columns} />
      </div>
    </div>
  )
}


