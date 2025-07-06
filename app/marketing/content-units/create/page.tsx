"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Upload,
  Calendar,
  Send,
  CheckCircle,
  Instagram,
  Facebook,
  MessageCircle,
  Mail,
  Globe,
  ImageIcon,
  Video,
  FileText,
  Hash,
  Link,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import type { Channel, ContentType } from "@/types/marketing"

interface ContentUnitForm {
  title: string
  description: string
  channel: string
  contentType: string
  textContent: { [key: string]: any }
  mediaContent: { [key: string]: File[] }
  scheduledDate: string
  campaignId?: string
  strategyId?: string
}

export default function CreateContentUnitPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null)
  const [formData, setFormData] = useState<ContentUnitForm>({
    title: "",
    description: "",
    channel: "",
    contentType: "",
    textContent: {},
    mediaContent: {},
    scheduledDate: "",
  })

  const totalSteps = 7
  const stepTitles = [
    "Title & Description",
    "Select Channel",
    "Select Content Type",
    "Text Content",
    "Media Content",
    "Preview",
    "Schedule & Publish",
  ]

  // Mock channels data (same as in marketing hub)
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
      analytics: { followers: 2400, engagement: 4.2, reach: 12500 },
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
        {
          id: "broadcast",
          name: "Broadcast",
          description: "WhatsApp broadcast message",
          textFields: [
            {
              id: "message",
              name: "Broadcast Message",
              type: "textarea",
              required: true,
              maxLength: 4096,
              placeholder: "Broadcast message...",
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
          previewTemplate: "whatsapp_broadcast",
        },
      ],
      analytics: { followers: 1200, engagement: 8.5, reach: 8900 },
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "Facebook",
      color: "text-blue-600",
      status: "disconnected",
      contentTypes: [
        {
          id: "post",
          name: "Post",
          description: "Facebook post",
          textFields: [
            {
              id: "text",
              name: "Post Text",
              type: "textarea",
              required: true,
              maxLength: 63206,
              placeholder: "What's on your mind?",
            },
          ],
          mediaFields: [
            {
              id: "media",
              name: "Media",
              type: "image",
              required: false,
              maxFiles: 10,
              acceptedFormats: ["jpg", "png", "mp4"],
            },
          ],
          previewTemplate: "facebook_post",
        },
      ],
    },
    {
      id: "website",
      name: "Website",
      icon: "Globe",
      color: "text-blue-500",
      status: "connected",
      contentTypes: [
        {
          id: "blog",
          name: "Blog Post",
          description: "Website blog post",
          textFields: [
            {
              id: "title",
              name: "Title",
              type: "text",
              required: true,
              maxLength: 100,
              placeholder: "Blog post title...",
            },
            {
              id: "content",
              name: "Content",
              type: "textarea",
              required: true,
              maxLength: 10000,
              placeholder: "Blog content...",
            },
          ],
          mediaFields: [
            {
              id: "featured_image",
              name: "Featured Image",
              type: "image",
              required: false,
              maxFiles: 1,
              acceptedFormats: ["jpg", "png"],
            },
          ],
          previewTemplate: "blog_post",
        },
      ],
      analytics: { followers: 3200, engagement: 2.8, reach: 15600 },
    },
  ]

  useEffect(() => {
    setChannels(mockChannels.filter((channel) => channel.status === "connected"))
  }, [])

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

  const getFieldIcon = (fieldType: string) => {
    switch (fieldType) {
      case "text":
      case "textarea":
        return <FileText className="w-4 h-4" />
      case "hashtags":
        return <Hash className="w-4 h-4" />
      case "url":
        return <Link className="w-4 h-4" />
      case "image":
        return <ImageIcon className="w-4 h-4" />
      case "video":
        return <Video className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTextContentChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      textContent: {
        ...prev.textContent,
        [fieldId]: value,
      },
    }))
  }

  const handleFileUpload = (fieldId: string, files: FileList | null) => {
    if (files) {
      setFormData((prev) => ({
        ...prev,
        mediaContent: {
          ...prev.mediaContent,
          [fieldId]: Array.from(files),
        },
      }))
    }
  }

  const handleChannelSelect = (channelId: string) => {
    const channel = channels.find((c) => c.id === channelId)
    setSelectedChannel(channel || null)
    handleInputChange("channel", channelId)
    handleInputChange("contentType", "")
    setSelectedContentType(null)
  }

  const handleContentTypeSelect = (contentTypeId: string) => {
    if (selectedChannel) {
      const contentType = selectedChannel.contentTypes.find((ct) => ct.id === contentTypeId)
      setSelectedContentType(contentType || null)
      handleInputChange("contentType", contentTypeId)

      // Reset text and media content when content type changes
      setFormData((prev) => ({
        ...prev,
        textContent: {},
        mediaContent: {},
      }))
    }
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.title.trim()) {
          toast({
            title: "Title Required",
            description: "Please enter a title for your content unit",
            variant: "destructive",
          })
          return false
        }
        return true
      case 2:
        if (!formData.channel) {
          toast({
            title: "Channel Required",
            description: "Please select a channel",
            variant: "destructive",
          })
          return false
        }
        return true
      case 3:
        if (!formData.contentType) {
          toast({
            title: "Content Type Required",
            description: "Please select a content type",
            variant: "destructive",
          })
          return false
        }
        return true
      case 4:
        if (selectedContentType) {
          const requiredTextFields = selectedContentType.textFields.filter((field) => field.required)
          for (const field of requiredTextFields) {
            if (!formData.textContent[field.id]?.trim()) {
              toast({
                title: `${field.name} Required`,
                description: `Please fill in the ${field.name.toLowerCase()}`,
                variant: "destructive",
              })
              return false
            }
          }
        }
        return true
      case 5:
        if (selectedContentType) {
          const requiredMediaFields = selectedContentType.mediaFields.filter((field) => field.required)
          for (const field of requiredMediaFields) {
            if (!formData.mediaContent[field.id]?.length) {
              toast({
                title: `${field.name} Required`,
                description: `Please upload ${field.name.toLowerCase()}`,
                variant: "destructive",
              })
              return false
            }
          }
        }
        return true
      default:
        return true
    }
  }

  const saveDraft = async () => {
    setLoading(true)
    try {
      // Mock API call to save draft
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Draft Saved",
        description: "Your content unit has been saved as draft",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const scheduleContent = async () => {
    if (!formData.scheduledDate) {
      toast({
        title: "Schedule Date Required",
        description: "Please select a date and time to schedule",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Mock API call to schedule content
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Content Scheduled",
        description: "Your content unit has been scheduled successfully",
      })

      router.push("/marketing/content-units")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule content",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const publishNow = async () => {
    setLoading(true)
    try {
      // Mock API call to publish content
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Content Published",
        description: "Your content unit has been published successfully",
      })

      router.push("/marketing/content-units")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish content",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
              onClick={() => router.push("/marketing")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketing Hub
            </Button>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Content Unit</h1>
            <p className="text-gray-600 mt-2">Create individual content pieces for your marketing campaigns</p>
          </div>
        </div>

        {/* Progress */}
        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
              </h2>
              <Badge variant="outline">{Math.round((currentStep / totalSteps) * 100)}% Complete</Badge>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {stepTitles.map((title, index) => (
                <span key={index} className={`${index + 1 <= currentStep ? "text-gray-900 font-medium" : ""}`}>
                  {index + 1}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8">
            {/* Step 1: Title & Description */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Details</h3>
                  <p className="text-gray-600 mb-6">Start by giving your content unit a clear title and description</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Diwali Special Menu Showcase"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Give your content a descriptive title</p>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of what this content is about..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional: Add more context about this content</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Select Channel */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Channel</h3>
                  <p className="text-gray-600 mb-6">Choose where you want to publish this content</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {channels.map((channel) => {
                    const IconComponent = getChannelIcon(channel.id)
                    return (
                      <div
                        key={channel.id}
                        className={`p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          formData.channel === channel.id
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleChannelSelect(channel.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <IconComponent className={`w-6 h-6 ${channel.color}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{channel.name}</h4>
                            <p className="text-sm text-gray-600">
                              {channel.contentTypes.length} content types available
                            </p>
                            {channel.analytics && (
                              <p className="text-xs text-gray-500 mt-1">
                                {channel.analytics.followers.toLocaleString()} followers
                              </p>
                            )}
                          </div>
                          {formData.channel === channel.id && <CheckCircle className="w-5 h-5 text-gray-900" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Select Content Type */}
            {currentStep === 3 && selectedChannel && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Content Type</h3>
                  <p className="text-gray-600 mb-6">Choose the type of content for {selectedChannel.name}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedChannel.contentTypes.map((contentType) => (
                    <div
                      key={contentType.id}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        formData.contentType === contentType.id
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleContentTypeSelect(contentType.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{contentType.name}</h4>
                          <p className="text-sm text-gray-600 mb-4">{contentType.description}</p>

                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-medium text-gray-700">Text Fields:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {contentType.textFields.map((field) => (
                                  <Badge key={field.id} variant="outline" className="text-xs">
                                    {field.name}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-medium text-gray-700">Media Fields:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {contentType.mediaFields.map((field) => (
                                  <Badge key={field.id} variant="outline" className="text-xs">
                                    {field.name}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        {formData.contentType === contentType.id && <CheckCircle className="w-5 h-5 text-gray-900" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Text Content */}
            {currentStep === 4 && selectedContentType && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Text Content</h3>
                  <p className="text-gray-600 mb-6">
                    Fill in the text content for your {selectedContentType.name.toLowerCase()}
                  </p>
                </div>

                <div className="space-y-6">
                  {selectedContentType.textFields.map((field) => (
                    <div key={field.id}>
                      <Label htmlFor={field.id} className="flex items-center space-x-2">
                        {getFieldIcon(field.type)}
                        <span>
                          {field.name}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </span>
                      </Label>

                      {field.type === "textarea" ? (
                        <Textarea
                          id={field.id}
                          placeholder={field.placeholder}
                          value={formData.textContent[field.id] || ""}
                          onChange={(e) => handleTextContentChange(field.id, e.target.value)}
                          className="mt-2"
                          rows={4}
                          maxLength={field.maxLength}
                        />
                      ) : field.type === "hashtags" ? (
                        <Input
                          id={field.id}
                          placeholder={field.placeholder}
                          value={formData.textContent[field.id] || ""}
                          onChange={(e) => handleTextContentChange(field.id, e.target.value)}
                          className="mt-2"
                          maxLength={field.maxLength}
                        />
                      ) : (
                        <Input
                          id={field.id}
                          placeholder={field.placeholder}
                          value={formData.textContent[field.id] || ""}
                          onChange={(e) => handleTextContentChange(field.id, e.target.value)}
                          className="mt-2"
                          maxLength={field.maxLength}
                        />
                      )}

                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{field.required ? "Required field" : "Optional field"}</span>
                        {field.maxLength && (
                          <span>
                            {(formData.textContent[field.id] || "").length}/{field.maxLength}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Media Content */}
            {currentStep === 5 && selectedContentType && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Media Content</h3>
                  <p className="text-gray-600 mb-6">
                    Upload media files for your {selectedContentType.name.toLowerCase()}
                  </p>
                </div>

                <div className="space-y-6">
                  {selectedContentType.mediaFields.map((field) => (
                    <div key={field.id}>
                      <Label className="flex items-center space-x-2 mb-3">
                        {getFieldIcon(field.type)}
                        <span>
                          {field.name}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </span>
                      </Label>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                        <div className="text-sm text-gray-600 mb-2">
                          Upload {field.name.toLowerCase()} ({field.acceptedFormats.join(", ")})
                        </div>
                        <div className="text-xs text-gray-500 mb-4">
                          Max {field.maxFiles} file{field.maxFiles > 1 ? "s" : ""}
                        </div>
                        <input
                          type="file"
                          accept={field.acceptedFormats.map((format) => `.${format}`).join(",")}
                          multiple={field.maxFiles > 1}
                          onChange={(e) => handleFileUpload(field.id, e.target.files)}
                          className="hidden"
                          id={`file-${field.id}`}
                        />
                        <Label htmlFor={`file-${field.id}`} className="cursor-pointer">
                          <Button variant="outline" className="bg-transparent" asChild>
                            <span>Choose Files</span>
                          </Button>
                        </Label>

                        {formData.mediaContent[field.id]?.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm text-green-600 font-medium">
                              ✓ {formData.mediaContent[field.id].length} file
                              {formData.mediaContent[field.id].length > 1 ? "s" : ""} selected
                            </p>
                            <div className="mt-2 space-y-1">
                              {formData.mediaContent[field.id].map((file, index) => (
                                <p key={index} className="text-xs text-gray-600">
                                  {file.name}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Preview */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Preview Content</h3>
                  <p className="text-gray-600 mb-6">Review how your content will appear on {selectedChannel?.name}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div>
                        <p className="font-medium text-sm">Your Restaurant</p>
                        <p className="text-xs text-gray-500">Sponsored</p>
                      </div>
                    </div>

                    {formData.mediaContent.images?.length > 0 && (
                      <div className="mb-4 bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                        <span className="ml-2 text-sm text-gray-500">
                          {formData.mediaContent.images.length} image
                          {formData.mediaContent.images.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}

                    {formData.mediaContent.video?.length > 0 && (
                      <div className="mb-4 bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                        <Video className="w-8 h-8 text-gray-400" />
                        <span className="ml-2 text-sm text-gray-500">Video content</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      {Object.entries(formData.textContent).map(([key, value]) => (
                        <div key={key}>
                          {key === "caption" || key === "message" || key === "text" ? (
                            <p className="text-sm text-gray-900">{value as string}</p>
                          ) : key === "hashtags" ? (
                            <p className="text-sm text-blue-600">{value as string}</p>
                          ) : key === "cta" ? (
                            <p className="text-sm font-medium text-gray-900">{value as string}</p>
                          ) : (
                            <p className="text-sm text-gray-700">{value as string}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-gray-500">
                        <button className="flex items-center space-x-1 text-sm">
                          <span>👍</span>
                          <span>Like</span>
                        </button>
                        <button className="flex items-center space-x-1 text-sm">
                          <span>💬</span>
                          <span>Comment</span>
                        </button>
                        <button className="flex items-center space-x-1 text-sm">
                          <span>📤</span>
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Schedule & Publish */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule & Publish</h3>
                  <p className="text-gray-600 mb-6">Choose when to publish your content</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="scheduledDate">Schedule Date & Time</Label>
                    <Input
                      id="scheduledDate"
                      type="datetime-local"
                      value={formData.scheduledDate}
                      onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                      className="mt-2"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to publish immediately</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      onClick={publishNow}
                      disabled={loading}
                      className="bg-gray-900 hover:bg-gray-800 text-white h-12"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Publish Now
                    </Button>

                    <Button
                      onClick={scheduleContent}
                      disabled={loading}
                      variant="outline"
                      className="bg-white border-gray-300 text-gray-700 h-12"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                      ) : (
                        <Calendar className="w-4 h-4 mr-2" />
                      )}
                      Schedule Content
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="bg-white border-gray-300 text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <Button
                  onClick={saveDraft}
                  disabled={loading}
                  variant="outline"
                  className="bg-white border-gray-300 text-gray-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              </div>

              {currentStep < totalSteps && (
                <Button onClick={nextStep} className="bg-gray-900 hover:bg-gray-800 text-white">
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
