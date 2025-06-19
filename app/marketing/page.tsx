"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import {
  Users,
  Globe,
  ArrowRight,
  BarChart3,
  DollarSign,
  Eye,
  Heart,
  MessageSquare,
  Target,
  PenTool,
  Calendar,
  Zap,
  Instagram,
  Facebook,
  Clock,
  CheckCircle,
  Megaphone,
  Lightbulb,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function MarketingHubPage() {
  const router = useRouter()
  const [monthlyBudget] = useState(25000)
  const [budgetUsed] = useState(18500)
  const budgetPercentage = (budgetUsed / monthlyBudget) * 100

  const performanceOverview = [
    {
      title: "Total Reach",
      value: "12.5K",
      change: "+18%",
      changeType: "positive",
      icon: Eye,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Engagement Rate",
      value: "4.2%",
      change: "+0.8%",
      changeType: "positive",
      icon: Heart,
      color: "bg-pink-50 text-pink-700",
    },
    {
      title: "Active Campaigns",
      value: "8",
      change: "+2",
      changeType: "positive",
      icon: Target,
      color: "bg-green-50 text-green-700",
    },
    {
      title: "Content Published",
      value: "24",
      change: "+6",
      changeType: "positive",
      icon: PenTool,
      color: "bg-purple-50 text-purple-700",
    },
  ]

  const marketingModules = [
    {
      title: "Campaigns",
      description: "Manage paid and organic marketing campaigns across all channels",
      icon: Target,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      stats: {
        active: "8 Active",
        budget: "₹18.5K Spent",
        channels: "5 Connected",
      },
      href: "/marketing/campaigns",
      status: "active",
      features: ["Paid & Organic", "Multi-Channel", "Budget Tracking", "Analytics"],
    },
    {
      title: "Content",
      description: "Create and manage all content types: posts, videos, articles, and promotions",
      icon: PenTool,
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      stats: {
        posts: "24 Published",
        videos: "8 Created",
        articles: "12 Written",
      },
      href: "/marketing/content",
      status: "active",
      features: ["Posts & Stories", "Videos & Reels", "Articles & Blogs", "Events & Offers"],
    },
    {
      title: "Calendar",
      description: "Schedule and auto-publish content across all marketing channels",
      icon: Calendar,
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      stats: {
        scheduled: "12 Events",
        thisWeek: "4 This Week",
        autopublish: "6 Auto-scheduled",
      },
      href: "/marketing/calendar",
      status: "active",
      features: ["Auto-Schedule", "Multi-Channel", "Timeline View", "Auto-Publish"],
    },
    {
      title: "Integrations",
      description: "Connect and manage all your marketing channels and platforms",
      icon: Globe,
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
      stats: {
        connected: "8 Platforms",
        social: "5 Social Media",
        ads: "3 Ad Platforms",
      },
      href: "/marketing/integrations",
      status: "active",
      features: ["Social Media", "Ad Platforms", "Email Marketing", "Analytics Tools"],
    },
  ]

  const overarchingStrategies = [
    {
      title: "Social Media Branding",
      description: "Build consistent brand presence across all social platforms",
      progress: 78,
      status: "active",
      channels: ["Instagram", "Facebook", "TikTok", "YouTube"],
      nextMilestone: "Brand Guidelines Complete",
      dueDate: "Dec 15, 2024",
    },
    {
      title: "SEO & Content Marketing",
      description: "Improve search rankings and drive organic traffic",
      progress: 65,
      status: "active",
      channels: ["Website", "Google My Business", "Blog"],
      nextMilestone: "Local SEO Optimization",
      dueDate: "Nov 30, 2024",
    },
    {
      title: "Paid Advertising",
      description: "Strategic paid campaigns across Google, Facebook, and Instagram",
      progress: 45,
      status: "active",
      channels: ["Google Ads", "Facebook Ads", "Instagram Ads"],
      nextMilestone: "Holiday Campaign Launch",
      dueDate: "Dec 1, 2024",
    },
    {
      title: "Partnership & Affiliations",
      description: "Build strategic partnerships with food bloggers and influencers",
      progress: 25,
      status: "planning",
      channels: ["Influencer Network", "Food Bloggers", "Local Partnerships"],
      nextMilestone: "Influencer Outreach",
      dueDate: "Jan 15, 2025",
    },
  ]

  const recentActivities = [
    {
      title: "Instagram Reel - Weekend Special",
      type: "content",
      date: "Today, 6:00 PM",
      platform: "Instagram",
      status: "scheduled",
      module: "Content Marketing",
    },
    {
      title: "Diwali Campaign Performance",
      type: "campaign",
      date: "2 hours ago",
      platform: "Facebook",
      status: "active",
      module: "Performance Marketing",
    },
    {
      title: "Blog Post - Healthy Indian Cuisine",
      type: "content",
      date: "Tomorrow, 10:00 AM",
      platform: "Website",
      status: "draft",
      module: "Content Marketing",
    },
    {
      title: "AI Generated Social Posts",
      type: "ai-content",
      date: "1 day ago",
      platform: "Multiple",
      status: "completed",
      module: "AI Content Creation",
    },
    {
      title: "Email Newsletter Scheduled",
      type: "campaign",
      date: "Nov 10, 2024",
      platform: "Email",
      status: "scheduled",
      module: "Performance Marketing",
    },
  ]

  const quickActions = [
    {
      title: "Generate Content",
      description: "Create AI-powered social media posts",
      icon: Zap,
      href: "/marketing/ai-content",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Create Campaign",
      description: "Launch new marketing campaign",
      icon: Megaphone,
      href: "/marketing/performance/campaigns",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Schedule Content",
      description: "Plan upcoming posts and activities",
      icon: Calendar,
      href: "/marketing/calendar",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "View Analytics",
      description: "Check performance metrics",
      icon: BarChart3,
      href: "/marketing/performance/analytics",
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "scheduled":
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "draft":
        return <Clock className="w-4 h-4 text-amber-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="w-4 h-4 text-pink-600" />
      case "facebook":
        return <Facebook className="w-4 h-4 text-blue-600" />
      case "website":
        return <Globe className="w-4 h-4 text-gray-600" />
      case "email":
        return <MessageSquare className="w-4 h-4 text-purple-600" />
      case "multiple":
        return <Zap className="w-4 h-4 text-orange-600" />
      default:
        return <Globe className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Marketing Hub</h1>
              <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">
                AI-powered marketing dashboard and strategy center
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="flex items-center rounded-md border-slate-200 text-sm"
                onClick={() => router.push("/marketing/calendar")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Marketing Calendar</span>
                <span className="sm:hidden">Calendar</span>
              </Button>
              <Button
                className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md text-sm"
                onClick={() => router.push("/marketing/ai-content")}
              >
                <Zap className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">AI Content Creation</span>
                <span className="sm:hidden">AI Content</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Performance Overview - Mobile Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {performanceOverview.map((stat, index) => (
            <Card key={index} className="border-slate-200">
              <CardContent className="p-3 sm:p-4">
                <div className={`p-2 sm:p-3 rounded-lg ${stat.color}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-white/50 flex items-center justify-center">
                      <stat.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-slate-600 truncate">{stat.title}</div>
                  <div className="text-xs text-emerald-600 font-medium">{stat.change}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Budget Overview - Mobile Optimized */}
        <Card className="mb-6 sm:mb-8 border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Marketing Budget Overview
                </CardTitle>
                <CardDescription className="text-sm">Monthly budget allocation and performance</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-md border-slate-200 self-start sm:self-auto"
                onClick={() => router.push("/marketing/performance/budget")}
              >
                Manage Budget
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Monthly Budget</span>
                  <span className="text-lg font-bold text-slate-900">₹{monthlyBudget.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Used</span>
                  <span className="text-sm font-medium text-slate-700">₹{budgetUsed.toLocaleString()}</span>
                </div>
                <Progress value={budgetPercentage} className="h-2" />
                <div className="text-xs text-slate-500">{Math.round(budgetPercentage)}% of budget used</div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Top Performing</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Social Media Ads</span>
                    <span className="font-medium text-green-600">+32% ROI</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Content Marketing</span>
                    <span className="font-medium text-green-600">+28% Engagement</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Email Campaigns</span>
                    <span className="font-medium text-green-600">+15% Conversion</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">This Month</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">New Customers</span>
                    <span className="font-medium">+156</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Revenue Generated</span>
                    <span className="font-medium">₹45.2K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Cost per Lead</span>
                    <span className="font-medium">₹125</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Marketing Modules */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Marketing Modules</CardTitle>
                <CardDescription className="text-sm">
                  Comprehensive marketing tools and AI-powered automation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {marketingModules.map((module, index) => (
                    <div
                      key={index}
                      className={`p-4 sm:p-6 border rounded-lg hover:shadow-sm transition-all duration-200 cursor-pointer group ${module.color}`}
                      onClick={() => router.push(module.href)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white/50 rounded-md flex items-center justify-center group-hover:bg-white/70 transition-colors">
                            <module.icon className={`w-5 h-5 ${module.iconColor}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{module.title}</h3>
                            <Badge className="bg-green-100 text-green-700 mt-1" variant="secondary">
                              {module.status}
                            </Badge>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </div>

                      <p className="text-sm text-slate-600 mb-4">{module.description}</p>

                      <div className="space-y-2">
                        {Object.entries(module.stats).map(([key, value], statIndex) => (
                          <div key={statIndex} className="flex justify-between text-sm">
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                            <span className="font-medium text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
                <CardDescription className="text-sm">Fast access to common marketing tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <div
                      key={index}
                      className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                      onClick={() => router.push(action.href)}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{action.title}</h4>
                          <p className="text-sm text-slate-600">{action.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activities */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">{getStatusIcon(activity.status)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 break-words">{activity.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {getPlatformIcon(activity.platform)}
                        <span className="text-xs text-slate-500">{activity.platform}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-400">{activity.module}</span>
                      </div>
                      <p className="text-xs text-slate-400">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 text-sm">Optimization Tip</h4>
                  <p className="text-xs text-blue-800 mt-1">
                    Your Instagram posts perform 32% better when posted between 6-8 PM. Consider scheduling more content
                    during this time.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 text-sm">Trending Content</h4>
                  <p className="text-xs text-green-800 mt-1">
                    Food photography posts are getting 45% more engagement this week. Focus on visual content.
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 text-sm">Budget Alert</h4>
                  <p className="text-xs text-purple-800 mt-1">
                    You're 74% through your monthly budget with 8 days remaining. Consider reallocating funds.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Module Navigation */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Module Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-slate-200"
                  onClick={() => router.push("/marketing/content")}
                >
                  <PenTool className="w-4 h-4 mr-2" />
                  Content Marketing
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-slate-200"
                  onClick={() => router.push("/marketing/performance")}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Performance Marketing
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-slate-200"
                  onClick={() => router.push("/marketing/calendar")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Marketing Calendar
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-slate-200"
                  onClick={() => router.push("/marketing/ai-content")}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  AI Content Creation
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-slate-200"
                  onClick={() => router.push("/profile")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Back to Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
