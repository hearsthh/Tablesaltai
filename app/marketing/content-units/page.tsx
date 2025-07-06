"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Plus,
  Search,
  Eye,
  Edit,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  MoreHorizontal,
  Instagram,
  Facebook,
  MessageCircle,
  Mail,
  Globe,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import type { ContentUnit } from "@/types/marketing"

export default function ContentUnitsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [contentUnits, setContentUnits] = useState<ContentUnit[]>([])
  const [filteredUnits, setFilteredUnits] = useState<ContentUnit[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [channelFilter, setChannelFilter] = useState("all")

  // Mock content units data
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
      campaignId: "1",
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
      campaignId: "1",
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
      campaignId: "1",
      strategyId: "1",
      createdAt: "2024-10-30T11:00:00Z",
      updatedAt: "2024-11-01T09:00:00Z",
    },
    {
      id: "4",
      title: "Customer Review Highlight",
      description: "Instagram story featuring customer review",
      channel: "instagram",
      contentType: "story",
      textContent: {
        caption: "Thank you for the amazing review! 🙏",
      },
      mediaContent: {
        images: ["/placeholder.svg?height=400&width=400&text=Customer+Review"],
      },
      status: "draft",
      currentStep: 3,
      totalSteps: 7,
      campaignId: "2",
      strategyId: "1",
      createdAt: "2024-11-01T15:00:00Z",
      updatedAt: "2024-11-01T15:00:00Z",
    },
    {
      id: "5",
      title: "Happy Customer Photos",
      description: "Instagram post with customer dining photos",
      channel: "instagram",
      contentType: "post",
      textContent: {
        caption: "Nothing makes us happier than seeing our customers enjoy their meals! 😊",
      },
      mediaContent: {},
      status: "draft",
      currentStep: 2,
      totalSteps: 7,
      campaignId: "2",
      strategyId: "1",
      createdAt: "2024-11-02T10:00:00Z",
      updatedAt: "2024-11-02T10:00:00Z",
    },
    {
      id: "6",
      title: "Brunch Menu Introduction",
      description: "Instagram post introducing new brunch menu",
      channel: "instagram",
      contentType: "post",
      textContent: {},
      mediaContent: {},
      status: "draft",
      currentStep: 1,
      totalSteps: 7,
      campaignId: "3",
      strategyId: "2",
      createdAt: "2024-11-02T16:00:00Z",
      updatedAt: "2024-11-02T16:00:00Z",
    },
  ]

  useEffect(() => {
    fetchContentUnits()
  }, [])

  useEffect(() => {
    filterContentUnits()
  }, [contentUnits, searchQuery, statusFilter, channelFilter])

  const fetchContentUnits = async () => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setContentUnits(mockContentUnits)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch content units",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterContentUnits = () => {
    let filtered = contentUnits

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (unit) =>
          unit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          unit.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((unit) => unit.status === statusFilter)
    }

    // Channel filter
    if (channelFilter !== "all") {
      filtered = filtered.filter((unit) => unit.channel === channelFilter)
    }

    setFilteredUnits(filtered)
  }

  const getChannelIcon = (channelId: string) => {
    const iconMap: { [key: string]: any } = {
      instagram: Instagram,
      whatsapp: MessageCircle,
      facebook: Facebook,
      website: Globe,
      email: Mail,
    }
    return iconMap[channelId] || Globe
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "ready":
        return "bg-purple-100 text-purple-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-3 h-3" />
      case "scheduled":
        return <Clock className="w-3 h-3" />
      case "ready":
        return <Play className="w-3 h-3" />
      case "draft":
        return <AlertCircle className="w-3 h-3" />
      case "failed":
        return <AlertCircle className="w-3 h-3" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getNextStepName = (currentStep: number) => {
    const stepNames = [
      "Complete title & description",
      "Select channel",
      "Select content type",
      "Add text content",
      "Add media content",
      "Preview content",
      "Schedule content",
    ]
    return stepNames[currentStep - 1] || "Complete setup"
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
              onClick={() => router.push("/marketing")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketing Hub
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Content Units</h1>
              <p className="text-gray-600 mt-2">Manage all your individual content pieces</p>
            </div>
            <Button
              onClick={() => router.push("/marketing/content-units/create")}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Content Unit
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search content units..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Content Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnits.map((unit) => {
            const IconComponent = getChannelIcon(unit.channel)
            return (
              <Card key={unit.id} className="border-0 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      <Badge variant="outline" className="text-xs">
                        {unit.contentType}
                      </Badge>
                    </div>
                    <Badge className={getStatusColor(unit.status)} variant="secondary">
                      {getStatusIcon(unit.status)}
                      <span className="ml-1 capitalize">{unit.status}</span>
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-base">{unit.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">{unit.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress for draft/ready content */}
                  {(unit.status === "draft" || unit.status === "ready") && (
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                        <span>
                          Step {unit.currentStep} of {unit.totalSteps}
                        </span>
                        <span>{Math.round((unit.currentStep / unit.totalSteps) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gray-900 h-2 rounded-full transition-all"
                          style={{ width: `${(unit.currentStep / unit.totalSteps) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Next: {getNextStepName(unit.currentStep)}</p>
                    </div>
                  )}

                  {/* Scheduled date */}
                  {unit.status === "scheduled" && unit.scheduledDate && (
                    <div className="flex items-center space-x-2 text-sm text-blue-600">
                      <Calendar className="w-4 h-4" />
                      <span>Scheduled: {formatDate(unit.scheduledDate)}</span>
                    </div>
                  )}

                  {/* Published analytics */}
                  {unit.status === "published" && unit.analytics && (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-medium text-blue-900">{unit.analytics.reach}</div>
                        <div className="text-blue-700">Reach</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-medium text-green-900">{unit.analytics.engagement}</div>
                        <div className="text-green-700">Engagement</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="font-medium text-purple-900">{unit.analytics.conversions}</div>
                        <div className="text-purple-700">Conversions</div>
                      </div>
                    </div>
                  )}

                  {/* Channel and creation date */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="capitalize">{unit.channel}</span>
                    <span>{formatDate(unit.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/marketing/content-units/${unit.id}`)}
                      className="flex-1 bg-white border-gray-300 text-gray-700"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>

                    {(unit.status === "draft" || unit.status === "ready") && (
                      <Button
                        size="sm"
                        onClick={() => router.push(`/marketing/content-units/${unit.id}/edit`)}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Continue
                      </Button>
                    )}

                    {unit.status === "scheduled" && (
                      <Button size="sm" variant="outline" className="bg-white border-gray-300 text-gray-700">
                        <Pause className="w-3 h-3 mr-1" />
                        Pause
                      </Button>
                    )}

                    <Button size="sm" variant="ghost" className="px-2">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredUnits.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Units Found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || statusFilter !== "all" || channelFilter !== "all"
                  ? "Try adjusting your filters to see more content units"
                  : "Create your first content unit to get started with marketing"}
              </p>
              <Button
                onClick={() => router.push("/marketing/content-units/create")}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Content Unit
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
