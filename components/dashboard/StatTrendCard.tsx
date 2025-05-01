import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatTrendCardProps {
  title: string
  value: string | number
  change: number
  icon: LucideIcon
  changeLabel?: string
  changeType?: "increase" | "decrease" | "neutral"
  trendDirection?: "up" | "down"
  className?: string
}

export function StatTrendCard({
  title,
  value,
  change,
  icon: Icon,
  changeLabel = "from last period",
  changeType = "increase",
  trendDirection,
  className,
}: StatTrendCardProps) {
  // Determine if the trend is positive based on the change type and direction
  const isPositive = trendDirection ? trendDirection === "up" : changeType === "increase"

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/80 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold mt-1">{value}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-950 flex items-center">
            <div
              className={cn(
                "flex items-center text-sm font-medium",
                isPositive ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500",
              )}
            >
              {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              {Math.abs(change)}%
            </div>
            <span className="text-muted-foreground text-sm ml-1.5">{changeLabel}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

