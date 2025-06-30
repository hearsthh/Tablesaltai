"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import {
  TrendingUp,
  TrendingDown,
  Star,
  AlertTriangle,
  BarChart3,
  Target,
  Award,
  FileText,
  Download,
  Share,
} from "lucide-react"

interface MenuPerformanceDashboardProps {
  menuData: any
  onAction?: (action: any) => void
}

export default function MenuPerformanceDashboard({ menuData, onAction }: MenuPerformanceDashboardProps) {
  const [performanceData, setPerformanceData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const generatePerformanceReport = async () => {
    setIsLoading(true)
    try {
      // Mock performance data - in real app, this would come from API
      const mockData = {
        menuScore: 7.8,
        topPerforming: [
          {
            id: "7",
            name: "Butter Chicken",
            sales: 89,
            revenue: 1512.11,
            rating: 4.8,
            trend: "increasing",
            profitMargin: "high",
          },
          {
            id: "9",
            name: "Chicken Biryani",
            sales: 76,
            revenue: 1443.24,
            rating: 4.7,
            trend: "stable",
            profitMargin: "high",
          },
          {
            id: "15",
            name: "Garlic Naan",
            sales: 134,
            revenue: 534.66,
            rating: 4.6,
            trend: "increasing",
            profitMargin: "medium",
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
            issues: ["Low visibility", "Price point", "Limited appeal"],
          },
          {
            id: "2",
            name: "Chicken Wings",
            sales: 23,
            revenue: 298.77,
            rating: 4.1,
            trend: "stable",
            issues: ["Underpriced", "Limited promotion"],
          },
        ],
        menuSpecs: {
          totalItems: menuData.categories.reduce((sum: number, cat: any) => sum + cat.items.length, 0),
          totalCategories: menuData.categories.length,
          avgItemsPerCategory: 0,
          priceRange: { min: 2.49, max: 19.99 },
          recommendations: [
            "Consider reducing menu size by 15% for better focus",
            "Add 2-3 items to Desserts category for better balance",
            "Price optimization needed for 4 items",
            "Seasonal menu rotation recommended",
          ],
        },
        insights: {
          strengths: ["Strong main course performance", "Good price diversity", "Popular signature items"],
          weaknesses: ["Unbalanced categories", "Some underperforming items", "Limited seasonal offerings"],
          opportunities: ["Combo meal potential", "Upselling opportunities", "Social media promotion"],
        },
      }

      mockData.menuSpecs.avgItemsPerCategory = mockData.menuSpecs.totalItems / mockData.menuSpecs.totalCategories

      setPerformanceData(mockData)
      toast({
        title: "📊 Performance Report Generated",
        description: `Menu score: ${mockData.menuScore}/10`,
      })
    } catch (error) {
      toast({
        title: "❌ Report Generation Failed",
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

  const getScoreDescription = (score: number) => {
    if (score >= 8) return "Excellent"
    if (score >= 6) return "Good"
    if (score >= 4) return "Needs Improvement"
    return "Poor"
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Menu Performance</h2>
          <p className="text-sm sm:text-base text-gray-600">Comprehensive analysis of your menu performance</p>
        </div>
        <Button
          onClick={generatePerformanceReport}
          disabled={isLoading}
          className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600"
        >
          {isLoading ? (
            <>
              <BarChart3 className="w-4 h-4 mr-2 animate-spin" />
              <span className="text-sm">Analyzing...</span>
            </>
          ) : (
            <>
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="text-sm">Generate Report</span>
            </>
          )}
        </Button>
      </div>

      {performanceData ? (
        <div className="space-y-4 sm:space-y-6">
          {/* Menu Score */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Overall Menu Score</h3>
                  <p className="text-sm text-gray-600">Based on performance, balance, and optimization</p>
                </div>
                <div className="text-center">
                  <div className={`text-4xl sm:text-5xl font-bold ${getScoreColor(performanceData.menuScore)}`}>
                    {performanceData.menuScore}
                    <span className="text-lg text-gray-500">/10</span>
                  </div>
                  <p className={`text-sm font-medium ${getScoreColor(performanceData.menuScore)}`}>
                    {getScoreDescription(performanceData.menuScore)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={performanceData.menuScore * 10} className="h-2" />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button
                  onClick={() => handleAction("download-report")}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="text-sm">Download Report</span>
                </Button>
                <Button
                  onClick={() => handleAction("share-report")}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Share className="w-4 h-4 mr-2" />
                  <span className="text-sm">Share Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Top Performing Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {performanceData.topPerforming.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-green-50 rounded-lg gap-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs text-gray-600">{item.sales} orders</span>
                        <span className="text-xs text-gray-600">${item.revenue}</span>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" />
                          <span className="text-xs text-gray-600">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => handleAction("promote-item", item)}
                      size="sm"
                      className="w-full sm:w-auto text-xs"
                    >
                      <Target className="w-3 h-3 mr-1" />
                      Promote More
                    </Button>
                    <Button
                      onClick={() => handleAction("create-combo", item)}
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto text-xs"
                    >
                      <Award className="w-3 h-3 mr-1" />
                      Create Combo
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Underperforming Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <span>Underperforming Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {performanceData.underPerforming.map((item: any) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-red-50 rounded-lg gap-3"
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-1 mb-2">
                        <span className="text-xs text-gray-600">{item.sales} orders</span>
                        <span className="text-xs text-gray-600">${item.revenue}</span>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" />
                          <span className="text-xs text-gray-600">{item.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.issues.map((issue: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => handleAction("optimize-item", item)}
                      size="sm"
                      variant="destructive"
                      className="w-full sm:w-auto text-xs"
                    >
                      <Target className="w-3 h-3 mr-1" />
                      Optimize
                    </Button>
                    <Button
                      onClick={() => handleAction("remove-item", item)}
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto text-xs"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Consider Removal
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Menu Specifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Menu Specifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{performanceData.menuSpecs.totalItems}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Total Items</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">
                    {performanceData.menuSpecs.totalCategories}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Categories</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    {performanceData.menuSpecs.avgItemsPerCategory.toFixed(1)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Avg per Category</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-lg sm:text-xl font-bold text-orange-600">
                    ${performanceData.menuSpecs.priceRange.min}-${performanceData.menuSpecs.priceRange.max}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Price Range</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Recommendations</h4>
                {performanceData.menuSpecs.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 flex-1">{rec}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button
                  onClick={() => handleAction("optimize-menu-structure")}
                  size="sm"
                  className="w-full sm:w-auto text-xs"
                >
                  <Target className="w-3 h-3 mr-1" />
                  Optimize Structure
                </Button>
                <Button
                  onClick={() => handleAction("balance-categories")}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto text-xs"
                >
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Balance Categories
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="text-center py-8 sm:py-12">
          <CardContent>
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Generate Performance Report</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Get detailed insights about your menu performance, top items, and optimization opportunities.
            </p>
            <Button onClick={generatePerformanceReport} disabled={isLoading}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
