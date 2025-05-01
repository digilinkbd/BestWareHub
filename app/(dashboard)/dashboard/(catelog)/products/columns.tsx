"use client";
import { Checkbox } from "@/components/ui/checkbox";
import DateColumn from "@/components/DataTableColumns/DateColumn";
import ImageColumn from "@/components/DataTableColumns/ImageColumn";
import SortableColumn from "@/components/DataTableColumns/SortableColumn";
import { ColumnDef } from "@tanstack/react-table";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import { useDeleteProduct } from "@/hooks/useProduct";
import { ProductWithRelations } from "@/types/types";
import { StatusBadge } from "@/components/frontend/StatusBadge";
import { ProductStatus } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<ProductWithRelations>[] = [
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
  {
    accessorKey: "productPrice",
    header: "Price",
    cell: ({ row }) => `$${row.original.productPrice.toFixed(2)}`,
  },
  {
    accessorKey: "productStock",
    header: "Stock",
    cell: ({ row }) => row.original.productStock || 0,
  },
  {
    accessorKey: "department.title",
    header: "Department",
    cell: ({ row }) => row.original.department?.title || "N/A",
  },
  {
    accessorKey: "category.title",
    header: "Category",
    cell: ({ row }) => row.original.category?.title || "N/A",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded ${
          row.original.isFeatured ? "bg-yellow-500 text-white" : "bg-gray-300 text-black"
        }`}
      >
        {row.original.isFeatured ? "Featured" : "Regular"}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Is Active",
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status as ProductStatus} />,
  },
  {
    accessorKey: "view",
    header: "View",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Link href={`/dashboard/product-approvals/${product.id}`} passHref>
          <Button size="sm" variant="outline" className="text-green-700 hover:text-green-700">
            View
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => <DateColumn row={row} accessorKey="createdAt" />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      const { deleteProduct } = useDeleteProduct();
      return (
        <ActionColumn
          row={row}
          model="product"
          editEndpoint={`/dashboard/products/update/${product.id}`}
          id={product.id}
          deleteFunction={deleteProduct} 
        />
      );
    },
  },
];