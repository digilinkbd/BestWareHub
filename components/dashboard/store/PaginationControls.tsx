"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  status: string
  search: string
}

export function PaginationControls({ currentPage, totalPages, status, search }: PaginationControlsProps) {
  if (totalPages <= 1) return null

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? `?status=${status}&page=${currentPage - 1}&search=${search}` : "#"}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
          const pageNumber = i + 1
          return (
            <PaginationItem key={i}>
              <PaginationLink
                href={`?status=${status}&page=${pageNumber}&search=${search}`}
                isActive={currentPage === pageNumber}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        {totalPages > 5 && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href={`?status=${status}&page=${totalPages}&search=${search}`}
                isActive={currentPage === totalPages}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? `?status=${status}&page=${currentPage + 1}&search=${search}` : "#"}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

