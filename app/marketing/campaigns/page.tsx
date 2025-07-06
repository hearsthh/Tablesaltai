"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Target,
  Eye,
  Edit,
  Play,
  Pause,
  Plus,
  DollarSign,
  TrendingUp,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  Mail,
  Filter,
  Download,
  MoreHorizontal,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

interface Campaign {
  id: string
  name: string
  type: "paid" | "organic" | "both"
  status: "active" | "paused" | "completed" | "draft" | "scheduled"
  progress: number
  channels: string[]
  budget?: number
  spent?: number
  duration: string
  frequency: string
  activities: Array<{
    name: string
    status: string
    progress: number
  }>
  analytics: {
    reach: string
    engagement: string
    clicks: string
    conversions: string
  }
}

export default function CampaignsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  const campaignStats = [
    { title: "Total Campaigns", value: "12", icon: Target, color: "text-blue-600" },
    { title: "Active Campaigns", value: "8", icon: Play, color: "text-green-600" },
    { title: "Total Budget", value: "₹45K", icon: DollarSign, color: "text-purple-600" },
    { title: "Avg ROI", value: "+35%", icon: TrendingUp, color: "text-orange-600" },
  ]

  const mockCampaigns: Campaign[] = [
    {
      id: "1",
      name: "Diwali Special Menu Campaign",
      type: "paid",
      status: "active",
      progress: 75,
      channels: ["Instagram", "Facebook", "Google Ads"],
      budget: 15000,
      spent: 8500,
      duration: "Oct 20 - Nov 5, 2024",
      frequency: "Daily",
      activities: [
        { name: "Social Media Posts", status: "completed", progress: 100 },
        { name: "Google Ads Setup", status: "active", progress: 75 },
        { name: "Influencer Outreach", status: "pending", progress: 0 },
      ],
      analytics: {
        reach: "3.2K",
        engagement: "4.2%",
        clicks: "156",
        conversions: "23",
      },
    },
    {
      id: "2",
      name: "Weekend Brunch Organic Push",
      type: "organic",
      status: "active",
      progress: 60,
      channels: ["Instagram", "Facebook", "YouTube"],
      budget: 0,
      spent: 0,
      duration: "Nov 1 - Nov 30, 2024",
      frequency: "Weekly",
      activities: [
        { name: "Content Creation", status: "active", progress: 60 },
        { name: "Story Highlights", status: "completed", progress: 100 },
        { name: "Reel Production", status: "pending", progress: 20 },
      ],
      analytics: {
        reach: "1.8K",
        engagement: "6.1%",
        clicks: "89",
        conversions: "12",
      },
    },
    {
      id: "3",
      name: "Customer Loyalty Program Launch",
      type: "both",
      status: "scheduled",
      progress: 25,
      channels: ["Email", "WhatsApp", "Website"],
      budget: 8000,
      spent: 0,
      duration: "Nov 15 - Dec 15, 2024",
      frequency: "Bi-weekly",
      activities: [
        { name: "Email Templates", status: "active", progress: 50 },
        { name: "WhatsApp Automation", status: "pending", progress: 0 },
        { name: "Landing Page", status: "pending", progress: 10 },
      ],
      analytics: {
        reach: "0",
        engagement: "0%",
        clicks: "0",
        conversions: "0",
      },
    },
    {
      id: "4",
      name: "Holiday Season Mega Campaign",
      type: "paid",
      status: "draft",
      progress: 10,
      channels: ["Instagram", "Facebook", "Google Ads", "YouTube"],
      budget: 25000,
      spent: 0,
      duration: "Dec 1 - Jan 15, 2025",
      frequency: "Daily",
      activities: [
        { name: "Strategy Planning", status: "active", progress: 30 },
        { name: "Creative Development", status: "pending", progress: 0 },
        { name: "Ad Account Setup", status: "pending", progress: 0 },
      ],
      analytics: {
        reach: "0",
        engagement: "0%",
        clicks: "0",
        conversions: "0",
      },
    },
    {
      id: "5",
      name: "Local Community Engagement",
      type: "organic",
      status: "completed",
      progress: 100,
      channels: ["Instagram", "Facebook"],
      budget: 0,
      spent: 0,
      duration: "Sep 1 - Oct 15, 2024",
      frequency: "Daily",
      activities: [
        { name: "Community Posts", status: "completed", progress: 100 },
        { name: "Local Hashtags", status: "completed", progress: 100 },
        { name: "User Generated Content", status: "completed", progress: 100 },
      ],
      analytics: {
        reach: "2.1K",
        engagement: "5.8%",
        clicks: "134",
        conversions: "18",
      },
    },
  ]

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCampaigns(mockCampaigns)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive",
      })
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
      case "scheduled":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "paid":
        return "bg-red-100 text-red-800"
      case "organic":
        return "bg-green-100 text-green-800"
      case "both":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case "instagram":
        return <Instagram className="w-4 h-4 text-pink-600" />
      case "facebook":
        return <Facebook className="w-4 h-4 text-blue-600" />
      case "youtube":
        return <Youtube className="w-4 h-4 text-red-600" />
      case "google ads":
        return <Globe className="w-4 h-4 text-green-600" />
      case "email":
        return <Mail className="w-4 h-4 text-purple-600" />
      default:
        return <Globe className="w-4 h-4 text-gray-600" />
    }
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (activeTab === "all") return true
    if (activeTab === "paid") return campaign.type === "paid" || campaign.type === "both"
    if (activeTab === "organic") return campaign.type === "organic" || campaign.type === "both"
    return campaign.status === activeTab
  })

  const handleCampaignAction = async (campaignId: string, action: string) => {
    try {
      const response = await fetch(`/api/marketing/campaigns/${campaignId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Campaign ${action} successfully`,
        })
        fetchCampaigns()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} campaign`,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/marketing")}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketing Hub
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Campaign Management</h1>
              <p className="text-gray-600 mt-2">Create and manage paid & organic marketing campaigns</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex items-center justify-center bg-white border-gray-300 hover:bg-gray-50 text-gray-700 h-12 rounded-lg"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center bg-white border-gray-300 hover:bg-gray-50 text-gray-700 h-12 rounded-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={() => router.push("/marketing/campaigns/create")}
                className="flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white h-12 rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {campaignStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Campaigns List */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>All Campaigns</CardTitle>
            <CardDescription>Manage your marketing campaigns in one place</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="organic">Organic</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {filteredCampaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
                    <p className="text-gray-600 mb-4">Create your first campaign to get started</p>
                    <Button
                      onClick={() => router.push("/marketing/campaigns/create")}
                      className="bg-gray-900 hover:bg-gray-800 text-white h-10 rounded-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Campaign
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCampaigns.map((campaign) => (
                      <Card key={campaign.id} className="border border-gray-200 hover:shadow-md transition-all">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            {/* Campaign Info */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <h3 className="font-semibold text-gray-900 text-lg">{campaign.name}</h3>
                                <Badge className={getStatusColor(campaign.status)} variant="secondary">
                                  {campaign.status}
                                </Badge>
                                <Badge className={getTypeColor(campaign.type)} variant="secondary">
                                  {campaign.type}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-gray-600">Duration</p>
                                  <p className="font-medium text-gray-900">{campaign.duration}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Frequency</p>
                                  <p className="font-medium text-gray-900">{campaign.frequency}</p>
                                </div>
                                {campaign.budget && campaign.budget > 0 && (
                                  <div>
                                    <p className="text-sm text-gray-600">Budget</p>
                                    <p className="font-medium text-gray-900">
                                      ₹{campaign.spent?.toLocaleString()} / ₹{campaign.budget.toLocaleString()}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm text-gray-600">Progress</p>
                                  <p className="font-medium text-gray-900">{campaign.progress}%</p>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="mb-4">
                                <Progress value={campaign.progress} className="h-2" />
                              </div>

                              {/* Channels */}
                              <div className="flex items-center space-x-2 mb-4">
                                <span className="text-sm text-gray-600">Channels:</span>
                                <div className="flex items-center space-x-2">
                                  {campaign.channels.map((channel, index) => (
                                    <div key={index} className="flex items-center space-x-1">
                                      {getChannelIcon(channel)}
                                      <span className="text-sm text-gray-700">{channel}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Activities */}
                              <div className="mb-4">
                                <p className="text-sm font-medium text-gray-900 mb-2">Campaign Activities</p>
                                <div className="space-y-2">
                                  {campaign.activities.map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        <div
                                          className={`w-2 h-2 rounded-full ${
                                            activity.status === "completed"
                                              ? "bg-green-500"
                                              : activity.status === "active"
                                                ? "bg-blue-500"
                                                : "bg-gray-300"
                                          }`}
                                        />
                                        <span className="text-sm text-gray-700">{activity.name}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Badge className={getStatusColor(activity.status)} variant="secondary">
                                          {activity.status}
                                        </Badge>
                                        <span className="text-xs text-gray-500">{activity.progress}%</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Analytics */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
                                <div className="text-center">
                                  <div className="text-sm font-medium text-gray-900">{campaign.analytics.reach}</div>
                                  <div className="text-xs text-gray-500">Reach</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-sm font-medium text-gray-900">
                                    {campaign.analytics.engagement}
                                  </div>
                                  <div className="text-xs text-gray-500">Engagement</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-sm font-medium text-gray-900">{campaign.analytics.clicks}</div>
                                  <div className="text-xs text-gray-500">Clicks</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-sm font-medium text-gray-900">
                                    {campaign.analytics.conversions}
                                  </div>
                                  <div className="text-xs text-gray-500">Conversions</div>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col space-y-2 lg:ml-6">
                              <Button
                                onClick={() => router.push(`/marketing/campaigns/${campaign.id}`)}
                                variant="outline"
                                size="sm"
                                className="w-full lg:w-auto bg-white border-gray-300 h-10 rounded-lg"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>

                              <Button
                                onClick={() => router.push(`/marketing/campaigns/${campaign.id}/edit`)}
                                variant="outline"
                                size="sm"
                                className="w-full lg:w-auto bg-white border-gray-300 h-10 rounded-lg"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>

                              {campaign.status === "active" ? (
                                <Button
                                  onClick={() => handleCampaignAction(campaign.id, "pause")}
                                  variant="outline"
                                  size="sm"
                                  className="w-full lg:w-auto bg-white border-gray-300 h-10 rounded-lg"
                                >
                                  <Pause className="w-4 h-4 mr-2" />
                                  Pause
                                </Button>
                              ) : campaign.status === "paused" ? (
                                <Button
                                  onClick={() => handleCampaignAction(campaign.id, "resume")}
                                  variant="outline"
                                  size="sm"
                                  className="w-full lg:w-auto bg-white border-gray-300 h-10 rounded-lg"
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Resume
                                </Button>
                              ) : null}

                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full lg:w-auto bg-white border-gray-300 h-10 rounded-lg"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
