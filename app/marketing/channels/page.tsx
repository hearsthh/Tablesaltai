"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Settings,
  Plus,
  Instagram,
  Facebook,
  MessageCircle,
  Mail,
  Phone,
  Globe,
  Megaphone,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Users,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

interface MarketingChannel {
  id: string
  name: string
  description: string
  status: "connected" | "disconnected" | "pending"
  isEnabled: boolean
  allocation: number
  followers?: number
  engagement?: number
  reach?: string
  conversions?: number
  cpm?: number
  cpc?: number
  icon: any
  color: string
  setupUrl?: string
  features: string[]
  pricing: {
    type: "free" | "paid" | "freemium"
    cost?: string
  }
}

export default function MarketingChannelsPage() {
  const router = useRouter()
  const [channels, setChannels] = useState<MarketingChannel[]>([])
  const [loading, setLoading] = useState(true)

  const marketingChannels: MarketingChannel[] = [
    {
      id: "instagram",
      name: "Instagram Business",
      description: "Share photos, stories, and reels to showcase your restaurant",
      status: "connected",
      isEnabled: true,
      allocation: 30,
      followers: 2400,
      engagement: 4.2,
      reach: "3.2K",
      conversions: 156,
      cpm: 45,
      cpc: 2.8,
      icon: Instagram,
      color: "text-pink-600",
      setupUrl: "https://business.instagram.com",
      features: ["Photo Posts", "Stories", "Reels", "Shopping", "Ads"],
      pricing: {
        type: "freemium",
        cost: "Free + Ad spend",
      },
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      description: "Direct messaging and broadcast lists for customer communication",
      status: "connected",
      isEnabled: true,
      allocation: 20,
      followers: 1200,
      engagement: 8.5,
      reach: "1.8K",
      conversions: 89,
      cpm: 15,
      cpc: 1.2,
      icon: MessageCircle,
      color: "text-green-600",
      setupUrl: "https://business.whatsapp.com",
      features: ["Direct Messages", "Broadcast Lists", "Catalog", "Automated Responses"],
      pricing: {
        type: "free",
      },
    },
    {
      id: "facebook",
      name: "Facebook Business",
      description: "Connect with customers through posts, events, and targeted ads",
      status: "disconnected",
      isEnabled: false,
      allocation: 15,
      icon: Facebook,
      color: "text-blue-600",
      setupUrl: "https://business.facebook.com",
      features: ["Page Posts", "Events", "Ads Manager", "Messenger", "Reviews"],
      pricing: {
        type: "freemium",
        cost: "Free + Ad spend",
      },
    },
    {
      id: "google",
      name: "Google My Business",
      description: "Manage your restaurant's presence on Google Search and Maps",
      status: "connected",
      isEnabled: true,
      allocation: 10,
      followers: 3200,
      engagement: 2.8,
      reach: "5.1K",
      conversions: 67,
      icon: Globe,
      color: "text-blue-500",
      setupUrl: "https://business.google.com",
      features: ["Business Listing", "Reviews", "Photos", "Posts", "Insights"],
      pricing: {
        type: "free",
      },
    },
    {
      id: "email",
      name: "Email Marketing",
      description: "Send newsletters and promotional emails to your customer list",
      status: "disconnected",
      isEnabled: false,
      allocation: 10,
      icon: Mail,
      color: "text-purple-600",
      features: ["Newsletters", "Promotional Emails", "Automated Campaigns", "Analytics"],
      pricing: {
        type: "paid",
        cost: "₹500-2000/month",
      },
    },
    {
      id: "sms",
      name: "SMS Marketing",
      description: "Send text messages for promotions and order updates",
      status: "pending",
      isEnabled: false,
      allocation: 5,
      icon: Phone,
      color: "text-orange-600",
      features: ["Promotional SMS", "Order Updates", "Bulk Messaging", "Delivery Reports"],
      pricing: {
        type: "paid",
        cost: "₹0.50-2/SMS",
      },
    },
    {
      id: "ads",
      name: "Digital Advertising",
      description: "Run targeted ads across Google, Facebook, and Instagram",
      status: "disconnected",
      isEnabled: false,
      allocation: 10,
      icon: Megaphone,
      color: "text-red-600",
      features: ["Search Ads", "Display Ads", "Social Media Ads", "Retargeting"],
      pricing: {
        type: "paid",
        cost: "Budget-based",
      },
    },
  ]

  useEffect(() => {
    fetchChannels()
  }, [])

  const fetchChannels = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setChannels(marketingChannels)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch marketing channels",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleChannel = async (channelId: string, enabled: boolean) => {
    try {
      // Update local state immediately for better UX
      setChannels((prev) =>
        prev.map((channel) =>
          channel.id === channelId
            ? { ...channel, isEnabled: enabled, status: enabled ? "connected" : "disconnected" }
            : channel,
        ),
      )

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: enabled ? "Channel Enabled" : "Channel Disabled",
        description: `${channels.find((c) => c.id === channelId)?.name} has been ${enabled ? "enabled" : "disabled"}`,
      })
    } catch (error) {
      // Revert on error
      setChannels((prev) =>
        prev.map((channel) => (channel.id === channelId ? { ...channel, isEnabled: !enabled } : channel)),
      )

      toast({
        title: "Error",
        description: "Failed to update channel status",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "disconnected":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4" />
      case "disconnected":
        return <AlertCircle className="w-4 h-4" />
      case "pending":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const connectedChannels = channels.filter((c) => c.status === "connected")
  const totalAllocation = channels.reduce((sum, c) => sum + c.allocation, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-8">
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

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/marketing")}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketing Hub
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Marketing Channels</h1>
              <p className="text-gray-600 mt-2">Connect and manage your marketing channels for maximum reach</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.push("/marketing/channels/analytics")}
                variant="outline"
                className="flex items-center justify-center bg-white border-gray-300 hover:bg-gray-50 text-gray-700 h-10 rounded-lg"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button
                onClick={() => router.push("/marketing/channels/setup")}
                className="flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white h-10 rounded-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Channel
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Connected Channels</p>
                  <p className="text-2xl font-bold text-gray-900">{connectedChannels.length}</p>
                  <p className="text-xs text-gray-500">of {channels.length} total</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Followers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {connectedChannels.reduce((sum, c) => sum + (c.followers || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">across all channels</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {connectedChannels.length > 0
                      ? (
                          connectedChannels.reduce((sum, c) => sum + (c.engagement || 0), 0) / connectedChannels.length
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-green-600 font-medium">+12% this month</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Conversions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {connectedChannels.reduce((sum, c) => sum + (c.conversions || 0), 0)}
                  </p>
                  <p className="text-xs text-gray-500">this month</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Channel Allocation Overview */}
        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Channel Allocation</CardTitle>
            <CardDescription>How your marketing efforts are distributed across channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channels
                .filter((c) => c.allocation > 0)
                .map((channel) => (
                  <div key={channel.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <channel.icon className={`w-5 h-5 ${channel.color}`} />
                      <span className="font-medium text-gray-900">{channel.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${(channel.allocation / totalAllocation) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">{channel.allocation}%</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {channels.map((channel) => (
            <Card key={channel.id} className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        channel.status === "connected" ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      <channel.icon className={`w-6 h-6 ${channel.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{channel.name}</CardTitle>
                      <CardDescription className="text-sm">{channel.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(channel.status)} variant="secondary">
                      {getStatusIcon(channel.status)}
                      <span className="ml-1 capitalize">{channel.status}</span>
                    </Badge>
                    <Switch
                      checked={channel.isEnabled}
                      onCheckedChange={(checked) => handleToggleChannel(channel.id, checked)}
                      disabled={channel.status === "pending"}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Performance Metrics */}
                {channel.status === "connected" && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {channel.followers && (
                      <div>
                        <div className="text-xs text-gray-600">Followers</div>
                        <div className="font-semibold text-gray-900">{channel.followers.toLocaleString()}</div>
                      </div>
                    )}
                    {channel.engagement && (
                      <div>
                        <div className="text-xs text-gray-600">Engagement</div>
                        <div className="font-semibold text-gray-900">{channel.engagement}%</div>
                      </div>
                    )}
                    {channel.reach && (
                      <div>
                        <div className="text-xs text-gray-600">Reach</div>
                        <div className="font-semibold text-gray-900">{channel.reach}</div>
                      </div>
                    )}
                    {channel.conversions && (
                      <div>
                        <div className="text-xs text-gray-600">Conversions</div>
                        <div className="font-semibold text-gray-900">{channel.conversions}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Features */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {channel.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Pricing</h4>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className={
                        channel.pricing.type === "free"
                          ? "bg-green-100 text-green-800"
                          : channel.pricing.type === "freemium"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                      }
                    >
                      {channel.pricing.type}
                    </Badge>
                    {channel.pricing.cost && <span className="text-sm text-gray-600">{channel.pricing.cost}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  {channel.status === "disconnected" && (
                    <Button
                      onClick={() => window.open(channel.setupUrl, "_blank")}
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white h-9 rounded-lg"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  )}
                  {channel.status === "connected" && (
                    <>
                      <Button
                        onClick={() => router.push(`/marketing/channels/${channel.id}/settings`)}
                        variant="outline"
                        className="flex-1 bg-white border-gray-300 text-gray-700 h-9 rounded-lg"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                      <Button
                        onClick={() => router.push(`/marketing/channels/${channel.id}/analytics`)}
                        variant="outline"
                        className="flex-1 bg-white border-gray-300 text-gray-700 h-9 rounded-lg"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                    </>
                  )}
                  {channel.status === "pending" && (
                    <Button
                      disabled
                      variant="outline"
                      className="flex-1 bg-gray-100 border-gray-200 text-gray-500 h-9 rounded-lg"
                    >
                      Setup in Progress
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
