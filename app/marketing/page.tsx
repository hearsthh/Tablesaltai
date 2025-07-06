"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import {
  Play,
  Pause,
  Square,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Plus,
  Settings,
  Instagram,
  MessageCircle,
  Facebook,
  Globe,
  Mail,
  Eye,
  Calendar,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data
const mockChannels = [
  {
    id: "instagram",
    name: "Instagram",
    icon: "📷",
    color: "text-pink-600",
    status: "connected" as const,
    analytics: {
      followers: 12500,
      engagement: 890,
      reach: 15200,
      posts: 45,
      avgEngagementRate: 7.2,
    },
    lastSync: "2024-01-15T10:30:00Z",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "💬",
    color: "text-green-600",
    status: "connected" as const,
    analytics: {
      followers: 850,
      engagement: 756,
      reach: 8900,
      posts: 12,
      avgEngagementRate: 89.2,
    },
    lastSync: "2024-01-15T09:15:00Z",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "📘",
    color: "text-blue-600",
    status: "disconnected" as const,
    analytics: {
      followers: 8200,
      engagement: 445,
      reach: 12400,
      posts: 23,
      avgEngagementRate: 5.4,
    },
  },
  {
    id: "website",
    name: "Website",
    icon: "🌐",
    color: "text-purple-600",
    status: "pending" as const,
    analytics: {
      followers: 0,
      engagement: 0,
      reach: 2400,
      posts: 8,
      avgEngagementRate: 12.5,
    },
  },
]

const mockStrategies = [
  {
    id: "1",
    name: "Weekend Special Promotion",
    description: "Drive weekend traffic with special offers and social media campaigns",
    status: "active" as const,
    progress: 75,
    goal: "Increase weekend revenue by 30%",
    targetAudience: "Local food enthusiasts",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    totalBudget: 25000,
    totalSpent: 18750,
    campaigns: ["1", "2"],
    analytics: {
      reach: 15200,
      engagement: 890,
      conversions: 45,
      spend: 18750,
      revenue: 45000,
      roi: 2.4,
      overallROI: 2.4,
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "New Menu Launch",
    description: "Introduce new seasonal dishes with comprehensive marketing campaign",
    status: "draft" as const,
    progress: 25,
    goal: "Generate awareness for new menu items",
    targetAudience: "Food lovers aged 25-45",
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    totalBudget: 40000,
    totalSpent: 5000,
    campaigns: ["3"],
    analytics: {
      reach: 0,
      engagement: 0,
      conversions: 0,
      spend: 5000,
      revenue: 0,
      roi: 0,
      overallROI: 0,
    },
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-12T14:20:00Z",
  },
]

const mockCampaigns = [
  {
    id: "1",
    name: "Instagram Stories Campaign",
    description: "Daily stories showcasing weekend specials",
    objective: "conversion" as const,
    status: "active" as const,
    progress: 80,
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    budget: 10000,
    spent: 7500,
    contentUnits: ["1", "2"],
    strategyId: "1",
    analytics: {
      reach: 8500,
      engagement: 425,
      conversions: 25,
      spend: 7500,
      revenue: 22500,
      roi: 3.0,
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "WhatsApp Broadcast",
    description: "Direct offers to loyal customers via WhatsApp",
    objective: "engagement" as const,
    status: "scheduled" as const,
    progress: 0,
    startDate: "2024-01-15",
    endDate: "2024-01-31",
    budget: 5000,
    spent: 0,
    contentUnits: ["3"],
    strategyId: "1",
    analytics: {
      reach: 0,
      engagement: 0,
      conversions: 0,
      spend: 0,
      revenue: 0,
      roi: 0,
    },
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-10T16:45:00Z",
  },
]

const mockContentUnits = [
  {
    id: "1",
    title: "Weekend Special Announcement",
    description: "Eye-catching post about weekend discounts",
    channel: "instagram",
    contentType: "post" as const,
    status: "published" as const,
    currentStep: 7,
    totalSteps: 7,
    publishedDate: "2024-01-10T10:00:00Z",
    campaignId: "1",
    strategyId: "1",
    analytics: {
      reach: 2400,
      engagement: 156,
      clicks: 45,
      conversions: 12,
      spend: 0,
    },
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "2",
    title: "Behind the Scenes Video",
    description: "Chef preparing signature dishes",
    channel: "instagram",
    contentType: "reel" as const,
    status: "scheduled" as const,
    currentStep: 6,
    totalSteps: 7,
    scheduledDate: "2024-01-16T18:00:00Z",
    campaignId: "1",
    strategyId: "1",
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-14T09:30:00Z",
  },
  {
    id: "3",
    title: "Customer Testimonial",
    description: "Happy customer sharing their experience",
    channel: "whatsapp",
    contentType: "broadcast" as const,
    status: "ready" as const,
    currentStep: 5,
    totalSteps: 7,
    campaignId: "2",
    strategyId: "1",
    createdAt: "2024-01-13T00:00:00Z",
    updatedAt: "2024-01-15T11:20:00Z",
  },
  {
    id: "4",
    title: "Menu Photography",
    description: "Professional photos of new dishes",
    channel: "instagram",
    contentType: "post" as const,
    status: "pending" as const,
    currentStep: 2,
    totalSteps: 7,
    campaignId: "3",
    strategyId: "2",
    createdAt: "2024-01-14T00:00:00Z",
    updatedAt: "2024-01-15T08:45:00Z",
  },
]

export default function MarketingPage() {
  const router = useRouter()
  const [showChannels, setShowChannels] = useState(false)
  const [activeTab, setActiveTab] = useState("strategies")

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      case "published":
        return "bg-green-100 text-green-800"
      case "ready":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "connected":
        return "bg-green-100 text-green-800"
      case "disconnected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getChannelIcon = (channelId: string) => {
    const iconMap: { [key: string]: any } = {
      instagram: Instagram,
      whatsapp: MessageCircle,
      facebook: Facebook,
      website: Globe,
      email: Mail,
    }
    return iconMap[channelId] || Globe
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-3 h-3" />
      case "scheduled":
        return <Clock className="w-3 h-3" />
      case "ready":
        return <CheckCircle className="w-3 h-3" />
      case "pending":
        return <AlertCircle className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  const handleStrategyAction = (action: string, id: string) => {
    console.log(`${action} strategy:`, id)
    // Implement actual actions here
  }

  const handleCampaignAction = (action: string, id: string) => {
    console.log(`${action} campaign:`, id)
    // Implement actual actions here
  }

  const handleChannelAction = (action: string, id: string) => {
    console.log(`${action} channel:`, id)
    // Implement actual actions here
  }

  // Calculate totals
  const totalReach = mockStrategies.reduce((sum, s) => sum + s.analytics.reach, 0)
  const totalEngagement = mockStrategies.reduce((sum, s) => sum + s.analytics.engagement, 0)
  const totalConversions = mockStrategies.reduce((sum, s) => sum + s.analytics.conversions, 0)
  const totalSpend = mockStrategies.reduce((sum, s) => sum + s.analytics.spend, 0)
  const totalRevenue = mockStrategies.reduce((sum, s) => sum + s.analytics.revenue, 0)
  const averageROI = totalSpend > 0 ? totalRevenue / totalSpend : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="mb-3 sm:mb-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Marketing Hub</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your restaurant's marketing campaigns</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChannels(!showChannels)}
                className="bg-white text-xs sm:text-sm"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Channels
              </Button>
              <Button
                size="sm"
                onClick={() => router.push("/marketing/strategies/create")}
                className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Create
              </Button>
            </div>
          </div>

          {/* Channels Modal */}
          {showChannels && (
            <Card className="mb-4 border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg">Marketing Channels</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowChannels(false)} className="text-xs">
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {mockChannels.map((channel) => {
                    const IconComponent = getChannelIcon(channel.id)
                    return (
                      <div key={channel.id} className="p-3 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <IconComponent className={`w-4 h-4 ${channel.color}`} />
                            <span className="text-sm font-medium text-gray-900">{channel.name}</span>
                          </div>
                          <Badge className={getStatusColor(channel.status)} variant="secondary">
                            {channel.status}
                          </Badge>
                        </div>
                        {channel.analytics && (
                          <div className="text-xs text-gray-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Followers:</span>
                              <span className="font-medium">{formatNumber(channel.analytics.followers)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Engagement:</span>
                              <span className="font-medium">{channel.analytics.avgEngagementRate}%</span>
                            </div>
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2 text-xs bg-white"
                          onClick={() =>
                            handleChannelAction(channel.status === "connected" ? "disconnect" : "connect", channel.id)
                          }
                        >
                          {channel.status === "connected" ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analytics Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
            <Card className="border-gray-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Reach</p>
                    <p className="text-sm sm:text-lg font-bold text-gray-900">{formatNumber(totalReach)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600">Engagement</p>
                    <p className="text-sm sm:text-lg font-bold text-gray-900">{formatNumber(totalEngagement)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">Conversions</p>
                    <p className="text-sm sm:text-lg font-bold text-gray-900">{totalConversions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  <div>
                    <p className="text-xs text-gray-600">Spend</p>
                    <p className="text-sm sm:text-lg font-bold text-gray-900">{formatCurrency(totalSpend)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-600">Revenue</p>
                    <p className="text-sm sm:text-lg font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                  <div>
                    <p className="text-xs text-gray-600">ROI</p>
                    <p className="text-sm sm:text-lg font-bold text-gray-900">{averageROI.toFixed(1)}x</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger value="strategies" className="text-xs sm:text-sm">
              Strategies
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="text-xs sm:text-sm">
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="channels" className="text-xs sm:text-sm">
              Channels
            </TabsTrigger>
            <TabsTrigger value="content" className="text-xs sm:text-sm">
              Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="strategies" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Marketing Strategies</h2>
              <Button
                size="sm"
                onClick={() => router.push("/marketing/strategies/create")}
                className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                New Strategy
              </Button>
            </div>

            <div className="space-y-3">
              {mockStrategies.map((strategy) => (
                <Card key={strategy.id} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <div className="flex-1 mb-2 sm:mb-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{strategy.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">{strategy.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(strategy.status)}>{strategy.status}</Badge>
                        <div className="flex items-center space-x-1">
                          {strategy.status === "active" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStrategyAction("pause", strategy.id)}
                              className="bg-white text-xs px-2 py-1"
                            >
                              <Pause className="w-3 h-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStrategyAction("start", strategy.id)}
                              className="bg-white text-xs px-2 py-1"
                            >
                              <Play className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStrategyAction("stop", strategy.id)}
                            className="bg-white text-xs px-2 py-1"
                          >
                            <Square className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{strategy.progress}%</span>
                      </div>
                      <Progress value={strategy.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-gray-600">Budget:</span>
                        <div className="font-medium">{formatCurrency(strategy.totalBudget)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Spent:</span>
                        <div className="font-medium">{formatCurrency(strategy.totalSpent)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Revenue:</span>
                        <div className="font-medium">{formatCurrency(strategy.analytics.revenue)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">ROI:</span>
                        <div className="font-medium">{strategy.analytics.roi}x</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-600">
                        {strategy.campaigns.length} campaigns • {strategy.analytics.reach} reach
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/marketing/strategies/${strategy.id}`)}
                        className="bg-white text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Marketing Campaigns</h2>
              <Button
                size="sm"
                onClick={() => router.push("/marketing/campaigns/create")}
                className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                New Campaign
              </Button>
            </div>

            <div className="space-y-3">
              {mockCampaigns.map((campaign) => (
                <Card key={campaign.id} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <div className="flex-1 mb-2 sm:mb-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{campaign.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">{campaign.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                        <div className="flex items-center space-x-1">
                          {campaign.status === "active" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCampaignAction("pause", campaign.id)}
                              className="bg-white text-xs px-2 py-1"
                            >
                              <Pause className="w-3 h-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCampaignAction("start", campaign.id)}
                              className="bg-white text-xs px-2 py-1"
                            >
                              <Play className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCampaignAction("stop", campaign.id)}
                            className="bg-white text-xs px-2 py-1"
                          >
                            <Square className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{campaign.progress}%</span>
                      </div>
                      <Progress value={campaign.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-gray-600">Budget:</span>
                        <div className="font-medium">{formatCurrency(campaign.budget)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Spent:</span>
                        <div className="font-medium">{formatCurrency(campaign.spent)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Revenue:</span>
                        <div className="font-medium">{formatCurrency(campaign.analytics.revenue)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">ROI:</span>
                        <div className="font-medium">{campaign.analytics.roi}x</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-600">
                        {campaign.contentUnits.length} content units • {campaign.objective}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/marketing/campaigns/${campaign.id}`)}
                        className="bg-white text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="channels" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Marketing Channels</h2>
              <Button
                size="sm"
                onClick={() => router.push("/marketing/integrations")}
                className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Add Channel
              </Button>
            </div>

            <div className="space-y-3">
              {mockChannels.map((channel) => {
                const IconComponent = getChannelIcon(channel.id)
                return (
                  <Card key={channel.id} className="border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                          <IconComponent className={`w-5 h-5 ${channel.color}`} />
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{channel.name}</h3>
                            <p className="text-xs text-gray-600">
                              {channel.lastSync
                                ? `Last sync: ${new Date(channel.lastSync).toLocaleDateString()}`
                                : "Not synced"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(channel.status)}>{channel.status}</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleChannelAction(channel.status === "connected" ? "disconnect" : "connect", channel.id)
                            }
                            className="bg-white text-xs px-2 py-1"
                          >
                            <Settings className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {channel.analytics && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-gray-600">Followers:</span>
                            <div className="font-medium">{formatNumber(channel.analytics.followers)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Reach:</span>
                            <div className="font-medium">{formatNumber(channel.analytics.reach)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Engagement:</span>
                            <div className="font-medium">{formatNumber(channel.analytics.engagement)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Avg Rate:</span>
                            <div className="font-medium">{channel.analytics.avgEngagementRate}%</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Content Units</h2>
              <Button
                size="sm"
                onClick={() => router.push("/marketing/content-units/create")}
                className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                New Content
              </Button>
            </div>

            <div className="space-y-3">
              {mockContentUnits.map((content) => {
                const IconComponent = getChannelIcon(content.channel)
                return (
                  <Card key={content.id} className="border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                          <IconComponent className="w-4 h-4 text-gray-600" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{content.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">{content.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(content.status)}>
                            {getStatusIcon(content.status)}
                            <span className="ml-1">{content.status}</span>
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/marketing/content-units/${content.id}/edit`)}
                            className="bg-white text-xs px-2 py-1"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Completion</span>
                          <span className="font-medium">
                            {Math.round((content.currentStep / content.totalSteps) * 100)}%
                          </span>
                        </div>
                        <Progress value={(content.currentStep / content.totalSteps) * 100} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-600">
                            Channel: <span className="font-medium capitalize">{content.channel}</span>
                          </span>
                          <span className="text-gray-600">
                            Type: <span className="font-medium capitalize">{content.contentType}</span>
                          </span>
                        </div>
                        {content.status === "scheduled" && content.scheduledDate && (
                          <div className="flex items-center space-x-1 text-blue-600">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(content.scheduledDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {content.status === "published" && content.analytics && (
                          <div className="text-gray-600">{formatNumber(content.analytics.reach)} reach</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
