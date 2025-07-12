"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { MenuItemMetrics } from "@/lib/types/menu-intelligence"
import { Edit, Trash2, Zap, ImageIcon, TrendingUp, TrendingDown, Star, Leaf } from "lucide-react"
import { useState } from "react"

interface MenuItemCardProps {
  item: MenuItemMetrics
  onGenerateDescription: (itemId: string) => void
  onUpdatePrice: (itemId: string, newPrice: number) => void
  onRemoveItem: (itemId: string) => void
  onCreateCombo: (itemId: string) => void
}

export function MenuItemCard({
  item,
  onGenerateDescription,
  onUpdatePrice,
  onRemoveItem,
  onCreateCombo,
}: MenuItemCardProps) {
  const [isEditingPrice, setIsEditingPrice] = useState(false)
  const [newPrice, setNewPrice] = useState(item.price)

  const handlePriceUpdate = () => {
    onUpdatePrice(item.id, newPrice)
    setIsEditingPrice(false)
  }

  const getPerformanceIcon = () => {
    switch (item.performanceTier) {
      case "top":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "low":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Star className="w-4 h-4 text-yellow-600" />
    }
  }

  const getPerformanceBadge = () => {
    switch (item.performanceTier) {
      case "top":
        return <Badge className="bg-green-100 text-green-800 border-green-200">🔥 Top Performer</Badge>
      case "low":
        return <Badge className="bg-red-100 text-red-800 border-red-200">💤 Underperforming</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⭐ Average</Badge>
    }
  }

  const getActionTags = () => {
    const tags = []
    if (item.missingImage)
      tags.push({ label: "📸 Missing Image", color: "bg-orange-100 text-orange-800 border-orange-200" })
    if (item.missingDescription)
      tags.push({ label: "💬 Missing Description", color: "bg-blue-100 text-blue-800 border-blue-200" })
    if (item.suggestRepricing)
      tags.push({ label: "₹ Reprice Suggested", color: "bg-purple-100 text-purple-800 border-purple-200" })
    if (item.suggestRemoval) tags.push({ label: "🗑 Consider Removal", color: "bg-red-100 text-red-800 border-red-200" })
    if (item.risingStar) tags.push({ label: "🌟 Rising Star", color: "bg-green-100 text-green-800 border-green-200" })
    if (item.suggestCombo)
      tags.push({ label: "🍱 Combo Opportunity", color: "bg-indigo-100 text-indigo-800 border-indigo-200" })
    return tags
  }

  const daysSinceLastOrder = Math.floor((Date.now() - new Date(item.lastOrderedDate).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Image */}
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {item.imageUrl ? (
              <img
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <ImageIcon className="w-6 h-6 text-gray-400" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                  {item.isVeg && <Leaf className="w-3 h-3 text-green-600" />}
                  {getPerformanceIcon()}
                </div>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-2">
                  {isEditingPrice ? (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">₹</span>
                      <Input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        className="w-16 h-6 text-xs"
                        step="0.01"
                      />
                      <Button size="sm" onClick={handlePriceUpdate} className="h-6 px-2 text-xs">
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditingPrice(false)}
                        className="h-6 px-2 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-sm">₹{item.price}</span>
                      <Button size="sm" variant="ghost" onClick={() => setIsEditingPrice(true)} className="h-5 w-5 p-0">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Performance Badge */}
            <div className="mb-2">{getPerformanceBadge()}</div>

            {/* Action Tags */}
            {getActionTags().length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {getActionTags().map((tag, index) => (
                  <Badge key={index} className={`text-xs ${tag.color}`}>
                    {tag.label}
                  </Badge>
                ))}
              </div>
            )}

            {/* Mini Metrics */}
            <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
              <div className="text-center">
                <div className="font-medium text-gray-900">{item.orderCount}</div>
                <div className="text-gray-600">Orders</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">₹{Math.round(item.totalRevenue)}</div>
                <div className="text-gray-600">Revenue</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">{daysSinceLastOrder}d</div>
                <div className="text-gray-600">Last Order</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-1">
              {item.missingDescription && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onGenerateDescription(item.id)}
                  className="h-6 px-2 text-xs bg-transparent"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  AI Description
                </Button>
              )}

              {item.suggestCombo && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCreateCombo(item.id)}
                  className="h-6 px-2 text-xs bg-transparent"
                >
                  🍱 Create Combo
                </Button>
              )}

              {item.suggestRemoval && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRemoveItem(item.id)}
                  className="h-6 px-2 text-xs bg-transparent text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
