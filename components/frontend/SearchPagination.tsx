"use client"

import { useRouter } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function SearchPagination({
  currentPage,
  totalPages,
  searchParamsString,
}: {
  currentPage: number;
  totalPages: number;
  searchParamsString: string;
}) {
  const router = useRouter()

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParamsString)

    if (pageNumber === 1) {
      params.delete("page")
    } else {
      params.set("page", pageNumber.toString())
    }

    return `/search?${params.toString()}`
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []

    // Always show first page
    pages.push(1)

    // Calculate range around current page
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push("...")
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push("...")
    }

    // Always show last page if more than one page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {getPageNumbers().map((page, i) => (
          <PaginationItem key={i}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink href={createPageURL(page as number)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}