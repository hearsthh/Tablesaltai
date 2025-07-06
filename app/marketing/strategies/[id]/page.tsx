"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter, useParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Play,
  Pause,
  Edit,
  Target,
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  BarChart3,
  Plus,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { CampaignCard } from "@/components/marketing/campaign-card"
import { usePerformanceMetrics } from "@/hooks/use-performance-metrics"
import type { Strategy, Campaign } from "@/types/marketing"

export default function StrategyDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const strategyId = params.id as string

  const [strategy, setStrategy] = useState<Strategy | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  const { metrics, loading: metricsLoading } = usePerformanceMetrics(strategyId, "strategy")

  useEffect(() => {
    fetchStrategyDetails()
  }, [strategyId])

  const fetchStrategyDetails = async () => {
    try {
      // Mock strategy data - replace with actual API call
      const mockStrategy: Strategy = {
        id: strategyId,
        name: "Festival Season Marketing",
        description:
          "Comprehensive marketing strategy for festival seasons targeting increased revenue and brand awareness during peak celebration periods",
        goal: "conversion",
        template: "festival_marketing",
        status: "active",
        progress: 65,
        startDate: "2024-10-15",
        endDate: "2024-12-31",
        totalBudget: 50000,
        totalSpent: 32500,
        campaigns: ["1", "2"],
        analytics: {
          totalReach: 18500,
          totalEngagement: 925,
          totalConversions: 67,
          totalSpend: 32500,
          overallROI: 2.8,
        },
        createdAt: "2024-10-15T10:00:00Z",
        updatedAt: "2024-11-02T14:30:00Z",
      }

      const mockCampaigns: Campaign[] = [
        {
          id: "1",
          name: "Diwali Special Menu",
          description: "Promote special Diwali menu items",
          objective: "conversion",
          status: "active",
          progress: 75,
          startDate: "2024-10-20",
          endDate: "2024-11-05",
          budget: 25000,
          spent: 18750,
          contentUnits: ["1", "2", "3"],
          strategyId: strategyId,
          analytics: {
            reach: 12500,
            engagement: 625,
            conversions: 45,
            spend: 18750,
            roi: 2.4,
          },
          createdAt: "2024-10-20T10:00:00Z",
          updatedAt: "2024-11-02T14:30:00Z",
        },
        {
          id: "2",
          name: "Customer Testimonials",
          description: "Showcase customer reviews and experiences",
          objective: "engagement",
          status: "active",
          progress: 50,
          startDate: "2024-10-25",
          endDate: "2024-11-25",
          budget: 15000,
          spent: 7500,
          contentUnits: ["4", "5"],
          strategyId: strategyId,
          analytics: {
            reach: 6000,
            engagement: 300,
            conversions: 22,
            spend: 7500,
            roi: 1.8,
          },
          createdAt: "2024-10-25T11:00:00Z",
          updatedAt: "2024-11-02T16:00:00Z",
        },
      ]

      setStrategy(mockStrategy)
      setCampaigns(mockCampaigns)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load strategy details",
        variant: "destructive",
      })
      router.push("/marketing/strategies")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case "reach":
        return <Users className="w-5 h-5" />
      case "engagement":
        return <TrendingUp className="w-5 h-5" />
      case "conversion":
        return <Target className="w-5 h-5" />
      default:
        return <Target className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!strategy) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Strategy Not Found</h2>
            <p className="text-gray-600 mt-2">The strategy you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/marketing/strategies")} className="mt-4">
              Back to Strategies
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/marketing/strategies")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Strategies
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                {getGoalIcon(strategy.goal)}
                <h1 className="text-3xl font-bold text-gray-900">{strategy.name}</h1>
                <Badge className={getStatusColor(strategy.status)} variant="secondary">
                  {strategy.status}
                </Badge>
              </div>
              <p className="text-gray-600">{strategy.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>Goal: {strategy.goal}</span>
                <span>•</span>
                <span>
                  {new Date(strategy.startDate).toLocaleDateString()} -{" "}
                  {new Date(strategy.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/marketing/strategies/${strategy.id}/analytics`)}
                className="bg-white"
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Analytics
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/marketing/strategies/${strategy.id}/edit`)}
                className="bg-white"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="bg-white">
                {strategy.status === "active" ? (
                  <>
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{strategy.progress}%</p>
                  <p className="text-xs text-gray-500">{strategy.campaigns.length} campaigns</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <Progress value={strategy.progress} className="h-2 mt-3" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reach</p>
                  <p className="text-2xl font-bold text-gray-900">{strategy.analytics.totalReach.toLocaleString()}</p>
                  <p className="text-xs text-green-600 font-medium">+15% vs target</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversions</p>
                  <p className="text-2xl font-bold text-gray-900">{strategy.analytics.totalConversions}</p>
                  <p className="text-xs text-purple-600 font-medium">Above target</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ROI</p>
                  <p className="text-2xl font-bold text-gray-900">{strategy.analytics.overallROI}x</p>
                  <p className="text-xs text-orange-600 font-medium">+12% growth</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaigns */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Strategy Campaigns</CardTitle>
                    <CardDescription>Campaigns within this strategy</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => router.push(`/marketing/campaigns/create?strategyId=${strategy.id}`)}
                    className="bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Campaign
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {campaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} showActions={true} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Strategy Info */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Strategy Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Goal:</span>
                  <p className="text-sm text-gray-900 capitalize">{strategy.goal}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">Template:</span>
                  <p className="text-sm text-gray-900">{strategy.template?.replace("_", " ")}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">Duration:</span>
                  <p className="text-sm text-gray-900">
                    {Math.ceil(
                      (new Date(strategy.endDate).getTime() - new Date(strategy.startDate).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">Budget Utilization:</span>
                  <div className="mt-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>
                        ₹{strategy.totalSpent.toLocaleString()} / ₹{strategy.totalBudget.toLocaleString()}
                      </span>
                      <span>{Math.round((strategy.totalSpent / strategy.totalBudget) * 100)}%</span>
                    </div>
                    <Progress value={(strategy.totalSpent / strategy.totalBudget) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            {metrics && !metricsLoading && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Performance Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {metrics.insights.map((insight, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">{insight.message}</p>
                      {insight.recommendation && <p className="text-xs text-gray-600 mt-1">{insight.recommendation}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white"
                  onClick={() => router.push(`/marketing/strategies/${strategy.id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Strategy
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white"
                  onClick={() => router.push(`/marketing/campaigns/create?strategyId=${strategy.id}`)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Campaign
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white"
                  onClick={() => router.push("/marketing/calendar")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white"
                  onClick={() => router.push(`/marketing/strategies/${strategy.id}/analytics`)}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
