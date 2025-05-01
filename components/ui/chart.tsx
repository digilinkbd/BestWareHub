"use client"

import type * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

// Chart container
export function ChartContainer({
  children,
  className,
}: {
  children:any
  className?: string
}) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
       {children}
    </ResponsiveContainer>
  )
}

// Line chart
export function LineChartComponent({
  data,
  className,
  xAxisKey = "name",
  xAxisFormatter,
  yAxisFormatter,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  children,
}: {
  data: any[]
  className?: string
  xAxisKey?: string
  xAxisFormatter?: (value: any) => string
  yAxisFormatter?: (value: any) => string
  showLegend?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  children: React.ReactNode
}) {
  return (
    <LineChart data={data} className={cn("w-full h-full", className)}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
      <XAxis
        dataKey={xAxisKey}
        tickLine={false}
        axisLine={false}
        tickFormatter={xAxisFormatter}
        tick={{ fontSize: 12 }}
        dy={10}
      />
      <YAxis tickLine={false} axisLine={false} tickFormatter={yAxisFormatter} tick={{ fontSize: 12 }} dx={-10} />
      {showTooltip && <Tooltip content={<CustomTooltip />} />}
      {showLegend && <Legend />}
      {children}
    </LineChart>
  )
}

// Bar chart
export function BarChartComponent({
  data,
  className,
  xAxisKey = "name",
  xAxisFormatter,
  yAxisFormatter,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  layout = "vertical",
  children,
}: {
  data: any[]
  className?: string
  xAxisKey?: string
  xAxisFormatter?: (value: any) => string
  yAxisFormatter?: (value: any) => string
  showLegend?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  layout?: "vertical" | "horizontal"
  children: React.ReactNode
}) {
  return (
    <BarChart data={data} className={cn("w-full h-full", className)} layout={layout}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
      <XAxis
        dataKey={layout === "vertical" ? undefined : xAxisKey}
        type={layout === "vertical" ? "number" : "category"}
        tickLine={false}
        axisLine={false}
        tickFormatter={xAxisFormatter}
        tick={{ fontSize: 12 }}
        dy={10}
      />
      <YAxis
        dataKey={layout === "vertical" ? xAxisKey : undefined}
        type={layout === "vertical" ? "category" : "number"}
        tickLine={false}
        axisLine={false}
        tickFormatter={yAxisFormatter}
        tick={{ fontSize: 12 }}
        dx={-10}
      />
      {showTooltip && <Tooltip content={<CustomTooltip />} />}
      {showLegend && <Legend />}
      {children}
    </BarChart>
  )
}

// Area chart
export function AreaChartComponent({
  data,
  className,
  xAxisKey = "name",
  xAxisFormatter,
  yAxisFormatter,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  children,
}: {
  data: any[]
  className?: string
  xAxisKey?: string
  xAxisFormatter?: (value: any) => string
  yAxisFormatter?: (value: any) => string
  showLegend?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  children: React.ReactNode
}) {
  return (
    <AreaChart data={data} className={cn("w-full h-full", className)}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
      <XAxis
        dataKey={xAxisKey}
        tickLine={false}
        axisLine={false}
        tickFormatter={xAxisFormatter}
        tick={{ fontSize: 12 }}
        dy={10}
      />
      <YAxis tickLine={false} axisLine={false} tickFormatter={yAxisFormatter} tick={{ fontSize: 12 }} dx={-10} />
      {showTooltip && <Tooltip content={<CustomTooltip />} />}
      {showLegend && <Legend />}
      {children}
    </AreaChart>
  )
}

// Pie chart
export function PieChartComponent({
  data,
  className,
  showLegend = true,
  showTooltip = true,
  children,
}: {
  data: any[]
  className?: string
  showLegend?: boolean
  showTooltip?: boolean
  children: React.ReactNode
}) {
  return (
    <PieChart className={cn("w-full h-full", className)}>
      {showTooltip && <Tooltip content={<CustomTooltip />} />}
      {showLegend && <Legend />}
      {children}
    </PieChart>
  )
}

// Custom tooltip
export function CustomTooltip({ active, payload, label }: TooltipProps<any, any>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-sm p-2 text-sm">
        {label && <p className="font-medium mb-1">{label}</p>}
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

// Chart components
export const ChartLine = Line
export const ChartBar = Bar
export const ChartArea = Area
export const ChartPie = Pie
export const ChartCell = Cell

