"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import {
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Calendar,
  MessageSquare,
  BarChart3,
  Zap,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Star,
} from "lucide-react"
import { useCustomerStore } from "@/lib/store/customer-store"

export default function CustomerInsightsPage() {
  const router = useRouter()
  const { customers, churnAnalysis } = useCustomerStore()
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)

  const aiInsights = [
    {
      id: "revenue-opportunity",
      title: "Revenue Opportunity",
      category: "Growth",
      priority: "high",
      impact: "₹45,000",
      confidence: 92,
      description:
        "Targeting dormant customers with personalized offers could generate significant additional revenue.",
      details:
        "Analysis shows 68 dormant customers with high historical LTV. Reactivation campaigns have 32% success rate.",
      recommendations: [
        "Send personalized email campaigns to dormant VIP customers",
        "Offer 20% discount on their favorite cuisine type",
        "Schedule campaigns for weekends when engagement is highest",
      ],
      actionable: true,
      timeframe: "2 weeks",
      effort: "Medium",
      icon: DollarSign,
      color: "bg-green-50 border-green-200",
      textColor: "text-green-800",
    },
    {
      id: "churn-prevention",
      title: "Churn Prevention Alert",
      category: "Retention",
      priority: "high",
      impact: "₹28,000",
      confidence: 87,
      description: "15 high-value customers showing early churn signals need immediate attention.",
      details: "Customers with 60+ days since last visit and declining order frequency. Average LTV of ₹18,500.",
      recommendations: [
        "Implement immediate retention campaigns",
        "Offer exclusive loyalty benefits",
        "Schedule personal outreach calls",
      ],
      actionable: true,
      timeframe: "1 week",
      effort: "High",
      icon: AlertTriangle,
      color: "bg-red-50 border-red-200",
      textColor: "text-red-800",
    },
    {
      id: "upselling-opportunity",
      title: "Upselling Opportunity",
      category: "Growth",
      priority: "medium",
      impact: "₹22,000",
      confidence: 78,
      description: "VIP customers show 85% interest in premium menu items and experiences.",
      details:
        "42 VIP customers frequently order appetizers but rarely try premium mains. High willingness to pay more.",
      recommendations: [
        "Launch premium tasting menu for VIP customers",
        "Create exclusive chef's table experiences",
        "Offer wine pairing suggestions",
      ],
      actionable: true,
      timeframe: "3 weeks",
      effort: "Medium",
      icon: TrendingUp,
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-800",
    },
    {
      id: "acquisition-strategy",
      title: "Customer Acquisition Strategy",
      category: "Acquisition",
      priority: "medium",
      impact: "₹35,000",
      confidence: 74,
      description: "Target 25-35 age group through social media for 68% higher conversion rates.",
      details:
        "Analysis of successful acquisitions shows young professionals respond best to Instagram and LinkedIn ads.",
      recommendations: [
        "Increase social media ad spend for 25-35 demographic",
        "Create content showcasing work-friendly atmosphere",
        "Partner with nearby offices for corporate catering",
      ],
      actionable: true,
      timeframe: "4 weeks",
      effort: "Low",
      icon: Users,
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-800",
    },
    {
      id: "seasonal-trends",
      title: "Seasonal Behavior Patterns",
      category: "Insights",
      priority: "low",
      impact: "₹15,000",
      confidence: 89,
      description: "Customer preferences shift significantly during festival seasons and weather changes.",
      details: "Spicy food orders increase 40% during monsoon. Festival bookings peak 2 weeks before celebrations.",
      recommendations: [
        "Adjust menu offerings based on seasonal preferences",
        "Launch pre-festival booking campaigns",
        "Create weather-appropriate comfort food specials",
      ],
      actionable: false,
      timeframe: "Ongoing",
      effort: "Low",
      icon: Calendar,
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-800",
    },
    {
      id: "loyalty-optimization",
      title: "Loyalty Program Optimization",
      category: "Retention",
      priority: "medium",
      impact: "₹18,000",
      confidence: 81,
      description:
        "Current loyalty program has low engagement. Personalized rewards could increase participation by 45%.",
      details:
        "Only 23% of customers actively use loyalty points. Personalized offers based on preferences show higher redemption.",
      recommendations: [
        "Redesign loyalty program with personalized rewards",
        "Implement tier-based benefits",
        "Send automated milestone celebrations",
      ],
      actionable: true,
      timeframe: "6 weeks",
      effort: "High",
      icon: Star,
      color: "bg-yellow-50 border-yellow-200",
      textColor: "text-yellow-800",
    },
  ]

  const insightCategories = [
    { name: "All", count: aiInsights.length, active: true },
    { name: "Growth", count: aiInsights.filter((i) => i.category === "Growth").length, active: false },
    { name: "Retention", count: aiInsights.filter((i) => i.category === "Retention").length, active: false },
    { name: "Acquisition", count: aiInsights.filter((i) => i.category === "Acquisition").length, active: false },
    { name: "Insights", count: aiInsights.filter((i) => i.category === "Insights").length, active: false },
  ]

  const keyMetrics = [
    {
      title: "Potential Revenue",
      value: "₹163K",
      description: "From implementing all recommendations",
      icon: DollarSign,
      color: "bg-green-50 text-green-700",
    },
    {
      title: "Actionable Insights",
      value: aiInsights.filter((i) => i.actionable).length.toString(),
      description: "Ready to implement",
      icon: Zap,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Avg Confidence",
      value: `${Math.round(aiInsights.reduce((sum, i) => sum + i.confidence, 0) / aiInsights.length)}%`,
      description: "AI prediction accuracy",
      icon: BarChart3,
      color: "bg-purple-50 text-purple-700",
    },
    {
      title: "High Priority",
      value: aiInsights.filter((i) => i.priority === "high").length.toString(),
      description: "Urgent recommendations",
      icon: AlertTriangle,
      color: "bg-red-50 text-red-700",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "High":
        return "bg-red-100 text-red-700"
      case "Medium":
        return "bg-yellow-100 text-yellow-700"
      case "Low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="rounded-md" onClick={() => router.push("/customers")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">AI Customer Insights</h1>
                <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  AI-powered recommendations to grow your business
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="flex items-center rounded-md border-slate-200 text-sm"
                onClick={() => router.push("/customers/segmentation")}
              >
                <Users className="w-4 h-4 mr-2" />
                Segmentation
              </Button>
              <Button
                className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md text-sm"
                onClick={() => router.push("/marketing/campaigns")}
              >
                <Target className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {keyMetrics.map((metric, index) => (
            <Card key={index} className="border-slate-200">
              <CardContent className="p-3 sm:p-4">
                <div className={`p-2 sm:p-3 rounded-lg ${metric.color}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-white/50 flex items-center justify-center">
                      <metric.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-slate-900">{metric.value}</div>
                  <div className="text-xs sm:text-sm text-slate-600">{metric.title}</div>
                  <div className="text-xs text-slate-500">{metric.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {insightCategories.map((category, index) => (
                  <Button
                    key={index}
                    variant={category.active ? "default" : "ghost"}
                    className="w-full justify-between rounded-md"
                  >
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="ml-2">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Insights */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {aiInsights.map((insight, index) => (
                <Card
                  key={index}
                  className={`border cursor-pointer hover:shadow-md transition-all ${insight.color} ${
                    selectedInsight === insight.id ? "ring-2 ring-slate-900" : ""
                  }`}
                  onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/50 rounded-lg flex items-center justify-center">
                          <insight.icon className="w-6 h-6 text-slate-700" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{insight.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getPriorityColor(insight.priority)}>{insight.priority} priority</Badge>
                            <Badge variant="outline">{insight.category}</Badge>
                            {insight.actionable && <Badge className="bg-blue-100 text-blue-700">Actionable</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">{insight.impact}</div>
                        <div className="text-sm text-slate-600">Potential Impact</div>
                        <div className="text-xs text-slate-500 mt-1">{insight.confidence}% confidence</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-sm mb-4 ${insight.textColor}`}>{insight.description}</p>

                    {selectedInsight === insight.id && (
                      <div className="space-y-4 pt-4 border-t border-slate-200">
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">Detailed Analysis</h4>
                          <p className="text-sm text-slate-700">{insight.details}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">Recommendations</h4>
                          <ul className="space-y-2">
                            {insight.recommendations.map((rec, recIndex) => (
                              <li key={recIndex} className="flex items-start space-x-2 text-sm text-slate-700">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-slate-600">Timeframe</span>
                            <p className="font-medium text-slate-900">{insight.timeframe}</p>
                          </div>
                          <div>
                            <span className="text-sm text-slate-600">Effort Required</span>
                            <Badge className={getEffortColor(insight.effort)} variant="secondary">
                              {insight.effort}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                          <Button
                            className="bg-slate-900 hover:bg-slate-800"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push("/marketing/campaigns")
                            }}
                          >
                            <Target className="w-4 h-4 mr-2" />
                            Create Campaign
                          </Button>
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Handle export or share
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Share Insight
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span>Confidence: {insight.confidence}%</span>
                        <Progress value={insight.confidence} className="w-20 h-2" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
