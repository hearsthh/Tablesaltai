"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  CheckCircle,
  Calendar,
  Target,
  Sparkles,
  Instagram,
  Facebook,
  MessageCircle,
  Mail,
  Phone,
  Globe,
  ImageIcon,
  FileText,
  Video,
  Palette,
  Send,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

interface TaskForm {
  title: string
  description: string
  type: "content_creation" | "design_format" | "schedule_publish" | "analysis" | "engagement"
  priority: "low" | "medium" | "high"
  assignedTo: "ai" | "user"
  campaign?: string
  strategy?: string
  channels: string[]
  contentType: string
  scheduledDate: string
  scheduledTime: string
  autoExecute: boolean
  dependencies: string[]
  estimatedDuration: number
  budget?: number
  targetMetrics: {
    reach?: number
    engagement?: number
    clicks?: number
    conversions?: number
  }
}

export default function CreateTaskPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<TaskForm>({
    title: "",
    description: "",
    type: "content_creation",
    priority: "medium",
    assignedTo: "ai",
    campaign: "",
    strategy: "",
    channels: [],
    contentType: "",
    scheduledDate: "",
    scheduledTime: "",
    autoExecute: true,
    dependencies: [],
    estimatedDuration: 30,
    budget: 0,
    targetMetrics: {},
  })

  const taskTypes = [
    {
      value: "content_creation",
      label: "Content Creation",
      description: "Generate text, images, or video content",
      icon: Sparkles,
      stages: ["Generate Content", "Review & Edit", "Approve"],
    },
    {
      value: "design_format",
      label: "Design & Format",
      description: "Create visual designs and format content",
      icon: Palette,
      stages: ["Design Creation", "Format Optimization", "Final Review"],
    },
    {
      value: "schedule_publish",
      label: "Schedule & Publish",
      description: "Schedule and publish content to channels",
      icon: Send,
      stages: ["Schedule Setup", "Content Upload", "Publish"],
    },
    {
      value: "analysis",
      label: "Analysis & Reporting",
      description: "Analyze performance and generate reports",
      icon: Target,
      stages: ["Data Collection", "Analysis", "Report Generation"],
    },
    {
      value: "engagement",
      label: "Engagement & Response",
      description: "Respond to comments and engage with audience",
      icon: MessageCircle,
      stages: ["Monitor Comments", "Generate Responses", "Engage"],
    },
  ]

  const channels = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-600" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600" },
    { id: "whatsapp", name: "WhatsApp Business", icon: MessageCircle, color: "text-green-600" },
    { id: "email", name: "Email Marketing", icon: Mail, color: "text-purple-600" },
    { id: "sms", name: "SMS Marketing", icon: Phone, color: "text-orange-600" },
    { id: "website", name: "Website", icon: Globe, color: "text-blue-500" },
  ]

  const contentTypes = [
    { value: "social_post", label: "Social Media Post", icon: FileText },
    { value: "story", label: "Story/Reel", icon: Video },
    { value: "image", label: "Image/Photo", icon: ImageIcon },
    { value: "video", label: "Video Content", icon: Video },
    { value: "email", label: "Email Newsletter", icon: Mail },
    { value: "blog", label: "Blog Article", icon: FileText },
    { value: "ad", label: "Advertisement", icon: Target },
    { value: "offer", label: "Promotional Offer", icon: Target },
  ]

  const campaigns = [
    { id: "1", name: "Diwali Festival Special" },
    { id: "2", name: "Weekend Brunch Launch" },
    { id: "3", name: "Customer Loyalty Program" },
  ]

  const strategies = [
    { id: "1", name: "Q4 Revenue Growth Strategy" },
    { id: "2", name: "Brand Awareness Campaign 2024" },
    { id: "3", name: "Customer Retention Initiative" },
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
        ...prev[parent as keyof TaskForm],
        [field]: value,
      },
    }))
  }

  const handleArrayToggle = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field as keyof TaskForm].includes(value)
        ? prev[field as keyof TaskForm].filter((item: string) => item !== value)
        : [...prev[field as keyof TaskForm], value],
    }))
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.scheduledDate || !formData.scheduledTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/marketing/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          scheduledDateTime: `${formData.scheduledDate}T${formData.scheduledTime}:00.000Z`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Task Created!",
          description: "Your marketing task has been created and scheduled.",
        })
        router.push("/marketing/calendar")
      } else {
        throw new Error(data.error || "Failed to create task")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedTaskType = taskTypes.find((type) => type.value === formData.type)

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
              onClick={() => router.push("/marketing")}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketing Hub
            </Button>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Marketing Task</h1>
            <p className="text-gray-600 mt-2">Set up a scheduled marketing task with automated execution</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
                <CardDescription>Define your marketing task and its execution parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Task Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Create Instagram post for weekend special"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this task should accomplish..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Task Type */}
                <div>
                  <Label>Task Type</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {taskTypes.map((type) => (
                      <div
                        key={type.value}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.type === type.value
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleInputChange("type", type.value)}
                      >
                        <div className="flex items-start space-x-3">
                          <type.icon className="w-5 h-5 text-gray-900 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">{type.label}</div>
                            <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Type */}
                <div>
                  <Label>Content Type</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                    {contentTypes.map((type) => (
                      <div
                        key={type.value}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.contentType === type.value
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleInputChange("contentType", type.value)}
                      >
                        <div className="flex flex-col items-center text-center space-y-2">
                          <type.icon className="w-5 h-5 text-gray-900" />
                          <div className="text-sm font-medium text-gray-900">{type.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Channels */}
                <div>
                  <Label>Target Channels</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {channels.map((channel) => (
                      <div
                        key={channel.id}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.channels.includes(channel.id)
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleArrayToggle("channels", channel.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <channel.icon className={`w-4 h-4 ${channel.color}`} />
                          <div className="text-sm font-medium text-gray-900">{channel.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Campaign & Strategy Association */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Associated Campaign (Optional)</Label>
                    <Select
                      value={formData.campaign || "none"}
                      onValueChange={(value) => handleInputChange("campaign", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select campaign" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No campaign</SelectItem>
                        {campaigns.map((campaign) => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Associated Strategy (Optional)</Label>
                    <Select
                      value={formData.strategy || "none"}
                      onValueChange={(value) => handleInputChange("strategy", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No strategy</SelectItem>
                        {strategies.map((strategy) => (
                          <SelectItem key={strategy.id} value={strategy.id}>
                            {strategy.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Scheduling */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="scheduledTime">Scheduled Time *</Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => handleInputChange("scheduledTime", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Task Settings */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label>Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Assigned To</Label>
                      <RadioGroup
                        value={formData.assignedTo}
                        onValueChange={(value) => handleInputChange("assignedTo", value)}
                        className="mt-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ai" id="ai" />
                          <Label htmlFor="ai">AI (Automated)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="user" id="user" />
                          <Label htmlFor="user">Manual (User)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="estimatedDuration">Duration (minutes)</Label>
                      <Input
                        id="estimatedDuration"
                        type="number"
                        value={formData.estimatedDuration}
                        onChange={(e) => handleInputChange("estimatedDuration", Number.parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="autoExecute"
                      checked={formData.autoExecute}
                      onCheckedChange={(checked) => handleInputChange("autoExecute", checked)}
                    />
                    <Label htmlFor="autoExecute" className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-gray-900" />
                      <span>Auto-execute when scheduled (AI tasks only)</span>
                    </Label>
                  </div>
                </div>

                {/* Budget (if applicable) */}
                {(formData.type === "schedule_publish" || formData.contentType === "ad") && (
                  <div>
                    <Label htmlFor="budget">Budget (₹) - Optional</Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="e.g., 500"
                      value={formData.budget || ""}
                      onChange={(e) => handleInputChange("budget", Number.parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">Budget for paid promotion or advertising</p>
                  </div>
                )}

                {/* Target Metrics */}
                <div>
                  <Label>Target Metrics (Optional)</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                    <div>
                      <Label htmlFor="targetReach" className="text-sm">
                        Reach
                      </Label>
                      <Input
                        id="targetReach"
                        type="number"
                        placeholder="1000"
                        value={formData.targetMetrics.reach || ""}
                        onChange={(e) =>
                          handleNestedInputChange("targetMetrics", "reach", Number.parseInt(e.target.value) || 0)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetEngagement" className="text-sm">
                        Engagement
                      </Label>
                      <Input
                        id="targetEngagement"
                        type="number"
                        placeholder="50"
                        value={formData.targetMetrics.engagement || ""}
                        onChange={(e) =>
                          handleNestedInputChange("targetMetrics", "engagement", Number.parseInt(e.target.value) || 0)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetClicks" className="text-sm">
                        Clicks
                      </Label>
                      <Input
                        id="targetClicks"
                        type="number"
                        placeholder="25"
                        value={formData.targetMetrics.clicks || ""}
                        onChange={(e) =>
                          handleNestedInputChange("targetMetrics", "clicks", Number.parseInt(e.target.value) || 0)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetConversions" className="text-sm">
                        Conversions
                      </Label>
                      <Input
                        id="targetConversions"
                        type="number"
                        placeholder="5"
                        value={formData.targetMetrics.conversions || ""}
                        onChange={(e) =>
                          handleNestedInputChange("targetMetrics", "conversions", Number.parseInt(e.target.value) || 0)
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Task Preview & Stages */}
          <div className="space-y-6">
            {/* Task Preview */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Task Preview</CardTitle>
                <CardDescription>How your task will appear</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{formData.title || "Task Title"}</h4>
                    <p className="text-sm text-gray-600 mt-1">{formData.description || "Task description"}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        formData.priority === "high"
                          ? "bg-red-500"
                          : formData.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    <span className="text-sm text-gray-600 capitalize">{formData.priority} Priority</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        formData.assignedTo === "ai" ? "bg-blue-500" : "bg-orange-500"
                      }`}
                    />
                    <span className="text-sm text-gray-600">
                      {formData.assignedTo === "ai" ? "AI Automated" : "Manual Task"}
                    </span>
                  </div>

                  {formData.scheduledDate && formData.scheduledTime && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {formData.channels.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Channels:</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.channels.map((channelId) => {
                          const channel = channels.find((c) => c.id === channelId)
                          return channel ? (
                            <div
                              key={channelId}
                              className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs"
                            >
                              <channel.icon className={`w-3 h-3 ${channel.color}`} />
                              <span>{channel.name}</span>
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Task Stages */}
            {selectedTaskType && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Task Stages</CardTitle>
                  <CardDescription>Execution stages for {selectedTaskType.label}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedTaskType.stages.map((stage, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-700">{stage}</span>
                      </div>
                    ))}
                  </div>

                  {formData.autoExecute && formData.assignedTo === "ai" && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Auto-Execution Enabled</span>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        This task will be automatically executed by AI at the scheduled time
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.title || !formData.scheduledDate || !formData.scheduledTime}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white h-12 rounded-lg"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Task...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Create Task</span>
                  </div>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/marketing/calendar")}
                className="w-full bg-white border-gray-300 text-gray-700 h-10 rounded-lg"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
