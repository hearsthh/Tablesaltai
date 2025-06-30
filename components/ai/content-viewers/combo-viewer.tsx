"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Utensils, Plus, DollarSign, Percent, TrendingUp } from "lucide-react"

interface ComboViewerProps {
  content: any
  onApply?: (combos: any[]) => void
}

export default function ComboViewer({ content, onApply }: ComboViewerProps) {
  const [selectedCombos, setSelectedCombos] = useState<string[]>([])

  // Parse combo content
  const parseComboContent = (content: any) => {
    try {
      if (typeof content === "string") {
        const parsed = JSON.parse(content)
        return parsed.combos || []
      }
      return content.combos || content || []
    } catch {
      // Fallback parsing for text format
      return []
    }
  }

  const combos = parseComboContent(content)

  const handleSelectCombo = (comboId: string) => {
    setSelectedCombos((prev) => (prev.includes(comboId) ? prev.filter((id) => id !== comboId) : [...prev, comboId]))
  }

  const handleApplySelected = () => {
    const selectedComboData = combos.filter((combo: any) => selectedCombos.includes(combo.id || combo.name))

    onApply?.(selectedComboData)
    toast({
      title: "✅ Combos Applied!",
      description: `${selectedComboData.length} combo meals have been added to your menu`,
    })
  }

  if (!combos || combos.length === 0) {
    return (
      <div className="text-center py-8">
        <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No combo meals found in this content</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Generated Combo Meals</h3>
          <p className="text-gray-600">Select combos to add to your menu</p>
        </div>
        <Button
          onClick={handleApplySelected}
          disabled={selectedCombos.length === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Apply Selected ({selectedCombos.length})
        </Button>
      </div>

      {/* Combo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {combos.map((combo: any, index: number) => {
          const comboId = combo.id || combo.name || `combo-${index}`
          const isSelected = selectedCombos.includes(comboId)

          return (
            <Card
              key={comboId}
              className={`cursor-pointer transition-all ${
                isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
              }`}
              onClick={() => handleSelectCombo(comboId)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900">{combo.name || `Combo ${index + 1}`}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <DollarSign className="w-3 h-3 mr-1" />${combo.price || combo.totalPrice || "0.00"}
                      </Badge>
                      {combo.savings && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          <Percent className="w-3 h-3 mr-1" />
                          Save ${combo.savings}
                        </Badge>
                      )}
                      {combo.profitMargin && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {combo.profitMargin}% margin
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{combo.description || "Delicious combo meal with great value"}</p>

                {/* Items in combo */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Includes:</h4>
                  <div className="space-y-1">
                    {(combo.items || []).map((item: any, itemIndex: number) => (
                      <div key={itemIndex} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{typeof item === "string" ? item : item.name || item}</span>
                        {typeof item === "object" && item.price && <span className="text-gray-500">${item.price}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Value proposition */}
                {combo.valueProposition && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">{combo.valueProposition}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Combo Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Combos:</span>
            <span className="ml-2 font-medium">{combos.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Selected:</span>
            <span className="ml-2 font-medium">{selectedCombos.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Avg Price:</span>
            <span className="ml-2 font-medium">
              ${(combos.reduce((sum: number, combo: any) => sum + (combo.price || 0), 0) / combos.length).toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total Value:</span>
            <span className="ml-2 font-medium">
              $
              {combos
                .filter((combo: any) => selectedCombos.includes(combo.id || combo.name))
                .reduce((sum: number, combo: any) => sum + (combo.price || 0), 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
