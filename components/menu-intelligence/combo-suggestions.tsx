"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { ComboSuggestion } from "@/lib/types/menu-intelligence"
import { Plus, Edit, Sparkles, TrendingUp, Users } from "lucide-react"
import { useState } from "react"

interface ComboSuggestionsProps {
  suggestions: ComboSuggestion[]
  onCreateCombo: (itemId: string) => void
}

export function ComboSuggestions({ suggestions, onCreateCombo }: ComboSuggestionsProps) {
  const [selectedCombo, setSelectedCombo] = useState<ComboSuggestion | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editedCombo, setEditedCombo] = useState<Partial<ComboSuggestion>>({})

  const handleCreateCombo = (combo: ComboSuggestion) => {
    setSelectedCombo(combo)
    setEditedCombo({
      name: combo.suggestedName,
      suggestedPrice: combo.suggestedPrice,
    })
    setShowCreateDialog(true)
  }

  const handleConfirmCreate = () => {
    if (selectedCombo) {
      onCreateCombo(selectedCombo.id)
      setShowCreateDialog(false)
      setSelectedCombo(null)
      setEditedCombo({})
    }
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-purple-600" />🍱 Combo Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No combo opportunities yet</h3>
            <p className="text-gray-600 text-sm">
              Combo suggestions will appear as you collect more order data and co-ordering patterns.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-purple-600" />🍱 Combo Opportunities
            <Badge variant="outline" className="ml-2">
              {suggestions.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestions.map((combo) => (
            <div key={combo.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{combo.suggestedName}</h4>
                  <p className="text-xs text-gray-600 mb-2">{combo.reason}</p>

                  {/* Included Items */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {combo.includedItems.map((item, index) => (
                      <Badge key={item.id} variant="outline" className="text-xs">
                        {item.name}
                        {index < combo.includedItems.length - 1 && " +"}
                      </Badge>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center space-x-4 text-sm">
                    <div>
                      <span className="text-gray-600">Original: </span>
                      <span className="line-through text-gray-500">₹{combo.originalPrice}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Combo: </span>
                      <span className="font-semibold text-green-600">₹{combo.suggestedPrice}</span>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Save ₹{combo.savings.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <div className="text-right text-xs">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Users className="w-3 h-3 mr-1" />
                      {combo.confidence}% confidence
                    </div>
                    {combo.frequency > 0 && (
                      <div className="flex items-center text-gray-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {Math.round(combo.frequency * 100)}% co-order rate
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleCreateCombo(combo)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Create Combo
                  </Button>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    <Edit className="w-4 h-4 mr-1" />
                    Customize
                  </Button>
                </div>

                <Badge
                  className={`${
                    combo.confidence >= 80
                      ? "bg-green-100 text-green-800 border-green-200"
                      : combo.confidence >= 60
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  {combo.confidence >= 80
                    ? "High Confidence"
                    : combo.confidence >= 60
                      ? "Medium Confidence"
                      : "Low Confidence"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Create Combo Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Combo</DialogTitle>
            <DialogDescription>Customize your combo details before adding it to the menu</DialogDescription>
          </DialogHeader>

          {selectedCombo && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Combo Name</Label>
                <Input
                  value={editedCombo.name || selectedCombo.suggestedName}
                  onChange={(e) => setEditedCombo({ ...editedCombo, name: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Included Items</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  {selectedCombo.includedItems.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between py-1">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm text-gray-600">₹{item.price}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex items-center justify-between font-medium">
                    <span className="text-sm">Total Individual Price:</span>
                    <span className="text-sm">₹{selectedCombo.originalPrice}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Combo Price</Label>
                <Input
                  type="number"
                  value={editedCombo.suggestedPrice || selectedCombo.suggestedPrice}
                  onChange={(e) => setEditedCombo({ ...editedCombo, suggestedPrice: Number(e.target.value) })}
                  className="mt-1"
                  step="0.01"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Customer saves ₹
                  {((editedCombo.suggestedPrice || selectedCombo.suggestedPrice) - selectedCombo.originalPrice).toFixed(
                    2,
                  )}
                  (
                  {Math.round(
                    ((selectedCombo.originalPrice - (editedCombo.suggestedPrice || selectedCombo.suggestedPrice)) /
                      selectedCombo.originalPrice) *
                      100,
                  )}
                  % discount)
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmCreate} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Add to Menu
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
