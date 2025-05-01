"use client"

import { ArrowDown, ArrowRight, ArrowUp, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    description?: string;
    trend?: number;
    prefix?: string;
    suffix?: string;
    trendHidden?: boolean;
    trendInverted?: boolean;
    variant?: any;
    onClick?: () => void;
  }
  
  export function MetricCard({
    title,
    value,
    icon: Icon,
    description,
    trend = 0,
    prefix = "",
    suffix = "",
    trendHidden = false,
    trendInverted = false,
    variant = "default",
    onClick,
  }: MetricCardProps) {
    const formattedValue =
      typeof value === "number"
        ? value >= 1000
          ? `${prefix}${(value / 1000).toFixed(1)}k${suffix}`
          : `${prefix}${value.toLocaleString()}${suffix}`
        : `${prefix}0${suffix}`;
  
    const isPositive = trendInverted ? trend < 0 : trend >= 0;
  
    // Variant-based styling
    const variantStyles: Record<string, { accent: string; icon: string }> = {
      admin: {
        accent: "border-l-primary",
        icon: "text-primary",
      },
      vendor: {
        accent: "border-l-indigo-500",
        icon: "text-indigo-500",
      },
      user: {
        accent: "border-l-blue-500",
        icon: "text-blue-500",
      },
      default: {
        accent: "border-l-gray-200 dark:border-l-gray-800",
        icon: "text-primary",
      },
    };
  
    const styles = variantStyles[variant] || variantStyles.default;
   

  return (
    <Card
      className={cn("relative overflow-hidden", onClick && "cursor-pointer")}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{formattedValue}</div>
        {!trendHidden ? (
          <div className={cn("flex items-center text-sm", isPositive ? "text-emerald-600" : "text-rose-600")}>
            {isPositive ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
            {Math.abs(trend)}% {description && <span className="text-muted-foreground ml-1">{description}</span>}
          </div>
        ) : onClick ? (
          <div className="flex items-center text-sm text-primary">
            View details
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        ) : description ? (
          <div className="text-xs text-muted-foreground">{description}</div>
        ) : null}
      </CardContent>
      <div className="absolute right-0 bottom-0 opacity-5">
        <Icon className={cn("h-24 w-24", styles.icon)} />
      </div>
    </Card>
  )
}

