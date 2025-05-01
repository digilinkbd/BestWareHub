"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SortableColumn from "@/components/DataTableColumns/SortableColumn";
import DateColumn from "@/components/DataTableColumns/DateColumn";
import { UserWithRoles } from "@/types/types";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { deleteUser } from "@/actions/users";

// Function to delete a user (replace with your actual implementation)
const useDeleteUser = () => {
  const router = useRouter();
  
  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      
      toast({
        title: "User deleted",
        description: "User has been successfully deleted",
        variant: "default",
      });
      
      router.refresh();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. They may have related records.",
        variant: "destructive",
      });
    }
  };
  
  return { deleteUser };
};

// Role badge component with appropriate colors
const RoleBadge = ({ role }: { role: string }) => {
  let color;
  
  switch(role) {
    case "ADMIN":
      color = "bg-red-500";
      break;
    case "SECRETARY":
      color = "bg-purple-500";
      break;
    case "VENDOR":
      color = "bg-orange-500";
      break;
    default:
      color = "bg-blue-500";
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs text-white ${color}`}>
      {role}
    </span>
  );
};

export const columns: ColumnDef<UserWithRoles>[] = [
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
    accessorKey: "image",
    header: "Profile",
    cell: ({ row }) => {
      const user = row.original;
      const userImage = user.image;
      const userName = user.name;
      
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userImage || ""} alt={userName} />
            <AvatarFallback>{userName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => <SortableColumn column={column} title="Role" />,
    cell: ({ row }) => {
      const user = row.original;
      return <RoleBadge role={user.role} />;
    },
  },
  {
    accessorKey: "isVerified",
    header: "Verification",
    cell: ({ row }) => (

<span
className={`px-2 py-1 rounded ${
  row.original.isVerified ? "bg-green-500 text-white" : "bg-red-600 text-white"
}`}
>
{row.original.isVerified ? "Verified" : "Unverified"}
</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
    
<span
className={`px-2 py-1 rounded ${
  row.original.status? "bg-green-500 text-white" : "bg-red-600 text-white"
}`}
>
{row.original.status? "Active" : "Inactive"}
</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableColumn column={column} title="Joined" />,
    cell: ({ row }) => <DateColumn row={row} accessorKey="createdAt" />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const router=useRouter()
     async function deleteUserFn(id:string){
       await deleteUser(id)
       toast.success("User deleted sucessfully")
       router.refresh()
      }
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href={`/dashboard/users/view/${user.id}`} className="flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/dashboard/users/update/${user.id}`} className="flex items-center">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete this user and all associated data including orders, 
                  products, reviews, and other related records. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteUserFn(user.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  },
];