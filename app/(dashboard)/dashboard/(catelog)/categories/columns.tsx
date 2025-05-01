"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import DateColumn from "@/components/DataTableColumns/DateColumn"
import ImageColumn from "@/components/DataTableColumns/ImageColumn"
import SortableColumn from "@/components/DataTableColumns/SortableColumn"
import type { ColumnDef } from "@tanstack/react-table"
import ActionColumn from "@/components/DataTableColumns/ActionColumn"
import type { CategoryWithDepartment } from "@/types/types"
import { useDeleteCategory } from "@/hooks/useCategory"


export const columns: ColumnDef<CategoryWithDepartment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <SortableColumn column={column} title="Title" />,
  },
  {
    accessorKey: "department.title",
    header: ({ column }) => <SortableColumn column={column} title="Department" />,
    cell: ({ row }) => <div className="font-medium">{row.original.department?.title || "N/A"}</div>,
  },
  {
    accessorKey: "image",
    header: "Category Image",
    cell: ({ row }) => <ImageColumn row={row} accessorKey="image" />,
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded ${
          row.original.featured ? "bg-yellow-500 text-white" : "bg-gray-300 text-black"
        }`}
      >
        {row.original.featured ? "Featured" : "Regular"}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded ${
          row.original.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => <DateColumn row={row} accessorKey="createdAt" />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original
      const { deleteCategory } = useDeleteCategory()
      return (
        <ActionColumn
          row={row}
          model="category"
          editEndpoint={`/dashboard/categories/update/${category.id}`}
          id={category.id}
          deleteFunction={deleteCategory}
        />
      )
    },
  },
]

