"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Target,
  Eye,
  Edit,
  Trash2,
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
} from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function CampaignsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")

  const campaignStats = [
    { title: "Total Campaigns", value: "12", icon: Target, color: "text-blue-600" },
    { title: "Active Campaigns", value: "8", icon: Play, color: "text-green-600" },
    { title: "Total Budget", value: "₹45K", icon: DollarSign, color: "text-purple-600" },
    { title: "Avg ROI", value: "+35%", icon: TrendingUp, color: "text-orange-600" },
  ]

  const campaigns = [
    {
      id: "1",
      name: "Diwali Special Menu Campaign",
      type: "paid",
      status: "active",
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
      channels: ["Instagram", "Facebook", "YouTube"],
      budget: 0,
      spent: 0,
      duration: "Nov 1 - Nov 30, 2024",
      frequency: "Weekly",
      activities: [
        { name: "Content Creation", status: "active", progress: 60 },
        { name: "Community Engagement", status: "active", progress: 80 },
        { name: "User Generated Content", status: "pending", progress: 20 },
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
      name: "Customer Loyalty Email Series",
      type: "both",
      status: "scheduled",
      channels: ["Email", "WhatsApp"],
      budget: 5000,
      spent: 0,
      duration: "Nov 15 - Dec 15, 2024",
      frequency: "Bi-weekly",
      activities: [
        { name: "Email Template Design", status: "completed", progress: 100 },
        { name: "Customer Segmentation", status: "active", progress: 90 },
        { name: "Automation Setup", status: "pending", progress: 30 },
      ],
      analytics: {
        reach: "0",
        engagement: "0%",
        clicks: "0",
        conversions: "0",
      },
    },
  ]

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "scheduled":
        return "bg-blue-100 text-blue-700"
      case "paused":
        return "bg-yellow-100 text-yellow-700"
      case "completed":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700"
      case "active":
        return "bg-blue-100 text-blue-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (activeTab === "all") return true
    if (activeTab === "paid") return campaign.type === "paid" || campaign.type === "both"
    if (activeTab === "organic") return campaign.type === "organic" || campaign.type === "both"
    return campaign.status === activeTab
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/marketing")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketing Hub
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Campaign Management</h1>
              <p className="text-slate-600">Create and manage paid & organic marketing campaigns</p>
            </div>
            <Button className="flex items-center bg-slate-900 hover:bg-slate-800">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {campaignStats.map((stat, index) => (
            <Card key={index} className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.title}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Campaign Tabs */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Your Campaigns</CardTitle>
            <CardDescription>Manage all your marketing campaigns in one place</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="organic">Organic</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="space-y-6">
                  {filteredCampaigns.map((campaign) => (
                    <div key={campaign.id} className="border border-slate-200 rounded-lg p-6">
                      {/* Campaign Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-slate-900 text-lg">{campaign.name}</h3>
                            <Badge className={getStatusColor(campaign.status)} variant="secondary">
                              {campaign.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs capitalize">
                              {campaign.type}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-slate-500 mb-3">
                            <span>{campaign.duration}</span>
                            <span>•</span>
                            <span>{campaign.frequency}</span>
                          </div>
                          {/* Channels */}
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-600">Channels:</span>
                            {campaign.channels.map((channel, index) => (
                              <div key={index} className="flex items-center space-x-1">
                                {getChannelIcon(channel)}
                                <span className="text-xs text-slate-600">{channel}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            {campaign.status === "active" ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Activities */}
                        <div>
                          <h4 className="font-medium text-slate-900 mb-3">Campaign Activities</h4>
                          <div className="space-y-3">
                            {campaign.activities.map((activity, index) => (
                              <div key={index} className="p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-slate-900">{activity.name}</span>
                                  <Badge className={getActivityStatusColor(activity.status)} variant="secondary">
                                    {activity.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-slate-600">Progress</span>
                                  <span className="text-slate-600">{activity.progress}%</span>
                                </div>
                                <Progress value={activity.progress} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Analytics & Budget */}
                        <div className="space-y-4">
                          {/* Budget */}
                          {campaign.budget > 0 && (
                            <div>
                              <h4 className="font-medium text-slate-900 mb-3">Budget & Spend</h4>
                              <div className="p-3 bg-slate-50 rounded-lg">
                                <div className="flex justify-between text-sm mb-2">
                                  <span>Budget</span>
                                  <span>₹{campaign.budget.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span>Spent</span>
                                  <span>₹{campaign.spent.toLocaleString()}</span>
                                </div>
                                <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                                <div className="text-xs text-slate-500 mt-1">
                                  {Math.round((campaign.spent / campaign.budget) * 100)}% of budget used
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Analytics */}
                          <div>
                            <h4 className="font-medium text-slate-900 mb-3">Performance Analytics</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 bg-slate-50 rounded-lg text-center">
                                <div className="text-lg font-bold text-slate-900">{campaign.analytics.reach}</div>
                                <div className="text-xs text-slate-600">Reach</div>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg text-center">
                                <div className="text-lg font-bold text-slate-900">{campaign.analytics.engagement}</div>
                                <div className="text-xs text-slate-600">Engagement</div>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg text-center">
                                <div className="text-lg font-bold text-slate-900">{campaign.analytics.clicks}</div>
                                <div className="text-xs text-slate-600">Clicks</div>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg text-center">
                                <div className="text-lg font-bold text-slate-900">{campaign.analytics.conversions}</div>
                                <div className="text-xs text-slate-600">Conversions</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
