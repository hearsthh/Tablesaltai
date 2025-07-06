"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter, useParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Play,
  Pause,
  Edit,
  Target,
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  BarChart3,
  Plus,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { ContentUnitCard } from "@/components/marketing/content-unit-card"
import { usePerformanceMetrics } from "@/hooks/use-performance-metrics"
import { useAICampaignContent } from "@/hooks/use-ai-campaign-content"
import type { Campaign, ContentUnit } from "@/types/marketing"

export default function CampaignDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const campaignId = params.id as string

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [contentUnits, setContentUnits] = useState<ContentUnit[]>([])
  const [loading, setLoading] = useState(true)

  const { metrics, loading: metricsLoading } = usePerformanceMetrics(campaignId, "campaign")
  const { suggestions: aiSuggestions, loading: aiLoading } = useAICampaignContent(campaign)

  useEffect(() => {
    fetchCampaignDetails()
  }, [campaignId])

  const fetchCampaignDetails = async () => {
    try {
      // Mock campaign data - replace with actual API call
      const mockCampaign: Campaign = {
        id: campaignId,
        name: "Diwali Special Menu",
        description: "Promote special Diwali menu items and increase festival season revenue",
        objective: "conversion",
        status: "active",
        progress: 75,
        startDate: "2024-10-20",
        endDate: "2024-11-05",
        budget: 25000,
        spent: 18750,
        contentUnits: ["1", "2", "3"],
        strategyId: "1",
        analytics: {
          reach: 12500,
          engagement: 625,
          conversions: 45,
          spend: 18750,
          roi: 2.4,
        },
        createdAt: "2024-10-20T10:00:00Z",
        updatedAt: "2024-11-02T14:30:00Z",
      }

      const mockContentUnits: ContentUnit[] = [
        {
          id: "1",
          title: "Diwali Special Thali Showcase",
          description: "Instagram post showcasing our special Diwali thali",
          channel: "instagram",
          contentType: "post",
          textContent: {
            caption:
              "✨ Celebrate Diwali with our special traditional thali! Made with love and authentic spices. Book your table now! 🪔",
            hashtags: ["#Diwali", "#SpecialThali", "#AuthenticFlavors", "#BookNow", "#FestivalSpecial"],
            callToAction: "Book your table now!",
          },
          mediaContent: {
            images: ["/placeholder.svg?height=400&width=400&text=Diwali+Thali"],
          },
          status: "published",
          currentStep: 7,
          totalSteps: 7,
          scheduledDate: "2024-10-22T18:00:00Z",
          publishedDate: "2024-10-22T18:00:00Z",
          campaignId: campaignId,
          strategyId: "1",
          analytics: {
            reach: 2400,
            engagement: 156,
            clicks: 45,
            conversions: 12,
            spend: 0,
          },
          createdAt: "2024-10-22T10:00:00Z",
          updatedAt: "2024-10-22T18:00:00Z",
        },
        {
          id: "2",
          title: "Behind the Scenes Cooking",
          description: "Instagram reel showing cooking process",
          channel: "instagram",
          contentType: "reel",
          textContent: {
            caption:
              "Watch our chef create magic in the kitchen! 👨‍🍳✨ Fresh ingredients, traditional techniques, amazing flavors!",
            hashtags: ["#BehindTheScenes", "#ChefMagic", "#FreshIngredients", "#TraditionalCooking"],
          },
          mediaContent: {
            videos: ["/placeholder.svg?height=400&width=400&text=Cooking+Video"],
          },
          status: "scheduled",
          currentStep: 6,
          totalSteps: 7,
          scheduledDate: "2024-11-03T17:00:00Z",
          campaignId: campaignId,
          strategyId: "1",
          createdAt: "2024-10-28T14:00:00Z",
          updatedAt: "2024-10-28T16:30:00Z",
        },
        {
          id: "3",
          title: "Weekend Special Offer",
          description: "WhatsApp broadcast for weekend offer",
          channel: "whatsapp",
          contentType: "broadcast",
          textContent: {
            caption:
              "🎉 Weekend Special! Get 20% off on orders above ₹1500. Valid for dine-in and takeaway. Call now to book your table!",
          },
          mediaContent: {
            images: ["/placeholder.svg?height=400&width=400&text=Weekend+Offer"],
          },
          status: "ready",
          currentStep: 5,
          totalSteps: 7,
          campaignId: campaignId,
          strategyId: "1",
          createdAt: "2024-10-30T11:00:00Z",
          updatedAt: "2024-11-01T09:00:00Z",
        },
      ]

      setCampaign(mockCampaign)
      setContentUnits(mockContentUnits)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load campaign details",
        variant: "destructive",
      })
      router.push("/marketing/campaigns")
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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getObjectiveIcon = (objective: string) => {
    switch (objective) {
      case "reach":
        return <Users className="w-5 h-5" />
      case "engagement":
        return <TrendingUp className="w-5 h-5" />
      case "conversion":
        return <Target className="w-5 h-5" />
      default:
        return <Target className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Campaign Not Found</h2>
            <p className="text-gray-600 mt-2">The campaign you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/marketing/campaigns")} className="mt-4">
              Back to Campaigns
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/marketing/campaigns")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                {getObjectiveIcon(campaign.objective)}
                <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
                <Badge className={getStatusColor(campaign.status)} variant="secondary">
                  {campaign.status}
                </Badge>
              </div>
              <p className="text-gray-600">{campaign.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>Objective: {campaign.objective}</span>
                <span>•</span>
                <span>
                  {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                  {new Date(campaign.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/marketing/campaigns/${campaign.id}/analytics`)}
                className="bg-white"
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Analytics
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/marketing/campaigns/${campaign.id}/edit`)}
                className="bg-white"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="bg-white">
                {campaign.status === "active" ? (
                  <>
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{campaign.progress}%</p>
                  <p className="text-xs text-gray-500">{campaign.contentUnits.length} content units</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <Progress value={campaign.progress} className="h-2 mt-3" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reach</p>
                  <p className="text-2xl font-bold text-gray-900">{campaign.analytics.reach.toLocaleString()}</p>
                  <p className="text-xs text-green-600 font-medium">+12% vs target</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversions</p>
                  <p className="text-2xl font-bold text-gray-900">{campaign.analytics.conversions}</p>
                  <p className="text-xs text-purple-600 font-medium">Above target</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ROI</p>
                  <p className="text-2xl font-bold text-gray-900">{campaign.analytics.roi}x</p>
                  <p className="text-xs text-orange-600 font-medium">+8% growth</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Units */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Campaign Content Units</CardTitle>
                    <CardDescription>Content pieces within this campaign</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => router.push(`/marketing/content-units/create?campaignId=${campaign.id}`)}
                    className="bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Content
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {contentUnits.map((unit) => (
                    <ContentUnitCard key={unit.id} contentUnit={unit} showActions={true} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Content Suggestions */}
            {aiSuggestions.length > 0 && (
              <Card className="border-0 shadow-sm mt-6 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="text-lg">AI Content Suggestions</CardTitle>
                  <CardDescription>AI-generated content ideas for this campaign</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiSuggestions.slice(0, 2).map((suggestion) => (
                      <div key={suggestion.id} className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                            <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                              <span>{suggestion.channel}</span>
                              <span>•</span>
                              <span>{suggestion.contentType}</span>
                            </div>
                          </div>
                          {suggestion.mediaRequirement.required && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Media Required
                            </Badge>
                          )}
                        </div>

                        {suggestion.mediaRequirement.required && (
                          <div className="mb-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-sm text-yellow-800">
                              <strong>Media needed:</strong> {suggestion.mediaRequirement.description}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Est. reach: {suggestion.estimatedPerformance.reach.toLocaleString()}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => router.push(`/marketing/content-units/create?suggestion=${suggestion.id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Use Suggestion
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Campaign Info */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Objective:</span>
                  <p className="text-sm text-gray-900 capitalize">{campaign.objective}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">Duration:</span>
                  <p className="text-sm text-gray-900">
                    {Math.ceil(
                      (new Date(campaign.endDate).getTime() - new Date(campaign.startDate).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">Budget Utilization:</span>
                  <div className="mt-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>
                        ₹{campaign.spent.toLocaleString()} / ₹{campaign.budget.toLocaleString()}
                      </span>
                      <span>{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                    </div>
                    <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">Content Units:</span>
                  <div className="mt-1 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Published:</span>
                      <span>{contentUnits.filter((u) => u.status === "published").length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Scheduled:</span>
                      <span>{contentUnits.filter((u) => u.status === "scheduled").length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Draft:</span>
                      <span>{contentUnits.filter((u) => u.status === "draft").length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            {metrics && !metricsLoading && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Performance Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {metrics.insights.slice(0, 3).map((insight, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">{insight.message}</p>
                      {insight.recommendation && <p className="text-xs text-gray-600 mt-1">{insight.recommendation}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white"
                  onClick={() => router.push(`/marketing/campaigns/${campaign.id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Campaign
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white"
                  onClick={() => router.push(`/marketing/content-units/create?campaignId=${campaign.id}`)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Content Unit
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white"
                  onClick={() => router.push("/marketing/calendar")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white"
                  onClick={() => router.push(`/marketing/campaigns/${campaign.id}/analytics`)}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
