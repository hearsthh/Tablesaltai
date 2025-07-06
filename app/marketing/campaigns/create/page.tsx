"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Target,
  Sparkles,
  CheckCircle,
  Instagram,
  Facebook,
  MessageCircle,
  Mail,
  Phone,
  Globe,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

interface CampaignForm {
  name: string
  objective: string
  type: "paid" | "organic" | "both"
  description: string
  budget: number
  duration: {
    start: string
    end: string
  }
  frequency: string
  channels: string[]
  targetAudience: {
    ageRange: string
    location: string
    interests: string[]
  }
  contentTypes: string[]
  autoGenerate: boolean
}

export default function CreateCampaignPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CampaignForm>({
    name: "",
    objective: "",
    type: "both",
    description: "",
    budget: 0,
    duration: {
      start: "",
      end: "",
    },
    frequency: "",
    channels: [],
    targetAudience: {
      ageRange: "",
      location: "",
      interests: [],
    },
    contentTypes: [],
    autoGenerate: true,
  })

  const objectives = [
    { value: "brand_awareness", label: "Brand Awareness", description: "Increase visibility and recognition" },
    { value: "lead_generation", label: "Lead Generation", description: "Generate new customer leads" },
    { value: "sales", label: "Increase Sales", description: "Drive direct sales and revenue" },
    { value: "engagement", label: "Customer Engagement", description: "Boost interaction and loyalty" },
    { value: "traffic", label: "Website Traffic", description: "Drive visitors to your website" },
    { value: "app_installs", label: "App Downloads", description: "Increase mobile app installations" },
  ]

  const channels = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-600", type: "social" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600", type: "social" },
    { id: "whatsapp", name: "WhatsApp Business", icon: MessageCircle, color: "text-green-600", type: "messaging" },
    { id: "email", name: "Email Marketing", icon: Mail, color: "text-purple-600", type: "messaging" },
    { id: "sms", name: "SMS Marketing", icon: Phone, color: "text-orange-600", type: "messaging" },
    { id: "website", name: "Website", icon: Globe, color: "text-blue-500", type: "web" },
  ]

  const contentTypes = [
    "Social Media Posts",
    "Stories & Reels",
    "Email Newsletters",
    "WhatsApp Messages",
    "Blog Articles",
    "Product Images",
    "Promotional Videos",
    "Infographics",
  ]

  const interests = [
    "Food & Dining",
    "Local Events",
    "Family Dining",
    "Fine Dining",
    "Casual Dining",
    "Takeaway & Delivery",
    "Vegetarian Food",
    "Regional Cuisine",
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof CampaignForm],
        [field]: value,
      },
    }))
  }

  const handleArrayToggle = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field as keyof CampaignForm].includes(value)
        ? prev[field as keyof CampaignForm].filter((item: string) => item !== value)
        : [...prev[field as keyof CampaignForm], value],
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/marketing/campaigns/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Campaign Created!",
          description: "Your campaign has been created successfully.",
        })
        router.push(`/marketing/campaigns/${data.campaignId}`)
      } else {
        throw new Error(data.error || "Failed to create campaign")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.objective && formData.type
      case 2:
        return formData.channels.length > 0
      case 3:
        return formData.duration.start && formData.duration.end && formData.frequency
      case 4:
        return true
      default:
        return false
    }
  }

  const steps = [
    { number: 1, title: "Campaign Basics", description: "Name, objective, and type" },
    { number: 2, title: "Channels & Content", description: "Select platforms and content types" },
    { number: 3, title: "Schedule & Budget", description: "Timeline and budget allocation" },
    { number: 4, title: "Target Audience", description: "Define your target market" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/marketing/campaigns")}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create New Campaign</h1>
            <p className="text-gray-600 mt-2">Set up a comprehensive marketing campaign for your restaurant</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.number ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium text-gray-900">{step.title}</div>
                    <div className="text-xs text-gray-500 hidden sm:block">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.number ? "bg-gray-900" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8">
            {/* Step 1: Campaign Basics */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Basics</h2>
                  <p className="text-gray-600 mb-6">Let's start with the fundamental details of your campaign</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Diwali Special Menu Campaign"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of your campaign goals and strategy"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Campaign Objective</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {objectives.map((objective) => (
                        <div
                          key={objective.value}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.objective === objective.value
                              ? "border-gray-900 bg-gray-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleInputChange("objective", objective.value)}
                        >
                          <div className="font-medium text-gray-900">{objective.label}</div>
                          <div className="text-sm text-gray-600 mt-1">{objective.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Campaign Type</Label>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={(value) => handleInputChange("type", value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paid" id="paid" />
                        <Label htmlFor="paid">Paid Campaign (Budget required)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="organic" id="organic" />
                        <Label htmlFor="organic">Organic Campaign (No budget)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both">Mixed Campaign (Paid + Organic)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Channels & Content */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Channels & Content</h2>
                  <p className="text-gray-600 mb-6">Choose your marketing channels and content types</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label>Marketing Channels</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                      {channels.map((channel) => (
                        <div
                          key={channel.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.channels.includes(channel.id)
                              ? "border-gray-900 bg-gray-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleArrayToggle("channels", channel.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <channel.icon className={`w-5 h-5 ${channel.color}`} />
                            <div>
                              <div className="font-medium text-gray-900">{channel.name}</div>
                              <div className="text-xs text-gray-500 capitalize">{channel.type}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Content Types</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                      {contentTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={formData.contentTypes.includes(type)}
                            onCheckedChange={() => handleArrayToggle("contentTypes", type)}
                          />
                          <Label htmlFor={type} className="text-sm">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="autoGenerate"
                        checked={formData.autoGenerate}
                        onCheckedChange={(checked) => handleInputChange("autoGenerate", checked)}
                      />
                      <Label htmlFor="autoGenerate" className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-gray-900" />
                        <span>Auto-generate content using AI</span>
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 ml-6">
                      Our AI will create engaging content based on your campaign objectives and brand voice
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Schedule & Budget */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule & Budget</h2>
                  <p className="text-gray-600 mb-6">Set your campaign timeline and budget allocation</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.duration.start}
                        onChange={(e) => handleNestedInputChange("duration", "start", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.duration.end}
                        onChange={(e) => handleNestedInputChange("duration", "end", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="frequency">Posting Frequency</Label>
                    <Select value={formData.frequency} onValueChange={(value) => handleInputChange("frequency", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="every_other_day">Every Other Day</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi_weekly">Bi-weekly</SelectItem>
                        <SelectItem value="custom">Custom Schedule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(formData.type === "paid" || formData.type === "both") && (
                    <div>
                      <Label htmlFor="budget">Campaign Budget (₹)</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="e.g., 15000"
                        value={formData.budget || ""}
                        onChange={(e) => handleInputChange("budget", Number.parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        This will be distributed across your selected paid channels
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Target Audience */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Target Audience</h2>
                  <p className="text-gray-600 mb-6">Define who you want to reach with this campaign</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ageRange">Age Range</Label>
                    <Select
                      value={formData.targetAudience.ageRange}
                      onValueChange={(value) => handleNestedInputChange("targetAudience", "ageRange", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-24">18-24 years</SelectItem>
                        <SelectItem value="25-34">25-34 years</SelectItem>
                        <SelectItem value="35-44">35-44 years</SelectItem>
                        <SelectItem value="45-54">45-54 years</SelectItem>
                        <SelectItem value="55+">55+ years</SelectItem>
                        <SelectItem value="all">All ages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Mumbai, Pune, or 5km radius"
                      value={formData.targetAudience.location}
                      onChange={(e) => handleNestedInputChange("targetAudience", "location", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Interests</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                      {interests.map((interest) => (
                        <div key={interest} className="flex items-center space-x-2">
                          <Checkbox
                            id={interest}
                            checked={formData.targetAudience.interests.includes(interest)}
                            onCheckedChange={() => {
                              const currentInterests = formData.targetAudience.interests
                              const newInterests = currentInterests.includes(interest)
                                ? currentInterests.filter((i) => i !== interest)
                                : [...currentInterests, interest]
                              handleNestedInputChange("targetAudience", "interests", newInterests)
                            }}
                          />
                          <Label htmlFor={interest} className="text-sm">
                            {interest}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Campaign Summary */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Campaign Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{formData.name || "Not set"}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-2 font-medium capitalize">{formData.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Channels:</span>
                      <span className="ml-2 font-medium">{formData.channels.length} selected</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-medium">
                        {formData.duration.start && formData.duration.end
                          ? `${formData.duration.start} to ${formData.duration.end}`
                          : "Not set"}
                      </span>
                    </div>
                    {formData.budget > 0 && (
                      <div>
                        <span className="text-gray-600">Budget:</span>
                        <span className="ml-2 font-medium">₹{formData.budget.toLocaleString()}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">AI Content:</span>
                      <span className="ml-2 font-medium">{formData.autoGenerate ? "Enabled" : "Disabled"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="bg-white border-gray-300 text-gray-700 h-12 rounded-lg"
              >
                Previous
              </Button>

              <div className="flex space-x-3">
                {currentStep < 4 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="bg-gray-900 hover:bg-gray-800 text-white h-12 rounded-lg"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !isStepValid()}
                    className="bg-gray-900 hover:bg-gray-800 text-white h-12 rounded-lg"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating Campaign...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>Create Campaign</span>
                      </div>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
