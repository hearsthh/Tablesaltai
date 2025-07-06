"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Settings,
  Instagram,
  Facebook,
  Globe,
  Mail,
  MapPin,
  Phone,
  ExternalLink,
  Star,
  Zap,
  RefreshCw,
  Plus,
  Eye,
  MessageCircle,
  Heart,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

interface Channel {
  id: string
  name: string
  type: string
  status: string
  strength: number
  followers?: number
  engagement_rate?: number
  monthly_visitors?: number
  conversion_rate?: number
  profile_views?: number
  booking_rate?: number
  last_sync: string
  config: any
}

interface Affiliation {
  id: string
  name: string
  type: string
  category: string
  location: string
  pincode: string
  relevance_score: number
  contact_info: any
  engagement_potential: string
  collaboration_type: string[]
  estimated_reach: number
  avg_engagement_rate: number
  description: string
}

export default function MarketingIntegrationsPage() {
  const router = useRouter()
  const [channels, setChannels] = useState<Channel[]>([])
  const [affiliations, setAffiliations] = useState<Affiliation[]>([])
  const [loading, setLoading] = useState(true)
  const [affiliationsLoading, setAffiliationsLoading] = useState(false)
  const [location, setLocation] = useState({ city: "Delhi", pincode: "110001" })

  useEffect(() => {
    fetchChannels()
    fetchAffiliations()
  }, [])

  const fetchChannels = async () => {
    try {
      const response = await fetch("/api/marketing/channels")
      const data = await response.json()
      setChannels(data.channels || [])
    } catch (error) {
      console.error("Error fetching channels:", error)
      toast({
        title: "Error",
        description: "Failed to fetch marketing channels",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAffiliations = async () => {
    setAffiliationsLoading(true)
    try {
      const response = await fetch(`/api/marketing/affiliations?city=${location.city}&pincode=${location.pincode}`)
      const data = await response.json()
      setAffiliations(data.affiliations || [])
    } catch (error) {
      console.error("Error fetching affiliations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch affiliations",
        variant: "destructive",
      })
    } finally {
      setAffiliationsLoading(false)
    }
  }

  const handleChannelAction = async (channelId: string, action: string) => {
    try {
      const response = await fetch("/api/marketing/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId, action }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        })
        fetchChannels() // Refresh channels
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update channel",
        variant: "destructive",
      })
    }
  }

  const handleAffiliationAction = async (affiliationId: string, action: string) => {
    try {
      const response = await fetch("/api/marketing/affiliations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliationId, action }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process action",
        variant: "destructive",
      })
    }
  }

  const getChannelIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "instagram":
        return <Instagram className="w-5 h-5 text-pink-600" />
      case "facebook":
        return <Facebook className="w-5 h-5 text-blue-600" />
      case "website":
        return <Globe className="w-5 h-5 text-green-600" />
      case "tablesalt profile":
        return <Settings className="w-5 h-5 text-purple-600" />
      default:
        return <Globe className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-700"
      case "disconnected":
        return "bg-red-100 text-red-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getEngagementColor = (potential: string) => {
    switch (potential) {
      case "high":
        return "bg-green-100 text-green-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-slate-600" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/marketing")}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketing Hub
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Marketing Integrations</h1>
              <p className="text-slate-600 mt-2">Connect channels and discover local affiliations</p>
            </div>
            <Button
              onClick={fetchAffiliations}
              className="bg-slate-900 hover:bg-slate-800 text-sm sm:text-base"
              disabled={affiliationsLoading}
            >
              {affiliationsLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Generate AI Affiliations
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Marketing Channels */}
          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Marketing Channels
                </CardTitle>
                <CardDescription>Connect and manage your marketing platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channels.map((channel) => (
                    <div key={channel.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getChannelIcon(channel.name)}
                          <div>
                            <h3 className="font-medium text-slate-900 text-sm sm:text-base">{channel.name}</h3>
                            <p className="text-xs sm:text-sm text-slate-500 capitalize">{channel.type}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(channel.status)} variant="secondary">
                          {channel.status}
                        </Badge>
                      </div>

                      {/* Channel Strength */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs sm:text-sm mb-1">
                          <span className="text-slate-600">Channel Strength</span>
                          <span className="text-slate-900 font-medium">{channel.strength}%</span>
                        </div>
                        <Progress value={channel.strength} className="h-2" />
                      </div>

                      {/* Channel Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {channel.followers && (
                          <div className="text-center p-2 bg-slate-50 rounded">
                            <div className="text-sm sm:text-base font-bold text-slate-900">
                              {channel.followers.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-600">Followers</div>
                          </div>
                        )}
                        {channel.engagement_rate && (
                          <div className="text-center p-2 bg-slate-50 rounded">
                            <div className="text-sm sm:text-base font-bold text-slate-900">
                              {channel.engagement_rate}%
                            </div>
                            <div className="text-xs text-slate-600">Engagement</div>
                          </div>
                        )}
                        {channel.monthly_visitors && (
                          <div className="text-center p-2 bg-slate-50 rounded">
                            <div className="text-sm sm:text-base font-bold text-slate-900">
                              {channel.monthly_visitors.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-600">Monthly Visitors</div>
                          </div>
                        )}
                        {channel.booking_rate && (
                          <div className="text-center p-2 bg-slate-50 rounded">
                            <div className="text-sm sm:text-base font-bold text-slate-900">{channel.booking_rate}%</div>
                            <div className="text-xs text-slate-600">Booking Rate</div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        {channel.status === "connected" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs sm:text-sm bg-transparent"
                              onClick={() => handleChannelAction(channel.id, "disconnect")}
                            >
                              Disconnect
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm bg-transparent">
                              <Settings className="w-3 h-3 mr-1" />
                              Settings
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            className="w-full bg-slate-900 hover:bg-slate-800 text-xs sm:text-sm"
                            onClick={() => handleChannelAction(channel.id, "connect")}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI-Powered Affiliations */}
          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  AI-Powered Affiliations
                </CardTitle>
                <CardDescription>Discover local partnerships and collaborations</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Location Info */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Searching in {location.city} ({location.pincode})
                    </span>
                  </div>
                </div>

                {affiliationsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-slate-600" />
                    <span className="ml-2 text-slate-600">Generating AI affiliations...</span>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {affiliations.map((affiliation) => (
                      <div key={affiliation.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-slate-900 text-sm sm:text-base mb-1">{affiliation.name}</h3>
                            <p className="text-xs sm:text-sm text-slate-600 mb-2">{affiliation.description}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {affiliation.category.replace("_", " ")}
                              </Badge>
                              <Badge
                                className={getEngagementColor(affiliation.engagement_potential)}
                                variant="secondary"
                              >
                                {affiliation.engagement_potential} potential
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right ml-3">
                            <div className="flex items-center space-x-1 mb-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs sm:text-sm font-medium">{affiliation.relevance_score}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="text-center p-2 bg-slate-50 rounded text-xs">
                            <div className="font-bold text-slate-900">
                              {affiliation.estimated_reach.toLocaleString()}
                            </div>
                            <div className="text-slate-600">Reach</div>
                          </div>
                          <div className="text-center p-2 bg-slate-50 rounded text-xs">
                            <div className="font-bold text-slate-900">{affiliation.avg_engagement_rate}%</div>
                            <div className="text-slate-600">Engagement</div>
                          </div>
                        </div>

                        {/* Collaboration Types */}
                        <div className="mb-3">
                          <div className="text-xs text-slate-600 mb-1">Collaboration Types:</div>
                          <div className="flex flex-wrap gap-1">
                            {affiliation.collaboration_type.map((type, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {type.replace("_", " ")}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="mb-3">
                          <div className="text-xs text-slate-600 mb-1">Contact:</div>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {affiliation.contact_info.email && (
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{affiliation.contact_info.email}</span>
                              </div>
                            )}
                            {affiliation.contact_info.instagram && (
                              <div className="flex items-center space-x-1">
                                <Instagram className="w-3 h-3" />
                                <span>{affiliation.contact_info.instagram}</span>
                              </div>
                            )}
                            {affiliation.contact_info.phone && (
                              <div className="flex items-center space-x-1">
                                <Phone className="w-3 h-3" />
                                <span>{affiliation.contact_info.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs bg-transparent"
                            onClick={() => handleAffiliationAction(affiliation.id, "contact")}
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Contact
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs bg-transparent"
                            onClick={() => handleAffiliationAction(affiliation.id, "save")}
                          >
                            <Heart className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                          {affiliation.contact_info.website && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs bg-transparent"
                              onClick={() => window.open(affiliation.contact_info.website, "_blank")}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Visit
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <Card className="border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50 mt-6 sm:mt-8">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Next Steps</CardTitle>
            <CardDescription>Ready to create your first AI-powered campaign?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => router.push("/marketing/campaigns/create")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => router.push("/marketing/calendar")}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
