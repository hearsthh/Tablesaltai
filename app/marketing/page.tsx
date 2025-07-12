"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Users,
  Eye,
  Heart,
  Share2,
  Calendar,
  Target,
  Sparkles,
  Plus,
  BarChart3,
  MessageSquare,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react"

// Static data for fast loading
const staticData = {
  campaigns: [
    {
      id: "1",
      name: "Weekend Special Promotion",
      status: "active",
      platform: "instagram",
      reach: 12500,
      engagement: 8.5,
      budget: 5000,
      spent: 3200,
      startDate: "2024-01-15",
      endDate: "2024-01-31",
    },
    {
      id: "2",
      name: "New Menu Launch",
      status: "draft",
      platform: "facebook",
      reach: 0,
      engagement: 0,
      budget: 8000,
      spent: 0,
      startDate: "2024-02-01",
      endDate: "2024-02-15",
    },
    {
      id: "3",
      name: "Customer Reviews Showcase",
      status: "completed",
      platform: "twitter",
      reach: 8900,
      engagement: 12.3,
      budget: 3000,
      spent: 3000,
      startDate: "2024-01-01",
      endDate: "2024-01-14",
    },
  ],
  content: [
    {
      id: "1",
      type: "post",
      platform: "instagram",
      title: "Today's Special: Butter Chicken",
      status: "published",
      engagement: 245,
      reach: 1800,
      publishedAt: "2024-01-20T10:00:00Z",
    },
    {
      id: "2",
      type: "story",
      platform: "instagram",
      title: "Behind the Kitchen",
      status: "scheduled",
      engagement: 0,
      reach: 0,
      publishedAt: "2024-01-21T18:00:00Z",
    },
    {
      id: "3",
      type: "post",
      platform: "facebook",
      title: "Weekend Dining Experience",
      status: "draft",
      engagement: 0,
      reach: 0,
      publishedAt: null,
    },
  ],
  analytics: {
    totalReach: 45600,
    totalEngagement: 3420,
    avgEngagementRate: 7.5,
    followerGrowth: 12.8,
    topPerformingPost: "Butter Chicken Special",
    bestPerformingTime: "7:00 PM - 9:00 PM",
  },
}

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState("campaigns")

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-4 h-4" />
      case "facebook":
        return <Facebook className="w-4 h-4" />
      case "twitter":
        return <Twitter className="w-4 h-4" />
      default:
        return <Share2 className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "published":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketing Hub</h1>
            <p className="text-gray-600 mt-1">Manage your campaigns, content, and social media presence</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Reach</CardTitle>
              <Eye className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{staticData.analytics.totalReach.toLocaleString()}</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-600">+15.2%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Engagement</CardTitle>
              <Heart className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {staticData.analytics.totalEngagement.toLocaleString()}
              </div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-600">+8.7%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Engagement Rate</CardTitle>
              <Target className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{staticData.analytics.avgEngagementRate}%</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-600">+2.1%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Follower Growth</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">+{staticData.analytics.followerGrowth}%</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-medium text-green-600">+3.4%</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="grid gap-6">
              {staticData.campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getPlatformIcon(campaign.platform)}
                        <div>
                          <CardTitle className="text-lg">{campaign.name}</CardTitle>
                          <CardDescription>
                            {campaign.startDate} - {campaign.endDate}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Reach</p>
                        <p className="text-2xl font-bold text-gray-900">{campaign.reach.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Engagement Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{campaign.engagement}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Budget</p>
                        <p className="text-2xl font-bold text-gray-900">₹{campaign.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Spent</p>
                        <p className="text-2xl font-bold text-gray-900">₹{campaign.spent.toLocaleString()}</p>
                        <Progress value={(campaign.spent / campaign.budget) * 100} className="mt-2" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit Campaign
                      </Button>
                      {campaign.status === "draft" && <Button size="sm">Launch Campaign</Button>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid gap-6">
              {staticData.content.map((content) => (
                <Card key={content.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getPlatformIcon(content.platform)}
                        <div>
                          <CardTitle className="text-lg">{content.title}</CardTitle>
                          <CardDescription className="capitalize">
                            {content.type} • {content.platform}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(content.status)}>{content.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Reach</p>
                        <p className="text-xl font-bold text-gray-900">{content.reach.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Engagement</p>
                        <p className="text-xl font-bold text-gray-900">{content.engagement.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Published</p>
                        <p className="text-sm text-gray-900">
                          {content.publishedAt ? new Date(content.publishedAt).toLocaleDateString() : "Not scheduled"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      {content.status === "draft" && <Button size="sm">Schedule</Button>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    AI Marketing Insights
                  </CardTitle>
                  <CardDescription>Personalized recommendations to improve your marketing performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <h4 className="font-medium text-blue-900">Optimal Posting Time</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your audience is most active between {staticData.analytics.bestPerformingTime}. Schedule your
                      posts during this window for maximum engagement.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <h4 className="font-medium text-green-900">Top Performing Content</h4>
                    <p className="text-sm text-green-700 mt-1">
                      "{staticData.analytics.topPerformingPost}" received the highest engagement. Create similar content
                      featuring your signature dishes.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <h4 className="font-medium text-yellow-900">Content Opportunity</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Behind-the-scenes content performs 40% better than regular posts. Show your kitchen, chef, and
                      food preparation process.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Social Media Post
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Content
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Respond to Comments
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
