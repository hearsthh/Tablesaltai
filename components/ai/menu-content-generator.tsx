"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Utensils, FileText, Palette, Calendar, Zap, Coffee, Sparkles } from "lucide-react"
import ItemDescriptionsModal from "@/components/ai/item-descriptions-modal"

interface MenuContentGeneratorProps {
  menuData: any
  onContentGenerated?: (content: any) => void
  onContentApplied?: (content: any, appliedData: any) => void
}

export default function MenuContentGenerator({
  menuData,
  onContentGenerated,
  onContentApplied,
}: MenuContentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState<string | null>(null)
  const [showItemDescriptionsModal, setShowItemDescriptionsModal] = useState(false)

  const contentTypes = [
    {
      id: "combos",
      title: "Combo Meals",
      description: "AI-generated combo suggestions based on popular pairings",
      icon: Utensils,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      estimatedTime: "2-3 min",
      features: ["Popular pairings", "Optimal pricing", "Profit margins"],
    },
    {
      id: "item-descriptions",
      title: "Item Descriptions & Tags",
      description: "Enhanced descriptions with taste tags and promotional tags",
      icon: FileText,
      color: "bg-green-50 text-green-600 border-green-200",
      estimatedTime: "3-4 min",
      features: ["SEO optimized", "Taste tags", "Promotional tags", "Appetizing language"],
    },
    {
      id: "menu-design",
      title: "Menu Templates & Design",
      description: "Complete menu templates with customizable design elements",
      icon: Palette,
      color: "bg-purple-50 text-purple-600 border-purple-200",
      estimatedTime: "5-7 min",
      features: ["Multiple templates", "Customizable design", "Brand aligned", "Print ready"],
    },
    {
      id: "seasonal-menu",
      title: "Seasonal Menu",
      description: "Seasonal variations and limited-time offerings",
      icon: Calendar,
      color: "bg-pink-50 text-pink-600 border-pink-200",
      estimatedTime: "4-5 min",
      features: ["Seasonal ingredients", "Holiday themes", "Limited time offers"],
    },
  ]

  const handleGenerate = async (contentType: any) => {
    if (!menuData || !menuData.categories?.length) {
      toast({
        title: "❌ No Menu Data",
        description: "Please upload and extract your menu first",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(contentType.id)
    try {
      let endpoint = ""
      let payload: any = { menuData }

      // Map content types to API endpoints
      switch (contentType.id) {
        case "combos":
          endpoint = "/api/ai/generate-combos"
          break
        case "item-descriptions":
          // Open the modal instead of direct API call
          setShowItemDescriptionsModal(true)
          setIsGenerating(null) // Reset loading state
          return // Exit early, modal will handle the generation
        case "menu-design":
          endpoint = "/api/ai/generate-menu-design"
          payload = {
            menuData,
            designStyle: "personalized",
            colorScheme: "adaptive",
            restaurantType: "adaptive",
            includeTemplates: true, // Generate actual templates
          }
          break
        case "seasonal-menu":
          endpoint = "/api/ai/generate-seasonal-menu"
          payload = { ...payload, season: "current", occasion: "general" }
          break
        default:
          throw new Error("Unknown content type")
      }

      console.log(`🚀 Calling ${endpoint}...`)
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Generation failed")
      }

      const result = await response.json()
      console.log("✅ AI Generation result:", result)

      // Create content object for storage
      const contentObject = {
        id: Date.now().toString(),
        content_type: contentType.id,
        title: contentType.title,
        content_data: result.content || result,
        metadata: {
          estimatedTime: contentType.estimatedTime,
          features: contentType.features,
          endpoint: endpoint,
          generatedAt: new Date().toISOString(),
        },
        ai_mode: result.mode || "openai",
        generation_cost: Number(result.cost?.totalCost || 0.001),
        tokens_used: Number(result.usage?.total_tokens || 100),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "generated",
      }

      // Store locally first
      const existingContent = JSON.parse(localStorage.getItem("generatedContent") || "[]")
      existingContent.unshift(contentObject)
      localStorage.setItem("generatedContent", JSON.stringify(existingContent.slice(0, 50)))

      // Try to save to database
      try {
        const saveResponse = await fetch("/api/generated-content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contentType: contentType.id,
            title: contentType.title,
            contentData: result.content || result,
            metadata: contentObject.metadata,
            aiMode: contentObject.ai_mode,
            generationCost: contentObject.generation_cost,
            tokensUsed: contentObject.tokens_used,
            restaurantId: "default-restaurant",
          }),
        })

        if (saveResponse.ok) {
          const savedContent = await saveResponse.json()
          console.log("✅ Content saved to database:", savedContent)
          onContentGenerated?.(savedContent.content)
        } else {
          console.warn("Database save failed, using local storage")
          onContentGenerated?.(contentObject)
        }
      } catch (saveError) {
        console.warn("Database save failed, using local storage:", saveError)
        onContentGenerated?.(contentObject)
      }

      toast({
        title: "✅ Content Generated!",
        description: `${contentType.title} has been created successfully`,
      })
    } catch (error) {
      console.error(`❌ ${contentType.title} generation failed:`, error)
      toast({
        title: "❌ Generation Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(null)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Menu Content Generator</h2>
        <p className="text-sm sm:text-base text-gray-600">Create professional menu content with AI assistance</p>
      </div>

      {/* Content Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contentTypes.map((contentType) => {
          const Icon = contentType.icon
          const isLoading = isGenerating === contentType.id

          return (
            <Card key={contentType.id} className={`hover:shadow-md transition-shadow ${contentType.color}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${contentType.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base sm:text-lg">{contentType.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {contentType.estimatedTime}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{contentType.description}</p>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Features:</h4>
                  <ul className="space-y-1">
                    {contentType.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => handleGenerate(contentType)}
                  disabled={isLoading}
                  className="w-full text-sm"
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Generate {contentType.title}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => {
                contentTypes.forEach((type, index) => {
                  setTimeout(() => handleGenerate(type), index * 2000)
                })
              }}
              className="w-full sm:w-auto text-sm"
              size="sm"
              disabled={isGenerating !== null}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate All Content
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto text-sm"
              disabled={isGenerating !== null}
              onClick={() => {
                const essentials = ["item-descriptions", "combos"]
                essentials.forEach((typeId, index) => {
                  const type = contentTypes.find((t) => t.id === typeId)
                  if (type) {
                    setTimeout(() => handleGenerate(type), index * 2000)
                  }
                })
              }}
            >
              <Coffee className="w-4 h-4 mr-2" />
              Generate Essentials
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Item Descriptions Modal */}
      <ItemDescriptionsModal
        isOpen={showItemDescriptionsModal}
        onClose={() => setShowItemDescriptionsModal(false)}
        menuData={menuData}
        onApplyDescriptions={(updatedDescriptions) => {
          // Handle the descriptions update
          const contentObject = {
            id: Date.now().toString(),
            content_type: "item-descriptions",
            title: "Item Descriptions & Tags",
            content_data: updatedDescriptions,
            metadata: {
              estimatedTime: "3-4 min",
              features: ["SEO optimized", "Taste tags", "Promotional tags", "Appetizing language"],
              generatedAt: new Date().toISOString(),
            },
            ai_mode: "openai",
            generation_cost: 0.001,
            tokens_used: 100,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: "generated",
          }

          // Store locally
          const existingContent = JSON.parse(localStorage.getItem("generatedContent") || "[]")
          existingContent.unshift(contentObject)
          localStorage.setItem("generatedContent", JSON.stringify(existingContent.slice(0, 50)))

          // Trigger the content generated callback
          onContentGenerated?.(contentObject)

          setShowItemDescriptionsModal(false)
        }}
      />
    </div>
  )
}
