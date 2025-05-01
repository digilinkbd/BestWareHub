import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface BarChartCardProps {
  title: string
  description: string
  data: any[]
  dataKeys: {
    key: string
    name: string
    color: string
  }[]
  xAxisKey: string
  yAxisFormatter?: (value: number) => string
  className?: string
}

export function BarChartCard({
  title,
  description,
  data,
  dataKeys,
  xAxisKey,
  yAxisFormatter,
  className,
}: BarChartCardProps) {
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
          <BarChart data={data}>
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
            {dataKeys.map((dataKey, index) => (
              <Bar
                key={dataKey.key}
                dataKey={dataKey.key}
                name={dataKey.name}
                fill={dataKey.color}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

