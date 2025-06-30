"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  DollarSign,
  Heart,
  AlertTriangle,
  Brain,
  Target,
  Zap,
  BarChart3,
  Star,
  TrendingUp,
  Sparkles,
} from "lucide-react"

interface CustomerAIDashboardProps {
  customerData?: {
    totalCustomers: number
    churnRate: number
    avgLTV: number
    retentionRate: number
  }
}

export function CustomerAIDashboard({ customerData }: CustomerAIDashboardProps) {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)

  const aiCapabilities = [
    {
      title: "Smart Customer Segmentation",
      description: "AI automatically segments customers using RFM analysis and behavioral patterns",
      accuracy: "94%",
      impact: "+28% Revenue",
      icon: Users,
      color: "bg-blue-50 border-blue-200 text-blue-700",
      features: ["RFM Analysis", "Behavioral Clustering", "Predictive Segments", "Auto-updating"],
      metrics: {
        segments: 12,
        accuracy: 94,
        revenueImpact: 28,
      },
    },
    {
      title: "Churn Prediction AI",
      description: "Predict which customers are likely to churn 60 days in advance",
      accuracy: "89%",
      impact: "60 Days Early",
      icon: AlertTriangle,
      color: "bg-red-50 border-red-200 text-red-700",
      features: ["Early Warning", "Risk Scoring", "Retention Actions", "Success Tracking"],
      metrics: {
        accuracy: 89,
        daysAdvance: 60,
        preventionRate: 73,
      },
    },
    {
      title: "Lifetime Value Forecasting",
      description: "Predict customer lifetime value using advanced ML models",
      accuracy: "87%",
      impact: "₹2.3L Avg LTV",
      icon: DollarSign,
      color: "bg-green-50 border-green-200 text-green-700",
      features: ["Value Prediction", "Growth Potential", "Investment Priority", "ROI Optimization"],
      metrics: {
        avgLTV: 230000,
        accuracy: 87,
        growthPotential: 45,
      },
    },
    {
      title: "Personalization Engine",
      description: "AI-powered menu recommendations and personalized experiences",
      accuracy: "91%",
      impact: "+42% Order Value",
      icon: Heart,
      color: "bg-purple-50 border-purple-200 text-purple-700",
      features: ["Menu Recommendations", "Personalized Offers", "Experience Customization", "Preference Learning"],
      metrics: {
        orderValueIncrease: 42,
        accuracy: 91,
        satisfactionScore: 4.7,
      },
    },
  ]

  const aiInsights = [
    {
      type: "churn-risk",
      title: "High Churn Risk Alert",
      description: "15 VIP customers showing early churn signals. Immediate action recommended.",
      confidence: 92,
      urgency: "High",
      action: "Launch retention campaign",
      icon: AlertTriangle,
      color: "bg-red-50 border-red-200",
      impact: "₹4.2L potential loss",
    },
    {
      type: "growth-opportunity",
      title: "Upselling Opportunity",
      description: "42 customers in 'Regular' segment ready for VIP upgrade based on behavior",
      confidence: 88,
      urgency: "Medium",
      action: "Create VIP upgrade campaign",
      icon: TrendingUp,
      color: "bg-green-50 border-green-200",
      impact: "₹2.8L revenue potential",
    },
    {
      type: "personalization",
      title: "Menu Personalization",
      description: "68% of customers would order 30% more with personalized menu recommendations",
      confidence: 85,
      urgency: "Medium",
      action: "Enable AI menu recommendations",
      icon: Sparkles,
      color: "bg-purple-50 border-purple-200",
      impact: "+30% order value",
    },
  ]

  const customerSegments = [
    {
      name: "VIP Champions",
      count: 45,
      percentage: 12,
      avgLTV: 450000,
      churnRisk: "Low",
      color: "bg-purple-500",
      description: "Highest value customers with strong loyalty",
      aiRecommendation: "Exclusive experiences and early access to new items",
    },
    {
      name: "Loyal Regulars",
      count: 128,
      percentage: 34,
      avgLTV: 180000,
      churnRisk: "Low",
      color: "bg-green-500",
      description: "Frequent visitors with consistent spending",
      aiRecommendation: "Loyalty rewards and referral incentives",
    },
    {
      name: "Potential Loyalists",
      count: 89,
      percentage: 24,
      avgLTV: 95000,
      churnRisk: "Medium",
      color: "bg-blue-500",
      description: "Recent customers with growth potential",
      aiRecommendation: "Engagement campaigns and personalized offers",
    },
    {
      name: "At Risk",
      count: 67,
      percentage: 18,
      avgLTV: 65000,
      churnRisk: "High",
      color: "bg-red-500",
      description: "Customers showing churn signals",
      aiRecommendation: "Immediate retention campaigns and win-back offers",
    },
    {
      name: "New Customers",
      count: 43,
      percentage: 12,
      avgLTV: 25000,
      churnRisk: "Unknown",
      color: "bg-orange-500",
      description: "Recently acquired customers",
      aiRecommendation: "Onboarding sequence and first-visit optimization",
    },
  ]

  return (
    <div className="space-y-6">
      {/* AI Overview */}
      <Card className="border-slate-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">AI Customer Intelligence</CardTitle>
              <CardDescription>Advanced AI analytics to understand and grow your customer base</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">372</div>
              <div className="text-sm text-slate-600">Total Customers</div>
              <div className="text-xs text-green-600">+12% this month</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">89%</div>
              <div className="text-sm text-slate-600">Retention Rate</div>
              <div className="text-xs text-blue-600">+5% improvement</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">₹1.8L</div>
              <div className="text-sm text-slate-600">Avg Customer LTV</div>
              <div className="text-xs text-purple-600">+18% growth</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-orange-600">92%</div>
              <div className="text-sm text-slate-600">AI Accuracy</div>
              <div className="text-xs text-orange-600">Prediction models</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Capabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {aiCapabilities.map((capability, index) => (
          <Card key={index} className={`border hover:shadow-md transition-shadow ${capability.color}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center">
                    <capability.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{capability.title}</CardTitle>
                    <CardDescription className="text-sm">{capability.description}</CardDescription>
                  </div>
                </div>
                <Badge className="bg-white/50" variant="secondary">
                  {capability.accuracy} accurate
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Impact:</span>
                  <span className="font-medium text-green-600">{capability.impact}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-700 mb-2 block">Key Features:</span>
                  <div className="grid grid-cols-2 gap-1">
                    {capability.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="w-full" size="sm">
                  <Zap className="w-4 h-4 mr-2" />
                  Activate {capability.title}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Customer Segments */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-xl">AI Customer Segments</CardTitle>
            </div>
            <Badge className="bg-blue-100 text-blue-700">Auto-Updated</Badge>
          </div>
          <CardDescription>AI-powered customer segmentation with actionable insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerSegments.map((segment, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${segment.color}`}></div>
                    <div>
                      <h4 className="font-medium text-slate-900">{segment.name}</h4>
                      <p className="text-sm text-slate-600">{segment.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">{segment.count}</div>
                    <div className="text-sm text-slate-600">{segment.percentage}% of total</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center p-2 bg-slate-50 rounded">
                    <div className="text-sm font-medium text-slate-900">₹{(segment.avgLTV / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-slate-600">Avg LTV</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded">
                    <div
                      className={`text-sm font-medium ${
                        segment.churnRisk === "Low"
                          ? "text-green-600"
                          : segment.churnRisk === "Medium"
                            ? "text-yellow-600"
                            : segment.churnRisk === "High"
                              ? "text-red-600"
                              : "text-slate-600"
                      }`}
                    >
                      {segment.churnRisk}
                    </div>
                    <div className="text-xs text-slate-600">Churn Risk</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded">
                    <div className="text-sm font-medium text-slate-900">{segment.percentage}%</div>
                    <div className="text-xs text-slate-600">Share</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="text-xs text-slate-600">AI Recommendation:</span>
                    <p className="text-sm text-slate-700">{segment.aiRecommendation}</p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-3">
                    <Target className="w-3 h-3 mr-1" />
                    Target
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-xl">AI Customer Insights</CardTitle>
            </div>
            <Badge className="bg-purple-100 text-purple-700">Real-time</Badge>
          </div>
          <CardDescription>Actionable insights powered by customer behavior analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className={`p-4 border rounded-lg ${insight.color}`}>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/50 rounded-md flex items-center justify-center">
                    <insight.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900">{insight.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                        <Badge
                          className={`text-xs ${
                            insight.urgency === "High" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                          }`}
                          variant="secondary"
                        >
                          {insight.urgency} Priority
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-600">Impact: </span>
                        <span className="text-xs font-medium text-green-600">{insight.impact}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Zap className="w-3 h-3 mr-1" />
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
