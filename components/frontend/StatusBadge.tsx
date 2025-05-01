import type { ProductStatus } from "@prisma/client"

type StatusBadgeProps = {
  status: ProductStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "DRAFT":
        return "bg-slate-200 text-slate-800 border-slate-300"
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200"
      case "INACTIVE":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded border ${getStatusStyles()}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}

