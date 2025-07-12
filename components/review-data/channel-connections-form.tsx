"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  Settings,
  RefreshCw,
  Star,
  MessageSquare,
  Zap,
} from "lucide-react"
import type { ChannelMetrics } from "@/lib/types/review-data"

interface ChannelConnectionsFormProps {
  initialData?: ChannelMetrics[]
  onSave: (data: ChannelMetrics[]) => void
  onSync: (channelId: string) => Promise<void>
  onSyncAll: () => Promise<void>
}

export default function ChannelConnectionsForm({
  initialData = [],
  onSave,
  onSync,
  onSyncAll,
}: ChannelConnectionsFormProps) {
  const [channels, setChannels] = useState<ChannelMetrics[]>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<ChannelMetrics | null>(null)
  const [showConnectionDialog, setShowConnectionDialog] = useState(false)
  const [connectionForm, setConnectionForm] = useState({
    businessId: "",
    apiKey: "",
    accessToken: "",
    placeId: "",
  })

  const availableChannels = [
    {
      id: "google",
      name: "Google My Business",
      type: "google" as const,
      logo: "/placeholder.svg?height=32&width=32",
      description: "Connect your Google My Business account to sync reviews",
      setupUrl: "https://business.google.com",
      isPopular: true,
    },
    {
      id: "yelp",
      name: "Yelp",
      type: "yelp" as const,
      logo: "/placeholder.svg?height=32&width=32",
      description: "Sync reviews from your Yelp business page",
      setupUrl: "https://business.yelp.com",
      isPopular: true,
    },
    {
      id: "zomato",
      name: "Zomato",
      type: "zomato" as const,
      logo: "/placeholder.svg?height=32&width=32",
      description: "Connect your Zomato restaurant profile",
      setupUrl: "https://business.zomato.com",
      isPopular: true,
    },
    {
      id: "tripadvisor",
      name: "TripAdvisor",
      type: "tripadvisor" as const,
      logo: "/placeholder.svg?height=32&width=32",
      description: "Sync reviews from TripAdvisor",
      setupUrl: "https://business.tripadvisor.com",
      isPopular: false,
    },
    {
      id: "facebook",
      name: "Facebook",
      type: "facebook" as const,
      logo: "/placeholder.svg?height=32&width=32",
      description: "Connect your Facebook business page",
      setupUrl: "https://business.facebook.com",
      isPopular: true,
    },
    {
      id: "direct",
      name: "Direct Reviews",
      type: "direct" as const,
      logo: "/placeholder.svg?height=32&width=32",
      description: "Collect reviews directly on your website",
      setupUrl: "",
      isPopular: false,
    },
  ]

  useEffect(() => {
    // Initialize with demo data if no initial data
    if (initialData.length === 0) {
      const demoChannels: ChannelMetrics[] = availableChannels.map((channel) => ({
        channelId: channel.id,
        channelName: channel.name,
        channelType: channel.type,
        isConnected: ["google", "yelp", "zomato", "facebook"].includes(channel.id),
        avgRating: ["google", "yelp", "zomato", "facebook"].includes(channel.id)
          ? Number((4.0 + Math.random() * 1.0).toFixed(1))
          : 0,
        ratingCount: ["google", "yelp", "zomato", "facebook"].includes(channel.id)
          ? Math.floor(50 + Math.random() * 150)
          : 0,
        lastSyncTime: ["google", "yelp", "zomato", "facebook"].includes(channel.id)
          ? new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000).toISOString()
          : "",
        syncStatus: ["google", "yelp", "zomato", "facebook"].includes(channel.id) ? "success" : "never",
        channelUrl: channel.setupUrl,
        channelLogo: channel.logo,
      }))
      setChannels(demoChannels)
    }
  }, [initialData])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onSave(channels)
      toast({
        title: "Success",
        description: "Channel connections saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save channel connections",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async (channelId: string) => {
    setIsLoading(true)
    try {
      // Simulate connection process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setChannels((prev) =>
        prev.map((channel) =>
          channel.channelId === channelId
            ? {
                ...channel,
                isConnected: true,
                syncStatus: "success",
                lastSyncTime: new Date().toISOString(),
                avgRating: Number((4.0 + Math.random() * 1.0).toFixed(1)),
                ratingCount: Math.floor(20 + Math.random() * 100),
              }
            : channel,
        ),
      )

      setShowConnectionDialog(false)
      toast({
        title: "Connected!",
        description: `Successfully connected to ${availableChannels.find((c) => c.id === channelId)?.name}`,
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the platform. Please check your credentials.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = (channelId: string) => {
    setChannels((prev) =>
      prev.map((channel) =>
        channel.channelId === channelId
          ? {
              ...channel,
              isConnected: false,
              syncStatus: "never",
              lastSyncTime: "",
              avgRating: 0,
              ratingCount: 0,
            }
          : channel,
      ),
    )

    toast({
      title: "Disconnected",
      description: `Disconnected from ${availableChannels.find((c) => c.id === channelId)?.name}`,
    })
  }

  const handleSync = async (channelId: string) => {
    setIsLoading(true)
    try {
      await onSync(channelId)

      // Update sync status
      setChannels((prev) =>
        prev.map((channel) =>
          channel.channelId === channelId
            ? {
                ...channel,
                lastSyncTime: new Date().toISOString(),
                syncStatus: "success",
              }
            : channel,
        ),
      )

      toast({
        title: "Sync Complete",
        description: `Successfully synced reviews from ${availableChannels.find((c) => c.id === channelId)?.name}`,
      })
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync reviews. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSyncAll = async () => {
    setIsLoading(true)
    try {
      await onSyncAll()

      // Update all connected channels
      setChannels((prev) =>
        prev.map((channel) =>
          channel.isConnected
            ? {
                ...channel,
                lastSyncTime: new Date().toISOString(),
                syncStatus: "success",
              }
            : channel,
        ),
      )

      toast({
        title: "Sync Complete",
        description: "Successfully synced all connected channels",
      })
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync some channels. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: ChannelMetrics["syncStatus"], isConnected: boolean) => {
    if (!isConnected) return <XCircle className="w-4 h-4 text-gray-400" />

    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusText = (status: ChannelMetrics["syncStatus"], isConnected: boolean) => {
    if (!isConnected) return "Not connected"

    switch (status) {
      case "success":
        return "Connected"
      case "error":
        return "Error"
      case "pending":
        return "Syncing..."
      default:
        return "Never synced"
    }
  }

  const connectedChannels = channels.filter((c) => c.isConnected)
  const totalReviews = connectedChannels.reduce((sum, c) => sum + c.ratingCount, 0)
  const avgRating =
    totalReviews > 0 ? connectedChannels.reduce((sum, c) => sum + c.avgRating * c.ratingCount, 0) / totalReviews : 0

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Connected</p>
                <p className="text-lg font-semibold">{connectedChannels.length}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Reviews</p>
                <p className="text-lg font-semibold">{totalReviews}</p>
              </div>
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Avg Rating</p>
                <div className="flex items-center space-x-1">
                  <p className="text-lg font-semibold">{avgRating.toFixed(1)}</p>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
              </div>
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Last Sync</p>
                <p className="text-sm font-medium">{connectedChannels.length > 0 ? "Just now" : "Never"}</p>
              </div>
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSyncAll}
          disabled={isLoading || connectedChannels.length === 0}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync All Channels</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowConnectionDialog(true)}
          className="flex items-center space-x-2 bg-transparent"
        >
          <Plus className="w-4 h-4" />
          <span>Add Channel</span>
        </Button>
      </div>

      {/* Channel List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Review Channels</CardTitle>
          <CardDescription>Connect and manage your review platforms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableChannels.map((availableChannel) => {
            const channel = channels.find((c) => c.channelId === availableChannel.id)
            const isConnected = channel?.isConnected || false

            return (
              <div key={availableChannel.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={availableChannel.logo || "/placeholder.svg"}
                    alt={availableChannel.name}
                    className="w-8 h-8 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm">{availableChannel.name}</h4>
                      {availableChannel.isPopular && (
                        <Badge variant="outline" className="text-xs">
                          Popular
                        </Badge>
                      )}
                      {getStatusIcon(channel?.syncStatus || "never", isConnected)}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{availableChannel.description}</p>

                    {isConnected && channel && (
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{channel.avgRating.toFixed(1)}</span>
                        </span>
                        <span>{channel.ratingCount} reviews</span>
                        {channel.lastSyncTime && (
                          <span>Last sync: {new Date(channel.lastSyncTime).toLocaleTimeString()}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isConnected ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSync(availableChannel.id)}
                        disabled={isLoading}
                        className="bg-transparent"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Sync
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedChannel(channel)}>
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDisconnect(availableChannel.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedChannel({
                          channelId: availableChannel.id,
                          channelName: availableChannel.name,
                          channelType: availableChannel.type,
                          isConnected: false,
                          avgRating: 0,
                          ratingCount: 0,
                          lastSyncTime: "",
                          syncStatus: "never",
                        })
                        setShowConnectionDialog(true)
                      }}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Connection Dialog */}
      <Dialog open={showConnectionDialog} onOpenChange={setShowConnectionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect to {selectedChannel?.channelName}</DialogTitle>
            <DialogDescription>Enter your platform credentials to sync reviews automatically</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedChannel?.channelType === "google" && (
              <>
                <div>
                  <Label htmlFor="placeId" className="text-sm">
                    Google Place ID
                  </Label>
                  <Input
                    id="placeId"
                    placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
                    value={connectionForm.placeId}
                    onChange={(e) => setConnectionForm((prev) => ({ ...prev, placeId: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="apiKey" className="text-sm">
                    API Key
                  </Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="AIzaSyD..."
                    value={connectionForm.apiKey}
                    onChange={(e) => setConnectionForm((prev) => ({ ...prev, apiKey: e.target.value }))}
                  />
                </div>
              </>
            )}

            {selectedChannel?.channelType === "yelp" && (
              <>
                <div>
                  <Label htmlFor="businessId" className="text-sm">
                    Business ID
                  </Label>
                  <Input
                    id="businessId"
                    placeholder="your-business-name-city"
                    value={connectionForm.businessId}
                    onChange={(e) => setConnectionForm((prev) => ({ ...prev, businessId: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="apiKey" className="text-sm">
                    API Key
                  </Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Bearer token..."
                    value={connectionForm.apiKey}
                    onChange={(e) => setConnectionForm((prev) => ({ ...prev, apiKey: e.target.value }))}
                  />
                </div>
              </>
            )}

            {(selectedChannel?.channelType === "zomato" || selectedChannel?.channelType === "facebook") && (
              <>
                <div>
                  <Label htmlFor="businessId" className="text-sm">
                    Business/Page ID
                  </Label>
                  <Input
                    id="businessId"
                    placeholder="123456789"
                    value={connectionForm.businessId}
                    onChange={(e) => setConnectionForm((prev) => ({ ...prev, businessId: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="accessToken" className="text-sm">
                    Access Token
                  </Label>
                  <Input
                    id="accessToken"
                    type="password"
                    placeholder="Access token..."
                    value={connectionForm.accessToken}
                    onChange={(e) => setConnectionForm((prev) => ({ ...prev, accessToken: e.target.value }))}
                  />
                </div>
              </>
            )}

            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <Zap className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-blue-800">Need help? Check our setup guide for step-by-step instructions.</p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowConnectionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => selectedChannel && handleConnect(selectedChannel.channelId)} disabled={isLoading}>
              {isLoading ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Connections"}
        </Button>
      </div>
    </div>
  )
}
