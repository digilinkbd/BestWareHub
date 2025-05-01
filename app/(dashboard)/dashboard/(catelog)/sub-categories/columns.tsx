"use client";
import { Checkbox } from "@/components/ui/checkbox";
import DateColumn from "@/components/DataTableColumns/DateColumn";
import ImageColumn from "@/components/DataTableColumns/ImageColumn";
import SortableColumn from "@/components/DataTableColumns/SortableColumn";
import { ColumnDef } from "@tanstack/react-table";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import { useDeleteSubCategory } from "@/hooks/useSubCategory";
import { SubCategoryWithCategory } from "@/types/types";

export const columns: ColumnDef<SubCategoryWithCategory>[] = [
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
    accessorKey: "category.title",
    header: "Category",
    cell: ({ row }) => <span>{row.original.category?.title || "N/A"}</span>,
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
        const subCategory = row.original;
        const { deleteSubCategory } = useDeleteSubCategory();
        return (
          <ActionColumn
            row={row}
            model="subCategory"
            editEndpoint={`/dashboard/sub-categories/update/${subCategory.id}`}
            id={subCategory.id}
            deleteFunction={deleteSubCategory} 
          />
        );
      },
    },
];
