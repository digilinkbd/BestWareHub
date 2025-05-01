"use client"

import type React from "react"
import { Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  totalItems?: number
}

export function SearchBar({ value, onChange, onSubmit, totalItems }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
      <div className="relative w-full sm:w-64">
        <form onSubmit={onSubmit}>
          <Input
            type="search"
            placeholder="Search stores..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-4 pr-10"
          />
          <Button type="submit" variant="ghost" size="sm" className="absolute right-0 top-0 h-full">
            <Eye className="h-4 w-4" />
          </Button>
        </form>
      </div>
      {totalItems !== undefined && (
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">{totalItems} stores found</p>
        </div>
      )}
    </div>
  )
}

