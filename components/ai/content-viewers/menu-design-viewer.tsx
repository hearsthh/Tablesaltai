"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Palette, Eye, Download, Wand2, Sparkles, RefreshCw } from "lucide-react"

interface MenuDesignViewerProps {
  content: any
  menuData: any
  onApply?: (design: any) => void
}

export default function MenuDesignViewer({ content, menuData, onApply }: MenuDesignViewerProps) {
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<string>("")
  const [templates, setTemplates] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [restaurantAnalysis, setRestaurantAnalysis] = useState<any>(null)

  useEffect(() => {
    // Parse the content to get templates
    parseTemplates()
  }, [content])

  const parseTemplates = () => {
    try {
      console.log("Raw content received:", content)

      let parsedContent = content

      // Handle different content formats
      if (typeof content === "string") {
        // Try to extract JSON from text that might contain other content
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0])
        } else {
          // If no JSON found, create fallback structure
          console.log("No JSON found in string content, using fallback")
          parsedContent = { templates: generateFallbackTemplates() }
        }
      }

      // Handle case where content is already an object but might have different structure
      if (typeof parsedContent === "object" && parsedContent !== null) {
        let templateData = []

        // Try different possible structures
        if (parsedContent.templates) {
          templateData = parsedContent.templates
        } else if (parsedContent.content && parsedContent.content.templates) {
          templateData = parsedContent.content.templates
        } else if (Array.isArray(parsedContent)) {
          templateData = parsedContent
        } else {
          // If structure is unexpected, generate fallback
          console.log("Unexpected content structure, using fallback")
          templateData = generateFallbackTemplates()
        }

        setTemplates(Array.isArray(templateData) ? templateData : [])
        setRestaurantAnalysis(parsedContent.restaurantAnalysis || null)

        if (templateData.length > 0) {
          setPreviewMode(templateData[0].id)
        }
      } else {
        // Content is neither string nor object, use fallback
        console.log("Content is neither string nor object, using fallback")
        const fallbackTemplates = generateFallbackTemplates()
        setTemplates(fallbackTemplates)
        if (fallbackTemplates.length > 0) {
          setPreviewMode(fallbackTemplates[0].id)
        }
      }
    } catch (error) {
      console.error("Error parsing templates:", error)
      console.log("Using fallback templates due to parsing error")

      // Always provide fallback templates on error
      const fallbackTemplates = generateFallbackTemplates()
      setTemplates(fallbackTemplates)
      if (fallbackTemplates.length > 0) {
        setPreviewMode(fallbackTemplates[0].id)
      }
    }
  }

  // Add fallback template generator
  const generateFallbackTemplates = () => {
    return [
      {
        id: "modern_fallback",
        name: "Modern Clean",
        philosophy: "Clean, minimalist design with modern typography",
        colors: ["#2D3748", "#4A5568", "#E53E3E", "#F7FAFC"],
        typography: {
          header: "Inter Bold",
          category: "Inter SemiBold",
          item: "Inter Regular",
          price: "Inter Bold",
        },
        layout: {
          structure: "Grid-based layout with clear sections",
          spacing: "Generous white space",
          hierarchy: "Clear visual hierarchy",
        },
        elements: {
          borders: "Subtle borders",
          icons: "Modern icons",
          accents: "Minimal accents",
        },
        target: "Modern diners who appreciate clean design",
      },
      {
        id: "classic_fallback",
        name: "Classic Elegant",
        philosophy: "Traditional design with elegant typography",
        colors: ["#744210", "#A0522D", "#D2691E", "#FFF8DC"],
        typography: {
          header: "Playfair Display",
          category: "Lora Bold",
          item: "Lora Regular",
          price: "Lora Bold",
        },
        layout: {
          structure: "Traditional menu layout",
          spacing: "Balanced spacing",
          hierarchy: "Classic hierarchy",
        },
        elements: {
          borders: "Decorative borders",
          icons: "Classic icons",
          accents: "Elegant accents",
        },
        target: "Diners who prefer traditional elegance",
      },
      {
        id: "vibrant_fallback",
        name: "Bold & Vibrant",
        philosophy: "Eye-catching design with bold colors",
        colors: ["#E53E3E", "#DD6B20", "#D69E2E", "#FFF5F5"],
        typography: {
          header: "Montserrat Bold",
          category: "Montserrat SemiBold",
          item: "Open Sans Regular",
          price: "Open Sans Bold",
        },
        layout: {
          structure: "Dynamic layout with visual interest",
          spacing: "Varied spacing for emphasis",
          hierarchy: "Bold visual hierarchy",
        },
        elements: {
          borders: "Bold borders",
          icons: "Vibrant icons",
          accents: "Colorful accents",
        },
        target: "Diners seeking energetic dining experience",
      },
    ]
  }

  const generateNewTemplates = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-menu-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuData,
          designStyle: "personalized",
          colorScheme: "adaptive",
          restaurantType: "adaptive",
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setTemplates(result.templates || [])
        setRestaurantAnalysis(result.restaurantAnalysis || null)
        if (result.templates?.length > 0) {
          setPreviewMode(result.templates[0].id)
        }
        toast({
          title: "🎨 New Templates Generated!",
          description: `Created ${result.templates?.length || 0} personalized design templates`,
        })
      }
    } catch (error) {
      toast({
        title: "❌ Generation Failed",
        description: "Failed to generate new templates",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const renderMenuPreview = (template: any) => {
    if (!template) return null

    const colors = template.colors || ["#2D3748", "#4A5568", "#E53E3E", "#F7FAFC"]

    const templateStyles = {
      container: `p-8 font-sans`,
      header: `text-center mb-8 pb-6`,
      title: `text-3xl font-bold mb-2`,
      subtitle: `text-sm uppercase tracking-wide`,
      category: `mb-6`,
      categoryTitle: `text-xl font-semibold mb-4 pb-2`,
      item: `flex justify-between items-start mb-4 pb-4`,
      itemName: `font-medium`,
      itemDesc: `text-sm mt-1`,
      itemPrice: `font-medium ml-4`,
    }

    const dynamicStyles = {
      backgroundColor: colors[3] || "#F7FAFC",
      color: colors[0] || "#2D3748",
      borderColor: colors[1] || "#4A5568",
      accentColor: colors[2] || "#E53E3E",
    }

    return (
      <div
        className={templateStyles.container}
        style={{
          backgroundColor: dynamicStyles.backgroundColor,
          color: dynamicStyles.color,
          border: `2px solid ${dynamicStyles.borderColor}20`,
        }}
      >
        <div className={templateStyles.header} style={{ borderBottom: `2px solid ${dynamicStyles.accentColor}` }}>
          <h1 className={templateStyles.title} style={{ color: dynamicStyles.accentColor }}>
            Spice Garden
          </h1>
          <p className={templateStyles.subtitle} style={{ color: dynamicStyles.color }}>
            Authentic Indian Cuisine
          </p>
        </div>

        {menuData.categories?.slice(0, 2).map((category: any) => (
          <div key={category.id} className={templateStyles.category}>
            <h2
              className={templateStyles.categoryTitle}
              style={{
                color: dynamicStyles.accentColor,
                borderBottom: `1px solid ${dynamicStyles.borderColor}40`,
              }}
            >
              {category.name}
            </h2>
            {category.items?.slice(0, 3).map((item: any) => (
              <div
                key={item.id}
                className={templateStyles.item}
                style={{ borderBottom: `1px solid ${dynamicStyles.borderColor}20` }}
              >
                <div className="flex-1">
                  <h3 className={templateStyles.itemName} style={{ color: dynamicStyles.color }}>
                    {item.name}
                  </h3>
                  <p className={templateStyles.itemDesc} style={{ color: `${dynamicStyles.color}80` }}>
                    {item.description}
                  </p>
                </div>
                <div className={templateStyles.itemPrice} style={{ color: dynamicStyles.accentColor }}>
                  ${item.price}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  const handleApplyDesign = (template: any) => {
    onApply?.(template)
    toast({
      title: "✅ Design Applied!",
      description: `${template.name} template has been applied to your menu`,
    })
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Design Templates</h3>
        <p className="text-gray-600 mb-4">Generate personalized design templates for your menu</p>
        <Button onClick={generateNewTemplates} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Templates
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">AI-Generated Menu Designs</h3>
          <p className="text-gray-600">Personalized templates created for your restaurant</p>
          {restaurantAnalysis && (
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>Cuisine: {restaurantAnalysis.cuisineType}</span>
              <span>Price Range: {restaurantAnalysis.priceRange}</span>
              <span>Items: {restaurantAnalysis.totalItems}</span>
            </div>
          )}
        </div>
        <Button onClick={generateNewTemplates} disabled={isGenerating} variant="outline">
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate New
            </>
          )}
        </Button>
      </div>

      {/* Template Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all ${
              previewMode === template.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
            }`}
            onClick={() => setPreviewMode(template.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <p className="text-sm text-gray-600">{template.philosophy}</p>
              <div className="flex gap-2 mt-2">
                {template.colors?.map((color: string, index: number) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Target: {template.target}</p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPreviewMode(template.id)
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleApplyDesign(template)
                  }}
                >
                  <Wand2 className="w-4 h-4 mr-1" />
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Preview */}
      {previewMode && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Live Preview - {templates.find((t) => t.id === previewMode)?.name}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    const template = templates.find((t) => t.id === previewMode)
                    if (template) handleApplyDesign(template)
                  }}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Apply This Design
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-white">
              {renderMenuPreview(templates.find((t) => t.id === previewMode))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Design Details */}
      {previewMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(() => {
            const template = templates.find((t) => t.id === previewMode)
            if (!template) return null

            return (
              <>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Typography</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Header: {template.typography?.header}</div>
                      <div>Category: {template.typography?.category}</div>
                      <div>Items: {template.typography?.item}</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Layout</h4>
                    <p className="text-sm text-gray-600">{template.layout?.structure}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Elements</h4>
                    <p className="text-sm text-gray-600">{template.elements?.borders}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Philosophy</h4>
                    <p className="text-sm text-gray-600">{template.philosophy}</p>
                  </CardContent>
                </Card>
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}
