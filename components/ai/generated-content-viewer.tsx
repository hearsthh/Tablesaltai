"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Download, Share, CheckCircle, Star, ThumbsUp, ThumbsDown } from "lucide-react"
import ComboViewer from "./content-viewers/combo-viewer"
import MenuDesignViewer from "./content-viewers/menu-design-viewer"
import ItemCardsViewer from "./content-viewers/item-cards-viewer"
import SeasonalMenuViewer from "./content-viewers/seasonal-menu-viewer"

interface GeneratedContent {
  id: string
  content_type: string
  title: string
  content_data: any
  metadata?: any
  status: string
  ai_mode: string
  generation_cost?: number
  tokens_used?: number
  created_at: string
  updated_at: string
}

interface GeneratedContentViewerProps {
  content: GeneratedContent
  menuData?: any
  onApply?: (content: GeneratedContent, applyData: any) => void
  onClose?: () => void
}

export default function GeneratedContentViewer({ content, menuData, onApply, onClose }: GeneratedContentViewerProps) {
  const [rating, setRating] = useState(0)

  const handleRating = async (newRating: number) => {
    setRating(newRating)
    toast({
      title: "Rating Submitted",
      description: `You rated this content ${newRating} stars`,
    })
  }

  const handleApplyContent = (appliedData: any) => {
    onApply?.(content, appliedData)
  }

  const renderContentViewer = () => {
    switch (content.content_type) {
      case "combos":
        return <ComboViewer content={content.content_data} onApply={handleApplyContent} />

      case "menu-design":
        return <MenuDesignViewer content={content.content_data} menuData={menuData} onApply={handleApplyContent} />

      case "item-cards":
        return <ItemCardsViewer content={content.content_data} onApply={handleApplyContent} />

      case "item-descriptions":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enhanced Item Descriptions</h3>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                {typeof content.content_data === "string"
                  ? content.content_data
                  : JSON.stringify(content.content_data, null, 2)}
              </pre>
            </div>
            <Button onClick={() => handleApplyContent(content.content_data)}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Apply Descriptions to Menu
            </Button>
          </div>
        )

      case "seasonal-menu":
        return <SeasonalMenuViewer content={content.content_data} onApply={handleApplyContent} />

      case "menu-templates":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Menu Templates</h3>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                {typeof content.content_data === "string"
                  ? content.content_data
                  : JSON.stringify(content.content_data, null, 2)}
              </pre>
            </div>
            <Button onClick={() => handleApplyContent(content.content_data)}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Apply Template
            </Button>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generated Content</h3>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                {typeof content.content_data === "string"
                  ? content.content_data
                  : JSON.stringify(content.content_data, null, 2)}
              </pre>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl">{content.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="secondary">{content.content_type.replace("-", " ")}</Badge>
                <Badge
                  variant={content.status === "applied" ? "default" : "outline"}
                  className={
                    content.status === "applied"
                      ? "bg-green-100 text-green-700"
                      : content.status === "generated"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                  }
                >
                  {content.status}
                </Badge>
                <Badge variant="outline">{content.ai_mode}</Badge>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card>
        <CardContent className="p-6">{renderContentViewer()}</CardContent>
      </Card>

      {/* Sidebar Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Rating */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rate This Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`p-1 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Helpful
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <ThumbsDown className="w-4 h-4 mr-1" />
                  Not Helpful
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span>{new Date(content.created_at).toLocaleDateString()}</span>
                </div>
                {content.generation_cost && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost:</span>
                    <span>${content.generation_cost.toFixed(4)}</span>
                  </div>
                )}
                {content.tokens_used && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tokens:</span>
                    <span>{content.tokens_used.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
