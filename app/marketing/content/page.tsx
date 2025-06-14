"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import {
  Users,
  TrendingUp,
  Globe,
  Menu,
  ArrowLeft,
  ArrowRight,
  FileText,
  Instagram,
  Youtube,
  Eye,
  Calendar,
  BarChart3,
  Zap,
  Settings,
} from "lucide-react"

export default function ContentMarketingPage() {
  const router = useRouter()

  const contentModules = [
    {
      title: "Social Media Strategy",
      description: "AI-generated social media content and posting strategy",
      icon: Instagram,
      color: "bg-pink-50 border-pink-200",
      iconColor: "text-pink-600",
      status: "active",
      progress: 78,
      stats: {
        posts: "24 Published",
        engagement: "4.2% Rate",
        reach: "12.5K Total",
      },
      href: "/marketing/content/social-media",
      actions: ["View Posts", "Generate Content", "Analytics"],
    },
    {
      title: "Blog & SEO Content",
      description: "SEO-optimized blog articles and website content",
      icon: FileText,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      status: "active",
      progress: 65,
      stats: {
        articles: "8 Published",
        traffic: "+32% Organic",
        keywords: "45 Ranking",
      },
      href: "/marketing/content/blog",
      actions: ["Write Article", "SEO Analysis", "Content Calendar"],
    },
    {
      title: "Video Content",
      description: "Video scripts, storyboards, and YouTube content",
      icon: Youtube,
      color: "bg-red-50 border-red-200",
      iconColor: "text-red-600",
      status: "setup",
      progress: 25,
      stats: {
        videos: "3 Published",
        views: "2.1K Total",
        subscribers: "156 New",
      },
      href: "/marketing/content/video",
      actions: ["Create Script", "Plan Video", "Upload Content"],
    },
    {
      title: "Email Marketing",
      description: "Newsletter content and email campaign copy",
      icon: Globe,
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      status: "active",
      progress: 85,
      stats: {
        campaigns: "12 Sent",
        openRate: "28.5%",
        clicks: "156 Total",
      },
      href: "/marketing/content/email",
      actions: ["Create Newsletter", "Design Template", "Send Campaign"],
    },
  ]

  const contentStrategy = {
    socialMedia: {
      status: "active",
      duration: "6 months",
      platforms: ["Instagram", "Facebook", "Google My Business"],
      nextReview: "Dec 15, 2024",
      progress: 78,
      objectives: ["Increase brand awareness", "Drive website traffic", "Generate leads"],
    },
    contentPlan: {
      status: "active",
      duration: "3 months",
      channels: ["Blog", "Social Media", "Email", "Video"],
      nextReview: "Nov 30, 2024",
      progress: 65,
      objectives: ["SEO improvement", "Thought leadership", "Customer education"],
    },
  }

  const recentContent = [
    {
      title: "Diwali Special Menu Post",
      type: "Social Media",
      platform: "Instagram",
      performance: { likes: 245, comments: 18, shares: 12 },
      date: "2 hours ago",
      status: "published",
    },
    {
      title: "Health Benefits of Indian Spices",
      type: "Blog Article",
      platform: "Website",
      performance: { views: 1200, shares: 8, comments: 5 },
      date: "1 day ago",
      status: "published",
    },
    {
      title: "Weekend Brunch Video",
      type: "Video",
      platform: "YouTube",
      performance: { views: 890, likes: 67, comments: 23 },
      date: "3 days ago",
      status: "published",
    },
    {
      title: "Monthly Newsletter Draft",
      type: "Email",
      platform: "Email",
      performance: { recipients: 0, opens: 0, clicks: 0 },
      date: "Draft",
      status: "draft",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "setup":
        return "bg-amber-100 text-amber-700"
      case "published":
        return "bg-blue-100 text-blue-700"
      case "draft":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
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
              <h1 className="text-3xl font-bold text-slate-900">Content Marketing</h1>
              <p className="text-slate-600 mt-2">Create and manage all your content marketing activities</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex items-center rounded-md border-slate-200"
                onClick={() => router.push("/marketing/calendar")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Content Calendar
              </Button>
              <Button
                className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md"
                onClick={() => router.push("/marketing/content/social-media")}
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate Content
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Content Strategy Overview */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl">Content Strategy Overview</CardTitle>
                <CardDescription>AI-generated content strategies and performance tracking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Social Media Strategy */}
                <div className="p-6 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                        <Instagram className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Social Media Strategy</h3>
                        <p className="text-sm text-slate-600">AI-generated long-term social media plan</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-slate-500">Duration</span>
                      <p className="font-medium">{contentStrategy.socialMedia.duration}</p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-500">Platforms</span>
                      <p className="font-medium">{contentStrategy.socialMedia.platforms.length} connected</p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-500">Next Review</span>
                      <p className="font-medium">{contentStrategy.socialMedia.nextReview}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Progress</span>
                      <span className="text-sm text-slate-500">{contentStrategy.socialMedia.progress}%</span>
                    </div>
                    <Progress value={contentStrategy.socialMedia.progress} className="h-2" />
                  </div>
                  <div className="flex space-x-3">
                    <Button size="sm" variant="outline" className="rounded-md border-slate-200">
                      <Eye className="w-4 h-4 mr-2" />
                      View Strategy
                    </Button>
                    <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </div>

                {/* Content Plan */}
                <div className="p-6 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Content Plan</h3>
                        <p className="text-sm text-slate-600">Blog, SEO, and content marketing plan</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-slate-500">Duration</span>
                      <p className="font-medium">{contentStrategy.contentPlan.duration}</p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-500">Channels</span>
                      <p className="font-medium">{contentStrategy.contentPlan.channels.length} channels</p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-500">Next Review</span>
                      <p className="font-medium">{contentStrategy.contentPlan.nextReview}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Progress</span>
                      <span className="text-sm text-slate-500">{contentStrategy.contentPlan.progress}%</span>
                    </div>
                    <Progress value={contentStrategy.contentPlan.progress} className="h-2" />
                  </div>
                  <div className="flex space-x-3">
                    <Button size="sm" variant="outline" className="rounded-md border-slate-200">
                      <Eye className="w-4 h-4 mr-2" />
                      View Plan
                    </Button>
                    <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Modules */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl">Content Modules</CardTitle>
                <CardDescription>Manage different types of content across all channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contentModules.map((module, index) => (
                    <div
                      key={index}
                      className={`p-6 border rounded-lg hover:shadow-sm transition-all duration-200 cursor-pointer group ${module.color}`}
                      onClick={() => router.push(module.href)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white/50 rounded-md flex items-center justify-center group-hover:bg-white/70 transition-colors">
                            <module.icon className={`w-5 h-5 ${module.iconColor}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{module.title}</h3>
                            <Badge className={getStatusColor(module.status)} variant="secondary">
                              {module.status}
                            </Badge>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </div>

                      <p className="text-sm text-slate-600 mb-4">{module.description}</p>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Progress</span>
                          <span className="text-sm text-slate-500">{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>

                      <div className="space-y-2 mb-4">
                        {Object.entries(module.stats).map(([key, value], statIndex) => (
                          <div key={statIndex} className="flex justify-between text-sm">
                            <span className="text-slate-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                            <span className="font-medium text-slate-900">{value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {module.actions.slice(0, 2).map((action, actionIndex) => (
                          <Badge key={actionIndex} variant="outline" className="text-xs">
                            {action}
                          </Badge>
                        ))}
                        {module.actions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{module.actions.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Content */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Recent Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentContent.map((content, index) => (
                  <div key={index} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900 text-sm">{content.title}</h4>
                      <Badge className={getStatusColor(content.status)} variant="secondary">
                        {content.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {content.type}
                      </Badge>
                      <span className="text-xs text-slate-500">{content.platform}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">{content.date}</span>
                    </div>
                    {content.status === "published" && (
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <p className="font-medium text-slate-900">
                            {content.performance.likes || content.performance.views}
                          </p>
                          <p className="text-slate-500">{content.performance.likes ? "Likes" : "Views"}</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-slate-900">{content.performance.comments}</p>
                          <p className="text-slate-500">Comments</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-slate-900">{content.performance.shares}</p>
                          <p className="text-slate-500">Shares</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
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
                  className="w-full justify-start rounded-md border-slate-200"
                  onClick={() => router.push("/marketing/content/social-media")}
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Create Social Post
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-slate-200"
                  onClick={() => router.push("/marketing/content/blog")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Write Blog Article
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <Youtube className="w-4 h-4 mr-2" />
                  Plan Video Content
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  Content Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Content Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Content Performance */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-900">32</div>
                  <div className="text-sm text-blue-600">Total Content</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-900">15.6K</div>
                  <div className="text-sm text-green-600">Total Reach</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-900">4.2%</div>
                  <div className="text-sm text-purple-600">Avg Engagement</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
