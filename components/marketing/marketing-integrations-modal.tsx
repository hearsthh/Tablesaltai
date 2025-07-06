"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import {
  Settings,
  Instagram,
  Facebook,
  MessageCircle,
  Mail,
  Phone,
  Globe,
  Megaphone,
  RefreshCw,
  Plus,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface Channel {
  id: string
  name: string
  type: string
  status: "connected" | "disconnected" | "pending"
  strength: number
  followers?: number
  engagement_rate?: number
  monthly_reach?: number
  last_sync?: string
  description: string
}

interface MarketingIntegrationsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MarketingIntegrationsModal({ isOpen, onClose }: MarketingIntegrationsModalProps) {
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)

  // India-specific marketing channels
  const indianChannels: Channel[] = [
    {
      id: "instagram",
      name: "Instagram",
      type: "social",
      status: "connected",
      strength: 30,
      followers: 2400,
      engagement_rate: 4.2,
      monthly_reach: 8500,
      last_sync: new Date().toISOString(),
      description: "Visual content and stories for food showcase",
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      type: "messaging",
      status: "connected",
      strength: 20,
      monthly_reach: 1200,
      last_sync: new Date().toISOString(),
      description: "Direct customer communication and order updates",
    },
    {
      id: "tablesalt",
      name: "Tablesalt Profile",
      type: "platform",
      status: "connected",
      strength: 10,
      monthly_reach: 890,
      last_sync: new Date().toISOString(),
      description: "Restaurant discovery and booking platform",
    },
    {
      id: "website",
      name: "Website",
      type: "web",
      status: "connected",
      strength: 10,
      monthly_reach: 3200,
      last_sync: new Date().toISOString(),
      description: "Your restaurant's official website",
    },
    {
      id: "ad_channels",
      name: "Ad Channels",
      type: "advertising",
      status: "disconnected",
      strength: 15,
      description: "Google Ads, Facebook Ads, Instagram Ads",
    },
    {
      id: "facebook",
      name: "Facebook",
      type: "social",
      status: "disconnected",
      strength: 5,
      description: "Community building and event promotion",
    },
    {
      id: "sms",
      name: "SMS Marketing",
      type: "messaging",
      status: "disconnected",
      strength: 5,
      description: "Direct SMS campaigns and notifications",
    },
    {
      id: "email",
      name: "Email Marketing",
      type: "messaging",
      status: "disconnected",
      strength: 5,
      description: "Newsletter and promotional emails",
    },
  ]

  useEffect(() => {
    if (isOpen) {
      fetchChannels()
    }
  }, [isOpen])

  const fetchChannels = async () => {
    setLoading(true)
    try {
      // Simulate API call - in real app, fetch from API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setChannels(indianChannels)
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

  const handleChannelAction = async (channelId: string, action: "connect" | "disconnect" | "configure") => {
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

  const getChannelIcon = (channelId: string) => {
    switch (channelId) {
      case "instagram":
        return <Instagram className="w-5 h-5 text-pink-600" />
      case "facebook":
        return <Facebook className="w-5 h-5 text-blue-600" />
      case "whatsapp":
        return <MessageCircle className="w-5 h-5 text-green-600" />
      case "email":
        return <Mail className="w-5 h-5 text-purple-600" />
      case "sms":
        return <Phone className="w-5 h-5 text-orange-600" />
      case "website":
        return <Globe className="w-5 h-5 text-blue-500" />
      case "tablesalt":
        return <Settings className="w-5 h-5 text-indigo-600" />
      case "ad_channels":
        return <Megaphone className="w-5 h-5 text-red-600" />
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "disconnected":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case "pending":
        return <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const connectedChannels = channels.filter((ch) => ch.status === "connected")
  const totalStrength = connectedChannels.reduce((sum, ch) => sum + ch.strength, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Settings className="w-6 h-6 mr-3 text-blue-600" />
            Marketing Integrations
          </DialogTitle>
          <DialogDescription>Connect and manage your marketing channels for India market</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-slate-600" />
            <span className="ml-3 text-slate-600">Loading channels...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-900">{connectedChannels.length}</div>
                <div className="text-sm text-blue-700">Connected</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-900">{totalStrength}%</div>
                <div className="text-sm text-green-700">Total Reach</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-900">
                  {connectedChannels.reduce((sum, ch) => sum + (ch.monthly_reach || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-purple-700">Monthly Reach</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-900">
                  {channels.filter((ch) => ch.status === "disconnected").length}
                </div>
                <div className="text-sm text-orange-700">Available</div>
              </div>
            </div>

            {/* Channels List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Marketing Channels</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getChannelIcon(channel.id)}
                        <div>
                          <h4 className="font-medium text-slate-900">{channel.name}</h4>
                          <p className="text-sm text-slate-600 capitalize">{channel.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(channel.status)}
                        <Badge className={getStatusColor(channel.status)} variant="secondary">
                          {channel.status}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-3">{channel.description}</p>

                    {/* Channel Strength */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Market Strength</span>
                        <span className="text-slate-900 font-medium">{channel.strength}%</span>
                      </div>
                      <Progress value={channel.strength} className="h-2" />
                    </div>

                    {/* Channel Stats */}
                    {channel.status === "connected" && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {channel.followers && (
                          <div className="text-center p-2 bg-slate-50 rounded">
                            <div className="text-sm font-bold text-slate-900">{channel.followers.toLocaleString()}</div>
                            <div className="text-xs text-slate-600">Followers</div>
                          </div>
                        )}
                        {channel.engagement_rate && (
                          <div className="text-center p-2 bg-slate-50 rounded">
                            <div className="text-sm font-bold text-slate-900">{channel.engagement_rate}%</div>
                            <div className="text-xs text-slate-600">Engagement</div>
                          </div>
                        )}
                        {channel.monthly_reach && (
                          <div className="text-center p-2 bg-slate-50 rounded col-span-2">
                            <div className="text-sm font-bold text-slate-900">
                              {channel.monthly_reach.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-600">Monthly Reach</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {channel.status === "connected" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs bg-transparent"
                            onClick={() => handleChannelAction(channel.id, "configure")}
                          >
                            <Settings className="w-3 h-3 mr-1" />
                            Configure
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs bg-transparent text-red-600 hover:bg-red-50"
                            onClick={() => handleChannelAction(channel.id, "disconnect")}
                          >
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                          onClick={() => handleChannelAction(channel.id, "connect")}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Connect {channel.name}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
