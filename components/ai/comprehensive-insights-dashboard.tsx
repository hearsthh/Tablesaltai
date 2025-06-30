"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  TrendingUp,
  Zap,
  DollarSign,
  Target,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import type { MenuInsight } from "@/lib/ai/menu-insights-engine"

interface ComprehensiveInsightsDashboardProps {
  menuData: any
  onInsightAction?: (action: any) => void
}

export default function ComprehensiveInsightsDashboard({
  menuData,
  onInsightAction,
}: ComprehensiveInsightsDashboardProps) {
  const [insights, setInsights] = useState<MenuInsight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedImpact, setSelectedImpact] = useState<string>("all")

  // Mock data for demonstration - in production this would come from various sources
  const mockData = {
    salesData: [
      {
        itemId: "1",
        itemName: "Samosa Chaat",
        totalSales: 45,
        revenue: 404.55,
        orderFrequency: 0.8,
        avgOrderValue: 8.99,
        peakHours: ["12:00", "19:00"],
        seasonalVariation: 1.2,
        lastOrderDate: "2024-01-15",
      },
      {
        itemId: "7",
        itemName: "Butter Chicken",
        totalSales: 89,
        revenue: 1512.11,
        orderFrequency: 1.5,
        avgOrderValue: 16.99,
        peakHours: ["18:00", "20:00"],
        seasonalVariation: 1.0,
        lastOrderDate: "2024-01-15",
      },
      {
        itemId: "2",
        itemName: "Chicken Wings",
        totalSales: 23,
        revenue: 298.77,
        orderFrequency: 0.4,
        avgOrderValue: 12.99,
        peakHours: ["17:00"],
        seasonalVariation: 0.8,
        lastOrderDate: "2024-01-10",
      },
    ],
    customerProfile: {
      demographics: {
        ageGroups: [
          { range: "25-35", percentage: 40 },
          { range: "35-45", percentage: 35 },
          { range: "18-25", percentage: 25 },
        ],
        incomeLevel: "mid-range" as const,
        dietaryPreferences: ["vegetarian-friendly", "spicy-food"],
        familySize: 2.8,
      },
      orderingPatterns: {
        peakDays: ["Friday", "Saturday", "Sunday"],
        avgOrderValue: 28.5,
        repeatCustomerRate: 0.65,
        seasonalPreferences: ["comfort-food-winter", "fresh-summer"],
      },
      preferences: {
        cuisineTypes: ["Indian", "Asian-Fusion"],
        spiceLevel: "medium",
        healthConsciousness: 7,
        pricesensitivity: 6,
      },
    },
    locationData: {
      city: "San Francisco",
      neighborhood: "Mission District",
      demographics: { avgAge: 32, avgIncome: 85000 },
      competitorDensity: 8,
      footTraffic: 850,
      averageIncome: 85000,
      popularCuisines: ["Indian", "Mexican", "Italian", "Asian"],
      localEvents: ["Street Food Festival", "Diwali Celebration"],
    },
    seasonalData: {
      currentSeason: "Winter",
      weatherTrends: ["cold", "rainy"],
      upcomingFestivals: ["Valentine's Day", "Holi"],
      seasonalIngredients: ["root vegetables", "citrus", "warming spices"],
      holidayCalendar: ["Presidents Day", "Valentine's Day"],
    },
    competitorData: {
      nearbyRestaurants: [
        {
          name: "Spice Route",
          cuisine: "Indian",
          priceRange: "$15-25",
          popularItems: [{ name: "Tikka Masala", price: 17.99 }],
          ratings: 4.2,
        },
        {
          name: "Curry House",
          cuisine: "Indian",
          priceRange: "$12-20",
          popularItems: [{ name: "Biryani", price: 16.99 }],
          ratings: 4.0,
        },
      ],
      marketGaps: ["healthy-bowls", "vegan-options", "lunch-combos"],
      pricingBenchmarks: [
        { category: "appetizers", avgPrice: 9.5, range: [7, 12] },
        { category: "main-course", avgPrice: 16.75, range: [14, 22] },
      ],
    },
    trendsData: {
      foodTrends: ["plant-based", "fermented-foods", "comfort-food", "sustainable-dining"],
      socialMediaTrends: ["food-photography", "behind-the-scenes", "chef-stories"],
      healthTrends: ["gut-health", "anti-inflammatory", "protein-rich"],
      sustainabilityTrends: ["local-sourcing", "zero-waste", "plant-forward"],
      technologyTrends: ["qr-menus", "contactless-ordering", "ai-recommendations"],
    },
  }

  const generateInsights = async () => {
    setIsLoading(true)
    try {
      console.log("🧠 Generating comprehensive menu insights...")

      const response = await fetch("/api/ai/comprehensive-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId: "demo-restaurant",
          menuData,
          ...mockData,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }

      const result = await response.json()

      if (result.success) {
        setInsights(result.insights)
        setSummary(result.summary)

        toast({
          title: "✅ Insights Generated!",
          description: `Generated ${result.insights.length} actionable insights with $${result.summary.estimatedTotalRevenue} potential revenue impact.`,
        })
      } else {
        throw new Error(result.error || "Generation failed")
      }
    } catch (error) {
      console.error("Insights generation error:", error)
      toast({
        title: "❌ Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredInsights = insights.filter((insight) => {
    const categoryMatch = selectedCategory === "all" || insight.type === selectedCategory
    const impactMatch = selectedImpact === "all" || insight.impact === selectedImpact
    return categoryMatch && impactMatch
  })

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pricing":
        return DollarSign
      case "menu-optimization":
        return Target
      case "promotion":
        return Zap
      default:
        return Activity
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pricing":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "menu-optimization":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "promotion":
        return "bg-orange-50 text-orange-700 border-orange-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const handleInsightAction = async (insight: MenuInsight, action: any) => {
    console.log("Executing insight action:", action)

    if (action.autoApplicable) {
      // Handle auto-applicable actions (like generating content)
      toast({
        title: "🚀 Action Executed",
        description: `${action.label} completed successfully.`,
      })
    } else {
      // Handle manual actions (like price updates)
      if (onInsightAction) {
        onInsightAction({ insight, action })
      }
      toast({
        title: "📋 Action Prepared",
        description: `${action.label} is ready for implementation.`,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Comprehensive Menu Insights</h2>
          <p className="text-gray-600 mt-1">AI-powered analysis with actionable recommendations</p>
        </div>
        <Button
          onClick={generateInsights}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isLoading ? (
            <>
              <Activity className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Insights
            </>
          )}
        </Button>
      </div>

      {/* Data Sources Indicator */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-blue-900">Analysis Data Sources</h3>
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
              Multi-Factor Analysis
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { icon: Target, label: "Menu Data", available: true },
              { icon: BarChart3, label: "Sales Data", available: true },
              { icon: Users, label: "Customer Profile", available: true },
              { icon: MapPin, label: "Location Data", available: true },
              { icon: Calendar, label: "Seasonal Data", available: true },
              { icon: PieChart, label: "Competitor Data", available: true },
              { icon: TrendingUp, label: "Trends Data", available: true },
            ].map((source, index) => {
              const Icon = source.icon
              return (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`p-1 rounded ${source.available ? "bg-green-100" : "bg-gray-100"}`}>
                    <Icon className={`w-3 h-3 ${source.available ? "text-green-600" : "text-gray-400"}`} />
                  </div>
                  <span className="text-xs text-gray-700">{source.label}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary Dashboard */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Insights</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalInsights}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">High Impact</p>
                  <p className="text-2xl font-bold text-red-600">{summary.highImpact}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue Potential</p>
                  <p className="text-2xl font-bold text-green-600">${summary.estimatedTotalRevenue}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categories</p>
                  <div className="flex space-x-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      P:{summary.categories.pricing}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      M:{summary.categories.menuOptimization}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Pr:{summary.categories.promotion}
                    </Badge>
                  </div>
                </div>
                <PieChart className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      {insights.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Categories</option>
              <option value="pricing">Pricing</option>
              <option value="menu-optimization">Menu Optimization</option>
              <option value="promotion">Promotions</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Impact:</span>
            <select
              value={selectedImpact}
              onChange={(e) => setSelectedImpact(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Impact Levels</option>
              <option value="high">High Impact</option>
              <option value="medium">Medium Impact</option>
              <option value="low">Low Impact</option>
            </select>
          </div>
        </div>
      )}

      {/* Insights List */}
      {filteredInsights.length > 0 ? (
        <div className="space-y-4">
          {filteredInsights.map((insight) => {
            const TypeIcon = getTypeIcon(insight.type)
            return (
              <Card key={insight.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(insight.type)}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <p className="text-gray-600 mt-1">{insight.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getImpactColor(insight.impact)}>{insight.impact} impact</Badge>
                      <Badge variant="outline">{Math.round(insight.confidence * 100)}% confidence</Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Revenue Impact</p>
                      <p className="text-lg font-semibold text-green-600">${insight.estimatedRevenue}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Implementation</p>
                      <p className="text-lg font-semibold text-blue-600">{insight.implementation.difficulty}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Timeframe</p>
                      <p className="text-lg font-semibold text-purple-600">{insight.implementation.timeframe}</p>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Reasoning:</h4>
                    <ul className="space-y-1">
                      {insight.data.reasoning.map((reason, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Implementation Steps */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Implementation Steps:</h4>
                    <div className="space-y-2">
                      {insight.implementation.steps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {insight.cta.actions.map((action) => (
                      <Button
                        key={action.id}
                        onClick={() => handleInsightAction(insight, action)}
                        variant={action.autoApplicable ? "default" : "outline"}
                        size="sm"
                        className={action.autoApplicable ? "bg-blue-600 hover:bg-blue-700" : ""}
                      >
                        {action.autoApplicable ? (
                          <Zap className="w-4 h-4 mr-2" />
                        ) : (
                          <ArrowRight className="w-4 h-4 mr-2" />
                        )}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : insights.length === 0 && !isLoading ? (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Generated Yet</h3>
            <p className="text-gray-600 mb-4">
              Click "Generate Insights" to analyze your menu with AI-powered recommendations.
            </p>
            <Button onClick={generateInsights} disabled={isLoading}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Comprehensive Insights
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
