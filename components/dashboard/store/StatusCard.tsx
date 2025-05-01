"use client"

import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatusCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  isActive: boolean
  onClick: () => void
  color: {
    bg: string
    border: string
    iconBg: string
    iconColor: string
    hoverBg: string
  }
}

export function StatusCard({ title, value, icon: Icon, isActive, onClick, color }: StatusCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all ${isActive ? `${color.bg} ${color.border}` : `hover:${color.hoverBg}`}`}
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`${color.iconBg} p-3 rounded-full`}>
          <Icon className={`h-6 w-6 ${color.iconColor}`} />
        </div>
      </CardContent>
    </Card>
  )
}

