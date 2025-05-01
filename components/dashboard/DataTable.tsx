"use client"

import type React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface DataTableProps<T> {
  data: T[]
  columns: {
    key: string
    title: string
    render?: (item: T) => React.ReactNode
    className?: string
  }[]
  className?: string
  onRowClick?: (item: T) => void
}

export function DataTable<T>({ data, columns, className, onRowClick }: DataTableProps<T>) {
  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={index}
              className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
            >
              {columns.map((column) => (
                <TableCell key={`${index}-${column.key}`} className={column.className}>
                  {column.render ? column.render(item) : (item as any)[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

