"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { ArrowLeft, Save, Play, Pause, Target, Calendar, DollarSign } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import type { Campaign } from "@/types/marketing"

export default function EditCampaignPage() {
  const router = useRouter()
  const params = useParams()
  const campaignId = params.id as string

  const [campaign, setCampaign] = useState<Partial<Campaign>>({
    name: "",
    description: "",
    objective: "conversion",
    status: "draft",
    budget: 0,
    startDate: "",
    endDate: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock campaign data
        const mockCampaign: Campaign = {
          id: campaignId,
          name: "Instagram Stories Campaign",
          description: "Daily stories showcasing weekend specials",
          objective: "conversion",
          status: "active",
          progress: 80,
          startDate: "2024-01-01",
          endDate: "2024-01-31",
          budget: 10000,
          spent: 7500,
          contentUnits: ["1", "2"],
          strategyId: "1",
          analytics: {
            reach: 8500,
            engagement: 425,
            conversions: 25,
            spend: 7500,
            revenue: 22500,
            roi: 3.0,
          },
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
        }

        setCampaign(mockCampaign)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load campaign details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCampaign()
  }, [campaignId])

  const handleSave = async () => {
    try {
      setSaving(true)

      // Validate required fields
      if (!campaign.name || !campaign.description || !campaign.budget) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Success",
        description: "Campaign updated successfully",
      })

      router.push(`/marketing/campaigns/${campaignId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      setCampaign((prev) => ({ ...prev, status: newStatus as any }))

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Success",
        description: `Campaign ${newStatus === "active" ? "started" : "paused"} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign status",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
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

      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/marketing/campaigns/${campaignId}`)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaign
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Edit Campaign</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Update campaign details and settings</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(campaign.status || "draft")}>{campaign.status || "draft"}</Badge>
              {campaign.status === "active" ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange("paused")}
                  className="bg-white text-xs sm:text-sm"
                >
                  <Pause className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Pause
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange("active")}
                  className="bg-white text-xs sm:text-sm"
                >
                  <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Start
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Campaign Name *
                  </Label>
                  <Input
                    id="name"
                    value={campaign.name}
                    onChange={(e) => setCampaign((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter campaign name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={campaign.description}
                    onChange={(e) => setCampaign((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your campaign goals and strategy"
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="objective" className="text-sm font-medium">
                      Objective
                    </Label>
                    <Select
                      value={campaign.objective}
                      onValueChange={(value) => setCampaign((prev) => ({ ...prev, objective: value as any }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reach">Reach</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                        <SelectItem value="conversion">Conversion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="budget" className="text-sm font-medium">
                      Budget (₹) *
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      value={campaign.budget}
                      onChange={(e) =>
                        setCampaign((prev) => ({ ...prev, budget: Number.parseInt(e.target.value) || 0 }))
                      }
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate" className="text-sm font-medium">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={campaign.startDate}
                      onChange={(e) => setCampaign((prev) => ({ ...prev, startDate: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate" className="text-sm font-medium">
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={campaign.endDate}
                      onChange={(e) => setCampaign((prev) => ({ ...prev, endDate: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Campaign Progress */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Campaign Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Completion</span>
                      <span className="font-medium">{campaign.progress || 0}%</span>
                    </div>
                    <Progress value={campaign.progress || 0} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Target className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                      <div className="font-medium">{campaign.analytics?.conversions || 0}</div>
                      <div className="text-xs text-gray-600">Conversions</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <DollarSign className="w-4 h-4 mx-auto mb-1 text-green-600" />
                      <div className="font-medium">{campaign.analytics?.roi || 0}x</div>
                      <div className="text-xs text-gray-600">ROI</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Overview */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Budget Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Budget:</span>
                    <span className="font-medium">₹{(campaign.budget || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Spent:</span>
                    <span className="font-medium">₹{(campaign.spent || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-medium text-green-600">
                      ₹{((campaign.budget || 0) - (campaign.spent || 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Budget Used:</span>
                      <span className="font-medium">
                        {campaign.budget ? Math.round(((campaign.spent || 0) / campaign.budget) * 100) : 0}%
                      </span>
                    </div>
                    <Progress
                      value={campaign.budget ? ((campaign.spent || 0) / campaign.budget) * 100 : 0}
                      className="h-2 mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Timeline */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Start:</span>
                    <span className="font-medium">
                      {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : "Not set"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">End:</span>
                    <span className="font-medium">
                      {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "Not set"}
                    </span>
                  </div>
                  {campaign.startDate && campaign.endDate && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {Math.ceil(
                          (new Date(campaign.endDate).getTime() - new Date(campaign.startDate).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        days
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white text-sm"
                  onClick={() => router.push(`/marketing/campaigns/${campaignId}`)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  View Campaign
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white text-sm"
                  onClick={() => router.push(`/marketing/content-units/create?campaignId=${campaignId}`)}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Add Content
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white text-sm"
                  onClick={() => router.push("/marketing/analytics")}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
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
