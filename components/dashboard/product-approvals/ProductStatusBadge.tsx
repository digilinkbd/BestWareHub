import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertTriangle, Check, X } from 'lucide-react'

type ProductStatusBadgeProps = {
  status: string
  size?: 'default' | 'lg'
}

const ProductStatusBadge = ({ status, size = 'default' }: ProductStatusBadgeProps) => {
  let color = ''
  let icon = null
  let label = status
  
  switch (status) {
    case 'DRAFT':
      color = 'bg-gray-500 hover:bg-gray-600'
      icon = <Clock className={size === 'lg' ? 'h-5 w-5 mr-2' : 'h-3 w-3 mr-1'} />
      break
    case 'PENDING':
      color = 'bg-yellow-500 hover:bg-yellow-600'
      icon = <AlertTriangle className={size === 'lg' ? 'h-5 w-5 mr-2' : 'h-3 w-3 mr-1'} />
      break
    case 'ACTIVE':
      color = 'bg-green-500 hover:bg-green-600'
      icon = <Check className={size === 'lg' ? 'h-5 w-5 mr-2' : 'h-3 w-3 mr-1'} />
      break
    case 'INACTIVE':
      color = 'bg-red-500 hover:bg-red-600'
      icon = <X className={size === 'lg' ? 'h-5 w-5 mr-2' : 'h-3 w-3 mr-1'} />
      break
    default:
      color = 'bg-gray-500 hover:bg-gray-600'
  }
  
  return (
    <Badge 
      className={`${color} ${size === 'lg' ? 'text-md py-1 px-3' : ''} text-white flex items-center`}
    >
      {icon}
      {label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()}
    </Badge>
  )
}

export default ProductStatusBadge