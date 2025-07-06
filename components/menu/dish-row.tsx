"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, TrendingDown, Edit, MoreHorizontal } from "lucide-react"

interface DishRowProps {
  name: string
  category: string
  price: number
  rating: number
  orders: number
  revenue: number
  trend: "up" | "down" | "stable"
  isVegetarian?: boolean
  isSpicy?: boolean
  onEdit?: () => void
  onViewDetails?: () => void
}

export function DishRow({
  name,
  category,
  price,
  rating,
  orders,
  revenue,
  trend,
  isVegetarian,
  isSpicy,
  onEdit,
  onViewDetails,
}: DishRowProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h4 className="font-medium text-black truncate">{name}</h4>
          {isVegetarian && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Veg
            </Badge>
          )}
          {isSpicy && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Spicy
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>{category}</span>
          <span>₹{price}</span>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-center">
          <div className="font-semibold text-black">{orders}</div>
          <div className="text-xs text-gray-500">Orders</div>
        </div>

        <div className="text-center">
          <div className="font-semibold text-black">₹{revenue.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Revenue</div>
        </div>

        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>{trend === "stable" ? "—" : trend}</span>
        </div>

        <div className="flex items-center space-x-2">
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onViewDetails && (
            <Button variant="ghost" size="sm" onClick={onViewDetails}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
