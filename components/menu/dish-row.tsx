"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, TrendingUp, TrendingDown, Star } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DishRowProps {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  isAvailable: boolean
  analytics?: {
    sales: number
    revenue: number
    rating: number
    trend: "up" | "down" | "stable"
    trendPercentage: number
  }
  tags?: string[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onToggleAvailability?: (id: string) => void
  onViewAnalytics?: (id: string) => void
  className?: string
  variant?: "compact" | "detailed"
}

export function DishRow({
  id,
  name,
  description,
  price,
  category,
  image,
  isAvailable,
  analytics,
  tags,
  onEdit,
  onDelete,
  onToggleAvailability,
  onViewAnalytics,
  className,
  variant = "detailed",
}: DishRowProps) {
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const getTrendIcon = () => {
    if (!analytics) return null
    switch (analytics.trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-600" />
      case "down":
        return <TrendingDown className="w-3 h-3 text-red-600" />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    if (!analytics) return "text-gray-600"
    switch (analytics.trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  if (variant === "compact") {
    return (
      <div
        className={`flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow ${className}`}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {image && (
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900 truncate">{name}</h4>
              {!isAvailable && (
                <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                  Unavailable
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm font-semibold text-gray-900">{formatCurrency(price)}</span>
              <span className="text-xs text-gray-500">{category}</span>
              {analytics && (
                <div className="flex items-center space-x-1">
                  {getTrendIcon()}
                  <span className={`text-xs ${getTrendColor()}`}>
                    {analytics.trendPercentage > 0 ? "+" : ""}
                    {analytics.trendPercentage}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Dish
              </DropdownMenuItem>
            )}
            {onToggleAvailability && (
              <DropdownMenuItem onClick={() => onToggleAvailability(id)}>
                {isAvailable ? "Mark Unavailable" : "Mark Available"}
              </DropdownMenuItem>
            )}
            {onViewAnalytics && analytics && (
              <DropdownMenuItem onClick={() => onViewAnalytics(id)}>View Analytics</DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={() => onDelete(id)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Dish
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <Card className={`border-gray-200 hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {image && (
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
                  {!isAvailable && (
                    <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                      Unavailable
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
                <div className="flex items-center space-x-4 mb-3">
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(price)}</span>
                  <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                    {category}
                  </Badge>
                  {analytics && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">{analytics.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                        {tag}
                      </Badge>
                    ))}
                    {tags.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                        +{tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Dish
                    </DropdownMenuItem>
                  )}
                  {onToggleAvailability && (
                    <DropdownMenuItem onClick={() => onToggleAvailability(id)}>
                      {isAvailable ? "Mark Unavailable" : "Mark Available"}
                    </DropdownMenuItem>
                  )}
                  {onViewAnalytics && analytics && (
                    <DropdownMenuItem onClick={() => onViewAnalytics(id)}>View Analytics</DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem onClick={() => onDelete(id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Dish
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Analytics Section */}
            {analytics && (
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">{formatNumber(analytics.sales)}</div>
                  <div className="text-xs text-gray-600">Sales</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">{formatCurrency(analytics.revenue)}</div>
                  <div className="text-xs text-gray-600">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {getTrendIcon()}
                    <span className={`text-sm font-bold ${getTrendColor()}`}>
                      {analytics.trendPercentage > 0 ? "+" : ""}
                      {analytics.trendPercentage}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">Trend</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
