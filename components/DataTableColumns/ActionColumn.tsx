"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"

type ActionColumnProps = {
  row: any
  model: string
  editEndpoint: string
  id: string
  deleteFunction: (id: string) => void | Promise<any>
}

export default function ActionColumn({ row, model, editEndpoint, id, deleteFunction }: ActionColumnProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router=useRouter()
  async function handleDelete() {
    try {
      setIsDeleting(true)
      const res = await deleteFunction(id)
      if (res?.ok) {
        toast.success(`${model} deleted successfully`)
      }
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error(`Failed to delete ${model}`)
    } finally {
      setIsDeleting(false)
      setIsOpen(false) // Only close the dialog after the operation completes
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onSelect={(e) => {
                // Prevent the dropdown from closing
                e.preventDefault()
                setIsOpen(true)
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete {model}
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this {model}?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove this {model} from our records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700" disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href={editEndpoint}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit {model}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

