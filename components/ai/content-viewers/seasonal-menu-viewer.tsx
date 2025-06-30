"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Calendar, Leaf, Snowflake, Sun, Flower, Plus } from "lucide-react"

interface SeasonalMenuViewerProps {
  content: any
  onApply?: (seasonalItems: any[]) => void
}

export default function SeasonalMenuViewer({ content, onApply }: SeasonalMenuViewerProps) {
  const [selectedSeason, setSelectedSeason] = useState<string>("spring")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const parseSeasonalContent = (content: any) => {
    try {
      if (typeof content === "string") {
        const parsed = JSON.parse(content)
        return parsed.seasonalMenus || parsed.seasons || {}
      }
      return content.seasonalMenus || content.seasons || content || {}
    } catch {
      return {}
    }
  }

  const seasonalData = parseSeasonalContent(content)

  const seasons = [
    {
      id: "spring",
      name: "Spring",
      icon: Flower,
      color: "bg-green-100 text-green-700",
      items: seasonalData.spring || [],
    },
    {
      id: "summer",
      name: "Summer",
      icon: Sun,
      color: "bg-yellow-100 text-yellow-700",
      items: seasonalData.summer || [],
    },
    { id: "fall", name: "Fall", icon: Leaf, color: "bg-orange-100 text-orange-700", items: seasonalData.fall || [] },
    {
      id: "winter",
      name: "Winter",
      icon: Snowflake,
      color: "bg-blue-100 text-blue-700",
      items: seasonalData.winter || [],
    },
  ]

  const currentSeason = seasons.find((s) => s.id === selectedSeason) || seasons[0]

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleApplySelected = () => {
    const selectedItemData = currentSeason.items.filter((item: any) => selectedItems.includes(item.id || item.name))

    onApply?.(selectedItemData)
    toast({
      title: "✅ Seasonal Items Applied!",
      description: `${selectedItemData.length} ${currentSeason.name.toLowerCase()} items added to menu`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Seasonal Menu Items</h3>
          <p className="text-gray-600">Add seasonal variety to your menu</p>
        </div>
        <Button
          onClick={handleApplySelected}
          disabled={selectedItems.length === 0}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Selected ({selectedItems.length})
        </Button>
      </div>

      {/* Season Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {seasons.map((season) => {
          const Icon = season.icon
          return (
            <Card
              key={season.id}
              className={`cursor-pointer transition-all ${
                selectedSeason === season.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
              }`}
              onClick={() => setSelectedSeason(season.id)}
            >
              <CardContent className="p-4 text-center">
                <Icon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <h4 className="font-medium">{season.name}</h4>
                <p className="text-sm text-gray-500">{season.items.length} items</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Seasonal Items */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <currentSeason.icon className="w-5 h-5" />
          <h4 className="text-lg font-semibold">{currentSeason.name} Menu Items</h4>
          <Badge className={currentSeason.color}>{currentSeason.items.length} items</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentSeason.items.map((item: any, index: number) => {
            const itemId = item.id || item.name || `item-${index}`
            const isSelected = selectedItems.includes(itemId)

            return (
              <Card
                key={itemId}
                className={`cursor-pointer transition-all ${
                  isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                }`}
                onClick={() => handleSelectItem(itemId)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{item.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <div className="text-lg font-semibold text-green-600 mt-2">${item.price || "0.00"}</div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>

                  {/* Seasonal Tags */}
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className={currentSeason.color}>
                      {currentSeason.name}
                    </Badge>
                    {item.tags?.map((tag: string, tagIndex: number) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Seasonal Info */}
                  {item.seasonalInfo && (
                    <div className="mt-3 text-xs text-gray-500">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {item.seasonalInfo}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Seasonal Tips */}
      <Card className="bg-green-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-green-900 mb-2">🌱 Seasonal Menu Tips</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Seasonal items create excitement and encourage repeat visits</li>
            <li>• Use fresh, local ingredients when available</li>
            <li>• Promote seasonal items on social media</li>
            <li>• Consider limited-time offers to create urgency</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
