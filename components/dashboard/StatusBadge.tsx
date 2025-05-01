import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string
  variant?: "default" | "outline" | "secondary" | "destructive"
  className?: string
  statusMap?: Record<
    string,
    {
      label?: string
      variant?: "default" | "outline" | "secondary" | "destructive"
      className?: string
    }
  >
}

export function StatusBadge({ status, variant = "secondary", className, statusMap }: StatusBadgeProps) {
  // Default status styling
  const defaultStatusMap: Record<
    string,
    {
      label?: string
      variant?: "default" | "outline" | "secondary" | "destructive"
      className?: string
    }
  > = {
    PENDING: {
      variant: "secondary",
      className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500",
    },
    PROCESSING: {
      variant: "secondary",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
    },
    SHIPPED: {
      variant: "secondary",
      className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-500",
    },
    DELIVERED: {
      variant: "secondary",
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    },
    CANCELED: {
      variant: "secondary",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
    },
    COMPLETED: {
      variant: "secondary",
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    },
    FAILED: {
      variant: "secondary",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
    },
    REFUNDED: {
      variant: "secondary",
      className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500",
    },
    ACTIVE: {
      variant: "secondary",
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    },
    INACTIVE: {
      variant: "secondary",
      className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500",
    },
  }

  // Merge default with custom status map
  const mergedStatusMap = { ...defaultStatusMap, ...statusMap }

  // Get status config or use defaults
  const statusConfig = mergedStatusMap[status] || {}

  return (
    <Badge variant={statusConfig.variant || variant} className={cn(statusConfig.className, className)}>
      {statusConfig.label || status}
    </Badge>
  )
}

