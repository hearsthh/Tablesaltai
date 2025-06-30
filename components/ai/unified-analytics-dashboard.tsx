"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Zap,
  Star,
  AlertTriangle,
  BarChart3,
  Award,
  ArrowRight,
  Activity,
  PieChart,
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
} from "lucide-react"

interface UnifiedAnalyticsDashboardProps {
  menuData: any
  onAction?: (action: any) => void
}

export default function UnifiedAnalyticsDashboard({ menuData, onAction }: UnifiedAnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const generateAnalytics = async () => {
    setIsLoading(true)
    try {
      // Mock comprehensive analytics data
      const mockData = {
        insights: {
          pricing: {
            underpriced: [
              {
                id: "2",
                name: "Chicken Wings",
                currentPrice: 12.99,
                suggestedPrice: 15.99,
                potentialRevenue: 156,
                confidence: 0.85,
                reasoning: ["Market rate is $16-18", "High demand item", "Premium ingredients"],
              },
              {
                id: "3",
                name: "Paneer Tikka",
                currentPrice: 10.99,
                suggestedPrice: 13.99,
                potentialRevenue: 89,
                confidence: 0.78,
                reasoning: ["Competitor pricing $14-16", "Labor intensive prep", "Premium paneer"],
              },
            ],
            overpriced: [
              {
                id: "6",
                name: "Vegetable Spring Rolls",
                currentPrice: 9.99,
                suggestedPrice: 7.99,
                potentialRevenue: 45,
                confidence: 0.72,
                reasoning: ["Low sales volume", "Simple preparation", "Market rate $6-8"],
              },
            ],
          },
          menuOptimization: [
            {
              id: "opt_1",
              type: "addition",
              title: "Add Healthy Bowl Options",
              description: "Market gap for healthy, protein-rich bowls targeting health-conscious customers",
              impact: "high",
              estimatedRevenue: 2400,
              confidence: 0.82,
              reasoning: ["Growing health trend", "Higher margins", "Untapped customer segment"],
              actions: [
                { id: "add_bowls", label: "Create Bowl Menu", autoApplicable: false },
                { id: "research_bowls", label: "Research Recipes", autoApplicable: true },
              ],
            },
            {
              id: "opt_2",
              type: "removal",
              title: "Consider Removing Low Performers",
              description: "3 items consistently underperform and may be confusing the menu",
              impact: "medium",
              estimatedRevenue: 800,
              confidence: 0.75,
              reasoning: ["Simplifies operations", "Reduces waste", "Improves focus"],
              actions: [
                { id: "remove_items", label: "Remove Items", autoApplicable: false },
                { id: "analyze_impact", label: "Analyze Impact", autoApplicable: true },
              ],
            },
          ],
          promotions: [
            {
              id: "promo_1",
              title: "Valentine's Day Couple Combo",
              description: "Create romantic dinner combos for Valentine's Day with 15% savings",
              impact: "high",
              estimatedRevenue: 1800,
              confidence: 0.88,
              timeframe: "2 weeks",
              reasoning: ["Seasonal opportunity", "High-margin items", "Proven combo success"],
              actions: [
                { id: "create_combo", label: "Create Combo", autoApplicable: true },
                { id: "design_promo", label: "Design Promotion", autoApplicable: true },
              ],
            },
            {
              id: "promo_2",
              title: "Lunch Hour Express Menu",
              description: "Quick lunch options for office workers with 20-minute guarantee",
              impact: "medium",
              estimatedRevenue: 1200,
              confidence: 0.79,
              timeframe: "1 month",
              reasoning: ["Untapped lunch market", "Quick service advantage", "Higher frequency"],
              actions: [
                { id: "create_express", label: "Create Express Menu", autoApplicable: false },
                { id: "test_timing", label: "Test Service Times", autoApplicable: true },
              ],
            },
          ],
        },
        performance: {
          menuScore: {
            overall: 7.8,
            breakdown: {
              pricing: { score: 6.5, description: "Some pricing optimization needed" },
              balance: { score: 8.2, description: "Good category distribution" },
              profitability: { score: 7.9, description: "Strong profit margins" },
              marketFit: { score: 8.5, description: "Excellent market alignment" },
            },
            recommendations: [
              "Optimize pricing for 4 underperforming items",
              "Add 2-3 healthy options to capture growing market",
              "Create seasonal rotation for 20% of menu",
              "Implement combo meals to increase average order value",
            ],
          },
          itemPerformance: {
            topPerforming: [
              {
                id: "7",
                name: "Butter Chicken",
                sales: 89,
                revenue: 1512.11,
                rating: 4.8,
                trend: "increasing",
                profitMargin: "high",
                insights: ["Signature dish", "High reorder rate", "Social media favorite"],
              },
              {
                id: "9",
                name: "Chicken Biryani",
                sales: 76,
                revenue: 1443.24,
                rating: 4.7,
                trend: "stable",
                profitMargin: "high",
                insights: ["Weekend favorite", "Family orders", "Premium pricing accepted"],
              },
              {
                id: "15",
                name: "Garlic Naan",
                sales: 134,
                revenue: 534.66,
                rating: 4.6,
                trend: "increasing",
                profitMargin: "medium",
                insights: ["High attachment rate", "Low cost", "Consistent performer"],
              },
            ],
            underPerforming: [
              {
                id: "6",
                name: "Vegetable Spring Rolls",
                sales: 12,
                revenue: 95.88,
                rating: 3.8,
                trend: "declining",
                issues: ["Low visibility on menu", "Price point too high", "Limited appeal"],
                suggestions: ["Reduce price by $2", "Improve description", "Add to appetizer combo"],
              },
              {
                id: "2",
                name: "Chicken Wings",
                sales: 23,
                revenue: 298.77,
                rating: 4.1,
                trend: "stable",
                issues: ["Underpriced for quality", "Limited promotion", "Not in combos"],
                suggestions: ["Increase price to $15.99", "Add to happy hour", "Create wing combo"],
              },
            ],
          },
          categoryAnalysis: [
            {
              category: "Appetizers",
              performance: "good",
              items: 6,
              avgRating: 4.2,
              totalRevenue: 1247.89,
              insights: ["Strong starter sales", "Good variety", "Price optimization needed"],
              actions: ["Optimize 2 item prices", "Add healthy option"],
            },
            {
              category: "Main Course",
              performance: "excellent",
              items: 8,
              avgRating: 4.6,
              totalRevenue: 4521.33,
              insights: ["Top revenue generator", "High ratings", "Good profit margins"],
              actions: ["Maintain quality", "Add seasonal specials"],
            },
          ],
        },
      }

      setAnalyticsData(mockData)
      toast({
        title: "📊 Analytics Generated!",
        description: "Comprehensive insights and performance analysis ready",
      })
    } catch (error) {
      toast({
        title: "❌ Analysis Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = (actionType: string, data?: any) => {
    onAction?.({ type: actionType, data })
    toast({
      title: "🚀 Action Initiated",
      description: `${actionType.replace("-", " ")} started`,
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 8) return "bg-green-50 border-green-200"
    if (score >= 6) return "bg-yellow-50 border-yellow-200"
    return "bg-red-50 border-red-200"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Menu Analytics</h2>
          <p className="text-gray-600">AI-powered insights and performance analysis</p>
        </div>
        <Button
          onClick={generateAnalytics}
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
              Generate Analytics
            </>
          )}
        </Button>
      </div>

      {analyticsData ? (
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>AI Insights</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Performance</span>
            </TabsTrigger>
          </TabsList>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6 mt-6">
            {/* Pricing Insights Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span>Pricing Optimization</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Underpriced Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 text-red-600 mr-2" />
                    Underpriced Items ({analyticsData.insights.pricing.underpriced.length})
                  </h4>
                  <div className="space-y-3">
                    {analyticsData.insights.pricing.underpriced.map((item: any) => (
                      <div key={item.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-medium text-gray-900">{item.name}</h5>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Current: ${item.currentPrice}</span>
                              <ArrowRight className="w-3 h-3" />
                              <span className="text-green-600 font-medium">Suggested: ${item.suggestedPrice}</span>
                              <span className="text-blue-600">+${item.potentialRevenue}/month</span>
                            </div>
                          </div>
                          <Badge className="bg-red-100 text-red-700">
                            {Math.round(item.confidence * 100)}% confident
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 mb-3">
                          {item.reasoning.map((reason: string, idx: number) => (
                            <div key={idx} className="flex items-center space-x-1">
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                        <Button
                          onClick={() => handleAction("update-price", item)}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Increase Price
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overpriced Items */}
                {analyticsData.insights.pricing.overpriced.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <TrendingDown className="w-4 h-4 text-blue-600 mr-2" />
                      Overpriced Items ({analyticsData.insights.pricing.overpriced.length})
                    </h4>
                    <div className="space-y-3">
                      {analyticsData.insights.pricing.overpriced.map((item: any) => (
                        <div key={item.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium text-gray-900">{item.name}</h5>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>Current: ${item.currentPrice}</span>
                                <ArrowRight className="w-3 h-3" />
                                <span className="text-blue-600 font-medium">Suggested: ${item.suggestedPrice}</span>
                                <span className="text-green-600">+${item.potentialRevenue}/month volume</span>
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700">
                              {Math.round(item.confidence * 100)}% confident
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600 mb-3">
                            {item.reasoning.map((reason: string, idx: number) => (
                              <div key={idx} className="flex items-center space-x-1">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <span>{reason}</span>
                              </div>
                            ))}
                          </div>
                          <Button
                            onClick={() => handleAction("update-price", item)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <TrendingDown className="w-3 h-3 mr-1" />
                            Reduce Price
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Menu Optimization Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span>Menu Optimization</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.insights.menuOptimization.map((insight: any) => (
                  <div key={insight.id} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {insight.type === "addition" ? (
                          <Plus className="w-5 h-5 text-green-600" />
                        ) : (
                          <Minus className="w-5 h-5 text-red-600" />
                        )}
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      </div>
                      <Badge
                        className={`${insight.impact === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{insight.description}</p>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="text-center p-2 bg-white rounded">
                        <p className="text-sm text-gray-600">Revenue Impact</p>
                        <p className="font-semibold text-green-600">${insight.estimatedRevenue}/month</p>
                      </div>
                      <div className="text-center p-2 bg-white rounded">
                        <p className="text-sm text-gray-600">Confidence</p>
                        <p className="font-semibold text-blue-600">{Math.round(insight.confidence * 100)}%</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mb-3">
                      {insight.reasoning.map((reason: string, idx: number) => (
                        <div key={idx} className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {insight.actions.map((action: any) => (
                        <Button
                          key={action.id}
                          onClick={() => handleAction(action.id, insight)}
                          size="sm"
                          variant={action.autoApplicable ? "default" : "outline"}
                        >
                          {action.autoApplicable ? (
                            <Zap className="w-3 h-3 mr-1" />
                          ) : (
                            <ArrowRight className="w-3 h-3 mr-1" />
                          )}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Promotions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <span>Promotion Opportunities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.insights.promotions.map((promo: any) => (
                  <div key={promo.id} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        <h4 className="font-medium text-gray-900">{promo.title}</h4>
                      </div>
                      <Badge
                        className={`${promo.impact === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {promo.impact} impact
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{promo.description}</p>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center p-2 bg-white rounded">
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="font-semibold text-green-600">${promo.estimatedRevenue}</p>
                      </div>
                      <div className="text-center p-2 bg-white rounded">
                        <p className="text-sm text-gray-600">Confidence</p>
                        <p className="font-semibold text-blue-600">{Math.round(promo.confidence * 100)}%</p>
                      </div>
                      <div className="text-center p-2 bg-white rounded">
                        <p className="text-sm text-gray-600">Timeline</p>
                        <p className="font-semibold text-purple-600">{promo.timeframe}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mb-3">
                      {promo.reasoning.map((reason: string, idx: number) => (
                        <div key={idx} className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {promo.actions.map((action: any) => (
                        <Button
                          key={action.id}
                          onClick={() => handleAction(action.id, promo)}
                          size="sm"
                          variant={action.autoApplicable ? "default" : "outline"}
                        >
                          {action.autoApplicable ? (
                            <Zap className="w-3 h-3 mr-1" />
                          ) : (
                            <ArrowRight className="w-3 h-3 mr-1" />
                          )}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6 mt-6">
            {/* Menu Score Card */}
            <Card className={`${getScoreBackground(analyticsData.performance.menuScore.overall)}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span>Overall Menu Score</span>
                  </div>
                  <div className={`text-3xl font-bold ${getScoreColor(analyticsData.performance.menuScore.overall)}`}>
                    {analyticsData.performance.menuScore.overall}/10
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(analyticsData.performance.menuScore.breakdown).map(([key, data]: [string, any]) => (
                    <div key={key} className="text-center p-3 bg-white rounded-lg">
                      <h5 className="text-sm font-medium text-gray-900 capitalize mb-1">{key}</h5>
                      <div className={`text-xl font-bold ${getScoreColor(data.score)}`}>{data.score}</div>
                      <p className="text-xs text-gray-600 mt-1">{data.description}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                  <div className="space-y-2">
                    {analyticsData.performance.menuScore.recommendations.map((rec: string, idx: number) => (
                      <div key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleAction("improve-score")} size="sm">
                    <Target className="w-3 h-3 mr-1" />
                    Improve Score
                  </Button>
                  <Button onClick={() => handleAction("detailed-analysis")} variant="outline" size="sm">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Detailed Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Item Performance Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span>Item Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Top Performing Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                    Top Performing Items ({analyticsData.performance.itemPerformance.topPerforming.length})
                  </h4>
                  <div className="space-y-3">
                    {analyticsData.performance.itemPerformance.topPerforming.map((item: any, index: number) => (
                      <div key={item.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-full text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{item.name}</h5>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>{item.sales} orders</span>
                                <span>${item.revenue}</span>
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                  <span>{item.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-700">{item.profitMargin} margin</Badge>
                        </div>
                        <div className="text-xs text-gray-600 mb-3">
                          {item.insights.map((insight: string, idx: number) => (
                            <div key={idx} className="flex items-center space-x-1">
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              <span>{insight}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleAction("promote-item", item)} size="sm">
                            <Target className="w-3 h-3 mr-1" />
                            Promote More
                          </Button>
                          <Button onClick={() => handleAction("create-combo", item)} variant="outline" size="sm">
                            <Plus className="w-3 h-3 mr-1" />
                            Create Combo
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Underperforming Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <TrendingDown className="w-4 h-4 text-red-600 mr-2" />
                    Underperforming Items ({analyticsData.performance.itemPerformance.underPerforming.length})
                  </h4>
                  <div className="space-y-3">
                    {analyticsData.performance.itemPerformance.underPerforming.map((item: any) => (
                      <div key={item.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h5 className="font-medium text-gray-900">{item.name}</h5>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>{item.sales} orders</span>
                                <span>${item.revenue}</span>
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                  <span>{item.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-red-100 text-red-700">{item.trend}</Badge>
                        </div>
                        <div className="mb-3">
                          <p className="text-xs text-gray-600 mb-2">Issues:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.issues.map((issue: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-xs text-gray-600 mb-2">Suggestions:</p>
                          <div className="text-xs text-gray-700 space-y-1">
                            {item.suggestions.map((suggestion: string, idx: number) => (
                              <div key={idx} className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>{suggestion}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleAction("optimize-item", item)} size="sm" variant="destructive">
                            <Target className="w-3 h-3 mr-1" />
                            Optimize
                          </Button>
                          <Button onClick={() => handleAction("remove-item", item)} variant="outline" size="sm">
                            <XCircle className="w-3 h-3 mr-1" />
                            Consider Removal
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Analysis Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  <span>Category Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {analyticsData.performance.categoryAnalysis.map((category: any, index: number) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{category.category}</h4>
                        <Badge
                          className={`${category.performance === "excellent" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                        >
                          {category.performance}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Items</p>
                          <p className="font-semibold text-gray-900">{category.items}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Avg Rating</p>
                          <p className="font-semibold text-yellow-600">{category.avgRating}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="font-semibold text-green-600">${category.totalRevenue}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Actions</p>
                          <p className="font-semibold text-blue-600">{category.actions.length}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-3">
                        {category.insights.map((insight: string, idx: number) => (
                          <div key={idx} className="flex items-center space-x-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <span>{insight}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.actions.map((action: string, idx: number) => (
                          <Button
                            key={idx}
                            onClick={() => handleAction("category-action", { category: category.category, action })}
                            size="sm"
                            variant="outline"
                          >
                            <ArrowRight className="w-3 h-3 mr-1" />
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Generate Comprehensive Analytics</h3>
            <p className="text-gray-600 mb-4">
              Get AI-powered insights on pricing, menu optimization, promotions, and performance analysis.
            </p>
            <Button onClick={generateAnalytics} disabled={isLoading}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Analytics
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
