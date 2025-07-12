"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import {
  Instagram,
  Facebook,
  Globe,
  MessageSquare,
  Mail,
  Phone,
  Search,
  MapPin,
  Loader2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
} from "lucide-react"
import type { MarketingChannel } from "@/lib/types/marketing-data"

const CHANNEL_CONFIGS = {
  instagram: {
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    description: "Connect your Instagram Business account",
    metrics: ["followers", "profile_visits", "website_clicks", "impressions"],
  },
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    description: "Connect your Facebook Business page",
    metrics: ["likes", "page_views", "video_views", "ctr"],
  },
  website: {
    name: "Website",
    icon: Globe,
    color: "bg-green-600",
    description: "Track your website analytics",
    metrics: ["page_views", "unique_visitors", "session_duration", "bounce_rate"],
  },
  sms: {
    name: "SMS",
    icon: MessageSquare,
    color: "bg-orange-600",
    description: "SMS marketing campaigns",
    metrics: ["sms_delivered", "sms_opens", "sms_clicks", "delivery_rate"],
  },
  email: {
    name: "Email",
    icon: Mail,
    color: "bg-red-600",
    description: "Email marketing campaigns",
    metrics: ["email_opens", "email_clicks", "open_rate", "click_rate"],
  },
  whatsapp: {
    name: "WhatsApp",
    icon: Phone,
    color: "bg-green-500",
    description: "WhatsApp Business messaging",
    metrics: ["messages_sent", "messages_read", "replies_received", "read_rate"],
  },
  google_ads: {
    name: "Google Ads",
    icon: Search,
    color: "bg-yellow-600",
    description: "Google advertising campaigns",
    metrics: ["impressions", "clicks", "ctr", "cpc", "conversion_rate"],
  },
  facebook_ads: {
    name: "Facebook Ads",
    icon: Facebook,
    color: "bg-blue-700",
    description: "Facebook advertising campaigns",
    metrics: ["impressions", "clicks", "ctr", "cpm", "roas"],
  },
  instagram_ads: {
    name: "Instagram Ads",
    icon: Instagram,
    color: "bg-gradient-to-r from-purple-600 to-pink-600",
    description: "Instagram advertising campaigns",
    metrics: ["impressions", "clicks", "ctr", "cpm", "roas"],
  },
  gmb: {
    name: "Google My Business",
    icon: MapPin,
    color: "bg-blue-500",
    description: "Google My Business profile",
    metrics: ["profile_views", "search_views", "direction_requests", "call_clicks"],
  },
}

interface MarketingChannelsFormProps {
  restaurantId: string
  onChannelsUpdate?: (channels: MarketingChannel[]) => void
}

export default function MarketingChannelsForm({ restaurantId, onChannelsUpdate }: MarketingChannelsFormProps) {
  const [channels, setChannels] = useState<MarketingChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadChannels()
  }, [restaurantId])

  const loadChannels = async () => {
    try {
      const response = await fetch(`/api/marketing-data?restaurant_id=${restaurantId}&type=channels`)
      const data = await response.json()

      if (data.success) {
        setChannels(data.channels || [])
        onChannelsUpdate?.(data.channels || [])
      }
    } catch (error) {
      console.error("Error loading channels:", error)
      toast({
        title: "Error",
        description: "Failed to load marketing channels",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const connectChannel = async (channelName: string) => {
    try {
      const channelData: Partial<MarketingChannel> = {
        restaurant_id: restaurantId,
        channel_name: channelName as any,
        is_connected: true,
        connection_status: "active",
        reach: 0,
        engagement: 0,
        conversation: 0,
        spend: 0,
        content_published_count: 0,
        content_types: {},
        channel_specific_metrics: {},
        config: {
          auto_sync: true,
          notifications_enabled: true,
          budget_alerts: true,
          performance_alerts: true,
          content_approval_required: false,
          auto_respond_enabled: false,
          tracking_pixels_enabled: true,
          utm_tracking_enabled: true,
        },
        sync_frequency: "daily",
        data_retention_days: 365,
      }

      const response = await fetch("/api/marketing-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "channel", data: channelData }),
      })

      const result = await response.json()

      if (result.success) {
        await loadChannels()
        toast({
          title: "Success",
          description: `${CHANNEL_CONFIGS[channelName as keyof typeof CHANNEL_CONFIGS].name} connected successfully`,
        })
      }
    } catch (error) {
      console.error("Error connecting channel:", error)
      toast({
        title: "Error",
        description: "Failed to connect channel",
        variant: "destructive",
      })
    }
  }

  const syncChannel = async (channelName: string) => {
    setSyncing(channelName)
    try {
      const response = await fetch("/api/marketing-data/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurant_id: restaurantId, channel_name: channelName }),
      })

      const result = await response.json()

      if (result.success) {
        await loadChannels()
        toast({
          title: "Success",
          description: `${CHANNEL_CONFIGS[channelName as keyof typeof CHANNEL_CONFIGS].name} synced successfully`,
        })
      }
    } catch (error) {
      console.error("Error syncing channel:", error)
      toast({
        title: "Error",
        description: "Failed to sync channel data",
        variant: "destructive",
      })
    } finally {
      setSyncing(null)
    }
  }

  const disconnectChannel = async (channelId: string, channelName: string) => {
    try {
      const channel = channels.find((c) => c.id === channelId)
      if (!channel) return

      const updatedChannel = {
        ...channel,
        is_connected: false,
        connection_status: "inactive" as const,
      }

      const response = await fetch("/api/marketing-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "channel", data: updatedChannel }),
      })

      const result = await response.json()

      if (result.success) {
        await loadChannels()
        toast({
          title: "Success",
          description: `${CHANNEL_CONFIGS[channelName as keyof typeof CHANNEL_CONFIGS].name} disconnected`,
        })
      }
    } catch (error) {
      console.error("Error disconnecting channel:", error)
      toast({
        title: "Error",
        description: "Failed to disconnect channel",
        variant: "destructive",
      })
    }
  }

  const getChannelStatus = (channelName: string) => {
    const channel = channels.find((c) => c.channel_name === channelName)
    return channel?.is_connected ? "connected" : "disconnected"
  }

  const getChannelData = (channelName: string) => {
    return channels.find((c) => c.channel_name === channelName)
  }

  const formatMetricValue = (value: any, metric: string) => {
    if (typeof value !== "number") return "0"

    if (metric.includes("rate") || metric.includes("ctr") || metric.includes("cpc")) {
      return `${value}%`
    }

    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }

    return value.toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const connectedChannels = channels.filter((c) => c.is_connected)
  const completionPercentage = Math.round((connectedChannels.length / Object.keys(CHANNEL_CONFIGS).length) * 100)

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Marketing Channels Setup
          </CardTitle>
          <CardDescription>Connect your marketing channels to track performance and automate campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Setup Progress</span>
              <span className="text-sm text-muted-foreground">
                {connectedChannels.length} of {Object.keys(CHANNEL_CONFIGS).length} channels connected
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedChannels.map((channel) => {
              const config = CHANNEL_CONFIGS[channel.channel_name as keyof typeof CHANNEL_CONFIGS]
              const Icon = config.icon

              return (
                <Card key={channel.id} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 ${config.color}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        <CardTitle className="text-base">{config.name}</CardTitle>
                      </div>
                      <Badge variant={channel.connection_status === "active" ? "default" : "secondary"}>
                        {channel.connection_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Reach:</span>
                        <span className="font-medium">{formatMetricValue(channel.reach, "reach")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Engagement:</span>
                        <span className="font-medium">{formatMetricValue(channel.engagement, "engagement")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MousePointer className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Conversions:</span>
                        <span className="font-medium">{formatMetricValue(channel.conversation, "conversation")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Spend:</span>
                        <span className="font-medium">₹{formatMetricValue(channel.spend, "spend")}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Last sync: {channel.last_sync ? new Date(channel.last_sync).toLocaleDateString() : "Never"}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => syncChannel(channel.channel_name)}
                        disabled={syncing === channel.channel_name}
                      >
                        {syncing === channel.channel_name ? <Loader2 className="h-3 w-3 animate-spin" /> : "Sync"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(CHANNEL_CONFIGS).map(([channelName, config]) => {
              const Icon = config.icon
              const status = getChannelStatus(channelName)
              const channelData = getChannelData(channelName)

              return (
                <Card key={channelName} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{config.name}</CardTitle>
                          <CardDescription>{config.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {status === "connected" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {status === "connected" && channelData ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {config.metrics.slice(0, 4).map((metric) => {
                            const value = channelData.channel_specific_metrics?.[metric] || 0
                            return (
                              <div key={metric} className="space-y-1">
                                <span className="text-muted-foreground capitalize">{metric.replace(/_/g, " ")}</span>
                                <div className="font-medium">{formatMetricValue(value, metric)}</div>
                              </div>
                            )
                          })}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => syncChannel(channelName)}
                            disabled={syncing === channelName}
                            className="flex-1"
                          >
                            {syncing === channelName ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                                Syncing...
                              </>
                            ) : (
                              "Sync Data"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => disconnectChannel(channelData.id, channelName)}
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Connect this channel to start tracking performance metrics and running campaigns.
                        </p>
                        <Button onClick={() => connectChannel(channelName)} className="w-full">
                          Connect {config.name}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance Analytics</CardTitle>
              <CardDescription>Detailed performance metrics across all connected channels</CardDescription>
            </CardHeader>
            <CardContent>
              {connectedChannels.length > 0 ? (
                <div className="space-y-6">
                  {connectedChannels.map((channel) => {
                    const config = CHANNEL_CONFIGS[channel.channel_name as keyof typeof CHANNEL_CONFIGS]
                    const Icon = config.icon

                    return (
                      <div key={channel.id} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <h4 className="font-medium">{config.name}</h4>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="space-y-1">
                            <span className="text-muted-foreground">Reach</span>
                            <div className="text-lg font-semibold">{formatMetricValue(channel.reach, "reach")}</div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-muted-foreground">Engagement</span>
                            <div className="text-lg font-semibold">
                              {formatMetricValue(channel.engagement, "engagement")}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-muted-foreground">Conversions</span>
                            <div className="text-lg font-semibold">
                              {formatMetricValue(channel.conversation, "conversation")}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-muted-foreground">Spend</span>
                            <div className="text-lg font-semibold">₹{formatMetricValue(channel.spend, "spend")}</div>
                          </div>
                        </div>

                        <Separator />
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Connected Channels</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect your marketing channels to view performance analytics
                  </p>
                  <Button onClick={() => setSelectedChannel("channels")}>Connect Channels</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
