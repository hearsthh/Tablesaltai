"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  Target,
  Plus,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Play,
  Pause,
  MoreHorizontal,
  ArrowRight,
  Megaphone,
  Filter,
  Search,
} from "lucide-react"
import { Navigation, MobileBottomNavigation } from "@/components/navigation"
import { UnifiedDataService } from "@/lib/services/unified-data-service"
import type { Strategy, Campaign } from "@/lib/types/unified-data"
import { useRouter } from "next/navigation"

export default function StrategyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("strategies")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const restaurantId = "restaurant-1"
      const [strategiesData, campaignsData] = await Promise.all([
        UnifiedDataService.getStrategies(restaurantId),
        UnifiedDataService.getCampaigns(restaurantId),
      ])
      setStrategies(strategiesData)
      setCampaigns(campaignsData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load strategy data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCampaignTypeColor = (type: string) => {
    switch (type) {
      case "promotion":
        return "bg-red-100 text-red-800 border-red-200"
      case "engagement":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "retention":
        return "bg-green-100 text-green-800 border-green-200"
      case "acquisition":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const calculateStrategyProgress = (strategy: Strategy) => {
    const now = new Date()
    const start = new Date(strategy.duration.startDate)
    const end = new Date(strategy.duration.endDate)
    const total = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    return Math.min(Math.max((elapsed / total) * 100, 0), 100)
  }

  const getLinkedCampaigns = (strategyId: string) => {
    return campaigns.filter((c) => c.strategyId === strategyId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading strategies...</p>
          </div>
        </div>
        <MobileBottomNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <div className="flex-1 pb-16 md:pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Strategy & Campaigns</h1>
                <p className="text-gray-600 mt-1">Plan, execute, and track your marketing initiatives</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="bg-white">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button
                  onClick={() => router.push("/marketing/strategy/create")}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Strategy
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{strategies.length}</p>
                  <p className="text-sm text-gray-600">Active Strategies</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Megaphone className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                  <p className="text-sm text-gray-600">Total Campaigns</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">₹45K</p>
                  <p className="text-sm text-gray-600">Total Budget</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-yellow-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">+28%</p>
                  <p className="text-sm text-gray-600">Avg ROI</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="strategies">Strategies</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            </TabsList>

            <TabsContent value="strategies" className="space-y-6">
              {strategies.length === 0 ? (
                <Card className="border-gray-100">
                  <CardContent className="p-12 text-center">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Strategies Yet</h3>
                    <p className="text-gray-600 mb-6">Create your first marketing strategy to get started</p>
                    <Button
                      onClick={() => router.push("/marketing/strategy/create")}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Strategy
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {strategies.map((strategy) => {
                    const progress = calculateStrategyProgress(strategy)
                    const linkedCampaigns = getLinkedCampaigns(strategy.id)

                    return (
                      <Card key={strategy.id} className="border-gray-100 hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">{strategy.title}</h3>
                                <Badge className={getStatusColor(strategy.status)} variant="outline">
                                  {strategy.status}
                                </Badge>
                              </div>

                              <p className="text-gray-600 mb-4">{strategy.description}</p>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-gray-500">Goal</p>
                                  <p className="font-medium">{strategy.goal}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Target Segment</p>
                                  <p className="font-medium">{strategy.targetSegment.join(", ")}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Duration</p>
                                  <p className="font-medium">
                                    {new Date(strategy.duration.startDate).toLocaleDateString()} -
                                    {new Date(strategy.duration.endDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-600">Progress</span>
                                  <span className="text-sm font-medium">{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                              </div>

                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Megaphone className="w-4 h-4" />
                                  <span>{linkedCampaigns.length} campaigns</span>
                                </div>
                                {strategy.budget && (
                                  <div className="flex items-center space-x-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span>₹{strategy.budget.toLocaleString()}</span>
                                  </div>
                                )}
                                {strategy.actualROI && (
                                  <div className="flex items-center space-x-1">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>{strategy.actualROI}% ROI</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col space-y-2 lg:ml-6">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/marketing/strategy/${strategy.id}`)}
                                className="bg-white"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/marketing/strategy/${strategy.id}/edit`)}
                                className="bg-white"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="bg-white">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Linked Campaigns Preview */}
                          {linkedCampaigns.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-gray-100">
                              <h4 className="text-sm font-medium text-gray-900 mb-3">Linked Campaigns</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {linkedCampaigns.slice(0, 3).map((campaign) => (
                                  <div key={campaign.id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <h5 className="font-medium text-sm">{campaign.title}</h5>
                                      <Badge className={getStatusColor(campaign.status)} variant="outline">
                                        {campaign.status}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                                      <Badge className={getCampaignTypeColor(campaign.type)} variant="outline">
                                        {campaign.type}
                                      </Badge>
                                      <span>{campaign.channels.length} channels</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {linkedCampaigns.length > 3 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-3 text-blue-600 hover:text-blue-700"
                                  onClick={() => router.push(`/marketing/strategy/${strategy.id}`)}
                                >
                                  View {linkedCampaigns.length - 3} more campaigns
                                  <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-6">
              {campaigns.length === 0 ? (
                <Card className="border-gray-100">
                  <CardContent className="p-12 text-center">
                    <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Campaigns Yet</h3>
                    <p className="text-gray-600 mb-6">Create your first campaign to start marketing</p>
                    <Button
                      onClick={() => router.push("/marketing/campaigns/create")}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Campaign
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <Card key={campaign.id} className="border-gray-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                              <Badge className={getStatusColor(campaign.status)} variant="outline">
                                {campaign.status}
                              </Badge>
                              <Badge className={getCampaignTypeColor(campaign.type)} variant="outline">
                                {campaign.type}
                              </Badge>
                            </div>

                            <p className="text-gray-600 mb-4">{campaign.description}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-500">Reach</p>
                                <p className="font-medium">{campaign.performance.reach.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Engagement</p>
                                <p className="font-medium">{campaign.performance.engagement.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Conversions</p>
                                <p className="font-medium">{campaign.performance.conversions}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Revenue</p>
                                <p className="font-medium">₹{campaign.performance.revenue.toLocaleString()}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                                  {new Date(campaign.endDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{campaign.targetSegment.join(", ")}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Megaphone className="w-4 h-4" />
                                <span>{campaign.channels.length} channels</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2 lg:ml-6">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/marketing/campaigns/${campaign.id}`)}
                              className="bg-white"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/marketing/campaigns/${campaign.id}/edit`)}
                              className="bg-white"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            {campaign.status === "active" ? (
                              <Button variant="outline" size="sm" className="bg-white">
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                              </Button>
                            ) : campaign.status === "paused" ? (
                              <Button variant="outline" size="sm" className="bg-white">
                                <Play className="w-4 h-4 mr-2" />
                                Resume
                              </Button>
                            ) : null}
                          </div>
                        </div>

                        {/* Content Units Preview */}
                        {campaign.contentUnits.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Content Units</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              {campaign.contentUnits.slice(0, 4).map((content) => (
                                <div key={content.id} className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-gray-700 capitalize">
                                      {content.channel}
                                    </span>
                                    <Badge className={getStatusColor(content.status)} variant="outline">
                                      {content.status}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 capitalize">{content.type}</p>
                                  {content.scheduledDate && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      {new Date(content.scheduledDate).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <MobileBottomNavigation />
    </div>
  )
}
