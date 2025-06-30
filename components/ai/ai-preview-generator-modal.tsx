"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Eye, Sparkles, Palette, Layout } from "lucide-react"

interface AIPreviewGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (config: any) => Promise<void>
  restaurantData: any
  connectedPlatforms: string[]
}

export default function AIPreviewGeneratorModal({
  isOpen,
  onClose,
  onGenerate,
  restaurantData,
  connectedPlatforms,
}: AIPreviewGeneratorModalProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewType, setPreviewType] = useState("social-media")
  const [platform, setPlatform] = useState("instagram")
  const [style, setStyle] = useState("modern")

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      await onGenerate({
        previewType,
        platform,
        style,
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
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Eye className="w-4 h-4 text-white" />
            </div>
            AI Preview Generator
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Generate social media previews and marketing materials using AI
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

          {/* Preview Type */}
          <div className="space-y-2">
            <Label htmlFor="preview-type" className="text-sm font-medium">
              Preview Type *
            </Label>
            <Select value={previewType} onValueChange={setPreviewType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="social-media">Social Media Post</SelectItem>
                <SelectItem value="business-card">Digital Business Card</SelectItem>
                <SelectItem value="menu-preview">Menu Preview</SelectItem>
                <SelectItem value="story-template">Instagram Story</SelectItem>
                <SelectItem value="cover-photo">Cover Photo Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Platform */}
          <div className="space-y-2">
            <Label htmlFor="platform" className="text-sm font-medium">
              Target Platform
            </Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="google">Google My Business</SelectItem>
                <SelectItem value="zomato">Zomato</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Style */}
          <div className="space-y-2">
            <Label htmlFor="style" className="text-sm font-medium">
              Design Style
            </Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern & Clean</SelectItem>
                <SelectItem value="elegant">Elegant & Sophisticated</SelectItem>
                <SelectItem value="rustic">Rustic & Traditional</SelectItem>
                <SelectItem value="vibrant">Vibrant & Colorful</SelectItem>
                <SelectItem value="minimalist">Minimalist</SelectItem>
                <SelectItem value="luxury">Luxury & Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview Features */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Preview Features</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Layout className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Layout Design</p>
                  <p className="text-xs text-gray-600">Professional layout with your branding</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Palette className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Brand Colors</p>
                  <p className="text-xs text-gray-600">Uses your restaurant's color scheme</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Sparkles className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">AI Content</p>
                  <p className="text-xs text-gray-600">Generated text and descriptions</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Eye className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Platform Optimized</p>
                  <p className="text-xs text-gray-600">Sized for your target platform</p>
                </div>
              </div>
            </div>
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
                  <span className="font-medium text-gray-700">Tagline:</span>
                  <span className="ml-1 text-gray-600">{restaurantData.tagline || "Not set"}</span>
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
            disabled={isGenerating}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            {isGenerating ? "Generating..." : "Generate Preview"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
