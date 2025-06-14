"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  Users,
  TrendingUp,
  Globe,
  Menu,
  ArrowLeft,
  ArrowRight,
  ImageIcon,
  Video,
  FileText,
  Instagram,
  Palette,
  Wand2,
  Sparkles,
  Plus,
  Eye,
} from "lucide-react"

export default function AIContentCreationPage() {
  const router = useRouter()

  const aiContentModules = [
    {
      title: "Social Media Posts",
      description: "Generate engaging posts with captions, hashtags, and optimal timing",
      icon: Instagram,
      color: "bg-pink-50 border-pink-200",
      iconColor: "text-pink-600",
      status: "active",
      stats: {
        generated: "156 Posts",
        platforms: "5 Platforms",
        engagement: "+32% Avg",
      },
      href: "/marketing/content/social-media",
      actions: ["Generate Post", "Bulk Create", "Schedule"],
    },
    {
      title: "Blog Articles",
      description: "SEO-optimized blog content with research and keyword integration",
      icon: FileText,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      status: "active",
      stats: {
        articles: "24 Written",
        keywords: "180 Optimized",
        traffic: "+45% Organic",
      },
      href: "/marketing/content/blog",
      actions: ["Write Article", "SEO Optimize", "Research Topics"],
    },
    {
      title: "Visual Content",
      description: "AI-generated images, graphics, and design assets for marketing",
      icon: ImageIcon,
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      status: "beta",
      stats: {
        images: "89 Created",
        templates: "12 Designs",
        downloads: "234 Total",
      },
      href: "/marketing/ai-content/visuals",
      actions: ["Generate Image", "Create Template", "Edit Design"],
    },
    {
      title: "Video Scripts",
      description: "Video scripts, storyboards, and content planning for video marketing",
      icon: Video,
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      status: "active",
      stats: {
        scripts: "18 Written",
        storyboards: "12 Created",
        videos: "8 Produced",
      },
      href: "/marketing/ai-content/video",
      actions: ["Write Script", "Create Storyboard", "Plan Video"],
    },
  ]

  const contentTemplates = [
    {
      name: "Restaurant Promotion",
      description: "Special offers and promotional content",
      category: "Social Media",
      uses: 45,
      icon: "🍽️",
    },
    {
      name: "Food Photography",
      description: "Appetizing food photos with descriptions",
      category: "Visual",
      uses: 67,
      icon: "📸",
    },
    {
      name: "Chef's Special",
      description: "Highlight signature dishes and chef recommendations",
      category: "Blog",
      uses: 23,
      icon: "👨‍🍳",
    },
    {
      name: "Customer Stories",
      description: "Customer testimonials and success stories",
      category: "Video",
      uses: 12,
      icon: "💬",
    },
    {
      name: "Behind the Scenes",
      description: "Kitchen operations and restaurant atmosphere",
      category: "Social Media",
      uses: 34,
      icon: "🎬",
    },
    {
      name: "Seasonal Menu",
      description: "Seasonal ingredients and special menus",
      category: "Blog",
      uses: 18,
      icon: "🍂",
    },
  ]

  const recentGenerations = [
    {
      title: "Diwali Special Menu Post",
      type: "Social Media",
      platform: "Instagram",
      status: "completed",
      date: "2 hours ago",
      engagement: "245 likes, 18 comments",
    },
    {
      title: "Health Benefits of Turmeric",
      type: "Blog Article",
      platform: "Website",
      status: "completed",
      date: "1 day ago",
      engagement: "1.2K views, 8 shares",
    },
    {
      title: "Weekend Brunch Hero Image",
      type: "Visual",
      platform: "Multiple",
      status: "completed",
      date: "2 days ago",
      engagement: "Downloaded 12 times",
    },
    {
      title: "Chef Interview Script",
      type: "Video Script",
      platform: "YouTube",
      status: "draft",
      date: "3 days ago",
      engagement: "In review",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "beta":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-green-100 text-green-700"
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
              <h1 className="text-3xl font-bold text-slate-900">AI Content Creation</h1>
              <p className="text-slate-600 mt-2">
                Generate high-quality marketing content with artificial intelligence
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex items-center rounded-md border-slate-200">
                <Eye className="w-4 h-4 mr-2" />
                Content Library
              </Button>
              <Button className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md">
                <Sparkles className="w-4 h-4 mr-2" />
                Quick Generate
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Content Modules */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Wand2 className="w-6 h-6 mr-2" />
                  AI Content Generation
                </CardTitle>
                <CardDescription>Create professional marketing content with AI assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aiContentModules.map((module, index) => (
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

            {/* Content Templates */}
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Content Templates</CardTitle>
                    <CardDescription>Pre-built templates for common restaurant marketing content</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-md border-slate-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contentTemplates.map((template, index) => (
                    <div
                      key={index}
                      className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{template.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 text-sm">{template.name}</h4>
                          <Badge variant="outline" className="text-xs mt-1">
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{template.uses} uses</span>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          Use Template
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Generations */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Recent Generations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentGenerations.map((generation, index) => (
                  <div key={index} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900 text-sm">{generation.title}</h4>
                      <Badge className={getStatusColor(generation.status)} variant="secondary">
                        {generation.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {generation.type}
                      </Badge>
                      <span className="text-xs text-slate-500">{generation.platform}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">{generation.date}</span>
                    </div>
                    <p className="text-xs text-slate-600">{generation.engagement}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Quick Generate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-slate-200"
                  onClick={() => router.push("/marketing/content/social-media")}
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Social Media Post
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-md border-slate-200"
                  onClick={() => router.push("/marketing/content/blog")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Blog Article
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Visual Content
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <Video className="w-4 h-4 mr-2" />
                  Video Script
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-md border-slate-200">
                  <Palette className="w-4 h-4 mr-2" />
                  Design Asset
                </Button>
              </CardContent>
            </Card>

            {/* AI Usage Stats */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">AI Usage Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-900">287</div>
                  <div className="text-sm text-blue-600">Content Generated</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-900">45</div>
                  <div className="text-sm text-green-600">Templates Used</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-900">12.5K</div>
                  <div className="text-sm text-purple-600">Total Reach</div>
                </div>
              </CardContent>
            </Card>

            {/* AI Tips */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">AI Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 text-sm">Content Optimization</h4>
                  <p className="text-xs text-blue-800 mt-1">
                    Posts with food emojis get 23% more engagement. Consider adding them to your social media content.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 text-sm">Best Time to Post</h4>
                  <p className="text-xs text-green-800 mt-1">
                    Your audience is most active between 6-8 PM. Schedule your AI-generated content for this time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
