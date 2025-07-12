"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Target, DollarSign, Users, Zap, CheckCircle, Clock, Plus, X } from "lucide-react"
import { Navigation } from "@/components/navigation"

interface CampaignFormData {
  name: string
  description: string
  objective: "reach" | "engagement" | "conversion" | ""
  budget: string
  startDate: string
  endDate: string
  targetAudience: string[]
  channels: string[]
}

export default function CreateCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    description: "",
    objective: "",
    budget: "",
    startDate: "",
    endDate: "",
    targetAudience: [],
    channels: [],
  })

  const objectives = [
    { value: "reach", label: "Brand Awareness", description: "Increase visibility and reach" },
    { value: "engagement", label: "Engagement", description: "Drive likes, comments, and shares" },
    { value: "conversion", label: "Conversions", description: "Generate bookings and orders" },
  ]

  const audienceOptions = [
    "New Customers",
    "Returning Customers",
    "Local Residents",
    "Food Enthusiasts",
    "Young Professionals",
    "Families",
    "Corporate Groups",
  ]

  const channelOptions = [
    { id: "instagram", name: "Instagram", icon: "📷" },
    { id: "facebook", name: "Facebook", icon: "📘" },
    { id: "whatsapp", name: "WhatsApp", icon: "💬" },
    { id: "email", name: "Email", icon: "📧" },
    { id: "website", name: "Website", icon: "🌐" },
  ]

  const handleInputChange = (field: keyof CampaignFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: "targetAudience" | "channels", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter((item) => item !== value) : [...prev[field], value],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate form
      if (!formData.name || !formData.objective || !formData.budget) {
        throw new Error("Please fill in all required fields")
      }

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Campaign Created",
        description: "Your marketing campaign has been created successfully!",
      })

      router.push("/marketing/campaigns")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create campaign",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.name && formData.objective && formData.budget

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-3 py-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/marketing/campaigns")}
              className="text-gray-600 hover:text-gray-900 p-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Create Campaign</h1>
              <p className="text-sm text-gray-600">Set up a new marketing campaign</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Basic Information</CardTitle>
              <CardDescription className="text-sm">Campaign name and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Campaign Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Weekend Special Promotion"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your campaign goals and strategy..."
                  className="mt-1 min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Campaign Objective */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center">
                <Target className="w-4 h-4 mr-2 text-gray-600" />
                Campaign Objective *
              </CardTitle>
              <CardDescription className="text-sm">What do you want to achieve?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {objectives.map((objective) => (
                  <div
                    key={objective.value}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.objective === objective.value
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleInputChange("objective", objective.value)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{objective.label}</h4>
                      {formData.objective === objective.value && <CheckCircle className="w-4 h-4 text-gray-900" />}
                    </div>
                    <p className="text-xs text-gray-600">{objective.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Budget & Timeline */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-gray-600" />
                Budget & Timeline
              </CardTitle>
              <CardDescription className="text-sm">Set your budget and campaign duration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="budget" className="text-sm font-medium">
                  Budget (₹) *
                </Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  placeholder="e.g., 10000"
                  className="mt-1"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
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
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Audience */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-600" />
                Target Audience
              </CardTitle>
              <CardDescription className="text-sm">Who do you want to reach?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {audienceOptions.map((audience) => (
                  <Badge
                    key={audience}
                    variant={formData.targetAudience.includes(audience) ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      formData.targetAudience.includes(audience)
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleArrayChange("targetAudience", audience)}
                  >
                    {audience}
                    {formData.targetAudience.includes(audience) && <X className="w-3 h-3 ml-1" />}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Channels */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center">
                <Zap className="w-4 h-4 mr-2 text-gray-600" />
                Marketing Channels
              </CardTitle>
              <CardDescription className="text-sm">Select where to run your campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {channelOptions.map((channel) => (
                  <div
                    key={channel.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.channels.includes(channel.id)
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleArrayChange("channels", channel.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{channel.icon}</span>
                        <span className="text-sm font-medium text-gray-900">{channel.name}</span>
                      </div>
                      {formData.channels.includes(channel.id) && <CheckCircle className="w-4 h-4 text-gray-900" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/marketing/campaigns")}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
