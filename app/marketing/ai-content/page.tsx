"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Zap,
  Instagram,
  Facebook,
  Twitter,
  Calendar,
  Heart,
  MessageSquare,
  Share2,
  Sparkles,
  Brain,
  ImageIcon,
  Video,
  FileText,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function AIContentPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [createContentOpen, setCreateContentOpen] = useState(false)

  const contentStats = [
    { title: "Posts Generated", value: "156", icon: Sparkles },
    { title: "Avg Engagement", value: "+45%", icon: Heart },
    { title: "Time Saved", value: "20hrs", icon: Calendar },
    { title: "Platforms", value: "5", icon: Share2 },
  ]

  const recentContent = [
    {
      id: "1",
      title: "Weekend Special Promotion",
      platform: "Instagram",
      type: "Image Post",
      status: "published",
      engagement: { likes: 245, comments: 18, shares: 12 },
      createdAt: "2 hours ago",
    },
    {
      id: "2",
      title: "Behind the Scenes - Chef's Special",
      platform: "Facebook",
      type: "Video Post",
      status: "scheduled",
      engagement: { likes: 0, comments: 0, shares: 0 },
      createdAt: "1 day ago",
    },
    {
      id: "3",
      title: "Customer Review Highlight",
      platform: "Twitter",
      type: "Text Post",
      status: "draft",
      engagement: { likes: 0, comments: 0, shares: 0 },
      createdAt: "2 days ago",
    },
  ]

  const handleGenerateContent = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setCreateContentOpen(false)
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700"
      case "scheduled":
        return "bg-blue-100 text-blue-700"
      case "draft":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="w-4 h-4 text-pink-600" />
      case "facebook":
        return <Facebook className="w-4 h-4 text-blue-600" />
      case "twitter":
        return <Twitter className="w-4 h-4 text-sky-600" />
      default:
        return <Share2 className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeIcon = (type: string) => {
    if (type.includes("Video")) {
      return <Video className="w-4 h-4 text-purple-600" />
    } else if (type.includes("Image")) {
      return <ImageIcon className="w-4 h-4 text-green-600" />
    } else {
      return <FileText className="w-4 h-4 text-blue-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Clean Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/marketing")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketing
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Content Creation</h1>
              <p className="text-slate-600">Generate engaging social media content with AI</p>
            </div>
            <Dialog open={createContentOpen} onOpenChange={setCreateContentOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center bg-slate-900 hover:bg-slate-800">
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Content
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    AI Content Generator
                  </DialogTitle>
                  <DialogDescription>Create engaging social media content with AI</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Platform</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Content Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">Image Post</SelectItem>
                          <SelectItem value="video">Video Post</SelectItem>
                          <SelectItem value="story">Story</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Topic</Label>
                    <Input placeholder="e.g., Weekend special, New menu item" />
                  </div>
                  <div>
                    <Label>Additional Details (Optional)</Label>
                    <Textarea placeholder="Any specific details you want to include..." rows={3} />
                  </div>
                  <Button onClick={handleGenerateContent} disabled={isGenerating} className="w-full">
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Content Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {contentStats.map((stat, index) => (
            <Card key={index} className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-slate-600" />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Recent Content</CardTitle>
                <CardDescription>Your AI-generated social media content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentContent.map((content) => (
                    <div
                      key={content.id}
                      className="p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {getPlatformIcon(content.platform)}
                            <span className="text-sm font-medium">{content.platform}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(content.type)}
                            <span className="text-sm text-slate-600">{content.type}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(content.status)} variant="secondary">
                          {content.status}
                        </Badge>
                      </div>

                      <h3 className="font-medium text-slate-900 mb-2">{content.title}</h3>

                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{content.engagement.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{content.engagement.comments}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share2 className="w-4 h-4" />
                            <span>{content.engagement.shares}</span>
                          </div>
                        </div>
                        <span>{content.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <Card className="border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Content Tip</h4>
                    <p className="text-xs text-slate-600">Food photos perform 40% better with natural lighting</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Trending</h4>
                    <p className="text-xs text-slate-600">Behind-the-scenes content is trending this week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Templates */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Quick Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm">
                  Menu Item Showcase
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  Customer Review
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  Special Offer
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  Behind the Scenes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
