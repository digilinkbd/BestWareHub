"use client";
import { Checkbox } from "@/components/ui/checkbox";
import DateColumn from "@/components/DataTableColumns/DateColumn";
import ImageColumn from "@/components/DataTableColumns/ImageColumn";
import SortableColumn from "@/components/DataTableColumns/SortableColumn";
import { ColumnDef } from "@tanstack/react-table";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import { useDeleteBrand } from "@/hooks/useBrand";
import { BrandWithRelations } from "@/types/types";

export const columns: ColumnDef<BrandWithRelations>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => <ImageColumn row={row} accessorKey="imageUrl" />,
  },
  // {
  //   accessorKey: "subCategory.title",
  //   header: "Subcategory",
  //   cell: ({ row }) => <span>{row.original.subCategory?.title || "N/A"}</span>,
  // },
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
      const brand = row.original;
      const { deleteBrand } = useDeleteBrand();
      return (
        <ActionColumn
          row={row}
          model="brand"
          editEndpoint={`/dashboard/brands/update/${brand.id}`}
          id={brand.id}
          deleteFunction={deleteBrand} 
        />
      );
    },
  },
];