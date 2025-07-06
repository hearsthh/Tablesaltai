"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { useRestaurantData } from "@/hooks/use-restaurant-data"
import { useMarketingData } from "@/hooks/use-marketing-data"
import { useCustomerData } from "@/hooks/use-customer-data"
import {
  ShoppingCart,
  MousePointer,
  Gift,
  Star,
  TrendingUp,
  Sparkles,
  BarChart3,
  MessageSquare,
  ArrowRight,
  User,
  Utensils,
  Users,
  Calendar,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const { data: restaurantData } = useRestaurantData()
  const { data: marketingData } = useMarketingData()
  const { data: customerData } = useCustomerData()

  const [currentTime] = useState(new Date())

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  // Mock data for dashboard
  const todayOrders = 47
  const ctrLast7Days = 3.2
  const liveOffers = 2
  const avgRating = 4.3
  const growthScore = 87

  const aiHighlights = [
    {
      id: "1",
      text: "Your Butter Chicken had 14 repeat orders this week (+23% vs last week)",
      type: "success",
      action: "View Menu Analytics",
      actionUrl: "/profile/menu-builder?tab=insights",
    },
    {
      id: "2",
      text: "Lunch orders are 32% lower than dinner - consider lunch promotions",
      type: "warning",
      action: "Create Lunch Campaign",
      actionUrl: "/marketing/campaigns/create",
    },
    {
      id: "3",
      text: "Weekend peak time is 8:30 PM - optimize staffing and inventory",
      type: "info",
      action: "View Analytics",
      actionUrl: "/analytics",
    },
  ]

  const topCampaigns = marketingData.campaigns.slice(0, 3).map((campaign) => ({
    ...campaign,
    ctr: ((campaign.analytics.engagement / campaign.analytics.reach) * 100).toFixed(1),
    orders: campaign.analytics.conversions,
  }))

  const nextSteps = [
    {
      id: "1",
      task: "Approve 3 content units",
      priority: "high",
      action: () => router.push("/marketing?tab=content"),
    },
    {
      id: "2",
      task: "Upload photo for Friday reel",
      priority: "medium",
      action: () => router.push("/marketing/content-units/create"),
    },
    {
      id: "3",
      task: "Respond to 2 Swiggy reviews",
      priority: "high",
      action: () => router.push("/profile/reviews"),
    },
    {
      id: "4",
      task: "Try suggested lunch combo",
      priority: "low",
      action: () => router.push("/profile/menu-builder"),
    },
  ]

  const quickAccessModules = [
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      color: "bg-blue-500",
    },
    {
      name: "Menu",
      href: "/profile/menu-builder",
      icon: Utensils,
      color: "bg-green-500",
    },
    {
      name: "Reviews",
      href: "/profile/reviews",
      icon: Star,
      color: "bg-yellow-500",
    },
    {
      name: "Campaigns",
      href: "/marketing",
      icon: BarChart3,
      color: "bg-purple-500",
    },
    {
      name: "Customers",
      href: "/customers",
      icon: Users,
      color: "bg-pink-500",
    },
  ]

  const funnelData = [
    { stage: "Visitors", value: 1247, percentage: 100 },
    { stage: "Engagement", value: 423, percentage: 34 },
    { stage: "Orders", value: 89, percentage: 7.1 },
    { stage: "Revenue", value: 12450, percentage: 100, isCurrency: true },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getHighlightColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-green-500 bg-green-50"
      case "warning":
        return "border-l-yellow-500 bg-yellow-50"
      case "info":
        return "border-l-blue-500 bg-blue-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      <Navigation />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Welcome back, {restaurantData.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 text-sm text-gray-600">
                <span>{restaurantData.location}</span>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{avgRating} average rating</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Synced {currentTime.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Snapshot Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <KpiCard
              title="Orders Today"
              value={todayOrders}
              icon={ShoppingCart}
              trend={{
                value: 12,
                label: "vs yesterday",
                isPositive: true,
              }}
            />
            <KpiCard
              title="CTR (Last 7 Days)"
              value={`${ctrLast7Days}%`}
              icon={MousePointer}
              trend={{
                value: 8,
                label: "vs last week",
                isPositive: true,
              }}
            />
            <KpiCard
              title="Live Offers"
              value={liveOffers}
              icon={Gift}
              badge={{
                text: "Active",
                variant: "default",
              }}
            />
            <KpiCard
              title="Rating"
              value={avgRating}
              icon={Star}
              trend={{
                value: 2,
                label: "this month",
                isPositive: true,
              }}
            />
            <KpiCard
              title="Growth Score"
              value={`${growthScore}/100`}
              icon={TrendingUp}
              className="col-span-2 lg:col-span-1"
            />
          </div>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* AI Highlights */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                <span>AI Highlights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiHighlights.map((highlight) => (
                <div key={highlight.id} className={`p-3 border-l-4 rounded-r-lg ${getHighlightColor(highlight.type)}`}>
                  <p className="text-xs sm:text-sm text-gray-800 mb-2">{highlight.text}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(highlight.actionUrl)}
                    className="bg-white text-xs"
                  >
                    {highlight.action}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Performing Campaigns */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span>Top Campaigns</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topCampaigns.map((campaign) => (
                <div key={campaign.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{campaign.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">CTR:</span>
                      <span className="font-medium ml-1">{campaign.ctr}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Orders:</span>
                      <span className="font-medium ml-1">{campaign.orders}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/marketing")}
                className="w-full bg-white text-xs"
              >
                View All Campaigns
              </Button>
            </CardContent>
          </Card>

          {/* Review Summary */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span>Review Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{avgRating}</span>
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs">+0.2 this week</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Recent Reviews:</span>
                  <span className="font-medium">23 this week</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-red-600">• "cold food"</span>
                    <span className="text-gray-500">3 mentions</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600">• "excellent taste"</span>
                    <span className="text-gray-500">8 mentions</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600">• "fast delivery"</span>
                    <span className="text-gray-500">5 mentions</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/profile/reviews")}
                className="w-full bg-white text-xs"
              >
                View All Reviews
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Action Panel */}
        <Card className="border-gray-200 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              <span>Next Steps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {nextSteps.map((step) => (
                <div
                  key={step.id}
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={step.action}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(step.priority)}`}>
                      {step.priority.toUpperCase()}
                    </Badge>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">{step.task}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {quickAccessModules.map((module) => {
              const Icon = module.icon
              return (
                <Button
                  key={module.name}
                  variant="outline"
                  onClick={() => router.push(module.href)}
                  className="h-auto p-4 bg-white border-gray-200 hover:bg-gray-50 flex-col space-y-2"
                >
                  <div className={`w-8 h-8 rounded-lg ${module.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900">{module.name}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Funnel Snapshot */}
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              <span>Performance Funnel</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelData.map((stage, index) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {stage.isCurrency ? formatCurrency(stage.value) : formatNumber(stage.value)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stage.percentage}%` }}
                    ></div>
                  </div>
                  {index < funnelData.length - 1 && (
                    <div className="text-xs text-gray-600 text-right">
                      {stage.stage === "Orders" ? "7.1% conversion rate" : ""}
                      {stage.stage === "Engagement" ? "34% engagement rate" : ""}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">₹140</div>
                  <div className="text-xs text-gray-600">Avg Order Value</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">7.1%</div>
                  <div className="text-xs text-gray-600">Conversion Rate</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
