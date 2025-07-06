"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Sparkles,
  ImageIcon,
  Video,
  FileText,
  QrCode,
  Gift,
  Star,
  Calendar,
  Download,
  Share,
  Eye,
  Clock,
  Bot,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

interface ContentType {
  id: string
  name: string
  description: string
  icon: any
  estimatedTime: string
  aiGenerated: boolean
  userInputRequired: string[]
}

interface GeneratedContent {
  id: string
  type: string
  title: string
  content: {
    text?: string
    caption?: string
    hashtags?: string[]
    design?: string
    images?: string[]
    callToAction?: string
  }
  channels: string[]
  status: "generated" | "scheduled" | "published"
  scheduledDate?: string
  performance?: {
    views: number
    likes: number
    shares: number
    clicks: number
  }
}

export default function ContentGenerationPage() {
  const router = useRouter()
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([])
  const [contentPrompt, setContentPrompt] = useState("")
  const [targetChannels, setTargetChannels] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null)

  const contentTypes: ContentType[] = [
    {
      id: "posts",
      name: "Social Media Posts",
      description: "Instagram/Facebook posts with engaging captions and hashtags",
      icon: FileText,
      estimatedTime: "2-3 min",
      aiGenerated: true,
      userInputRequired: ["Menu items or theme", "Target audience"],
    },
    {
      id: "reels",
      name: "Reels/Videos",
      description: "Short video content scripts and storyboards",
      icon: Video,
      estimatedTime: "5-10 min",
      aiGenerated: false,
      userInputRequired: ["Video footage", "Background music preference"],
    },
    {
      id: "stories",
      name: "Instagram Stories",
      description: "Interactive stories with polls, questions, and CTAs",
      icon: ImageIcon,
      estimatedTime: "1-2 min",
      aiGenerated: true,
      userInputRequired: ["Story theme", "Interactive elements"],
    },
    {
      id: "carousels",
      name: "Carousel Posts",
      description: "Multi-slide posts showcasing menu items or processes",
      icon: ImageIcon,
      estimatedTime: "3-5 min",
      aiGenerated: true,
      userInputRequired: ["Images for each slide", "Carousel theme"],
    },
    {
      id: "qr_codes",
      name: "QR Codes",
      description: "Custom QR codes for menu, feedback, or promotions",
      icon: QrCode,
      estimatedTime: "1 min",
      aiGenerated: true,
      userInputRequired: ["QR code destination", "Design preferences"],
    },
    {
      id: "menu_highlights",
      name: "Menu Highlights",
      description: "Promotional content for specific dishes or categories",
      icon: Star,
      estimatedTime: "2-3 min",
      aiGenerated: true,
      userInputRequired: ["Menu items to highlight", "Special offers"],
    },
    {
      id: "offer_cards",
      name: "Offer Cards",
      description: "Attractive promotional offers and discount cards",
      icon: Gift,
      estimatedTime: "2-3 min",
      aiGenerated: true,
      userInputRequired: ["Offer details", "Terms and conditions"],
    },
    {
      id: "testimonials",
      name: "Customer Testimonials",
      description: "Formatted customer reviews and testimonials",
      icon: Star,
      estimatedTime: "1-2 min",
      aiGenerated: true,
      userInputRequired: ["Customer reviews", "Permission to use"],
    },
  ]

  const marketingChannels = [
    { id: "instagram", name: "Instagram", percentage: 30 },
    { id: "whatsapp", name: "WhatsApp Business", percentage: 20 },
    { id: "ad_channels", name: "Ad Channels", percentage: 15 },
    { id: "tablesalt", name: "TableSalt", percentage: 10 },
    { id: "website", name: "Website", percentage: 10 },
    { id: "facebook", name: "Facebook", percentage: 5 },
    { id: "sms", name: "SMS Marketing", percentage: 5 },
    { id: "email", name: "Email Marketing", percentage: 5 },
  ]

  const handleContentTypeToggle = (contentTypeId: string) => {
    setSelectedContentTypes((prev) =>
      prev.includes(contentTypeId) ? prev.filter((id) => id !== contentTypeId) : [...prev, contentTypeId],
    )
  }

  const handleChannelToggle = (channelId: string) => {
    setTargetChannels((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId],
    )
  }

  const generateContent = async () => {
    if (selectedContentTypes.length === 0) {
      toast({
        title: "No Content Types Selected",
        description: "Please select at least one content type to generate",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/marketing/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentTypes: selectedContentTypes,
          prompt: contentPrompt,
          channels: targetChannels,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedContent(data.content)
        toast({
          title: "Content Generated Successfully!",
          description: `Generated ${data.content.length} pieces of content`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const scheduleContent = async (contentId: string, scheduledDate: string) => {
    try {
      const response = await fetch("/api/marketing/content/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId,
          scheduledDate,
          channels: targetChannels,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedContent((prev) =>
          prev.map((content) =>
            content.id === contentId ? { ...content, status: "scheduled", scheduledDate } : content,
          ),
        )
        toast({
          title: "Content Scheduled",
          description: "Content has been scheduled for publishing",
        })
      }
    } catch (error) {
      toast({
        title: "Scheduling Failed",
        description: "Failed to schedule content",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "generated":
        return "bg-blue-100 text-blue-700"
      case "scheduled":
        return "bg-yellow-100 text-yellow-700"
      case "published":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "generated":
        return <Sparkles className="w-3 h-3" />
      case "scheduled":
        return <Clock className="w-3 h-3" />
      case "published":
        return <CheckCircle className="w-3 h-3" />
      default:
        return <AlertCircle className="w-3 h-3" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/marketing")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketing Hub
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Content Generation</h1>
            <p className="text-gray-600 mt-2">Create engaging marketing content for your restaurant</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Generation Form */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Content Types
                </CardTitle>
                <CardDescription>Select the types of content you want to generate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contentTypes.map((contentType) => (
                    <div
                      key={contentType.id}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedContentTypes.includes(contentType.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleContentTypeToggle(contentType.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <contentType.icon className="w-5 h-5 text-gray-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{contentType.name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{contentType.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge
                                variant="secondary"
                                className={
                                  contentType.aiGenerated
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-orange-100 text-orange-700"
                                }
                              >
                                {contentType.aiGenerated ? (
                                  <>
                                    <Bot className="w-3 h-3 mr-1" />
                                    AI
                                  </>
                                ) : (
                                  <>
                                    <User className="w-3 h-3 mr-1" />
                                    User
                                  </>
                                )}
                              </Badge>
                              <span className="text-xs text-gray-500">{contentType.estimatedTime}</span>
                            </div>
                          </div>
                        </div>
                        <Checkbox
                          checked={selectedContentTypes.includes(contentType.id)}
                          onChange={() => handleContentTypeToggle(contentType.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Content Prompt</CardTitle>
                <CardDescription>Describe what you want to promote or highlight</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., Promote our new weekend brunch menu with fresh ingredients and family-friendly atmosphere..."
                  rows={4}
                  value={contentPrompt}
                  onChange={(e) => setContentPrompt(e.target.value)}
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Target Channels</CardTitle>
                <CardDescription>Select where you want to publish this content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {marketingChannels.map((channel) => (
                    <div key={channel.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={channel.id}
                        checked={targetChannels.includes(channel.id)}
                        onCheckedChange={() => handleChannelToggle(channel.id)}
                      />
                      <Label htmlFor={channel.id} className="text-sm font-medium cursor-pointer flex-1">
                        {channel.name}
                      </Label>
                      <span className="text-xs text-gray-500">{channel.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={generateContent}
              disabled={isGenerating || selectedContentTypes.length === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Content...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate AI Content
                </>
              )}
            </Button>
          </div>

          {/* Generated Content Display */}
          <div className="lg:col-span-2">
            {generatedContent.length === 0 ? (
              <Card className="border-0 shadow-sm border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Sparkles className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Generated Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Select content types and click "Generate AI Content" to create marketing materials
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4" />
                      <span>AI-powered generation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Ready in minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4" />
                      <span>Restaurant-optimized</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Share className="w-4 h-4" />
                      <span>Multi-channel ready</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Generated Content</h2>
                  <Badge variant="outline" className="bg-white">
                    {generatedContent.length} items generated
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedContent.map((content) => (
                    <Card key={content.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{content.title}</CardTitle>
                            <CardDescription className="capitalize">{content.type.replace("_", " ")}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(content.status)} variant="secondary">
                            {getStatusIcon(content.status)}
                            <span className="ml-1 capitalize">{content.status}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Content Preview */}
                        <div className="p-3 bg-gray-50 rounded-lg">
                          {content.content.text && (
                            <p className="text-sm text-gray-700 mb-2">{content.content.text.slice(0, 100)}...</p>
                          )}
                          {content.content.caption && (
                            <p className="text-sm text-gray-700 mb-2">{content.content.caption.slice(0, 100)}...</p>
                          )}
                          {content.content.hashtags && (
                            <div className="flex flex-wrap gap-1">
                              {content.content.hashtags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {content.content.hashtags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{content.content.hashtags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Target Channels */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Target Channels:</p>
                          <div className="flex flex-wrap gap-1">
                            {content.channels.map((channel, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Performance (if published) */}
                        {content.performance && (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-center p-2 bg-blue-50 rounded">
                              <div className="font-medium text-blue-900">{content.performance.views}</div>
                              <div className="text-blue-700">Views</div>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded">
                              <div className="font-medium text-green-900">{content.performance.likes}</div>
                              <div className="text-green-700">Likes</div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedContent(content)}
                            className="flex-1 bg-white"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                          {content.status === "generated" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                const scheduledDate = new Date()
                                scheduledDate.setHours(scheduledDate.getHours() + 1)
                                scheduleContent(content.id, scheduledDate.toISOString())
                              }}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              <Calendar className="w-3 h-3 mr-1" />
                              Schedule
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="bg-white">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Preview Modal */}
        {selectedContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{selectedContent.title}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedContent(null)}>
                    ×
                  </Button>
                </div>

                <div className="space-y-4">
                  {selectedContent.content.text && (
                    <div>
                      <Label className="text-sm font-medium">Content Text:</Label>
                      <div className="p-3 bg-gray-50 rounded-lg mt-1">
                        <p className="text-sm">{selectedContent.content.text}</p>
                      </div>
                    </div>
                  )}

                  {selectedContent.content.caption && (
                    <div>
                      <Label className="text-sm font-medium">Caption:</Label>
                      <div className="p-3 bg-gray-50 rounded-lg mt-1">
                        <p className="text-sm">{selectedContent.content.caption}</p>
                      </div>
                    </div>
                  )}

                  {selectedContent.content.hashtags && (
                    <div>
                      <Label className="text-sm font-medium">Hashtags:</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedContent.content.hashtags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedContent.content.callToAction && (
                    <div>
                      <Label className="text-sm font-medium">Call to Action:</Label>
                      <div className="p-3 bg-blue-50 rounded-lg mt-1">
                        <p className="text-sm font-medium text-blue-900">{selectedContent.content.callToAction}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-4">
                    <Button
                      onClick={() => {
                        const scheduledDate = new Date()
                        scheduledDate.setHours(scheduledDate.getHours() + 1)
                        scheduleContent(selectedContent.id, scheduledDate.toISOString())
                        setSelectedContent(null)
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Content
                    </Button>
                    <Button variant="outline" className="bg-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
