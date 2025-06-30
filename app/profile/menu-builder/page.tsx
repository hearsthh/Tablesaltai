"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Heart,
  Flame,
  Leaf,
  Coffee,
  Utensils,
  Upload,
  BarChart3,
  Sparkles,
  Bug,
  Eye,
  Plus,
  ArrowRight,
  ChefHat,
} from "lucide-react"
import MenuExtractModal from "@/components/ai/menu-extract-modal"
import UnifiedAnalyticsDashboard from "@/components/ai/unified-analytics-dashboard"
import MenuContentGenerator from "@/components/ai/menu-content-generator"
import ContentHistoryTimeline from "@/components/ai/content-history-timeline"
import ContentDebugPanel from "@/components/ai/content-debug-panel"
import GeneratedContentViewer from "@/components/ai/generated-content-viewer"

// Empty state for new users
const emptyMenuData = {
  categories: [],
}

// Mock data only for existing users
const mockMenuData = {
  categories: [
    {
      id: "1",
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      items: [
        {
          id: "1",
          name: "Samosa Chaat",
          description: "Crispy samosas topped with tangy chutneys and yogurt",
          price: 8.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["spicy", "vegetarian"],
          promoTags: ["popular", "signature"],
          insights: {
            sales: "high",
            pricing: "optimal",
            trend: "increasing",
            suggestions: ["Consider raising price by $1", "Add to combo offers"],
          },
        },
      ],
    },
  ],
}

const tasteTagsConfig = {
  spicy: { label: "Spicy", icon: Flame, color: "bg-red-50 text-red-600 border-red-200" },
  mild: { label: "Mild", icon: Coffee, color: "bg-yellow-50 text-yellow-600 border-yellow-200" },
  vegetarian: { label: "Veg", icon: Leaf, color: "bg-green-50 text-green-600 border-green-200" },
  vegan: { label: "Vegan", icon: Leaf, color: "bg-green-50 text-green-700 border-green-300" },
  "non-vegetarian": { label: "Non-Veg", icon: Utensils, color: "bg-orange-50 text-orange-600 border-orange-200" },
  healthy: { label: "Healthy", icon: Heart, color: "bg-pink-50 text-pink-600 border-pink-200" },
  creamy: { label: "Creamy", icon: Coffee, color: "bg-amber-50 text-amber-600 border-amber-200" },
}

const promoTagsConfig = {
  popular: { label: "Popular", color: "bg-blue-50 text-blue-600 border-blue-200" },
  "top-rated": { label: "Top Rated", color: "bg-purple-50 text-purple-600 border-purple-200" },
  signature: { label: "Signature", color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
  "must-try": { label: "Must Try", color: "bg-pink-50 text-pink-600 border-pink-200" },
  "kids-special": { label: "Kids", color: "bg-cyan-50 text-cyan-600 border-cyan-200" },
  "chef-special": { label: "Chef's", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
}

export default function MenuBuilderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOnboarding = searchParams.get("onboarding") === "true"
  const isNewUser = searchParams.get("new") === "true" || isOnboarding

  // Use empty data for new users, mock data for existing users
  const [menuData, setMenuData] = useState(isNewUser ? emptyMenuData : mockMenuData)
  const [showExtractModal, setShowExtractModal] = useState(false)
  const [activeTab, setActiveTab] = useState("manage")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAvailable, setFilterAvailable] = useState<boolean | null>(null)
  const [refreshHistory, setRefreshHistory] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [showGeneratedContent, setShowGeneratedContent] = useState(false)

  const handleContentApplied = (content: any, appliedData: any, setMenuData: any) => {
    switch (content.content_type) {
      case "combos":
        const comboCategory = {
          id: `combo_${Date.now()}`,
          name: "Combo Meals",
          description: "Value combo meals with great savings",
          items: appliedData.map((combo: any, index: number) => ({
            id: `combo_item_${Date.now()}_${index}`,
            name: combo.name,
            description: combo.description,
            price: combo.price,
            available: true,
            tasteTags: ["combo"],
            promoTags: ["value", "popular"],
            comboItems: combo.items,
          })),
        }

        setMenuData((prevData) => ({
          ...prevData,
          categories: [...prevData.categories, comboCategory],
        }))

        toast({
          title: "🍽️ Combos Added!",
          description: `${appliedData.length} combo meals have been added to your menu`,
        })
        break

      case "seasonal-menu":
        const seasonalCategory = {
          id: `seasonal_${Date.now()}`,
          name: "Seasonal Specials",
          description: "Limited-time seasonal offerings",
          items: appliedData.map((item: any, index: number) => ({
            id: `seasonal_item_${Date.now()}_${index}`,
            name: item.name,
            description: item.description,
            price: item.price,
            available: true,
            tasteTags: item.tags || ["seasonal"],
            promoTags: ["limited-time", "seasonal"],
          })),
        }

        setMenuData((prevData) => ({
          ...prevData,
          categories: [...prevData.categories, seasonalCategory],
        }))

        toast({
          title: "🌱 Seasonal Items Added!",
          description: `${appliedData.length} seasonal items have been added to your menu`,
        })
        break

      default:
        toast({
          title: "✅ Content Applied!",
          description: "Content has been applied to your menu",
        })
    }
  }

  const handleMenuExtracted = (extractedMenuData: any) => {
    const newCategories = extractedMenuData.categories.map((category: any) => ({
      ...category,
      id: `extracted_${Date.now()}_${category.id}`,
      items: category.items.map((item: any) => ({
        ...item,
        id: `extracted_${Date.now()}_${item.id}`,
      })),
    }))

    setMenuData((prevData) => ({
      ...prevData,
      categories: [...prevData.categories, ...newCategories],
    }))

    toast({
      title: "✅ Menu Imported Successfully!",
      description: `Added ${newCategories.length} categories and ${newCategories.reduce((total: number, cat: any) => total + cat.items.length, 0)} items to your menu.`,
    })
  }

  const handleContentGenerated = (content: any) => {
    console.log("🎉 New content generated:", content)
    setRefreshHistory((prev) => prev + 1)
    setGeneratedContent(content)
    setShowGeneratedContent(true)

    toast({
      title: "✅ Content Generated!",
      description: `${content.title} has been created and is ready for review`,
    })
  }

  const handleContinueOnboarding = () => {
    router.push("/profile/reviews?onboarding=true&new=true")
  }

  const tabs = [
    { id: "manage", label: "Menu", icon: Utensils },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "content", label: "AI Tools", icon: Sparkles },
    { id: "debug", label: "Debug", icon: Bug },
  ]

  // Empty state component for new users
  const EmptyMenuState = () => (
    <div className="text-center py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChefHat className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Your Menu</h3>
        <p className="text-gray-600 mb-6 text-sm">
          Start building your restaurant menu by uploading an existing menu or creating items from scratch.
        </p>

        <div className="space-y-3">
          <Button onClick={() => setShowExtractModal(true)} className="w-full bg-blue-600 hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Existing Menu
          </Button>

          <Button onClick={() => setActiveTab("content")} variant="outline" className="w-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate with AI
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // Add a sample category to get started
              setMenuData({
                categories: [
                  {
                    id: "starter",
                    name: "Getting Started",
                    description: "Your first menu category",
                    items: [],
                  },
                ],
              })
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Manually
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        {/* Mobile-First Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Menu Builder</h1>
              <p className="text-sm text-gray-600 mt-1">
                {isNewUser ? "Build your restaurant menu" : "Manage and optimize your menu"}
              </p>
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              {menuData.categories.length > 0 && (
                <Button onClick={() => setShowPreview(true)} variant="outline" className="w-full sm:w-auto text-sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              )}

              <Button
                onClick={() => setShowExtractModal(true)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Menu
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile-First Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <div className="overflow-x-auto">
              <nav className="flex space-x-1 px-3 sm:px-6 min-w-max">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-3 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          <div className="p-3 sm:p-6">
            {/* Manage Menu Tab */}
            {activeTab === "manage" && (
              <div>
                {menuData.categories.length === 0 ? (
                  <EmptyMenuState />
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Mobile Search & Filters */}
                    <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Search menu items..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={filterAvailable === true ? "default" : "outline"}
                          onClick={() => setFilterAvailable(filterAvailable === true ? null : true)}
                          size="sm"
                          className="flex-1 sm:flex-none text-xs"
                        >
                          Available
                        </Button>
                        <Button
                          variant={filterAvailable === false ? "default" : "outline"}
                          onClick={() => setFilterAvailable(filterAvailable === false ? null : false)}
                          size="sm"
                          className="flex-1 sm:flex-none text-xs"
                        >
                          Unavailable
                        </Button>
                      </div>
                    </div>

                    {/* Mobile-First Menu Categories */}
                    <div className="space-y-4 sm:space-y-6">
                      {menuData.categories.map((category) => (
                        <Card key={category.id} className="overflow-hidden">
                          <CardHeader className="pb-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <CardTitle className="text-base sm:text-lg">{category.name}</CardTitle>
                                <CardDescription className="text-sm">{category.description}</CardDescription>
                              </div>
                              <div className="text-xs text-gray-500 sm:text-sm">{category.items.length} items</div>
                            </div>
                          </CardHeader>

                          <CardContent className="pt-0">
                            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                              {category.items.map((item) => (
                                <div key={item.id} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                                    </div>
                                    <div
                                      className={`w-2 h-2 rounded-full flex-shrink-0 ml-2 ${item.available ? "bg-green-500" : "bg-red-500"}`}
                                    ></div>
                                  </div>

                                  <div className="text-base font-semibold text-green-600 mb-2">
                                    ${item.price.toFixed(2)}
                                  </div>

                                  {/* Mobile-Optimized Tags */}
                                  <div className="flex flex-wrap gap-1">
                                    {item.tasteTags?.slice(0, 2).map((tag) => {
                                      const config = tasteTagsConfig[tag as keyof typeof tasteTagsConfig]
                                      if (!config) return null
                                      const Icon = config.icon
                                      return (
                                        <span
                                          key={tag}
                                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${config.color}`}
                                        >
                                          <Icon className="w-2.5 h-2.5 mr-1" />
                                          {config.label}
                                        </span>
                                      )
                                    })}
                                    {item.promoTags?.slice(0, 1).map((tag) => {
                                      const config = promoTagsConfig[tag as keyof typeof promoTagsConfig]
                                      if (!config) return null
                                      return (
                                        <span
                                          key={tag}
                                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${config.color}`}
                                        >
                                          {config.label}
                                        </span>
                                      )
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div>
                {menuData.categories.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Yet</h3>
                    <p className="text-gray-600 text-sm mb-4">Add menu items to see analytics and insights</p>
                    <Button onClick={() => setActiveTab("manage")} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Menu Items
                    </Button>
                  </div>
                ) : (
                  <UnifiedAnalyticsDashboard
                    menuData={menuData}
                    onAction={(action) => {
                      console.log("Analytics action:", action)
                      toast({
                        title: "Analytics Action",
                        description: `${action.type} initiated`,
                      })
                    }}
                  />
                )}
              </div>
            )}

            {/* Content Generator Tab */}
            {activeTab === "content" && (
              <MenuContentGenerator
                menuData={menuData}
                onContentGenerated={handleContentGenerated}
                onContentApplied={(content, appliedData) => handleContentApplied(content, appliedData, setMenuData)}
              />
            )}

            {/* Debug Tab */}
            {activeTab === "debug" && <ContentDebugPanel />}
          </div>
        </div>

        {/* Onboarding Continue Button */}
        {isOnboarding && (
          <div className="mt-6 bg-white rounded-lg border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">Ready for the next step?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {menuData.categories.length > 0
                    ? "Great! Your menu is taking shape. Let's set up review management next."
                    : "You can always come back to build your menu later."}
                </p>
              </div>
              <Button onClick={handleContinueOnboarding} className="w-full sm:w-auto">
                Continue Setup
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* History Section */}
        {menuData.categories.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <ContentHistoryTimeline
              key={refreshHistory}
              menuData={menuData}
              onContentAction={(action, content) => {
                if (action === "apply") {
                  handleContentApplied(content, content.content_data, setMenuData)
                }
                console.log("Content action:", action, content)
                toast({
                  title: "Content Action",
                  description: `${action} executed for ${content.title}`,
                })
              }}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <MenuExtractModal
        isOpen={showExtractModal}
        onClose={() => setShowExtractModal(false)}
        onMenuExtracted={handleMenuExtracted}
      />

      {/* Mobile-Optimized Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[95vh] overflow-auto w-full">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Menu Preview</h2>
                <Button onClick={() => setShowPreview(false)} variant="outline" size="sm">
                  Close
                </Button>
              </div>

              <div className="bg-white border rounded-lg p-4 sm:p-8">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Restaurant</h2>
                  <p className="text-gray-600 mt-2 text-sm sm:text-base">Delicious Cuisine</p>
                </div>

                {menuData.categories.map((category) => (
                  <div key={category.id} className="mb-6 sm:mb-8">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 border-b pb-2">
                      {category.name}
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {category.items
                        .filter((item) => item.available)
                        .map((item) => (
                          <div key={item.id} className="flex justify-between items-start gap-3 sm:gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm sm:text-base">{item.name}</h4>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">{item.description}</p>
                              <div className="flex gap-1 mt-2">
                                {item.promoTags?.includes("popular") && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Popular</span>
                                )}
                                {item.promoTags?.includes("signature") && (
                                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                    Signature
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-sm sm:text-lg font-semibold text-gray-900 flex-shrink-0">
                              ${item.price.toFixed(2)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generated Content Viewer Modal */}
      {showGeneratedContent && generatedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg max-w-7xl max-h-[95vh] overflow-auto w-full">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Generated Content</h2>
                <Button onClick={() => setShowGeneratedContent(false)} variant="outline" size="sm">
                  Close
                </Button>
              </div>

              <GeneratedContentViewer
                content={generatedContent}
                menuData={menuData}
                onApply={(content, appliedData) => {
                  handleContentApplied(content, appliedData, setMenuData)
                  setShowGeneratedContent(false)
                }}
                onClose={() => setShowGeneratedContent(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
