import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface AreaChartCardProps {
  title: string
  description: string
  data: any[]
  areaKey: string
  areaName: string
  areaColor: string
  lineKey?: string
  lineName?: string
  lineColor?: string
  xAxisKey: string
  yAxisFormatter?: (value: number) => string
  className?: string
}

export function AreaChartCard({
  title,
  description,
  data,
  areaKey,
  areaName,
  areaColor,
  lineKey,
  lineName,
  lineColor = "#06b6d4",
  xAxisKey,
  yAxisFormatter,
  className,
}: AreaChartCardProps) {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color${areaKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={areaColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={areaColor} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} dy={10} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={yAxisFormatter} tick={{ fontSize: 12 }} dx={-10} />
            <Tooltip
              formatter={(value: number, name: string) => {
                const formattedValue = yAxisFormatter ? yAxisFormatter(value) : value
                return [formattedValue, name]
              }}
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "0.375rem",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey={areaKey}
              name={areaName}
              stroke={areaColor}
              fillOpacity={1}
              fill={`url(#color${areaKey})`}
              strokeWidth={2}
            />
            {lineKey && (
              <Line
                type="monotone"
                dataKey={lineKey}
                name={lineName || lineKey}
                stroke={lineColor}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

