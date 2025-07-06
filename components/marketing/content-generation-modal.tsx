"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import {
  Sparkles,
  ImageIcon,
  Video,
  FileText,
  QrCode,
  Star,
  Gift,
  MessageSquare,
  Upload,
  Wand2,
  Loader2,
  Download,
  Eye,
} from "lucide-react"

interface ContentType {
  id: string
  name: string
  description: string
  icon: any
  color: string
  requires_upload: boolean
  upload_type?: "image" | "video" | "text"
  templates: string[]
}

interface ContentGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  campaignId?: string
}

export default function ContentGenerationModal({ isOpen, onClose, campaignId }: ContentGenerationModalProps) {
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [customPrompt, setCustomPrompt] = useState<string>("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)

  const contentTypes: ContentType[] = [
    {
      id: "post",
      name: "Social Media Post",
      description: "Instagram/Facebook posts with captions",
      icon: ImageIcon,
      color: "text-pink-600",
      requires_upload: false,
      templates: ["Food Showcase", "Behind the Scenes", "Customer Experience", "Daily Special", "Chef's Choice"],
    },
    {
      id: "reel",
      name: "Reel/Video",
      description: "Short video content for Instagram Reels",
      icon: Video,
      color: "text-purple-600",
      requires_upload: true,
      upload_type: "video",
      templates: ["Cooking Process", "Food Preparation", "Customer Reactions", "Restaurant Tour", "Chef Introduction"],
    },
    {
      id: "story",
      name: "Story",
      description: "Instagram/Facebook stories",
      icon: FileText,
      color: "text-blue-600",
      requires_upload: false,
      templates: ["Daily Updates", "Quick Polls", "Behind the Scenes", "Flash Offers", "Customer Shoutouts"],
    },
    {
      id: "carousel",
      name: "Carousel",
      description: "Multi-image carousel posts",
      icon: ImageIcon,
      color: "text-green-600",
      requires_upload: true,
      upload_type: "image",
      templates: ["Menu Showcase", "Step-by-Step Recipe", "Before/After", "Multiple Dishes", "Restaurant Gallery"],
    },
    {
      id: "qr_code",
      name: "QR Code",
      description: "QR codes for menu, offers, or feedback",
      icon: QrCode,
      color: "text-indigo-600",
      requires_upload: false,
      templates: ["Digital Menu", "Feedback Form", "Special Offers", "Contact Info", "Social Media Links"],
    },
    {
      id: "menu_highlight",
      name: "Menu Highlight",
      description: "Promote specific menu items or categories",
      icon: Star,
      color: "text-yellow-600",
      requires_upload: true,
      upload_type: "image",
      templates: ["Signature Dish", "New Item Launch", "Category Feature", "Chef's Special", "Seasonal Menu"],
    },
    {
      id: "offer_card",
      name: "Offer Card",
      description: "Promotional offers and discounts",
      icon: Gift,
      color: "text-red-600",
      requires_upload: false,
      templates: ["Percentage Discount", "Buy One Get One", "Festival Special", "Happy Hours", "Combo Offers"],
    },
    {
      id: "testimonial",
      name: "Testimonial",
      description: "Customer testimonials and reviews",
      icon: MessageSquare,
      color: "text-teal-600",
      requires_upload: true,
      upload_type: "image",
      templates: ["Review Highlight", "Customer Story", "Rating Showcase", "Experience Share", "Recommendation"],
    },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleGenerate = async () => {
    if (!selectedType || !selectedTemplate) {
      toast({
        title: "Missing Information",
        description: "Please select content type and template",
        variant: "destructive",
      })
      return
    }

    const selectedContentType = contentTypes.find((ct) => ct.id === selectedType)
    if (selectedContentType?.requires_upload && !uploadedFile) {
      toast({
        title: "Upload Required",
        description: `Please upload a ${selectedContentType.upload_type} for this content type`,
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const formData = new FormData()
      formData.append("content_type", selectedType)
      formData.append("template", selectedTemplate)
      formData.append("custom_prompt", customPrompt)
      if (campaignId) formData.append("campaign_id", campaignId)
      if (uploadedFile) formData.append("file", uploadedFile)

      const response = await fetch("/api/marketing/content/generate", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedContent(data.content)
        toast({
          title: "Content Generated!",
          description: "Your marketing content has been created successfully",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (generatedContent) {
      // Create download logic based on content type
      const blob = new Blob([JSON.stringify(generatedContent, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${selectedType}_${selectedTemplate}_${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const resetForm = () => {
    setSelectedType("")
    setSelectedTemplate("")
    setCustomPrompt("")
    setUploadedFile(null)
    setGeneratedContent(null)
  }

  const selectedContentType = contentTypes.find((ct) => ct.id === selectedType)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Sparkles className="w-6 h-6 mr-3 text-purple-600" />
            AI Content Generation
          </DialogTitle>
          <DialogDescription>Generate professional marketing content for your restaurant with AI</DialogDescription>
        </DialogHeader>

        {!generatedContent ? (
          <div className="space-y-6">
            {/* Content Type Selection */}
            <div>
              <Label className="text-base font-medium mb-4 block">Select Content Type</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {contentTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedType === type.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => {
                      setSelectedType(type.id)
                      setSelectedTemplate("")
                    }}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <type.icon className={`w-6 h-6 ${type.color}`} />
                      <div className="font-medium text-sm">{type.name}</div>
                      <div className="text-xs text-slate-600">{type.description}</div>
                      {type.requires_upload && (
                        <Badge variant="outline" className="text-xs">
                          Requires {type.upload_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Template Selection */}
            {selectedType && selectedContentType && (
              <div>
                <Label className="text-base font-medium mb-3 block">Choose Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedContentType.templates.map((template) => (
                      <SelectItem key={template} value={template}>
                        {template}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* File Upload */}
            {selectedContentType?.requires_upload && (
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Upload {selectedContentType.upload_type?.toUpperCase()}
                </Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="text-sm text-slate-600 mb-2">Upload your {selectedContentType.upload_type} file</div>
                  <input
                    type="file"
                    accept={
                      selectedContentType.upload_type === "image"
                        ? "image/*"
                        : selectedContentType.upload_type === "video"
                          ? "video/*"
                          : "*/*"
                    }
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" className="bg-transparent" asChild>
                      <span>Choose File</span>
                    </Button>
                  </Label>
                  {uploadedFile && <div className="mt-2 text-sm text-green-600">✓ {uploadedFile.name} uploaded</div>}
                </div>
              </div>
            )}

            {/* Custom Prompt */}
            <div>
              <Label htmlFor="custom-prompt" className="text-base font-medium mb-3 block">
                Additional Instructions (Optional)
              </Label>
              <Textarea
                id="custom-prompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Any specific requirements, style preferences, or additional context..."
                rows={3}
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedType || !selectedTemplate}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate AI Content
                </>
              )}
            </Button>
          </div>
        ) : (
          /* Generated Content Display */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Content</h3>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleDownload} size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" onClick={resetForm} size="sm">
                  <Wand2 className="w-4 h-4 mr-1" />
                  Generate New
                </Button>
              </div>
            </div>

            {/* Content Preview */}
            <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
              <div className="space-y-4">
                {generatedContent.title && (
                  <div>
                    <Label className="font-medium text-slate-700">Title</Label>
                    <div className="mt-1 p-3 bg-white rounded border">{generatedContent.title}</div>
                  </div>
                )}

                {generatedContent.caption && (
                  <div>
                    <Label className="font-medium text-slate-700">Caption</Label>
                    <div className="mt-1 p-3 bg-white rounded border whitespace-pre-wrap">
                      {generatedContent.caption}
                    </div>
                  </div>
                )}

                {generatedContent.hashtags && (
                  <div>
                    <Label className="font-medium text-slate-700">Hashtags</Label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {generatedContent.hashtags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {generatedContent.call_to_action && (
                  <div>
                    <Label className="font-medium text-slate-700">Call to Action</Label>
                    <div className="mt-1 p-3 bg-white rounded border">{generatedContent.call_to_action}</div>
                  </div>
                )}

                {generatedContent.image_url && (
                  <div>
                    <Label className="font-medium text-slate-700">Generated Image</Label>
                    <div className="mt-1">
                      <img
                        src={generatedContent.image_url || "/placeholder.svg"}
                        alt="Generated content"
                        className="max-w-full h-auto rounded border"
                      />
                    </div>
                  </div>
                )}

                {generatedContent.qr_code && (
                  <div>
                    <Label className="font-medium text-slate-700">QR Code</Label>
                    <div className="mt-1">
                      <img
                        src={generatedContent.qr_code || "/placeholder.svg"}
                        alt="Generated QR Code"
                        className="w-48 h-48 border rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                <Eye className="w-4 h-4 mr-2" />
                Preview on Platform
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Schedule Post
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Save to Library
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
