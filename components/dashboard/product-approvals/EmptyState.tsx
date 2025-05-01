import React from 'react'
import { Package2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description: string
  className?: string
  icon?: React.ReactNode
}

export default function EmptyState({ 
  title, 
  description, 
  className,
  icon = <Package2 size={50} className="text-gray-300" />
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto">{description}</p>
    </div>
  )
}