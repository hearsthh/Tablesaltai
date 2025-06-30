"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Eye,
  Palette,
  Layout,
  Loader2,
  CheckCircle,
  X,
  Sparkles,
  Monitor,
  Smartphone,
  Tablet,
  Share2,
  ExternalLink,
  Star,
  Users,
  MapPin,
  Clock,
  Phone,
  Camera,
  ThumbsUp,
} from "lucide-react"
import RestaurantListingPage from "@/components/restaurant-listing-page"

interface AISocialProfilePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (config: any) => Promise<void>
  restaurantData: any
  connectedPlatforms: string[]
}

export default function AISocialProfilePreviewModal({
  isOpen,
  onClose,
  onGenerate,
  restaurantData,
  connectedPlatforms,
}: AISocialProfilePreviewModalProps) {
  const [activeStep, setActiveStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [selectedSections, setSelectedSections] = useState([
    "hero",
    "about",
    "menu-highlights",
    "reviews",
    "gallery",
    "contact",
    "hours",
  ])
  const [customPrompt, setCustomPrompt] = useState("")
  const [previewConfig, setPreviewConfig] = useState({
    colorScheme: "brand",
    layout: "single-page",
    includeReviews: true,
    includeGallery: true,
    includeMap: true,
    language: "english",
    devicePreview: "desktop",
  })
  const [generatedPreview, setGeneratedPreview] = useState<any>(null)

  const templates = [
    {
      id: "modern",
      name: "Modern & Clean",
      description: "Clean design with modern typography and spacing",
      preview: "/placeholder.svg?height=200&width=300&text=Modern+Template",
      features: ["Minimalist design", "Large hero section", "Card-based layout"],
    },
    {
      id: "elegant",
      name: "Elegant & Sophisticated",
      description: "Sophisticated design for fine dining establishments",
      preview: "/placeholder.svg?height=200&width=300&text=Elegant+Template",
      features: ["Elegant typography", "Rich colors", "Premium feel"],
    },
    {
      id: "casual",
      name: "Casual & Friendly",
      description: "Warm and inviting design for casual dining",
      preview: "/placeholder.svg?height=200&width=300&text=Casual+Template",
      features: ["Warm colors", "Friendly layout", "Approachable design"],
    },
    {
      id: "traditional",
      name: "Traditional & Authentic",
      description: "Classic design that emphasizes heritage and tradition",
      preview: "/placeholder.svg?height=200&width=300&text=Traditional+Template",
      features: ["Classic elements", "Heritage colors", "Traditional layout"],
    },
  ]

  const availableSections = [
    { id: "hero", name: "Hero Section", description: "Main banner with restaurant name and tagline", icon: Star },
    { id: "about", name: "About Us", description: "Restaurant story and concept", icon: Users },
    { id: "menu-highlights", name: "Menu Highlights", description: "Featured dishes and specialties", icon: Star },
    { id: "reviews", name: "Customer Reviews", description: "AI-summarized reviews and ratings", icon: ThumbsUp },
    { id: "gallery", name: "Photo Gallery", description: "Restaurant and food photos", icon: Camera },
    { id: "contact", name: "Contact Info", description: "Address, phone, and social media", icon: Phone },
    { id: "hours", name: "Operating Hours", description: "Business hours and availability", icon: Clock },
    { id: "location", name: "Location & Map", description: "Interactive map and directions", icon: MapPin },
    { id: "amenities", name: "Features & Amenities", description: "Dining options and facilities", icon: Star },
    { id: "offers", name: "Special Offers", description: "Current promotions and deals", icon: Star },
  ]

  const generationSteps = [
    { name: "Analyzing restaurant data", progress: 15 },
    { name: "Generating listing structure", progress: 30 },
    { name: "Creating content sections", progress: 50 },
    { name: "Applying responsive design", progress: 70 },
    { name: "Optimizing for all devices", progress: 85 },
    { name: "Finalizing listing page", progress: 100 },
  ]

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const handleGenerate = async () => {
    if (selectedSections.length === 0) {
      toast({
        title: "Select Sections",
        description: "Please select at least one section for the preview.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setActiveStep(3)

    try {
      // Simulate generation steps
      for (let i = 0; i < generationSteps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setGenerationProgress(generationSteps[i].progress)
      }

      const config = {
        selectedTemplate,
        selectedSections,
        customPrompt,
        previewConfig,
        restaurantData,
        connectedPlatforms,
      }

      // Generate mock preview data
      const mockPreview = {
        id: Date.now(),
        template: selectedTemplate,
        sections: selectedSections,
        url: `https://preview.tablesalt.ai/${restaurantData.restaurantName?.toLowerCase().replace(/\s+/g, "-") || "restaurant"}`,
        generatedAt: new Date().toISOString(),
        config: previewConfig,
      }

      setGeneratedPreview(mockPreview)
      await onGenerate(config)
      setActiveStep(4)
    } catch (error) {
      console.error("Preview generation failed:", error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate preview. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  const steps = [
    { id: 1, title: "Choose Template", icon: Layout },
    { id: 2, title: "Configure", icon: Palette },
    { id: 3, title: "Generating", icon: Sparkles },
    { id: 4, title: "Preview Ready", icon: Eye },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] w-[95vw] flex flex-col bg-white overflow-hidden">
        <DialogHeader className="border-b border-gray-200 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-black flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                Restaurant Listing Preview
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Generate a complete restaurant listing page that can be published and shared
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
              <X className="w-4 h-4 text-gray-600" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    activeStep >= step.id ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {activeStep > step.id ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                </div>
                <span className={`ml-2 text-xs font-medium ${activeStep >= step.id ? "text-black" : "text-gray-600"}`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-3 ${activeStep > step.id ? "bg-black" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Choose Template */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Choose Design Template</h3>
                <p className="text-sm text-gray-600">
                  Select a design template that matches your restaurant's style and brand
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedTemplate === template.id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <img
                          src={template.preview || "/placeholder.svg"}
                          alt={template.name}
                          className="w-full h-32 object-cover rounded border border-gray-200"
                        />
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-black">{template.name}</h4>
                            {selectedTemplate === template.id && <CheckCircle className="w-4 h-4 text-black" />}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {template.features.map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Configure */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Configure Preview</h3>
                <p className="text-sm text-gray-600">Select sections to include and customize the preview settings</p>
              </div>

              {/* Sections Selection */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-black">Select Sections to Include</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableSections.map((section) => (
                    <Card
                      key={section.id}
                      className={`border cursor-pointer transition-all duration-200 ${
                        selectedSections.includes(section.id)
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleSectionToggle(section.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <section.icon className="w-5 h-5 text-gray-600" />
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-black">{section.name}</h5>
                            <p className="text-xs text-gray-600">{section.description}</p>
                          </div>
                          {selectedSections.includes(section.id) && <CheckCircle className="w-4 h-4 text-black" />}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Preview Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-black">Design Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-black">Color Scheme</Label>
                      <Select
                        value={previewConfig.colorScheme}
                        onValueChange={(value) => setPreviewConfig({ ...previewConfig, colorScheme: value })}
                      >
                        <SelectTrigger className="border-gray-300 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brand">Use Brand Colors</SelectItem>
                          <SelectItem value="neutral">Neutral Colors</SelectItem>
                          <SelectItem value="warm">Warm Colors</SelectItem>
                          <SelectItem value="cool">Cool Colors</SelectItem>
                          <SelectItem value="vibrant">Vibrant Colors</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-black">Layout Style</Label>
                      <Select
                        value={previewConfig.layout}
                        onValueChange={(value) => setPreviewConfig({ ...previewConfig, layout: value })}
                      >
                        <SelectTrigger className="border-gray-300 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single-page">Single Page</SelectItem>
                          <SelectItem value="multi-section">Multi-Section</SelectItem>
                          <SelectItem value="card-based">Card-Based</SelectItem>
                          <SelectItem value="grid-layout">Grid Layout</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-black">Device Preview</Label>
                      <Select
                        value={previewConfig.devicePreview}
                        onValueChange={(value) => setPreviewConfig({ ...previewConfig, devicePreview: value })}
                      >
                        <SelectTrigger className="border-gray-300 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="desktop">Desktop</SelectItem>
                          <SelectItem value="tablet">Tablet</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-black">Content Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-black">Language</Label>
                      <Select
                        value={previewConfig.language}
                        onValueChange={(value) => setPreviewConfig({ ...previewConfig, language: value })}
                      >
                        <SelectTrigger className="border-gray-300 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="bilingual">Bilingual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs text-black">Include Features</Label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={previewConfig.includeReviews}
                            onChange={(e) => setPreviewConfig({ ...previewConfig, includeReviews: e.target.checked })}
                            className="rounded border-gray-300"
                          />
                          <span className="text-xs text-black">Customer Reviews & Ratings</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={previewConfig.includeGallery}
                            onChange={(e) => setPreviewConfig({ ...previewConfig, includeGallery: e.target.checked })}
                            className="rounded border-gray-300"
                          />
                          <span className="text-xs text-black">Photo Gallery</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={previewConfig.includeMap}
                            onChange={(e) => setPreviewConfig({ ...previewConfig, includeMap: e.target.checked })}
                            className="rounded border-gray-300"
                          />
                          <span className="text-xs text-black">Interactive Map</span>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Custom Prompt */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-black flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Custom Design Instructions
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-600">
                    Provide specific instructions for the preview design and content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g., Make it look premium and elegant, highlight our signature dishes, use warm colors that reflect our cozy atmosphere, emphasize family-friendly environment..."
                    rows={3}
                    className="border-gray-300 text-sm"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Generating */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Generating Preview</h3>
                <p className="text-sm text-gray-600">
                  AI is creating your social profile preview with the selected template and settings
                </p>
              </div>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-black">Generation Progress</span>
                      <span className="text-sm text-gray-600">{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="h-2" />

                    <div className="space-y-3">
                      {generationSteps.map((step, index) => {
                        const isCompleted = generationProgress >= step.progress
                        const isActive =
                          generationProgress >= (index > 0 ? generationSteps[index - 1].progress : 0) &&
                          generationProgress < step.progress

                        return (
                          <div key={index} className="flex items-center space-x-3">
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : isActive ? (
                              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                            ) : (
                              <div className="w-4 h-4 border border-gray-300 rounded-full" />
                            )}
                            <span
                              className={`text-sm ${isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-600"}`}
                            >
                              {step.name}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generation Summary */}
              <Card className="bg-gray-50 border border-gray-200">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-black mb-3">Generation Summary</h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <p>
                      <strong>Template:</strong> {templates.find((t) => t.id === selectedTemplate)?.name}
                    </p>
                    <p>
                      <strong>Sections:</strong> {selectedSections.length} sections selected
                    </p>
                    <p>
                      <strong>Settings:</strong> {previewConfig.colorScheme} colors, {previewConfig.layout} layout,{" "}
                      {previewConfig.devicePreview} preview
                    </p>
                    {customPrompt && (
                      <p>
                        <strong>Custom Instructions:</strong> {customPrompt.substring(0, 100)}
                        {customPrompt.length > 100 ? "..." : ""}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Preview Ready */}
          {activeStep === 4 && generatedPreview && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Preview Generated Successfully!</h3>
                <p className="text-sm text-gray-600">
                  Your social profile preview is ready. You can view, share, or publish it.
                </p>
              </div>

              {/* Preview Card */}
              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Preview Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-black">
                          {restaurantData.restaurantName || "Your Restaurant"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {restaurantData.tagline || "Delicious food, great atmosphere"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-gray-300 hover:bg-gray-50 bg-transparent"
                        >
                          <Monitor className="w-3 h-3 mr-1" />
                          Desktop
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-gray-300 hover:bg-gray-50 bg-transparent"
                        >
                          <Tablet className="w-3 h-3 mr-1" />
                          Tablet
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-gray-300 hover:bg-gray-50 bg-transparent"
                        >
                          <Smartphone className="w-3 h-3 mr-1" />
                          Mobile
                        </Button>
                      </div>
                    </div>

                    {/* Live Preview */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <div className="h-96 overflow-y-auto">
                        <div className="transform scale-50 origin-top-left w-[200%] h-[200%]">
                          <RestaurantListingPage restaurantData={restaurantData} />
                        </div>
                      </div>
                    </div>

                    {/* Preview Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-black">Preview Details</h5>
                        <div className="space-y-1 text-xs text-gray-600">
                          <p>
                            <strong>Template:</strong> {templates.find((t) => t.id === selectedTemplate)?.name}
                          </p>
                          <p>
                            <strong>Sections:</strong> {selectedSections.length} included
                          </p>
                          <p>
                            <strong>Generated:</strong> {new Date(generatedPreview.generatedAt).toLocaleString()}
                          </p>
                          <p>
                            <strong>URL:</strong> <span className="text-blue-600">{generatedPreview.url}</span>
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-black">Included Sections</h5>
                        <div className="flex flex-wrap gap-1">
                          {selectedSections.map((sectionId) => {
                            const section = availableSections.find((s) => s.id === sectionId)
                            return (
                              <Badge key={sectionId} variant="outline" className="text-xs">
                                {section?.name}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-center space-x-3 pt-4">
                      <Button
                        variant="outline"
                        className="text-xs border-gray-300 hover:bg-gray-50 bg-transparent"
                        onClick={() => {
                          // Open preview in new window
                          const previewWindow = window.open("", "_blank", "width=1200,height=800")
                          if (previewWindow) {
                            previewWindow.document.write(`
                              <!DOCTYPE html>
                              <html>
                                <head>
                                  <title>${restaurantData.restaurantName || "Restaurant"} - TableSalt AI</title>
                                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                  <script src="https://cdn.tailwindcss.com"></script>
                                </head>
                                <body>
                                  <div id="preview-root">Loading preview...</div>
                                  <script>
                                    // This would render the full preview
                                    document.getElementById('preview-root').innerHTML = '<div class="p-8 text-center">Preview will load here in production</div>';
                                  </script>
                                </body>
                              </html>
                            `)
                          }
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        <span className="text-black">Open Full Preview</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="text-xs border-gray-300 hover:bg-gray-50 bg-transparent"
                        onClick={() => {
                          const shareUrl = `https://tablesalt.ai/restaurant-listing/${restaurantData.restaurantName?.toLowerCase().replace(/\s+/g, "-") || "restaurant"}`
                          navigator.clipboard.writeText(shareUrl)
                          toast({
                            title: "Link Copied!",
                            description: "Share link has been copied to clipboard",
                          })
                        }}
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        <span className="text-black">Copy Share Link</span>
                      </Button>
                      <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Publish Listing
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Success Message */}
              <Card className="bg-green-50 border border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="text-sm font-medium text-green-900">Restaurant Listing Generated!</h4>
                      <p className="text-xs text-green-700 mt-1">
                        Your restaurant listing page has been generated and is ready to publish. It will be available at
                        a custom TableSalt AI URL that you can share with customers.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {activeStep > 1 && activeStep < 3 && (
                <Button
                  variant="outline"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="text-xs border-gray-300 hover:bg-gray-50"
                >
                  Previous
                </Button>
              )}
              {activeStep === 4 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveStep(1)
                    setGeneratedPreview(null)
                  }}
                  className="text-xs border-gray-300 hover:bg-gray-50"
                >
                  Generate New Preview
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {activeStep < 2 ? (
                <Button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="bg-black hover:bg-gray-800 text-white text-xs"
                >
                  Next Step
                </Button>
              ) : activeStep === 2 ? (
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || selectedSections.length === 0}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 mr-1" />
                      Generate Preview
                    </>
                  )}
                </Button>
              ) : activeStep === 4 ? (
                <Button onClick={onClose} className="bg-black hover:bg-gray-800 text-white text-xs">
                  Done
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
