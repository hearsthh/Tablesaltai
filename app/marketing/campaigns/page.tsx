"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  TrendingUp,
  Globe,
  Menu,
  ArrowLeft,
  Plus,
  Target,
  DollarSign,
  BarChart3,
  Play,
  Pause,
  Edit,
  Trash2,
  Eye,
  Instagram,
  Facebook,
  Youtube,
  Search,
  Filter,
} from "lucide-react"

export default function CampaignsPage() {
  const router = useRouter()
  const [createCampaignOpen, setCreateCampaignOpen] = useState(false)

  const campaigns = [
    {
      id: "1",
      name: "Diwali Festival Menu",
      type: "paid",
      status: "active",
      budget: 25000,
      spent: 18500,
      duration: "2 weeks",
      frequency: "daily",
      channels: ["Instagram", "Facebook", "Google Ads"],
      startDate: "Nov 1, 2024",
      endDate: "Nov 15, 2024",
      objective: "Brand Awareness",
      reach: "12.5K",
      engagement: "4.2%",
      conversions: 156,
      activities: [
        { name: "Creative Design", status: "completed", progress: 100 },
        { name: "Ad Copy Writing", status: "completed", progress: 100 },
        { name: "Campaign Launch", status: "active", progress: 75 },
        { name: "Performance Optimization", status: "pending", progress: 0 },
      ],
    },
    {
      id: "2",
      name: "Weekend Brunch Promotion",
      type: "organic",
      status: "active",
      budget: 0,
      spent: 0,
      duration: "4 weeks",
      frequency: "weekly",
      channels: ["Instagram", "Facebook", "TikTok"],
      startDate: "Oct 15, 2024",
      endDate: "Nov 15, 2024",
      objective: "Engagement",
      reach: "8.2K",
      engagement: "6.8%",
      conversions: 89,
      activities: [
        { name: "Content Planning", status: "completed", progress: 100 },
        { name: "Photo Shoot", status: "completed", progress: 100 },
        { name: "Social Media Posts", status: "active", progress: 60 },
        { name: "Influencer Outreach", status: "pending", progress: 0 },
      ],
    },
    {
      id: "3",
      name: "Holiday Catering Campaign",
      type: "both",
      status: "draft",
      budget: 35000,
      spent: 0,
      duration: "6 weeks",
      frequency: "daily",
      channels: ["Google Ads", "Facebook", "Email", "Website"],
      startDate: "Dec 1, 2024",
      endDate: "Jan 15, 2025",
      objective: "Lead Generation",
      reach: "0",
      engagement: "0%",
      conversions: 0,
      activities: [
        { name: "Market Research", status: "active", progress: 40 },
        { name: "Landing Page Design", status: "pending", progress: 0 },
        { name: "Email Sequences", status: "pending", progress: 0 },
        { name: "Ad Creative", status: "pending", progress: 0 },
      ],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "draft":
        return "bg-gray-100 text-gray-700"
      case "paused":
        return "bg-yellow-100 text-yellow-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "paid":
        return "bg-red-100 text-red-700"
      case "organic":
        return "bg-green-100 text-green-700"
      case "both":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
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
        return <Search className="w-4 h-4 text-green-600" />
      default:
        return <Globe className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-semibold text-slate-900">TableSalt</span>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <Button variant="ghost" className="text-slate-500 rounded-md" onClick={() => router.push("/profile")}>
                  <Users className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="text-slate-900 font-medium rounded-md"
                  onClick={() => router.push("/marketing")}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Marketing
                </Button>
                <Button variant="ghost" className="text-slate-500 rounded-md">
                  <Users className="w-4 h-4 mr-2" />
                  Customers
                </Button>
                <Button variant="ghost" className="text-slate-500 rounded-md">
                  <Globe className="w-4 h-4 mr-2" />
                  Integrations
                </Button>
              </nav>
              <Button variant="ghost" size="icon" className="md:hidden rounded-md">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/marketing")} className="rounded-md">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketing Hub
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-slate-900">Marketing Campaigns</h1>
              <p className="text-slate-600 mt-2">Manage paid and organic campaigns across all channels</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex items-center rounded-md border-slate-200">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Dialog open={createCampaignOpen} onOpenChange={setCreateCampaignOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Campaign</DialogTitle>
                    <DialogDescription>
                      Set up a new marketing campaign with channels, budget, and activities
                    </DialogDescription>
                  </DialogHeader>
                  {/* Campaign creation form will go here */}
                  <div className="p-4 text-center text-slate-500">Campaign creation form coming soon...</div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">Active Campaigns</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-slate-900">8</div>
                <div className="text-sm text-green-600">+2 from last month</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-slate-700">Total Budget</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-slate-900">₹60K</div>
                <div className="text-sm text-slate-600">₹18.5K spent</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-slate-700">Avg. ROI</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-slate-900">324%</div>
                <div className="text-sm text-green-600">+45% improvement</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-slate-700">Total Reach</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-slate-900">20.7K</div>
                <div className="text-sm text-green-600">+18% from last month</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Campaigns</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="organic">Organic</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="space-y-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="border-slate-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <CardTitle className="text-xl">{campaign.name}</CardTitle>
                          <Badge className={getStatusColor(campaign.status)} variant="secondary">
                            {campaign.status}
                          </Badge>
                          <Badge className={getTypeColor(campaign.type)} variant="secondary">
                            {campaign.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span>
                            {campaign.startDate} - {campaign.endDate}
                          </span>
                          <span>•</span>
                          <span>{campaign.duration}</span>
                          <span>•</span>
                          <span>{campaign.frequency}</span>
                          <span>•</span>
                          <span>{campaign.objective}</span>
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
                          {campaign.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Campaign Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-xs text-slate-500">Budget</span>
                        <p className="font-medium">₹{campaign.budget.toLocaleString()}</p>
                        {campaign.budget > 0 && (
                          <>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">₹{campaign.spent.toLocaleString()} spent</p>
                          </>
                        )}
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Reach</span>
                        <p className="font-medium">{campaign.reach}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Engagement</span>
                        <p className="font-medium">{campaign.engagement}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Conversions</span>
                        <p className="font-medium">{campaign.conversions}</p>
                      </div>
                    </div>

                    {/* Channels */}
                    <div>
                      <span className="text-sm font-medium text-slate-700">Channels</span>
                      <div className="flex items-center space-x-2 mt-2">
                        {campaign.channels.map((channel, index) => (
                          <div key={index} className="flex items-center space-x-1 bg-slate-100 px-2 py-1 rounded">
                            {getChannelIcon(channel)}
                            <span className="text-xs">{channel}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Activities Progress */}
                    <div>
                      <span className="text-sm font-medium text-slate-700">Activities Progress</span>
                      <div className="space-y-3 mt-3">
                        {campaign.activities.map((activity, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-slate-700">{activity.name}</span>
                                <span className="text-xs text-slate-500">{activity.progress}%</span>
                              </div>
                              <Progress value={activity.progress} className="h-2" />
                            </div>
                            <Badge
                              className={`ml-3 ${
                                activity.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : activity.status === "active"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                              variant="secondary"
                            >
                              {activity.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="paid" className="space-y-6">
            <div className="space-y-6">
              {campaigns
                .filter((c) => c.type === "paid" || c.type === "both")
                .map((campaign) => (
                  <Card key={campaign.id} className="border-slate-200">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-slate-900 mb-2">{campaign.name}</h3>
                        <p className="text-slate-600">Paid campaign details...</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="organic" className="space-y-6">
            <div className="space-y-6">
              {campaigns
                .filter((c) => c.type === "organic" || c.type === "both")
                .map((campaign) => (
                  <Card key={campaign.id} className="border-slate-200">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-slate-900 mb-2">{campaign.name}</h3>
                        <p className="text-slate-600">Organic campaign details...</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Campaign Analytics</CardTitle>
                <CardDescription>Performance metrics across all campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Analytics Dashboard</h3>
                  <p className="text-slate-500">Detailed analytics and reporting coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
