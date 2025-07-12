"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Wand2,
  RefreshCw,
  Edit3,
  Save,
  Calendar,
  Share2,
  ImageIcon,
  Type,
  Loader2,
  CheckCircle,
  Clock,
  Star,
} from "lucide-react"
import {
  CONTENT_TONES,
  type ContentCategory,
  type ContentTone,
  type GeneratedContent,
  type ContentGenerationRequest,
} from "@/lib/types/ai-content-generator"

interface ContentBlockProps {
  category: ContentCategory
  contentType: string
  onContentGenerated?: (content: GeneratedContent) => void
  onContentSaved?: (content: GeneratedContent) => void
}

const CHANNEL_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "print", label: "Print" },
  { value: "website", label: "Website" },
  { value: "in_store", label: "In-Store" },
]

const AI_MODEL_OPTIONS = [
  { value: "gpt-4", label: "GPT-4 (Best Quality)" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo (Fast)" },
  { value: "dall-e-3", label: "DALL-E 3 (Images)" },
]

const GOAL_OPTIONS = [
  "Increase engagement",
  "Drive sales",
  "Build brand awareness",
  "Customer retention",
  "Promote new items",
  "Seasonal promotion",
  "Event marketing",
  "Review generation",
]

export function ContentBlock({ category, contentType, onContentGenerated, onContentSaved }: ContentBlockProps) {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)

  // Form state
  const [promptInput, setPromptInput] = useState("")
  const [goal, setGoal] = useState("")
  const [tone, setTone] = useState<ContentTone>("friendly")
  const [channel, setChannel] = useState("")
  const [aiModel, setAiModel] = useState("gpt-4")
  const [customInstructions, setCustomInstructions] = useState("")
  const [outputText, setOutputText] = useState("")
  const [isApproved, setIsApproved] = useState(false)

  const formatContentTypeLabel = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const handleGenerate = async () => {
    if (!promptInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide input for content generation.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const request: ContentGenerationRequest = {
        category,
        contentType,
        promptInput: promptInput.trim(),
        tone,
        channel: channel || undefined,
        aiModel,
        customInstructions: customInstructions || undefined,
      }

      const response = await fetch("/api/ai/content-generator/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const result = await response.json()

      if (result.success && result.content) {
        const content: GeneratedContent = {
          ...result.content,
          title: `${formatContentTypeLabel(contentType)} - ${new Date().toLocaleDateString()}`,
        }

        setGeneratedContent(content)
        setOutputText(content.outputText || "")
        onContentGenerated?.(content)

        toast({
          title: "Content Generated!",
          description: `${formatContentTypeLabel(contentType)} has been generated successfully.`,
        })
      } else {
        throw new Error(result.error || "Generation failed")
      }
    } catch (error) {
      console.error("Generation error:", error)
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate content",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerate = async () => {
    await handleGenerate()
  }

  const handleSave = async () => {
    if (!generatedContent) return

    try {
      const updatedContent: GeneratedContent = {
        ...generatedContent,
        outputText,
        isApproved,
        status: isApproved ? "approved" : "draft",
        updatedAt: new Date().toISOString(),
      }

      await onContentSaved?.(updatedContent)

      toast({
        title: "Content Saved!",
        description: "Content has been saved to your library.",
      })
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save content",
        variant: "destructive",
      })
    }
  }

  const handleUseInCampaign = () => {
    if (!generatedContent) return

    // This would integrate with the campaign system
    toast({
      title: "Added to Campaign",
      description: "Content has been added to your campaign.",
    })
  }

  const handleAddToCalendar = () => {
    if (!generatedContent) return

    // This would integrate with the content calendar
    toast({
      title: "Added to Calendar",
      description: "Content has been scheduled for publishing.",
    })
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {contentType.includes("image") || contentType.includes("poster") ? (
                <ImageIcon className="h-5 w-5" />
              ) : (
                <Type className="h-5 w-5" />
              )}
              {formatContentTypeLabel(contentType)}
            </CardTitle>
            <CardDescription>
              Generate {formatContentTypeLabel(contentType).toLowerCase()} content for your {category} needs
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{category}</Badge>
            {generatedContent && (
              <Badge variant={isApproved ? "default" : "secondary"}>{isApproved ? "Approved" : "Draft"}</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Content Input *</Label>
            <Textarea
              id="prompt"
              placeholder={getPlaceholderText(contentType)}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Goal</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={(value) => setTone(value as ContentTone)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CONTENT_TONES).map(([key, toneData]) => (
                      <SelectItem key={key} value={key}>
                        {toneData.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="channel">Channel</Label>
                <Select value={channel} onValueChange={setChannel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHANNEL_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="aiModel">AI Model</Label>
              <Select value={aiModel} onValueChange={setAiModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Custom Instructions</Label>
              <Input
                id="instructions"
                placeholder="Additional instructions for AI..."
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Generation Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !promptInput.trim()}
            className="flex items-center gap-2"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {isGenerating ? "Generating..." : "Generate"}
          </Button>

          {generatedContent && (
            <Button
              variant="outline"
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
          )}
        </div>

        {/* Generated Content Output */}
        {generatedContent && (
          <div className="space-y-4">
            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="output">Generated Content</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-1"
                  >
                    <Edit3 className="h-3 w-3" />
                    {isEditing ? "Preview" : "Edit"}
                  </Button>
                </div>
              </div>

              {isEditing ? (
                <Textarea
                  id="output"
                  value={outputText}
                  onChange={(e) => setOutputText(e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
              ) : (
                <div className="p-4 border rounded-lg bg-muted/50 whitespace-pre-wrap text-sm">{outputText}</div>
              )}
            </div>

            {/* Generated Media */}
            {generatedContent.outputMediaUrls.length > 0 && (
              <div className="space-y-2">
                <Label>Generated Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {generatedContent.outputMediaUrls.map((url, index) => (
                    <div key={index} className="aspect-square border rounded-lg overflow-hidden">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Generated content ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approval and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch id="approve" checked={isApproved} onCheckedChange={setIsApproved} />
                <Label htmlFor="approve" className="flex items-center gap-2">
                  {isApproved ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  )}
                  {isApproved ? "Approved" : "Needs Review"}
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="flex items-center gap-1 bg-transparent"
                >
                  <Save className="h-3 w-3" />
                  Save
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUseInCampaign}
                  className="flex items-center gap-1 bg-transparent"
                >
                  <Share2 className="h-3 w-3" />
                  Use in Campaign
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddToCalendar}
                  className="flex items-center gap-1 bg-transparent"
                >
                  <Calendar className="h-3 w-3" />
                  Schedule
                </Button>
              </div>
            </div>

            {/* Content Metadata */}
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center justify-between">
                <span>Model: {generatedContent.aiModel}</span>
                <span>Generated: {new Date(generatedContent.createdAt).toLocaleString()}</span>
              </div>
              {generatedContent.performanceScore > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  <span>Performance Score: {generatedContent.performanceScore}%</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getPlaceholderText(contentType: string): string {
  const placeholders: Record<string, string> = {
    instagram_caption: "Describe your post, promotion, or dish...",
    whatsapp_card: "Enter message content for WhatsApp...",
    email_subject: "Describe the email purpose...",
    email_body: "Describe the email content and goal...",
    poster_prompt: "Describe the poster design and message...",
    sms_text: "Enter SMS message content (keep it short)...",
    reel_script: "Describe the reel concept and message...",
    churn_winback: "Customer segment and preferences...",
    loyalty_reward: "Reward details and customer type...",
    birthday_greeting: "Customer name and preferences...",
    post_visit_message: "Visit details and experience...",
    referral_invite: "Referral program details...",
    item_description: "Dish name, ingredients, cooking style...",
    combo_name: "Items included in the combo...",
    new_item_idea: "Cuisine type, dietary preferences...",
    food_image_prompt: "Describe the dish for image generation...",
    dietary_tags: "Dish name and dietary information...",
    pairing_suggestion: "Main dish and pairing preferences...",
    review_reply: "Review content and sentiment...",
    review_to_social: "Positive review content...",
    feedback_request: "Customer visit details...",
    testimonial_highlight: "Customer testimonial content...",
    about_us: "Restaurant history, values, story...",
    chef_intro: "Chef background and specialties...",
    brand_story: "Restaurant origin and mission...",
    tagline: "Restaurant concept and unique selling points...",
    event_banner: "Event details and promotion...",
    mission_statement: "Restaurant values and goals...",
    qr_flyer: "QR code purpose and call-to-action...",
    table_tent: "Promotion or information for tables...",
    bill_footer: "Thank you message or promotion...",
    chalkboard_special: "Daily special or promotion...",
    menu_header: "Menu section or restaurant intro...",
    wifi_password_card: "WiFi details and restaurant info...",
    goal_explanation: "Business goal or objective...",
    kpi_summary: "Key metrics and performance data...",
    action_insight: "Data insights and recommendations...",
    automation_message: "Automation trigger and purpose...",
    performance_report: "Performance data and analysis...",
  }

  return placeholders[contentType] || "Enter content details..."
}
