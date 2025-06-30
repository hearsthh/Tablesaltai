"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  BarChart3,
  Eye,
  Target,
  Calendar,
  PenTool,
  Zap,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  Mail,
  Settings,
  TrendingUp,
  Clock,
  Users,
  Sparkles,
  Brain,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function MarketingHubPage() {
  const router = useRouter()

  const keyMetrics = [
    { title: "Active Campaigns", value: "12", change: "+3", icon: Target, color: "text-blue-600" },
    { title: "Content Published", value: "48", change: "+12", icon: PenTool, color: "text-green-600" },
    { title: "Scheduled Posts", value: "24", change: "+8", icon: Clock, color: "text-purple-600" },
    { title: "Total Reach", value: "15.2K", change: "+18%", icon: Eye, color: "text-orange-600" },
  ]

  const marketingSections = [
    {
      title: "Campaigns",
      description: "Create and manage paid & organic marketing campaigns across all channels",
      icon: Target,
      href: "/marketing/campaigns",
      stats: {
        active: "8 Active",
        budget: "₹25K Budget",
        roi: "+35% ROI",
      },
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      features: ["Multi-channel campaigns", "Budget tracking", "Performance analytics", "A/B testing"],
    },
    {
      title: "Content",
      description: "Create, manage and organize all your marketing content with AI assistance",
      icon: PenTool,
      href: "/marketing/content",
      stats: {
        posts: "156 Posts",
        videos: "24 Videos",
        articles: "12 Articles",
      },
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      features: ["AI content generation", "Multi-format support", "Brand consistency", "Content library"],
    },
    {
      title: "Calendar",
      description: "Schedule and auto-publish content across all marketing channels",
      icon: Calendar,
      href: "/marketing/calendar",
      stats: {
        scheduled: "32 Scheduled",
        published: "18 Published",
        channels: "6 Channels",
      },
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      features: ["Auto-scheduling", "Multi-channel publishing", "Content planning", "Team collaboration"],
    },
  ]

  const connectedChannels = [
    { name: "Instagram", icon: Instagram, status: "connected", followers: "2.4K", color: "text-pink-600" },
    { name: "Facebook", icon: Facebook, status: "connected", followers: "1.8K", color: "text-blue-600" },
    { name: "YouTube", icon: Youtube, status: "connected", followers: "856", color: "text-red-600" },
    { name: "Google My Business", icon: Globe, status: "connected", followers: "324", color: "text-green-600" },
    { name: "Email Marketing", icon: Mail, status: "connected", followers: "1.2K", color: "text-purple-600" },
    { name: "WhatsApp Business", icon: Settings, status: "pending", followers: "0", color: "text-gray-400" },
  ]

  const marketingStrategies = [
    {
      name: "Social Media Growth",
      status: "active",
      progress: 75,
      description: "Increase followers and engagement across all social platforms",
      nextMilestone: "Reach 5K Instagram followers",
    },
    {
      name: "Local SEO Optimization",
      status: "active",
      progress: 60,
      description: "Improve local search rankings and Google My Business presence",
      nextMilestone: "Rank #1 for 'best restaurant near me'",
    },
    {
      name: "Customer Retention",
      status: "planning",
      progress: 25,
      description: "Email marketing and loyalty program to retain existing customers",
      nextMilestone: "Launch email newsletter campaign",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Marketing Hub</h1>
          <p className="text-slate-600">Comprehensive marketing management for your restaurant</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {keyMetrics.map((metric, index) => (
            <Card key={index} className="border-slate-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <metric.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${metric.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg sm:text-xl font-bold text-slate-900 truncate">{metric.value}</div>
                    <div className="text-xs sm:text-sm text-slate-600 truncate">{metric.title}</div>
                    <div className="text-xs text-green-600 font-medium">{metric.change}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Marketing Sections */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl">Marketing Sections</CardTitle>
                <CardDescription>Choose a section to manage your marketing activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {marketingSections.map((section, index) => (
                    <div
                      key={index}
                      className={`p-6 border rounded-lg hover:shadow-md transition-all cursor-pointer group ${section.color}`}
                      onClick={() => router.push(section.href)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white/70 rounded-lg flex items-center justify-center">
                            <section.icon className={`w-6 h-6 ${section.iconColor}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 text-lg">{section.title}</h3>
                            <p className="text-sm text-slate-600 mt-1">{section.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {Object.entries(section.stats).map(([key, value], statIndex) => (
                          <div key={statIndex} className="text-center">
                            <div className="text-sm font-medium text-slate-900">{value}</div>
                            <div className="text-xs text-slate-600 capitalize">{key}</div>
                          </div>
                        ))}
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2">
                        {section.features.map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Marketing Strategies */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Marketing Strategies
                </CardTitle>
                <CardDescription>Overarching strategies for restaurant growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketingStrategies.map((strategy, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-slate-900">{strategy.name}</h4>
                          <p className="text-sm text-slate-600 mt-1">{strategy.description}</p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={
                            strategy.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {strategy.status}
                        </Badge>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{strategy.progress}%</span>
                        </div>
                        <Progress value={strategy.progress} className="h-2" />
                      </div>
                      <div className="text-sm text-slate-600">
                        <span className="font-medium">Next milestone:</span> {strategy.nextMilestone}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Strategies
                </Button>
              </CardContent>
            </Card>
            {/* Cross-Module Integration */}
            <Card className="border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50 mb-6 sm:mb-8">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">AI-Powered Module Integration</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Connect your marketing with profile data and customer insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="p-4 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-slate-900 text-sm sm:text-base">Profile Integration</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mb-4">
                      Use your restaurant profile and menu data to create personalized marketing content automatically.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs sm:text-sm"
                        onClick={() => router.push("/profile/menu-builder")}
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Generate from Menu
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs sm:text-sm"
                        onClick={() => router.push("/profile/smart-profile")}
                      >
                        Update Profile
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Target className="w-5 h-5 text-purple-600" />
                      <h4 className="font-medium text-slate-900 text-sm sm:text-base">Customer Targeting</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mb-4">
                      Target your marketing campaigns using AI customer segmentation and behavior analysis.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-xs sm:text-sm"
                        onClick={() => router.push("/customers/segmentation")}
                      >
                        <Brain className="w-3 h-3 mr-1" />
                        View Segments
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs sm:text-sm"
                        onClick={() => router.push("/customers/profiles")}
                      >
                        Customer Insights
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Connected Channels */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Marketing Channels
                </CardTitle>
                <CardDescription>Connected platforms and integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {connectedChannels.map((channel, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <channel.icon className={`w-5 h-5 ${channel.color}`} />
                        <div>
                          <div className="font-medium text-sm text-slate-900">{channel.name}</div>
                          <div className="text-xs text-slate-500">
                            {channel.status === "connected" ? `${channel.followers} followers` : "Not connected"}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          channel.status === "connected" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }
                      >
                        {channel.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Integrations
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/marketing/campaigns/new")}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/marketing/content/create")}
                >
                  <PenTool className="w-4 h-4 mr-2" />
                  Create Content
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/marketing/calendar")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Post
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/marketing/analytics")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <Card className="border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  AI Assistant
                </CardTitle>
                <CardDescription>Get AI-powered marketing recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 text-sm mb-1">Content Suggestion</h4>
                    <p className="text-xs text-blue-800">Create a Diwali special menu post for Instagram</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 text-sm mb-1">Campaign Opportunity</h4>
                    <p className="text-xs text-green-800">Launch weekend brunch promotion campaign</p>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Get AI Recommendations
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
