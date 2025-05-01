import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedMetricCardProps {
  title: string
  value: number
  icon: LucideIcon
  description: string
  trend?: number
  prefix?: string
  suffix?: string
  trendHidden?: boolean
  trendInverted?: boolean
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info"
  className?: string
}

export function EnhancedMetricCard({
  title,
  value,
  icon: Icon,
  description,
  trend = 0,
  prefix = "",
  suffix = "",
  trendHidden = false,
  trendInverted = false,
  variant = "primary",
  className,
}: EnhancedMetricCardProps) {
  const formattedValue =
    typeof value === "number"
      ? value >= 1000
        ? `${prefix}${(value / 1000).toFixed(1)}k${suffix}`
        : `${prefix}${value.toLocaleString()}${suffix}`
      : `${prefix}0${suffix}`

  const isPositive = trendInverted ? trend < 0 : trend >= 0

  // Variant-based styling
  const variantStyles = {
    primary: {
      background: "bg-gradient-to-br from-violet-500 to-purple-600",
      icon: "bg-white/20 text-white",
    },
    secondary: {
      background: "bg-gradient-to-br from-blue-500 to-indigo-600",
      icon: "bg-white/20 text-white",
    },
    success: {
      background: "bg-gradient-to-br from-emerald-500 to-teal-600",
      icon: "bg-white/20 text-white",
    },
    warning: {
      background: "bg-gradient-to-br from-amber-500 to-orange-600",
      icon: "bg-white/20 text-white",
    },
    danger: {
      background: "bg-gradient-to-br from-rose-500 to-red-600",
      icon: "bg-white/20 text-white",
    },
    info: {
      background: "bg-gradient-to-br from-cyan-500 to-blue-600",
      icon: "bg-white/20 text-white",
    },
  }

  // Get styles for the current variant
  const styles = variantStyles[variant]

  return (
    <div className={cn("rounded-xl overflow-hidden shadow-md", styles.background, className)}>
      <div className="p-6 text-white">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-white/80 text-sm font-medium">{title}</p>
            <div className="flex items-baseline">
              <h2 className="text-2xl font-bold">{formattedValue}</h2>
              {!trendHidden && (
                <div className="ml-2 flex items-center text-sm text-white/90">
                  {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                  {Math.abs(trend)}%
                </div>
              )}
            </div>
            <p className="text-xs text-white/70">{description}</p>
          </div>
          <div className={cn("p-3 rounded-full", styles.icon)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  )
}

