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
import {
  Sparkles,
  Wand2,
  Brain,
  Loader2,
  CheckCircle,
  X,
  Lightbulb,
  Globe,
  Users,
  Heart,
  Star,
  Camera,
  FileText,
  Zap,
} from "lucide-react"

interface AIProfileGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (config: any) => Promise<void>
  restaurantData: any
  connectedPlatforms: string[]
}

export default function AIProfileGeneratorModal({
  isOpen,
  onClose,
  onGenerate,
  restaurantData,
  connectedPlatforms,
}: AIProfileGeneratorModalProps) {
  const [activeStep, setActiveStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([])
  const [customPrompt, setCustomPrompt] = useState("")
  const [generationConfig, setGenerationConfig] = useState({
    language: "english",
    tone: "professional",
    style: "modern",
    focus: "comprehensive",
    includeMedia: true,
    includeBranding: true,
    includeAnalytics: true,
  })

  const suggestedPrompts = [
    {
      id: "complete-profile",
      title: "Complete Restaurant Profile",
      description: "Generate comprehensive profile with all sections",
      icon: FileText,
      gradient: "from-cyan-500 to-blue-600", // Analysis gradient
      category: "comprehensive",
    },
    {
      id: "brand-identity",
      title: "Brand Identity & Story",
      description: "Focus on brand story, values, and positioning",
      icon: Heart,
      gradient: "from-cyan-500 to-blue-600", // Content generation gradient
      category: "branding",
    },
    {
      id: "customer-focused",
      title: "Customer-Centric Profile",
      description: "Highlight customer experience and testimonials",
      icon: Users,
      gradient: "from-orange-500 to-red-600", // Automation gradient
      category: "customer",
    },
    {
      id: "premium-dining",
      title: "Premium Dining Experience",
      description: "Emphasize quality, ambiance, and fine dining",
      icon: Star,
      gradient: "from-cyan-500 to-blue-600", // Analysis gradient
      category: "premium",
    },
    {
      id: "local-favorite",
      title: "Local Community Favorite",
      description: "Focus on local connections and community",
      icon: Globe,
      gradient: "from-cyan-500 to-blue-600", // Content generation gradient
      category: "local",
    },
    {
      id: "visual-showcase",
      title: "Visual & Media Rich",
      description: "Emphasize photos, videos, and visual content",
      icon: Camera,
      gradient: "from-orange-500 to-red-600", // Automation gradient
      category: "visual",
    },
  ]

  const aiCapabilities = [
    {
      title: "Smart Analysis",
      description: "AI analyzes your data to provide actionable insights",
      icon: Brain,
      gradient: "from-cyan-500 to-blue-600", // Analysis gradient
      features: ["Review sentiment analysis", "Popular menu items", "Customer demographics", "Peak hours"],
    },
    {
      title: "Content Generation",
      description: "Generate compelling content for all profile sections",
      icon: Sparkles,
      gradient: "from-cyan-500 to-blue-600", // Content generation gradient
      features: ["About us section", "Brand story", "Menu descriptions", "Value propositions"],
    },
    {
      title: "Process Automation",
      description: "Automate profile updates and optimizations",
      icon: Zap,
      gradient: "from-orange-500 to-red-600", // Automation gradient
      features: ["Auto-sync platform data", "Dynamic content updates", "Performance optimization", "A/B testing"],
    },
  ]

  const handlePromptToggle = (promptId: string) => {
    setSelectedPrompts((prev) => (prev.includes(promptId) ? prev.filter((id) => id !== promptId) : [...prev, promptId]))
  }

  const handleGenerate = async () => {
    if (selectedPrompts.length === 0 && !customPrompt.trim()) {
      toast({
        title: "Selection Required",
        description: "Please select at least one prompt or enter a custom prompt.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const config = {
        selectedPrompts,
        customPrompt,
        generationConfig,
        restaurantData,
        connectedPlatforms,
      }

      await onGenerate(config)
      onClose()
    } catch (error) {
      console.error("Generation failed:", error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const steps = [
    { id: 1, title: "AI Capabilities", icon: Brain },
    { id: 2, title: "Select Prompts", icon: Lightbulb },
    { id: 3, title: "Customize", icon: Wand2 },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-white">
        <DialogHeader className="border-b border-gray-200 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-black flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                AI Profile Generator
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Create a comprehensive restaurant profile using AI analysis and generation
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
          {/* Step 1: AI Capabilities */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">AI-Powered Profile Creation</h3>
                <p className="text-sm text-gray-600">
                  Our AI will analyze your connected platforms and generate a comprehensive profile
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiCapabilities.map((capability, index) => (
                  <Card key={index} className="border border-gray-200 hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${capability.gradient} rounded-lg flex items-center justify-center mb-3`}
                      >
                        <capability.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-base text-black">{capability.title}</CardTitle>
                      <CardDescription className="text-xs text-gray-600">{capability.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {capability.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-xs text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-600 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Connected Platforms Info */}
              <Card className="bg-gray-50 border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-black">Connected Platforms</h4>
                    <Badge className="bg-black text-white text-xs">{connectedPlatforms.length} Connected</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {connectedPlatforms.length > 0 ? (
                      connectedPlatforms.map((platform) => (
                        <Badge key={platform} variant="outline" className="text-xs border-gray-300">
                          {platform}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-gray-600">
                        No platforms connected. Connect platforms for better AI analysis.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Select Prompts */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Choose Generation Focus</h3>
                <p className="text-sm text-gray-600">Select one or more prompts to guide the AI generation process</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedPrompts.map((prompt) => (
                  <Card
                    key={prompt.id}
                    className={`border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedPrompts.includes(prompt.id)
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePromptToggle(prompt.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${prompt.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                          <prompt.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-black mb-1">{prompt.title}</h4>
                          <p className="text-xs text-gray-600">{prompt.description}</p>
                        </div>
                        {selectedPrompts.includes(prompt.id) && (
                          <CheckCircle className="w-5 h-5 text-black flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Custom Prompt */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-black flex items-center">
                    <Wand2 className="w-4 h-4 mr-2" />
                    Custom Prompt
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-600">
                    Describe specific requirements for your profile generation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g., Focus on family-friendly atmosphere, highlight vegetarian options, emphasize local sourcing..."
                    rows={3}
                    className="border-gray-300 text-sm"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Customize */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Customize Generation</h3>
                <p className="text-sm text-gray-600">Fine-tune the AI generation settings for your profile</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-black">Content Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-black">Language</Label>
                      <Select
                        value={generationConfig.language}
                        onValueChange={(value) => setGenerationConfig({ ...generationConfig, language: value })}
                      >
                        <SelectTrigger className="border-gray-300 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="bilingual">Bilingual (English + Hindi)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-black">Tone</Label>
                      <Select
                        value={generationConfig.tone}
                        onValueChange={(value) => setGenerationConfig({ ...generationConfig, tone: value })}
                      >
                        <SelectTrigger className="border-gray-300 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly & Warm</SelectItem>
                          <SelectItem value="casual">Casual & Fun</SelectItem>
                          <SelectItem value="elegant">Elegant & Sophisticated</SelectItem>
                          <SelectItem value="traditional">Traditional & Authentic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-black">Style</Label>
                      <Select
                        value={generationConfig.style}
                        onValueChange={(value) => setGenerationConfig({ ...generationConfig, style: value })}
                      >
                        <SelectTrigger className="border-gray-300 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">Modern & Contemporary</SelectItem>
                          <SelectItem value="classic">Classic & Timeless</SelectItem>
                          <SelectItem value="trendy">Trendy & Hip</SelectItem>
                          <SelectItem value="rustic">Rustic & Homely</SelectItem>
                          <SelectItem value="luxury">Luxury & Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-black">Generation Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-black">Focus Area</Label>
                      <Select
                        value={generationConfig.focus}
                        onValueChange={(value) => setGenerationConfig({ ...generationConfig, focus: value })}
                      >
                        <SelectTrigger className="border-gray-300 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="comprehensive">Comprehensive Profile</SelectItem>
                          <SelectItem value="branding">Brand & Identity Focus</SelectItem>
                          <SelectItem value="customer">Customer Experience Focus</SelectItem>
                          <SelectItem value="menu">Menu & Food Focus</SelectItem>
                          <SelectItem value="location">Location & Ambiance Focus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs text-black">Include Features</Label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={generationConfig.includeMedia}
                            onChange={(e) =>
                              setGenerationConfig({ ...generationConfig, includeMedia: e.target.checked })
                            }
                            className="rounded border-gray-300"
                          />
                          <span className="text-xs text-black">Media & Visual Content</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={generationConfig.includeBranding}
                            onChange={(e) =>
                              setGenerationConfig({ ...generationConfig, includeBranding: e.target.checked })
                            }
                            className="rounded border-gray-300"
                          />
                          <span className="text-xs text-black">Brand Assets & Colors</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={generationConfig.includeAnalytics}
                            onChange={(e) =>
                              setGenerationConfig({ ...generationConfig, includeAnalytics: e.target.checked })
                            }
                            className="rounded border-gray-300"
                          />
                          <span className="text-xs text-black">Analytics & Insights</span>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Generation Summary */}
              <Card className="bg-gray-50 border border-gray-200">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-black mb-3">Generation Summary</h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <p>
                      <strong>Selected Prompts:</strong>{" "}
                      {selectedPrompts.length > 0
                        ? selectedPrompts.map((id) => suggestedPrompts.find((p) => p.id === id)?.title).join(", ")
                        : "None"}
                    </p>
                    {customPrompt && (
                      <p>
                        <strong>Custom Prompt:</strong> {customPrompt.substring(0, 100)}
                        {customPrompt.length > 100 ? "..." : ""}
                      </p>
                    )}
                    <p>
                      <strong>Settings:</strong> {generationConfig.language} language, {generationConfig.tone} tone,{" "}
                      {generationConfig.style} style
                    </p>
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
              {activeStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="text-xs border-gray-300 hover:bg-gray-50"
                >
                  Previous
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {activeStep < 3 ? (
                <Button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="bg-black hover:bg-gray-800 text-white text-xs"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || (selectedPrompts.length === 0 && !customPrompt.trim())}
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
                      Generate Profile
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
