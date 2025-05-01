"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { VendorWithStore } from "@/actions/vendor"

export const columns: ColumnDef<VendorWithStore>[] = [
  {
    accessorKey: "store",
    header: "Store",
    cell: ({ row }) => {
      const store = row.original.store
      
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={store?.logo || ""} alt={store?.storeName || "Store"} />
            <AvatarFallback className="bg-yellow-100 text-yellow-800">
              {store?.storeName?.charAt(0) || row.original.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{store?.storeName || "No Store"}</p>
            <p className="text-sm text-muted-foreground">{row.original.name}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "productCount",
    header: "Products",
    cell: ({ row }) => {
      const productCount = row.original.productCount || 0
      
      return (
        <span className="font-medium">{productCount}</span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${
          status 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {status ? "Active" : "Inactive"}
        </span>
      )
    },
  },
  {
    accessorKey: "vendorStatus",
    header: "Verification",
    cell: ({ row }) => {
      const vendorStatus = row.original.vendorStatus
      
      const statusStyles = {
        PENDING: "bg-yellow-100 text-yellow-800",
        APPROVED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
        NORMAL: "bg-blue-100 text-blue-800"
      }
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${
          statusStyles[vendorStatus || "NORMAL"]
        }`}>
          {vendorStatus || "NORMAL"}
        </span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      return format(new Date(row.original.createdAt), "MMM dd, yyyy")
    },
  },
  {
    id: "view",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Link 
          href={`/dashboard/vendors/${row.original.id}`}
          className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800 font-medium"
        >
          <span>View Details</span>
          <ExternalLink size={14} />
        </Link>
      )
    },
  },
]