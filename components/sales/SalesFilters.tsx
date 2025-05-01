"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock } from "lucide-react"

type SalesFiltersProps = {
  selectedDateRange: "today" | "week" | "month" | "year" | undefined
  onDateRangeChange: (range: "today" | "week" | "month" | "year") => void
}

export function SalesFilters({ selectedDateRange, onDateRangeChange }: SalesFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-600" />
        <h2 className="font-medium text-blue-800">Filter Sales</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedDateRange === "today" ? "default" : "outline"}
          size="sm"
          onClick={() => onDateRangeChange("today")}
          className={
            selectedDateRange === "today"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "border-blue-300 text-blue-800 hover:bg-blue-100"
          }
        >
          Today
        </Button>

        <Button
          variant={selectedDateRange === "week" ? "default" : "outline"}
          size="sm"
          onClick={() => onDateRangeChange("week")}
          className={
            selectedDateRange === "week"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "border-blue-300 text-blue-800 hover:bg-blue-100"
          }
        >
          Last 7 Days
        </Button>

        <Button
          variant={selectedDateRange === "month" ? "default" : "outline"}
          size="sm"
          onClick={() => onDateRangeChange("month")}
          className={
            selectedDateRange === "month"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "border-blue-300 text-blue-800 hover:bg-blue-100"
          }
        >
          Last 30 Days
        </Button>

        <Button
          variant={selectedDateRange === "year" ? "default" : "outline"}
          size="sm"
          onClick={() => onDateRangeChange("year")}
          className={
            selectedDateRange === "year"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "border-blue-300 text-blue-800 hover:bg-blue-100"
          }
        >
          Last Year
        </Button>

        <Select onValueChange={(value: any) => onDateRangeChange(value)}>
          <SelectTrigger className="w-[180px] border-blue-300 text-blue-800 bg-white">
            <SelectValue placeholder="Custom Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

