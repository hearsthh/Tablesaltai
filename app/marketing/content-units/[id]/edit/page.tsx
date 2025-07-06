"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter, useParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  Upload,
  Calendar,
  Send,
  Instagram,
  MessageCircle,
  Facebook,
  Globe,
  Mail,
  AlertCircle,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import type { ContentUnit, Channel, ContentType } from "@/types/marketing"

export default function ContentUnitEditPage() {
  const router = useRouter()
  const params = useParams()
  const contentUnitId = params.id as string

  const [contentUnit, setContentUnit] = useState<ContentUnit | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null)
  const [mediaRequirement, setMediaRequirement] = useState<{
    type: "image" | "video" | "none"
    description: string
    required: boolean
  } | null>(null)

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    channel: "",
    contentType: "",
    textContent: {
      caption: "",
      hashtags: [] as string[],
      callToAction: "",
      body: "",
      subject: "",
    },
    mediaContent: {
      images: [] as string[],
      videos: [] as string[],
      audio: [] as string[],
      documents: [] as string[],
    },
    scheduledDate: "",
  })

  const stepNames = [
    "Title & Description",
    "Select Channel",
    "Select Content Type",
    "Text Content",
    "Media Content",
    "Preview",
    "Schedule & Publish",
  ]

  // Mock channels data
  const mockChannels: Channel[] = [
    {
      id: "instagram",
      name: "Instagram",
      icon: "Instagram",
      color: "text-pink-600",
      status: "connected",
      contentTypes: [
        {
          id: "post",
          name: "Post",
          description: "Regular Instagram post",
          textFields: [
            {
              id: "caption",
              name: "Caption",
              type: "textarea",
              required: true,
              maxLength: 2200,
              placeholder: "Write your caption...",
            },
            {
              id: "hashtags",
              name: "Hashtags",
              type: "hashtags",
              required: false,
              maxLength: 30,
              placeholder: "#food #restaurant",
            },
            {
              id: "cta",
              name: "Call to Action",
              type: "text",
              required: false,
              maxLength: 100,
              placeholder: "Visit us today!",
            },
          ],
          mediaFields: [
            {
              id: "images",
              name: "Images",
              type: "image",
              required: true,
              maxFiles: 10,
              acceptedFormats: ["jpg", "png", "jpeg"],
            },
          ],
          previewTemplate: "instagram_post",
        },
        {
          id: "story",
          name: "Story",
          description: "Instagram story",
          textFields: [
            {
              id: "text",
              name: "Story Text",
              type: "text",
              required: false,
              maxLength: 100,
              placeholder: "Story text...",
            },
          ],
          mediaFields: [
            {
              id: "media",
              name: "Image/Video",
              type: "image",
              required: true,
              maxFiles: 1,
              acceptedFormats: ["jpg", "png", "mp4"],
            },
          ],
          previewTemplate: "instagram_story",
        },
        {
          id: "reel",
          name: "Reel",
          description: "Instagram reel",
          textFields: [
            {
              id: "caption",
              name: "Caption",
              type: "textarea",
              required: true,
              maxLength: 2200,
              placeholder: "Reel caption...",
            },
            {
              id: "hashtags",
              name: "Hashtags",
              type: "hashtags",
              required: false,
              maxLength: 30,
              placeholder: "#reels #food",
            },
          ],
          mediaFields: [
            { id: "video", name: "Video", type: "video", required: true, maxFiles: 1, acceptedFormats: ["mp4", "mov"] },
          ],
          previewTemplate: "instagram_reel",
        },
      ],
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      icon: "MessageCircle",
      color: "text-green-600",
      status: "connected",
      contentTypes: [
        {
          id: "message",
          name: "Message",
          description: "WhatsApp message",
          textFields: [
            {
              id: "message",
              name: "Message",
              type: "textarea",
              required: true,
              maxLength: 4096,
              placeholder: "Your message...",
            },
          ],
          mediaFields: [
            {
              id: "media",
              name: "Media",
              type: "image",
              required: false,
              maxFiles: 1,
              acceptedFormats: ["jpg", "png", "pdf"],
            },
          ],
          previewTemplate: "whatsapp_message",
        },
      ],
    },
  ]

  useEffect(() => {
    fetchContentUnit()
    setChannels(mockChannels)
  }, [contentUnitId])

  const fetchContentUnit = async () => {
    try {
      // Mock content unit data - replace with actual API call
      const mockContentUnit: ContentUnit = {
        id: contentUnitId,
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
      }

      setContentUnit(mockContentUnit)
      setCurrentStep(mockContentUnit.currentStep)

      // Populate form data
      setFormData({
        title: mockContentUnit.title,
        description: mockContentUnit.description,
        channel: mockContentUnit.channel,
        contentType: mockContentUnit.contentType,
        textContent: {
          caption: mockContentUnit.textContent.caption || "",
          hashtags: mockContentUnit.textContent.hashtags || [],
          callToAction: mockContentUnit.textContent.callToAction || "",
          body: mockContentUnit.textContent.body || "",
          subject: "",
        },
        mediaContent: mockContentUnit.mediaContent,
        scheduledDate: mockContentUnit.scheduledDate || "",
      })

      // Set selected channel and content type
      const channel = mockChannels.find((c) => c.id === mockContentUnit.channel)
      if (channel) {
        setSelectedChannel(channel)
        const contentType = channel.contentTypes.find((ct) => ct.id === mockContentUnit.contentType)
        if (contentType) {
          setSelectedContentType(contentType)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load content unit",
        variant: "destructive",
      })
      router.push("/marketing/content-units")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Mock save - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Content unit saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content unit",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    await handleSave()
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleChannelSelect = (channelId: string) => {
    const channel = channels.find((c) => c.id === channelId)
    if (channel) {
      setSelectedChannel(channel)
      setFormData((prev) => ({ ...prev, channel: channelId, contentType: "" }))
      setSelectedContentType(null)
    }
  }

  const handleContentTypeSelect = (contentTypeId: string) => {
    if (selectedChannel) {
      const contentType = selectedChannel.contentTypes.find((ct) => ct.id === contentTypeId)
      if (contentType) {
        setSelectedContentType(contentType)
        setFormData((prev) => ({ ...prev, contentType: contentTypeId }))

        // Check if AI detects media requirement
        if (contentType.mediaFields.some((field) => field.required)) {
          setMediaRequirement({
            type: contentType.mediaFields[0].type as "image" | "video",
            description: `High-quality ${contentType.mediaFields[0].type} required for ${contentType.name.toLowerCase()}`,
            required: true,
          })
        }
      }
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!contentUnit) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Content Unit Not Found</h2>
            <p className="text-gray-600 mt-2">The content unit you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/marketing/content-units")} className="mt-4">
              Back to Content Units
            </Button>
          </div>
        </div>
      </div>
    )
  }

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
              onClick={() => router.push("/marketing/content-units")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Content Units
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Edit Content Unit</h1>
              <p className="text-gray-600">{contentUnit.title}</p>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleSave} disabled={saving} className="bg-white">
                <Save className="w-4 h-4 mr-1" />
                {saving ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/marketing/content-units/${contentUnit.id}`)}
                className="bg-white"
              >
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                Step {currentStep} of {stepNames.length}: {stepNames[currentStep - 1]}
              </h3>
              <span className="text-sm text-gray-600">
                {Math.round((currentStep / stepNames.length) * 100)}% complete
              </span>
            </div>
            <Progress value={(currentStep / stepNames.length) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            {/* Step 1: Title & Description */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Content Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter content title..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this content is about..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Select Channel */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Channel</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {channels.map((channel) => {
                      const IconComponent = getChannelIcon(channel.id)
                      return (
                        <div
                          key={channel.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.channel === channel.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          } ${channel.status !== "connected" ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => channel.status === "connected" && handleChannelSelect(channel.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent className={`w-6 h-6 ${channel.color}`} />
                            <div>
                              <h4 className="font-medium text-gray-900">{channel.name}</h4>
                              <p className="text-sm text-gray-600">
                                {channel.status === "connected" ? "Connected" : "Not connected"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Select Content Type */}
            {currentStep === 3 && selectedChannel && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Content Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedChannel.contentTypes.map((contentType) => (
                      <div
                        key={contentType.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.contentType === contentType.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleContentTypeSelect(contentType.id)}
                      >
                        <h4 className="font-medium text-gray-900">{contentType.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{contentType.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Text Content */}
            {currentStep === 4 && selectedContentType && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Text Content</h3>
                {selectedContentType.textFields.map((field) => (
                  <div key={field.id}>
                    <Label htmlFor={field.id}>
                      {field.name}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.id}
                        value={(formData.textContent[field.id as keyof typeof formData.textContent] as string) || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            textContent: { ...prev.textContent, [field.id]: e.target.value },
                          }))
                        }
                        placeholder={field.placeholder}
                        className="mt-1"
                        rows={4}
                        maxLength={field.maxLength}
                      />
                    ) : field.type === "hashtags" ? (
                      <Input
                        id={field.id}
                        value={(formData.textContent.hashtags || []).join(" ")}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            textContent: { ...prev.textContent, hashtags: e.target.value.split(" ").filter(Boolean) },
                          }))
                        }
                        placeholder={field.placeholder}
                        className="mt-1"
                      />
                    ) : (
                      <Input
                        id={field.id}
                        value={(formData.textContent[field.id as keyof typeof formData.textContent] as string) || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            textContent: { ...prev.textContent, [field.id]: e.target.value },
                          }))
                        }
                        placeholder={field.placeholder}
                        className="mt-1"
                        maxLength={field.maxLength}
                      />
                    )}
                    {field.maxLength && (
                      <p className="text-xs text-gray-500 mt-1">
                        {((formData.textContent[field.id as keyof typeof formData.textContent] as string) || "").length}{" "}
                        / {field.maxLength}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step 5: Media Content */}
            {currentStep === 5 && selectedContentType && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Media Content</h3>

                {/* AI Media Requirement Alert */}
                {mediaRequirement && mediaRequirement.required && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Media Required</h4>
                        <p className="text-sm text-yellow-700 mt-1">{mediaRequirement.description}</p>
                        <Button
                          size="sm"
                          className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white"
                          onClick={() => {
                            // Trigger file upload or media creation flow
                            toast({
                              title: "Media Upload",
                              description: "Please upload the required media files",
                            })
                          }}
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Upload {mediaRequirement.type}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedContentType.mediaFields.map((field) => (
                  <div key={field.id}>
                    <Label htmlFor={field.id}>
                      {field.name}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Drop {field.name.toLowerCase()} here or click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Supported formats: {field.acceptedFormats.join(", ")}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        Choose Files
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 6: Preview */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <div className="bg-gray-100 rounded-lg p-6">
                  <div className="max-w-sm mx-auto bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      {selectedChannel && (
                        <>
                          {React.createElement(getChannelIcon(selectedChannel.id), {
                            className: `w-5 h-5 ${selectedChannel.color}`,
                          })}
                          <span className="font-medium text-gray-900">{selectedChannel.name}</span>
                          <Badge variant="outline">{selectedContentType?.name}</Badge>
                        </>
                      )}
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">{formData.title}</h4>
                      {formData.textContent.caption && (
                        <p className="text-sm text-gray-700">{formData.textContent.caption}</p>
                      )}
                      {formData.textContent.hashtags && formData.textContent.hashtags.length > 0 && (
                        <p className="text-sm text-blue-600">
                          {formData.textContent.hashtags.map((tag) => `#${tag}`).join(" ")}
                        </p>
                      )}
                      {formData.textContent.callToAction && (
                        <p className="text-sm font-medium text-gray-900">{formData.textContent.callToAction}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Schedule & Publish */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Schedule & Publish</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="scheduledDate">Schedule Date & Time</Label>
                    <Input
                      id="scheduledDate"
                      type="datetime-local"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, scheduledDate: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        toast({
                          title: "Content Scheduled",
                          description: "Your content has been scheduled for publishing",
                        })
                        router.push("/marketing/content-units")
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Content
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => {
                        toast({
                          title: "Content Published",
                          description: "Your content has been published immediately",
                        })
                        router.push("/marketing/content-units")
                      }}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Publish Now
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1} className="bg-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {stepNames.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index + 1 <= currentStep ? "bg-blue-600" : "bg-gray-300"}`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentStep === 7}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
