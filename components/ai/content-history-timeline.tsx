"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import {
  Clock,
  Eye,
  Download,
  Trash2,
  RefreshCw,
  FileText,
  Utensils,
  Palette,
  CreditCard,
  Calendar,
  Layout,
} from "lucide-react"
import GeneratedContentViewer from "./generated-content-viewer"

interface ContentHistoryTimelineProps {
  menuData?: any
  onContentAction?: (action: string, content: any) => void
}

export default function ContentHistoryTimeline({ menuData, onContentAction }: ContentHistoryTimelineProps) {
  const [contentHistory, setContentHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedContent, setSelectedContent] = useState<any | null>(null)
  const [showViewer, setShowViewer] = useState(false)

  const contentTypeIcons = {
    "item-descriptions": FileText,
    combos: Utensils,
    "menu-design": Palette,
    "item-cards": CreditCard,
    "seasonal-menu": Calendar,
    "menu-templates": Layout,
  }

  const contentTypeColors = {
    "item-descriptions": "bg-green-100 text-green-700",
    combos: "bg-blue-100 text-blue-700",
    "menu-design": "bg-purple-100 text-purple-700",
    "item-cards": "bg-orange-100 text-orange-700",
    "seasonal-menu": "bg-pink-100 text-pink-700",
    "menu-templates": "bg-indigo-100 text-indigo-700",
  }

  useEffect(() => {
    loadContentHistory()
  }, [])

  const loadContentHistory = async () => {
    setIsLoading(true)
    try {
      // Try to load from database first
      const response = await fetch("/api/generated-content")
      if (response.ok) {
        const data = await response.json()
        setContentHistory(data.content || [])
      } else {
        // Fallback to localStorage
        const localContent = JSON.parse(localStorage.getItem("generatedContent") || "[]")
        setContentHistory(localContent)
      }
    } catch (error) {
      console.error("Error loading content history:", error)
      // Fallback to localStorage
      const localContent = JSON.parse(localStorage.getItem("generatedContent") || "[]")
      setContentHistory(localContent)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewContent = (content: any) => {
    setSelectedContent(content)
    setShowViewer(true)
  }

  const handleApplyContent = (content: any, appliedData: any) => {
    onContentAction?.("apply", { ...content, appliedData })

    // Update content status
    const updatedHistory = contentHistory.map((item) =>
      item.id === content.id ? { ...item, status: "applied" } : item,
    )
    setContentHistory(updatedHistory)
    localStorage.setItem("generatedContent", JSON.stringify(updatedHistory))

    setShowViewer(false)
  }

  const handleDeleteContent = async (contentId: string) => {
    try {
      // Try to delete from database
      const response = await fetch(`/api/generated-content/${contentId}`, {
        method: "DELETE",
      })

      if (response.ok || response.status === 404) {
        // Remove from local state and localStorage
        const updatedHistory = contentHistory.filter((item) => item.id !== contentId)
        setContentHistory(updatedHistory)
        localStorage.setItem("generatedContent", JSON.stringify(updatedHistory))

        toast({
          title: "✅ Content Deleted",
          description: "Content has been removed from your history",
        })
      } else {
        throw new Error("Failed to delete content")
      }
    } catch (error) {
      console.error("Error deleting content:", error)
      toast({
        title: "❌ Delete Failed",
        description: "Could not delete content. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadContent = (content: any) => {
    const dataStr = JSON.stringify(content, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${content.content_type}-${content.id}.json`
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "📥 Content Downloaded",
      description: "Content has been saved to your device",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-600">Loading content history...</span>
      </div>
    )
  }

  if (contentHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Content History</h3>
        <p className="text-gray-600 mb-4">Generate some content to see it appear here</p>
        <Button onClick={loadContentHistory} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Content History</h2>
          <p className="text-gray-600">View and manage your generated content</p>
        </div>
        <Button onClick={loadContentHistory} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Content Timeline */}
      <div className="space-y-4">
        {contentHistory.map((content, index) => {
          const Icon = contentTypeIcons[content.content_type as keyof typeof contentTypeIcons] || FileText
          const colorClass =
            contentTypeColors[content.content_type as keyof typeof contentTypeColors] || "bg-gray-100 text-gray-700"

          return (
            <Card key={content.id || index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{content.content_type?.replace("-", " ")}</Badge>
                        <Badge
                          variant={content.status === "applied" ? "default" : "outline"}
                          className={
                            content.status === "applied" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                          }
                        >
                          {content.status || "generated"}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(content.created_at || content.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleViewContent(content)} variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button onClick={() => handleDownloadContent(content)} variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteContent(content.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="font-medium">AI Mode:</span>
                      <span className="ml-1">{content.ai_mode || "openai"}</span>
                    </div>
                    {content.generation_cost && (
                      <div>
                        <span className="font-medium">Cost:</span>
                        <span className="ml-1">${content.generation_cost.toFixed(4)}</span>
                      </div>
                    )}
                    {content.tokens_used && (
                      <div>
                        <span className="font-medium">Tokens:</span>
                        <span className="ml-1">{content.tokens_used.toLocaleString()}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Status:</span>
                      <span className="ml-1 capitalize">{content.status || "generated"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Content Viewer Dialog */}
      <Dialog open={showViewer} onOpenChange={setShowViewer}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Content Viewer</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <GeneratedContentViewer
              content={selectedContent}
              menuData={menuData}
              onApply={handleApplyContent}
              onClose={() => setShowViewer(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
