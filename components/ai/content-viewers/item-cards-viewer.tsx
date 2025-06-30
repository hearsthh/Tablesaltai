"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { CreditCard, Download, Share, Eye, Heart, Star } from "lucide-react"

interface ItemCardsViewerProps {
  content: any
  onApply?: (cards: any[]) => void
}

export default function ItemCardsViewer({ content, onApply }: ItemCardsViewerProps) {
  const [selectedCards, setSelectedCards] = useState<string[]>([])

  const parseCardContent = (content: any) => {
    try {
      if (typeof content === "string") {
        const parsed = JSON.parse(content)
        return parsed.cards || parsed.itemCards || []
      }
      return content.cards || content.itemCards || content || []
    } catch {
      return []
    }
  }

  const cards = parseCardContent(content)

  const handleSelectCard = (cardId: string) => {
    setSelectedCards((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]))
  }

  const handleApplySelected = () => {
    const selectedCardData = cards.filter((card: any) => selectedCards.includes(card.id || card.itemName))

    onApply?.(selectedCardData)
    toast({
      title: "✅ Item Cards Applied!",
      description: `${selectedCardData.length} promotional cards have been created`,
    })
  }

  const renderItemCard = (card: any, index: number) => {
    const cardId = card.id || card.itemName || `card-${index}`
    const isSelected = selectedCards.includes(cardId)

    return (
      <div
        key={cardId}
        className={`relative overflow-hidden rounded-lg shadow-lg transition-all cursor-pointer ${
          isSelected ? "ring-2 ring-blue-500 scale-105" : "hover:shadow-xl"
        }`}
        onClick={() => handleSelectCard(cardId)}
      >
        {/* Card Design */}
        <div className="bg-gradient-to-br from-orange-400 to-red-500 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{card.itemName || card.name}</h3>
              <p className="text-orange-100 text-sm mb-3">{card.description}</p>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                isSelected ? "bg-white border-white" : "border-white"
              }`}
            >
              {isSelected && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">${card.price || "0.00"}</div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current text-yellow-300" />
              ))}
            </div>
          </div>

          {card.specialOffer && (
            <div className="mt-3 bg-white bg-opacity-20 rounded-lg p-2">
              <p className="text-sm font-medium">{card.specialOffer}</p>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            {card.tags?.map((tag: string, tagIndex: number) => (
              <Badge key={tagIndex} variant="secondary" className="bg-white bg-opacity-20 text-white border-white">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Card Footer */}
        <div className="bg-white p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Perfect for social media</span>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{Math.floor(Math.random() * 100) + 50}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-8">
        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No item cards found in this content</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Promotional Item Cards</h3>
          <p className="text-gray-600">Select cards to use for marketing</p>
        </div>
        <Button
          onClick={handleApplySelected}
          disabled={selectedCards.length === 0}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Selected ({selectedCards.length})
        </Button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card: any, index: number) => renderItemCard(card, index))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Button variant="outline" className="flex-1">
          <Share className="w-4 h-4 mr-2" />
          Share to Social Media
        </Button>
        <Button variant="outline" className="flex-1">
          <Eye className="w-4 h-4 mr-2" />
          Preview All Sizes
        </Button>
        <Button variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download as ZIP
        </Button>
      </div>

      {/* Usage Tips */}
      <Card className="bg-blue-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Usage Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use these cards on Instagram, Facebook, and Twitter</li>
            <li>• Perfect for highlighting daily specials and new items</li>
            <li>• Cards are optimized for mobile viewing</li>
            <li>• Include relevant hashtags when posting</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
