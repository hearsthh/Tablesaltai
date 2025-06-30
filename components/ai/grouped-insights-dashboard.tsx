"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  DollarSign,
  Target,
  Zap,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Calendar,
  Users,
  ArrowRight,
  Activity,
  BarChart3,
} from "lucide-react"
import type { MenuInsight } from "@/lib/ai/menu-insights-engine"

interface GroupedInsightsDashboardProps {
  menuData: any
  onInsightAction?: (action: any) => void
}

export default function GroupedInsightsDashboard({ menuData, onInsightAction }: GroupedInsightsDashboardProps) {
  const [insights, setInsights] = useState<MenuInsight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("pricing")

  const generateInsights = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/comprehensive-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: "demo-restaurant",
          menuData,
          // Mock data for demo
          salesData: [
            { itemId: "1", itemName: "Samosa Chaat", totalSales: 45, revenue: 404.55, orderFrequency: 0.8 },
            { itemId: "7", itemName: "Butter Chicken", totalSales: 89, revenue: 1512.11, orderFrequency: 1.5 },
            { itemId: "2", itemName: "Chicken Wings", totalSales: 23, revenue: 298.77, orderFrequency: 0.4 },
          ],
          customerProfile: {
            demographics: { incomeLevel: "mid-range", ageGroups: [{ range: "25-35", percentage: 40 }] },
            orderingPatterns: { avgOrderValue: 28.5, repeatCustomerRate: 0.65 },
          },
          locationData: { city: "San Francisco", neighborhood: "Mission District", competitorDensity: 8 },
          seasonalData: { currentSeason: "Winter", upcomingFestivals: ["Valentine's Day", "Holi"] },
          competitorData: {
            pricingBenchmarks: [{ category: "main-course", avgPrice: 16.75, range: [14, 22] }],
            marketGaps: ["healthy-bowls", "vegan-options"],
          },
          trendsData: { foodTrends: ["plant-based", "comfort-food", "sustainable-dining"] },
        }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const result = await response.json()
      if (result.success) {
        setInsights(result.insights)
        toast({
          title: "✅ Insights Generated!",
          description: `Generated ${result.insights.length} actionable insights`,
        })
      }
    } catch (error) {
      toast({
        title: "❌ Generation Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Group insights by type
  const groupedInsights = {
    pricing: insights.filter((i) => i.type === "pricing"),
    menuOptimization: insights.filter((i) => i.type === "menu-optimization"),
    promotion: insights.filter((i) => i.type === "promotion"),
  }

  const handleAction = async (insight: MenuInsight, action: any) => {
    if (action.autoApplicable) {
      toast({ title: "🚀 Action Executed", description: `${action.label} completed` })
    } else {
      onInsightAction?.({ insight, action })
      toast({ title: "📋 Action Prepared", description: `${action.label} ready for implementation` })
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const PricingInsightCard = ({ insight }: { insight: MenuInsight }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
          <div className="flex items-center space-x-2">
            {insight.title.includes("Increase") ? (
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
            ) : (
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
            )}
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 break-words">{insight.title}</h3>
          </div>
          <Badge className={`${getImpactColor(insight.impact)} text-xs flex-shrink-0`}>{insight.impact}</Badge>
        </div>

        <p className="text-gray-600 text-xs sm:text-sm mb-3 break-words">{insight.description}</p>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-sm font-semibold text-green-600">${insight.estimatedRevenue}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Confidence</p>
            <p className="text-sm font-semibold text-blue-600">{Math.round(insight.confidence * 100)}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Time</p>
            <p className="text-sm font-semibold text-purple-600 break-words">{insight.implementation.timeframe}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {insight.cta.actions.map((action) => (
            <Button
              key={action.id}
              onClick={() => handleAction(insight, action)}
              size="sm"
              variant={action.autoApplicable ? "default" : "outline"}
              className="flex-1 text-xs"
            >
              <ArrowRight className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const MenuOptimizationCard = ({ insight }: { insight: MenuInsight }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
          <div className="flex items-center space-x-2">
            {insight.category === "Menu Addition" ? (
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
            ) : (
              <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
            )}
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 break-words">{insight.title}</h3>
          </div>
          <Badge className={`${getImpactColor(insight.impact)} text-xs flex-shrink-0`}>{insight.impact}</Badge>
        </div>

        <p className="text-gray-600 text-xs sm:text-sm mb-3 break-words">{insight.description}</p>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-sm font-semibold text-green-600">${insight.estimatedRevenue}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Difficulty</p>
            <p className="text-sm font-semibold text-orange-600 break-words">{insight.implementation.difficulty}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Cost</p>
            <p className="text-sm font-semibold text-blue-600">${insight.implementation.cost}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {insight.cta.actions.map((action) => (
            <Button
              key={action.id}
              onClick={() => handleAction(insight, action)}
              size="sm"
              variant={action.autoApplicable ? "default" : "outline"}
              className="flex-1 text-xs"
            >
              <ArrowRight className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const PromotionCard = ({ insight }: { insight: MenuInsight }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
          <div className="flex items-center space-x-2">
            {insight.category.includes("Seasonal") ? (
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
            ) : insight.category.includes("Combo") ? (
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
            ) : (
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
            )}
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 break-words">{insight.title}</h3>
          </div>
          <Badge className={`${getImpactColor(insight.impact)} text-xs flex-shrink-0`}>{insight.impact}</Badge>
        </div>

        <p className="text-gray-600 text-xs sm:text-sm mb-3 break-words">{insight.description}</p>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-sm font-semibold text-green-600">${insight.estimatedRevenue}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Cost</p>
            <p className="text-sm font-semibold text-red-600">${insight.implementation.cost}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-sm font-semibold text-blue-600 break-words">{insight.implementation.timeframe}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {insight.cta.actions.map((action) => (
            <Button
              key={action.id}
              onClick={() => handleAction(insight, action)}
              size="sm"
              variant={action.autoApplicable ? "default" : "outline"}
              className="flex-1 text-xs"
            >
              <ArrowRight className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Menu Insights</h2>
          <p className="text-sm sm:text-base text-gray-600">AI-powered recommendations for your restaurant</p>
        </div>
        <Button
          onClick={generateInsights}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Activity className="w-4 h-4 mr-2 animate-spin" />
              <span className="text-sm">Analyzing...</span>
            </>
          ) : (
            <>
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="text-sm">Generate Insights</span>
            </>
          )}
        </Button>
      </div>

      {/* Summary Cards */}
      {insights.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-3 sm:p-4 text-center">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-sm sm:text-base font-semibold text-blue-900">Pricing Insights</h3>
              <p className="text-xl sm:text-2xl font-bold text-blue-700">{groupedInsights.pricing.length}</p>
              <p className="text-xs sm:text-sm text-blue-600">Price optimization opportunities</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-3 sm:p-4 text-center">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="text-sm sm:text-base font-semibold text-purple-900">Menu Optimization</h3>
              <p className="text-xl sm:text-2xl font-bold text-purple-700">{groupedInsights.menuOptimization.length}</p>
              <p className="text-xs sm:text-sm text-purple-600">Menu improvement suggestions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-3 sm:p-4 text-center">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="text-sm sm:text-base font-semibold text-orange-900">Promotions</h3>
              <p className="text-xl sm:text-2xl font-bold text-orange-700">{groupedInsights.promotion.length}</p>
              <p className="text-xs sm:text-sm text-orange-600">Marketing opportunities</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grouped Insights */}
      {insights.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
            <TabsTrigger value="pricing" className="flex items-center justify-center space-x-2 p-3">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Pricing ({groupedInsights.pricing.length})</span>
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center justify-center space-x-2 p-3">
              <Target className="w-4 h-4" />
              <span className="text-sm">Menu ({groupedInsights.menuOptimization.length})</span>
            </TabsTrigger>
            <TabsTrigger value="promotions" className="flex items-center justify-center space-x-2 p-3">
              <Zap className="w-4 h-4" />
              <span className="text-sm">Promotions ({groupedInsights.promotion.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pricing" className="space-y-4 mt-6">
            {groupedInsights.pricing.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupedInsights.pricing.map((insight) => (
                  <PricingInsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-6 sm:py-8">
                <CardContent>
                  <DollarSign className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm sm:text-base text-gray-600">No pricing insights available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="menu" className="space-y-4 mt-6">
            {groupedInsights.menuOptimization.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupedInsights.menuOptimization.map((insight) => (
                  <MenuOptimizationCard key={insight.id} insight={insight} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-6 sm:py-8">
                <CardContent>
                  <Target className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm sm:text-base text-gray-600">No menu optimization insights available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="promotions" className="space-y-4 mt-6">
            {groupedInsights.promotion.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupedInsights.promotion.map((insight) => (
                  <PromotionCard key={insight.id} insight={insight} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-6 sm:py-8">
                <CardContent>
                  <Zap className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm sm:text-base text-gray-600">No promotion insights available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Optimize Your Menu?</h3>
            <p className="text-gray-600 mb-4">
              Get AI-powered insights on pricing, menu optimization, and promotion opportunities.
            </p>
            <Button onClick={generateInsights} disabled={isLoading}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Menu Insights
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
