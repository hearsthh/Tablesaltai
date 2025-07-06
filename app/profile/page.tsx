"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import {
  Building,
  ArrowRight,
  CheckCircle,
  Clock,
  MessageSquare,
  MenuIcon,
  Sparkles,
  Users,
  TrendingUp,
  Settings,
  Wifi,
  BarChart3,
  Star,
  Eye,
  Calendar,
  Target,
  Home,
  Bell,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react"
import type { ProfileAnalytics } from "@/lib/services/profile-analytics-service"

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOnboarding = searchParams.get("onboarding") === "true"
  const isNewUser = searchParams.get("new") === "true"

  // Real data state
  const [analytics, setAnalytics] = useState<ProfileAnalytics | null>(null)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<string>("database")

  // Mock restaurant ID - in real app, get from auth context
  const restaurantId = "demo-restaurant-123"

  // Fetch real analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)

        // Try real data first, then fallback to mock data
        const response = await fetch(`/api/profile/analytics?restaurantId=${restaurantId}&mock=true`)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.success) {
          setAnalytics(data.analytics)
          setProgress(data.progress)
          setDataSource(data.dataSource || "database")

          if (data.error) {
            setError(data.error)
          }
        } else {
          throw new Error(data.error || "Failed to fetch analytics")
        }
      } catch (err) {
        console.error("Error fetching analytics:", err)
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        setError(errorMessage)

        // Provide basic fallback data
        setAnalytics({
          socialProfile: {
            platforms: 0,
            profileViews: 0,
            completeness: 0,
            lastUpdated: new Date().toISOString(),
            connectedPlatforms: [],
            missingFields: ["name", "description", "cuisine", "phone", "email", "address"],
          },
          menuManager: {
            menuItems: 0,
            categories: 0,
            aiDescriptions: 0,
            totalDescriptions: 0,
            avgPrice: 0,
            lastMenuUpdate: new Date().toISOString(),
            popularItems: [],
          },
          reviewManager: {
            totalReviews: 0,
            avgRating: 0,
            responseRate: 0,
            sentiment: "neutral",
            platformBreakdown: {},
            recentResponses: 0,
          },
          integrations: {
            totalPlatforms: 12,
            connectedPlatforms: 0,
            connectionHealth: {},
            lastSync: new Date().toISOString(),
            syncErrors: [],
          },
        })
        setProgress({
          socialProfile: 0,
          menuManager: 0,
          reviewManager: 0,
          integrations: 0,
        })
        setDataSource("fallback")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [restaurantId])

  // Profile modules with real data
  const profileModules = analytics
    ? [
        {
          id: "social-profile",
          title: "Social Profile",
          description: "Your restaurant's brand identity across all platforms",
          icon: Building,
          status: "available",
          progress: progress.socialProfile || 0,
          route: "/profile/social-profile",
          priority: 1,
          isRequired: true,
          userFlowStep: 1,
          summary: `${analytics.socialProfile.connectedPlatforms.length} platforms connected, ${analytics.socialProfile.completeness}% complete`,
          actionText: "Manage Profile",
          stats: {
            platforms: analytics.socialProfile.platforms,
            profileViews: analytics.socialProfile.profileViews.toLocaleString(),
            completeness: `${analytics.socialProfile.completeness}%`,
            lastUpdated: new Date(analytics.socialProfile.lastUpdated).toLocaleDateString(),
          },
          impact: `Visible on ${analytics.socialProfile.platforms} platforms with ${analytics.socialProfile.profileViews.toLocaleString()} monthly views`,
        },
        {
          id: "menu-builder",
          title: "Menu Manager",
          description: "Digital menu with AI-powered insights and optimization",
          icon: MenuIcon,
          status: "available",
          progress: progress.menuManager || 0,
          route: "/profile/menu-builder",
          priority: 2,
          isRequired: true,
          userFlowStep: 2,
          summary: `${analytics.menuManager.menuItems} items across ${analytics.menuManager.categories} categories`,
          actionText: "Update Menu",
          stats: {
            menuItems: analytics.menuManager.menuItems,
            categories: analytics.menuManager.categories,
            aiDescriptions: `${analytics.menuManager.aiDescriptions}/${analytics.menuManager.totalDescriptions}`,
            avgPrice: `₹${analytics.menuManager.avgPrice}`,
          },
          impact: `${analytics.menuManager.menuItems} items optimized with ${analytics.menuManager.aiDescriptions} AI descriptions`,
        },
        {
          id: "reviews",
          title: "Review Manager",
          description: "Automated review monitoring and AI-powered responses",
          icon: MessageSquare,
          status: "available",
          progress: progress.reviewManager || 0,
          route: "/profile/reviews",
          priority: 3,
          isRequired: false,
          userFlowStep: 3,
          summary: `${analytics.reviewManager.totalReviews} reviews monitored with ${analytics.reviewManager.responseRate}% response rate`,
          actionText: "View Reviews",
          stats: {
            totalReviews: analytics.reviewManager.totalReviews,
            avgRating: analytics.reviewManager.avgRating.toFixed(1),
            responseRate: `${analytics.reviewManager.responseRate}%`,
            sentiment: analytics.reviewManager.sentiment,
          },
          impact: `${analytics.reviewManager.totalReviews} reviews monitored, ${analytics.reviewManager.responseRate}% response rate`,
        },
      ]
    : []

  // Overall performance statistics from real data
  const overallStats = analytics
    ? {
        totalPlatforms: analytics.integrations.totalPlatforms,
        connectedPlatforms: analytics.integrations.connectedPlatforms,
        monthlyViews:
          analytics.socialProfile.profileViews > 1000
            ? `${(analytics.socialProfile.profileViews / 1000).toFixed(1)}K`
            : analytics.socialProfile.profileViews.toString(),
        avgRating: analytics.reviewManager.avgRating.toFixed(1),
        totalReviews: analytics.reviewManager.totalReviews,
        menuItems: analytics.menuManager.menuItems,
        lastSync: new Date(analytics.integrations.lastSync).toLocaleString(),
      }
    : null

  const integrationProgress = analytics
    ? Math.round((analytics.integrations.connectedPlatforms / analytics.integrations.totalPlatforms) * 100)
    : 0

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "ready":
        return <Sparkles className="w-4 h-4 text-purple-600" />
      case "locked":
        return <Clock className="w-4 h-4 text-gray-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getPercentageColor = (percentage: number) => {
    if (percentage < 40) return "text-red-500"
    if (percentage < 70) return "text-yellow-500"
    return "text-green-500"
  }

  const handleModuleClick = (module: any) => {
    const params = new URLSearchParams()
    if (isOnboarding) params.set("onboarding", "true")
    if (isNewUser) params.set("new", "true")

    const url = `${module.route}${params.toString() ? "?" + params.toString() : ""}`
    router.push(url)
  }

  const handleIntegrationsClick = () => {
    const params = new URLSearchParams()
    if (isOnboarding) params.set("onboarding", "true")
    if (isNewUser) params.set("new", "true")

    router.push(`/profile/integrations${params.toString() ? "?" + params.toString() : ""}`)
  }

  // Quick action handlers with specific functionality
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "view-profile":
        router.push("/restaurant-listing/demo-restaurant")
        break
      case "analytics":
        router.push("/analytics/market-need")
        break
      case "schedule":
        router.push("/marketing/calendar")
        break
      case "settings":
        router.push("/profile/integrations")
        break
      default:
        break
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation variant="default" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
            <p className="text-gray-600">Loading your profile analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state with fallback data
  if (!analytics || !overallStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation variant="default" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Analytics</h2>
            <p className="text-gray-600 mb-4">{error || "There was an error loading your profile data."}</p>
            <Button onClick={() => window.location.reload()} className="bg-gray-900 hover:bg-gray-800 text-white">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <Navigation variant="default" />

      {/* Main Content */}
      <div className="flex-1 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile Manager</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your restaurant's digital presence</p>
              </div>
              {dataSource !== "database" && (
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {dataSource === "mock" ? "Demo Data" : "Offline Mode"}
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                  <p className="text-sm text-yellow-800">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Overall Performance Stats - Real Data */}
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">{overallStats.monthlyViews}</div>
              <div className="text-xs sm:text-sm text-gray-600">Monthly Views</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-lg sm:text-2xl font-bold text-green-600 flex items-center justify-center">
                <Star className="w-4 h-4 mr-1" />
                {overallStats.avgRating}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Avg Rating</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-lg sm:text-2xl font-bold text-purple-600">
                {overallStats.connectedPlatforms}/{overallStats.totalPlatforms}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Platforms</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-lg sm:text-2xl font-bold text-orange-600">{overallStats.totalReviews}</div>
              <div className="text-xs sm:text-sm text-gray-600">Reviews</div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Platform Integrations Card - Enhanced Mobile Design */}
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Wifi className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Platform Integrations</h3>
                      <p className="text-sm text-gray-600">Sync data across platforms</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getPercentageColor(integrationProgress)}`}>
                        {integrationProgress}%
                      </div>
                      <div className="text-xs text-gray-500">Connected</div>
                    </div>
                    <Button
                      onClick={handleIntegrationsClick}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 hover:bg-gray-100 bg-transparent"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tool Modules - Real Data */}
            {profileModules.map((module, index) => (
              <Card
                key={module.id}
                className="border-gray-200 transition-all duration-200 hover:shadow-md cursor-pointer bg-white"
                onClick={() => handleModuleClick(module)}
              >
                <CardContent className="p-4 sm:p-6">
                  {/* Header Section */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <module.icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                          {module.isRequired && <span className="text-red-500 text-lg">*</span>}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div className="text-right">
                        <div className={`text-xl font-bold ${getPercentageColor(module.progress)}`}>
                          {module.progress}%
                        </div>
                        <div className="text-xs text-gray-500">Setup</div>
                      </div>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Statistics Grid - Real Data */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {Object.entries(module.stats).map(([key, value], statIndex) => (
                      <div key={statIndex} className="text-center">
                        <div className="text-sm sm:text-base font-semibold text-gray-900">{value}</div>
                        <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                      </div>
                    ))}
                  </div>

                  {/* Impact Summary - Real Data */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <div className="flex items-start space-x-2">
                      <BarChart3 className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-700 font-medium">{module.summary}</p>
                        <p className="text-xs text-gray-600 mt-1">{module.impact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {module.actionText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions Section */}
          <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center justify-center p-4 h-16 bg-transparent border-gray-200 hover:bg-gray-50"
                onClick={() => handleQuickAction("view-profile")}
              >
                <Eye className="w-5 h-5 mb-1 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">View Profile</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center justify-center p-4 h-16 bg-transparent border-gray-200 hover:bg-gray-50"
                onClick={() => handleQuickAction("analytics")}
              >
                <Target className="w-5 h-5 mb-1 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Analytics</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center justify-center p-4 h-16 bg-transparent border-gray-200 hover:bg-gray-50"
                onClick={() => handleQuickAction("schedule")}
              >
                <Calendar className="w-5 h-5 mb-1 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Schedule</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex flex-col items-center justify-center p-4 h-16 bg-transparent border-gray-200 hover:bg-gray-50"
                onClick={() => handleQuickAction("settings")}
              >
                <Settings className="w-5 h-5 mb-1 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Settings</span>
              </Button>
            </div>
          </div>

          {/* Last Sync Info - Real Data */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">Last synced: {overallStats.lastSync}</p>
          </div>
        </div>
      </div>

      {/* Fixed Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center p-2 text-gray-600 hover:text-gray-900"
            onClick={() => router.push("/dashboard")}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center p-2 text-gray-600 hover:text-gray-900"
            onClick={() => router.push("/marketing")}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs mt-1">Marketing</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center p-2 text-blue-600">
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center p-2 text-gray-600 hover:text-gray-900"
            onClick={() => router.push("/customers")}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">Customers</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center p-2 text-gray-600 hover:text-gray-900"
            onClick={() => router.push("/profile/integrations")}
          >
            <Bell className="w-5 h-5" />
            <span className="text-xs mt-1">Alerts</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
