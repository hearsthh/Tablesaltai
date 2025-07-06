import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Leaf, Flame } from "lucide-react"

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
}

export function DishRow({
  name,
  category,
  price,
  rating,
  orders,
  revenue,
  trend,
  isVegetarian = false,
  isSpicy = false,
}: DishRowProps) {
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "stable":
        return <Minus className="h-4 w-4 text-gray-600" />
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
      case "stable":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="flex items-center justify-between py-4 hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-black">{name}</h4>
              {isVegetarian && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  <Leaf className="h-3 w-3 mr-1" />
                  Veg
                </Badge>
              )}
              {isSpicy && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                  <Flame className="h-3 w-3 mr-1" />
                  Spicy
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{category}</span>
              <span>•</span>
              <span>{formatCurrency(price)}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <span>⭐</span>
                <span>{rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-8">
        <div className="text-right">
          <div className="text-sm font-medium text-black">{orders} orders</div>
          <div className="text-xs text-gray-500">this month</div>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium text-black">{formatCurrency(revenue)}</div>
          <div className="text-xs text-gray-500">revenue</div>
        </div>

        <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-medium capitalize">{trend}</span>
        </div>
      </div>
    </div>
  )
}
