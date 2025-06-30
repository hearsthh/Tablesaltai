"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileText, Wand2 } from "lucide-react"

interface AIContentGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (config: any) => Promise<void>
  restaurantData: any
  connectedPlatforms: string[]
  currentTab: string
}

export default function AIContentGeneratorModal({
  isOpen,
  onClose,
  onGenerate,
  restaurantData,
  connectedPlatforms,
  currentTab,
}: AIContentGeneratorModalProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [targetField, setTargetField] = useState("")
  const [contentType, setContentType] = useState("professional")
  const [customPrompt, setCustomPrompt] = useState("")

  // Field options based on current tab
  const getFieldOptions = () => {
    switch (currentTab) {
      case "basic":
        return [
          { value: "tagline", label: "Restaurant Tagline" },
          { value: "description", label: "Restaurant Description" },
        ]
      case "brand":
        return [
          { value: "brandStory", label: "Brand Story" },
          { value: "mission", label: "Mission Statement" },
          { value: "vision", label: "Vision Statement" },
        ]
      case "profile":
        return [
          { value: "about", label: "About Restaurant" },
          { value: "concept", label: "Restaurant Concept" },
          { value: "philosophy", label: "Culinary Philosophy" },
          { value: "chefBackground", label: "Chef Background" },
        ]
      case "marketing":
        return [
          { value: "valueProposition", label: "Value Proposition" },
          { value: "uniqueSellingPoints", label: "Unique Selling Points" },
        ]
      default:
        return [{ value: "general", label: "General Content" }]
    }
  }

  const handleGenerate = async () => {
    if (!targetField) return

    setIsGenerating(true)
    try {
      await onGenerate({
        targetField,
        contentType,
        customPrompt,
        restaurantData,
        connectedPlatforms,
      })
      onClose()
    } catch (error) {
      console.error("Generation failed:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-4 h-4 text-white" />
            </div>
            AI Content Generator
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Generate professional content for your restaurant profile using AI
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Connected Platforms */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Connected Platforms</Label>
              <Badge className="bg-black text-white text-xs">{connectedPlatforms.length}</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {connectedPlatforms.map((platform) => (
                <Badge key={platform} variant="outline" className="text-xs">
                  {platform}
                </Badge>
              ))}
            </div>
          </div>

          {/* Target Field */}
          <div className="space-y-2">
            <Label htmlFor="target-field" className="text-sm font-medium">
              Content Field *
            </Label>
            <Select value={targetField} onValueChange={setTargetField}>
              <SelectTrigger>
                <SelectValue placeholder="Select field to generate content for" />
              </SelectTrigger>
              <SelectContent>
                {getFieldOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content Type */}
          <div className="space-y-2">
            <Label htmlFor="content-type" className="text-sm font-medium">
              Writing Style
            </Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional & Polished</SelectItem>
                <SelectItem value="friendly">Warm & Friendly</SelectItem>
                <SelectItem value="casual">Casual & Approachable</SelectItem>
                <SelectItem value="elegant">Elegant & Sophisticated</SelectItem>
                <SelectItem value="modern">Modern & Trendy</SelectItem>
                <SelectItem value="traditional">Traditional & Authentic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Prompt */}
          <div className="space-y-2">
            <Label htmlFor="custom-prompt" className="text-sm font-medium">
              Additional Instructions (Optional)
            </Label>
            <Textarea
              id="custom-prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Any specific requirements or style preferences..."
              rows={3}
              className="text-sm"
            />
          </div>

          {/* Restaurant Context */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Restaurant Context</Label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-1 text-gray-600">{restaurantData.restaurantName || "Not set"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Cuisine:</span>
                  <span className="ml-1 text-gray-600">{restaurantData.cuisine || "Not set"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="ml-1 text-gray-600">{restaurantData.restaurantType || "Not set"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Price:</span>
                  <span className="ml-1 text-gray-600">{restaurantData.priceRange || "Not set"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1 text-sm bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!targetField || isGenerating}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-sm"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
            {isGenerating ? "Generating..." : "Generate Content"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
