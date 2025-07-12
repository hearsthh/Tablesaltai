"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  Sparkles,
  Copy,
  Save,
  Send,
  RefreshCw,
  Eye,
  Download,
  MessageSquare,
  Instagram,
  Facebook,
  Mail,
  Smartphone,
  ImageIcon,
  FileText,
  Megaphone,
  Star,
  Gift,
  Target,
  Zap,
  Clock,
  CheckCircle,
  Trash2,
} from "lucide-react"
import { Navigation, MobileBottomNavigation } from "@/components/navigation"
import { UnifiedDataService } from "@/lib/services/unified-data-service"
import type { GeneratedContent } from "@/lib/types/unified-data"
import { useRouter } from "next/navigation"

export default function ContentGeneratorPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("generator")
  const [currentGeneration, setCurrentGeneration] = useState<{
    type: string
    channel: string
    tone: string
    goal: string
    prompt: string
    result: string
  }>({
    type: "",
    channel: "",
    tone: "",
    goal: "",
    prompt: "",
    result: "",
  })

  useEffect(() => {
    loadGeneratedContent()
  }, [])

  const loadGeneratedContent = async () => {
    try {
      const restaurantId = "restaurant-1"
      const data = await UnifiedDataService.getGeneratedContent(restaurantId)
      setGeneratedContent(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load generated content",
        variant: "destructive",
      })
    }
  }

  const contentTypes = [
    { value: "campaign_caption", label: "Campaign Caption", icon: Megaphone },
    { value: "whatsapp_message", label: "WhatsApp Message", icon: MessageSquare },
    { value: "instagram_post", label: "Instagram Post", icon: Instagram },
    { value: "facebook_post", label: "Facebook Post", icon: Facebook },
    { value: "email_campaign", label: "Email Campaign", icon: Mail },
    { value: "sms_message", label: "SMS Message", icon: Smartphone },
    { value: "review_reply", label: "Review Reply", icon: Star },
    { value: "menu_description", label: "Menu Description", icon: FileText },
    { value: "offer_flyer", label: "Offer Flyer", icon: Gift },
  ]

  const channels = [
    { value: "whatsapp", label: "WhatsApp", color: "bg-green-100 text-green-800" },
    { value: "instagram", label: "Instagram", color: "bg-pink-100 text-pink-800" },
    { value: "facebook", label: "Facebook", color: "bg-blue-100 text-blue-800" },
    { value: "email", label: "Email", color: "bg-purple-100 text-purple-800" },
    { value: "sms", label: "SMS", color: "bg-gray-100 text-gray-800" },
  ]

  const tones = [
    { value: "friendly", label: "Friendly & Casual" },
    { value: "professional", label: "Professional" },
    { value: "exciting", label: "Exciting & Energetic" },
    { value: "warm", label: "Warm & Welcoming" },
    { value: "urgent", label: "Urgent & Action-Oriented" },
    { value: "elegant", label: "Elegant & Sophisticated" },
  ]

  const goals = [
    { value: "engagement", label: "Increase Engagement" },
    { value: "sales", label: "Drive Sales" },
    { value: "awareness", label: "Build Awareness" },
    { value: "retention", label: "Customer Retention" },
    { value: "feedback", label: "Gather Feedback" },
    { value: "promotion", label: "Promote Offer" },
  ]

  const handleGenerate = async () => {
    if (!currentGeneration.type || !currentGeneration.prompt) {
      toast({
        title: "Missing Information",
        description: "Please select content type and enter a prompt",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockResult = generateMockContent(currentGeneration.type, currentGeneration.prompt)
      setCurrentGeneration({ ...currentGeneration, result: mockResult })

      toast({
        title: "Content Generated",
        description: "AI has created your content successfully",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateMockContent = (type: string, prompt: string) => {
    const mockContents: { [key: string]: string } = {
      campaign_caption: `🍽️ Craving authentic flavors? Our chef's special biryani is waiting for you! Made with premium basmati rice and aromatic spices. Order now and get 20% off! #AuthenticFlavors #BiryaniLovers #FoodieParadise`,
      whatsapp_message: `Hi there! 👋 Hope you're having a great day! We've got something special brewing in our kitchen just for you. Our weekend special menu is now live with exciting new dishes. Would you like to take a look? Reply YES to see our latest offerings! 🍽️✨`,
      instagram_post: `✨ WEEKEND SPECIAL ALERT ✨\n\nIndulge in our chef's signature dishes this weekend! From creamy butter chicken to aromatic biryani, every bite is a celebration of flavors.\n\n📍 Visit us today\n🕒 Open till 11 PM\n📞 Call for reservations\n\n#WeekendSpecial #AuthenticCuisine #FoodLovers #RestaurantLife`,
      review_reply: `Thank you so much for your wonderful review! 🙏 We're thrilled to hear that you enjoyed your dining experience with us. Your kind words about our service and food quality truly make our day. We look forward to welcoming you back soon for another memorable meal! ⭐`,
      menu_description: `Aromatic Chicken Biryani - A royal feast of tender chicken pieces marinated in yogurt and spices, layered with fragrant basmati rice, slow-cooked to perfection with saffron and caramelized onions. Served with cooling raita and tangy pickle. A true celebration of traditional flavors that will transport you to culinary paradise.`,
    }

    return mockContents[type] || `Generated content for: ${prompt}`
  }

  const handleSave = async () => {
    if (!currentGeneration.result) return

    try {
      const restaurantId = "restaurant-1"
      await UnifiedDataService.saveGeneratedContent({
        restaurantId,
        type: currentGeneration.type as any,
        prompt: currentGeneration.prompt,
        content: currentGeneration.result,
        channel: currentGeneration.channel,
        tone: currentGeneration.tone,
        goal: currentGeneration.goal,
        isUsed: false,
      })

      await loadGeneratedContent()

      toast({
        title: "Content Saved",
        description: "Your generated content has been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content",
        variant: "destructive",
      })
    }
  }

  const getContentTypeIcon = (type: string) => {
    const contentType = contentTypes.find((ct) => ct.value === type)
    if (!contentType) return ImageIcon
    return contentType.icon
  }

  const getChannelColor = (channel: string) => {
    const channelInfo = channels.find((c) => c.value === channel)
    return channelInfo?.color || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <div className="flex-1 pb-16 md:pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Content Generator</h1>
                <p className="text-gray-600 mt-1">Create engaging content for all your marketing channels</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="bg-white">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generator">Generator</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Panel */}
                <Card className="border-gray-100">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                      Content Configuration
                    </CardTitle>
                    <CardDescription>Configure your content generation settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                      <Select
                        value={currentGeneration.type}
                        onValueChange={(value) => setCurrentGeneration({ ...currentGeneration, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          {contentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center space-x-2">
                                <type.icon className="w-4 h-4" />
                                <span>{type.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
                      <Select
                        value={currentGeneration.channel}
                        onValueChange={(value) => setCurrentGeneration({ ...currentGeneration, channel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                          {channels.map((channel) => (
                            <SelectItem key={channel.value} value={channel.value}>
                              {channel.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                      <Select
                        value={currentGeneration.tone}
                        onValueChange={(value) => setCurrentGeneration({ ...currentGeneration, tone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {tones.map((tone) => (
                            <SelectItem key={tone.value} value={tone.value}>
                              {tone.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Goal</label>
                      <Select
                        value={currentGeneration.goal}
                        onValueChange={(value) => setCurrentGeneration({ ...currentGeneration, goal: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select goal" />
                        </SelectTrigger>
                        <SelectContent>
                          {goals.map((goal) => (
                            <SelectItem key={goal.value} value={goal.value}>
                              {goal.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
                      <Textarea
                        placeholder="Describe what you want to create... (e.g., 'Create a post about our weekend special biryani offer')"
                        value={currentGeneration.prompt}
                        onChange={(e) => setCurrentGeneration({ ...currentGeneration, prompt: e.target.value })}
                        className="min-h-[100px]"
                      />
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={loading || !currentGeneration.type || !currentGeneration.prompt}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Content
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Output Panel */}
                <Card className="border-gray-100">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <FileText className="w-5 h-5 mr-2 text-green-600" />
                      Generated Content
                    </CardTitle>
                    <CardDescription>Your AI-generated content will appear here</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentGeneration.result ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {currentGeneration.channel && (
                                <Badge className={getChannelColor(currentGeneration.channel)} variant="outline">
                                  {currentGeneration.channel}
                                </Badge>
                              )}
                              {currentGeneration.tone && (
                                <Badge variant="secondary" className="text-xs">
                                  {currentGeneration.tone}
                                </Badge>
                              )}
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => handleCopy(currentGeneration.result)}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-800 whitespace-pre-wrap">{currentGeneration.result}</p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                            <Save className="w-4 h-4 mr-2" />
                            Save Content
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleCopy(currentGeneration.result)}
                            className="bg-white"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button variant="outline" className="bg-white">
                            <Send className="w-4 h-4 mr-2" />
                            Use in Campaign
                          </Button>
                          <Button variant="outline" onClick={handleGenerate} className="bg-white">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Regenerate
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate</h3>
                        <p className="text-gray-600">
                          Configure your settings and click generate to create AI-powered content
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="border-gray-100">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Content History
                  </CardTitle>
                  <CardDescription>Your previously generated content</CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedContent.length === 0 ? (
                    <div className="text-center py-12">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Yet</h3>
                      <p className="text-gray-600 mb-4">Start generating content to see your history here</p>
                      <Button
                        onClick={() => setActiveTab("generator")}
                        className="bg-black hover:bg-gray-800 text-white"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Content
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {generatedContent.map((content) => {
                        const ContentIcon = getContentTypeIcon(content.type)
                        return (
                          <div
                            key={content.id}
                            className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  <ContentIcon className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 capitalize">
                                    {content.type.replace("_", " ")}
                                  </h4>
                                  <p className="text-sm text-gray-600">{content.prompt}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {content.channel && (
                                  <Badge className={getChannelColor(content.channel)} variant="outline">
                                    {content.channel}
                                  </Badge>
                                )}
                                {content.isUsed && (
                                  <Badge className="bg-green-100 text-green-800 border-green-200" variant="outline">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Used
                                  </Badge>
                                )}
                                <span className="text-xs text-gray-500">
                                  {new Date(content.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="mb-3 p-3 bg-gray-50 rounded border text-sm text-gray-800">
                              {content.content.length > 200
                                ? `${content.content.substring(0, 200)}...`
                                : content.content}
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCopy(content.content)}
                                className="bg-white"
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                              </Button>
                              <Button size="sm" variant="outline" className="bg-white">
                                <Send className="w-4 h-4 mr-2" />
                                Use in Campaign
                              </Button>
                              <Button size="sm" variant="outline" className="bg-white">
                                <Eye className="w-4 h-4 mr-2" />
                                View Full
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-white text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card className="border-gray-100">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Target className="w-5 h-5 mr-2 text-orange-600" />
                    Content Templates
                  </CardTitle>
                  <CardDescription>Pre-built templates for common content types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        title: "Weekend Special Promotion",
                        type: "Instagram Post",
                        description: "Promote weekend specials with engaging visuals",
                        preview: "🌟 Weekend Special Alert! Try our chef's signature dishes...",
                        color: "bg-pink-50 border-pink-200",
                      },
                      {
                        title: "Customer Thank You",
                        type: "WhatsApp Message",
                        description: "Thank customers for their visit",
                        preview: "Thank you for dining with us! We hope you enjoyed...",
                        color: "bg-green-50 border-green-200",
                      },
                      {
                        title: "New Menu Launch",
                        type: "Email Campaign",
                        description: "Announce new menu items to customers",
                        preview: "Exciting news! We've added delicious new items to our menu...",
                        color: "bg-blue-50 border-blue-200",
                      },
                      {
                        title: "Birthday Offer",
                        type: "SMS Message",
                        description: "Send birthday wishes with special offers",
                        preview: "Happy Birthday! Celebrate with us and get 25% off...",
                        color: "bg-purple-50 border-purple-200",
                      },
                      {
                        title: "Review Response",
                        type: "Review Reply",
                        description: "Professional responses to customer reviews",
                        preview: "Thank you for your wonderful feedback! We're delighted...",
                        color: "bg-yellow-50 border-yellow-200",
                      },
                      {
                        title: "Combo Offer",
                        type: "Facebook Post",
                        description: "Promote combo deals and value meals",
                        preview: "🍽️ Combo Deal Alert! Get more for less with our amazing...",
                        color: "bg-indigo-50 border-indigo-200",
                      },
                    ].map((template, index) => (
                      <div key={index} className={`p-4 border rounded-lg ${template.color}`}>
                        <div className="mb-3">
                          <h4 className="font-semibold text-gray-900 mb-1">{template.title}</h4>
                          <Badge variant="secondary" className="text-xs mb-2">
                            {template.type}
                          </Badge>
                          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                          <div className="p-2 bg-white rounded border text-xs text-gray-700">{template.preview}</div>
                        </div>
                        <Button size="sm" className="w-full bg-black hover:bg-gray-800 text-white">
                          <Zap className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <MobileBottomNavigation />
    </div>
  )
}
