"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Zap,
  Eye,
  Save,
  Globe,
  Upload,
  Star,
  MapPin,
  Camera,
  Palette,
  FileText,
  MessageSquare,
  ChefHat,
  Award,
  Users,
  TrendingUp,
  ExternalLink,
  Settings,
  Edit,
  Search,
  Link,
} from "lucide-react"

export default function SmartProfilePage() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [aiGenerationOpen, setAiGenerationOpen] = useState(false)
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState<any>(null)
  const [sectionContent, setSectionContent] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const [profileData, setProfileData] = useState({
    restaurantName: "Spice Garden",
    tagline: "Authentic Indian Cuisine with Modern Flair",
    description: "",
    cuisine: "",
    location: "",
    phone: "",
    hours: "",
    priceRange: "",
    brandVoice: "",
    brandPositioning: "",
    brandPersonality: [] as string[],
  })

  const completionPercentage = 45

  const handleGenerateContent = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
      toast({
        title: "Content Generated",
        description: "AI has successfully generated content for selected sections.",
      })
      setAiGenerationOpen(false)
    }, 3000)
  }

  const handleSaveSection = (sectionTitle: string) => {
    setIsSaving(true)
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Section Updated",
        description: `${sectionTitle} has been updated successfully.`,
      })
      setSectionDialogOpen(false)
    }, 1000)
  }

  const handleSaveTab = (tab: string) => {
    setIsSaving(true)
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Information Saved",
        description: `${tab} information has been saved successfully.`,
      })
    }, 1000)
  }

  const profileSections = [
    {
      icon: Camera,
      title: "Hero Section",
      description: "AI-generated hero image and compelling headline",
      status: "pending",
      canGenerate: true,
      aiNote: "AI can generate a compelling headline and suggest hero image style based on your brand personality.",
    },
    {
      icon: FileText,
      title: "About & Story",
      description: "Restaurant history, mission, and unique story",
      status: "completed",
      canGenerate: true,
      aiNote: "AI can craft your restaurant's story using your brand voice and positioning information.",
    },
    {
      icon: ChefHat,
      title: "Menu Integration",
      description: "Showcase signature dishes and menu highlights",
      status: "completed",
      canGenerate: false,
      aiNote: "Menu content is pulled directly from your Menu Builder module. AI cannot generate this content.",
    },
    {
      icon: Star,
      title: "Reviews & Ratings",
      description: "Aggregated ratings from all platforms",
      status: "pending",
      canGenerate: true,
      aiNote: "AI will aggregate and summarize reviews from your connected platforms.",
    },
    {
      icon: Award,
      title: "Awards & Achievements",
      description: "Certifications, awards, and recognition",
      status: "pending",
      canGenerate: true,
      aiNote: "AI can search the web for your restaurant's awards and achievements or you can add them manually.",
    },
    {
      icon: MapPin,
      title: "Location & Contact",
      description: "Address, hours, and contact information",
      status: "completed",
      canGenerate: true,
      aiNote: "AI will format your location and contact details from your basic information.",
    },
  ]

  const platformIntegrations = [
    {
      name: "Google My Business",
      logo: "/placeholder.svg?height=24&width=24",
      status: "connected",
      color: "bg-blue-100 text-blue-800",
      enabled: true,
    },
    {
      name: "Zomato",
      logo: "/placeholder.svg?height=24&width=24",
      status: "disconnected",
      color: "bg-gray-100 text-gray-600",
      enabled: false,
    },
    {
      name: "TripAdvisor",
      logo: "/placeholder.svg?height=24&width=24",
      status: "connected",
      color: "bg-green-100 text-green-800",
      enabled: true,
    },
    {
      name: "Website",
      logo: "/placeholder.svg?height=24&width=24",
      status: "connected",
      color: "bg-purple-100 text-purple-800",
      enabled: true,
    },
    {
      name: "DineOut",
      logo: "/placeholder.svg?height=24&width=24",
      status: "disconnected",
      color: "bg-gray-100 text-gray-600",
      enabled: false,
    },
    {
      name: "Swiggy",
      logo: "/placeholder.svg?height=24&width=24",
      status: "disconnected",
      color: "bg-gray-100 text-gray-600",
      enabled: false,
    },
  ]

  const brandPersonalityTraits = [
    "Modern",
    "Traditional",
    "Casual",
    "Upscale",
    "Family-friendly",
    "Trendy",
    "Cozy",
    "Elegant",
    "Rustic",
    "Contemporary",
    "Authentic",
    "Innovative",
  ]

  const handlePersonalityChange = (trait: string, checked: boolean) => {
    if (checked) {
      setProfileData({
        ...profileData,
        brandPersonality: [...profileData.brandPersonality, trait],
      })
    } else {
      setProfileData({
        ...profileData,
        brandPersonality: profileData.brandPersonality.filter((t) => t !== trait),
      })
    }
  }

  const handleToggleIntegration = (index: number) => {
    const updatedIntegrations = [...platformIntegrations]
    updatedIntegrations[index].enabled = !updatedIntegrations[index].enabled

    toast({
      title: updatedIntegrations[index].enabled ? "Integration Enabled" : "Integration Disabled",
      description: `${updatedIntegrations[index].name} has been ${updatedIntegrations[index].enabled ? "enabled" : "disabled"}.`,
    })
  }

  const handleNavigateToAsset = (asset: string) => {
    // In a real app, this would navigate to the specific asset page
    toast({
      title: "Navigating",
      description: `Navigating to ${asset}...`,
    })

    // Simulate navigation
    if (asset === "Menu Builder") {
      router.push("/profile/menu-builder")
    } else if (asset === "WhatsApp Card") {
      router.push("/profile/whatsapp-card")
    } else if (asset === "Reviews Aggregator") {
      router.push("/profile/reviews")
    }
  }

  const handleFetchMedia = () => {
    toast({
      title: "Fetching Media",
      description: "AI is searching connected platforms for media...",
    })

    // Simulate fetching
    setTimeout(() => {
      toast({
        title: "Media Found",
        description: "5 images found from your connected platforms.",
      })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-semibold">TableSalt</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Button variant="ghost" className="text-gray-900 font-medium" onClick={() => router.push("/profile")}>
                <Users className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button variant="ghost" className="text-gray-500">
                <TrendingUp className="w-4 h-4 mr-2" />
                Marketing
              </Button>
              <Button variant="ghost" className="text-gray-500">
                <Users className="w-4 h-4 mr-2" />
                Customers
              </Button>
              <Button variant="ghost" className="text-gray-500">
                <Globe className="w-4 h-4 mr-2" />
                Integrations
              </Button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Smart Restaurant Profile</h1>
              <p className="text-gray-600 mt-2">Create your AI-powered restaurant website in minutes</p>
            </div>
            {/* Desktop buttons */}
            <div className="hidden sm:flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button className="flex items-center bg-black hover:bg-gray-800">
                <Globe className="w-4 h-4 mr-2" />
                Publish Live
              </Button>
            </div>
            {/* Mobile buttons - small and positioned right */}
            <div className="sm:hidden flex gap-2 justify-end">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4" />
              </Button>
              <Button size="sm" className="bg-black hover:bg-gray-800">
                <Globe className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Completion</span>
              <span className="text-sm text-gray-500">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Content Generation Card */}

            {/* Platform Integrations */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center text-gray-900">
                  <Link className="w-5 h-5 mr-2" />
                  Platform Integrations
                </CardTitle>
                <CardDescription>Connect your listing platforms to fetch data automatically</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {platformIntegrations.map((platform, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={platform.logo || "/placeholder.svg"}
                          alt={`${platform.name} logo`}
                          className="w-8 h-8 object-contain"
                        />
                        <span className="font-medium text-gray-900">{platform.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={platform.color}>
                          {platform.status === "connected" ? "Connected" : "Connect"}
                        </Badge>
                        <Switch
                          checked={platform.enabled}
                          onCheckedChange={() => handleToggleIntegration(index)}
                          disabled={platform.status !== "connected"}
                        />
                        {platform.status === "disconnected" && (
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Profile Sections - Now Clickable */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Sections</CardTitle>
                    <CardDescription>Configure each section of your restaurant website</CardDescription>
                  </div>
                  <Dialog open={aiGenerationOpen} onOpenChange={setAiGenerationOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        <Zap className="w-4 h-4 mr-2" />
                        Generate with AI
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
                      <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="flex items-center">
                          <Zap className="w-5 h-5 mr-2 text-teal-600" />
                          Generate Content with AI
                        </DialogTitle>
                        <DialogDescription>Select sections and provide context for AI generation</DialogDescription>
                      </DialogHeader>

                      <div className="flex-1 overflow-y-auto space-y-4 py-4">
                        {/* Additional Context */}
                        <div className="space-y-2">
                          <Label htmlFor="ai-prompt">Additional Context (Optional)</Label>
                          <Textarea
                            id="ai-prompt"
                            placeholder="e.g., Focus on family-friendly atmosphere, highlight our award-winning chef, emphasize organic ingredients..."
                            rows={3}
                            className="resize-none"
                          />
                          <p className="text-xs text-gray-500">
                            Provide specific details you want AI to include in the generated content
                          </p>
                        </div>

                        {/* Section Selection */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Select Sections to Generate</Label>
                          {profileSections.map((section, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                              <Checkbox
                                id={`section-${index}`}
                                disabled={!section.canGenerate}
                                defaultChecked={section.canGenerate}
                                className="mt-0.5"
                              />
                              <div className="flex-1 min-w-0">
                                <Label
                                  htmlFor={`section-${index}`}
                                  className={`font-medium text-sm ${!section.canGenerate ? "text-gray-400" : "text-gray-900"}`}
                                >
                                  {section.title}
                                </Label>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{section.aiNote}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <DialogFooter className="flex-shrink-0 border-t pt-4">
                        <Button variant="outline" onClick={() => setAiGenerationOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          className="bg-teal-600 hover:bg-teal-700"
                          onClick={handleGenerateContent}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 mr-2" />
                              Generate Content
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileSections.map((section, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        setCurrentSection(section)
                        setSectionDialogOpen(true)
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            section.status === "completed" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <section.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{section.title}</h4>
                            <Badge
                              variant={section.status === "completed" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {section.status === "completed" ? "Ready" : "Pending"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                          {section.canGenerate && (
                            <div className="flex items-center mt-2 text-xs text-teal-600">
                              <Search className="w-3 h-3 mr-1" />
                              AI can generate content
                            </div>
                          )}
                        </div>
                        <Edit className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Section Edit Dialog */}
            <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
              <DialogContent className="max-w-2xl">
                {currentSection && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <currentSection.icon className="w-5 h-5 mr-2" />
                        {currentSection.title}
                      </DialogTitle>
                      <DialogDescription>{currentSection.description}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {currentSection.canGenerate && (
                        <div className="p-4 bg-teal-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-teal-900">AI Generation Available</h4>
                              <p className="text-sm text-teal-700">{currentSection.aiNote}</p>
                            </div>
                            <Button
                              size="sm"
                              className="bg-teal-600 hover:bg-teal-700"
                              onClick={() => {
                                setSectionDialogOpen(false)
                                setAiGenerationOpen(true)
                              }}
                            >
                              <Zap className="w-4 h-4 mr-1" />
                              Generate
                            </Button>
                          </div>
                        </div>
                      )}
                      <div className="space-y-3">
                        <Label>Manual Input</Label>
                        <Textarea
                          placeholder={`Enter ${currentSection.title.toLowerCase()} content manually...`}
                          rows={4}
                          value={sectionContent[currentSection.title] || ""}
                          onChange={(e) =>
                            setSectionContent({
                              ...sectionContent,
                              [currentSection.title]: e.target.value,
                            })
                          }
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSectionDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => handleSaveSection(currentSection.title)} disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </DialogFooter>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>

            {/* Restaurant Information Form */}
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Information</CardTitle>
                <CardDescription>Basic details that will be used to generate your smart profile</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="brand">Brand Assets</TabsTrigger>
                    <TabsTrigger value="media">Media Assets</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Restaurant Name</Label>
                        <Input
                          id="name"
                          value={profileData.restaurantName}
                          onChange={(e) => setProfileData({ ...profileData, restaurantName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cuisine">Cuisine Type</Label>
                        <Input
                          id="cuisine"
                          placeholder="e.g., Indian, Italian, Mexican"
                          value={profileData.cuisine}
                          onChange={(e) => setProfileData({ ...profileData, cuisine: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell us about your restaurant's story, specialties, and what makes it unique..."
                        value={profileData.description}
                        onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="City, State"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="+1 (555) 123-4567"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={() => handleSaveTab("Basic Info")} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Information
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="brand" className="space-y-6 mt-6">
                    <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Restaurant Logo</h3>
                      <p className="text-gray-500 mb-4">PNG, JPG up to 10MB</p>
                      <Button variant="outline">Choose File</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Brand Colors</Label>
                        <div className="flex space-x-2 mt-2">
                          <div className="w-10 h-10 bg-orange-500 rounded-lg border-2 border-gray-200"></div>
                          <Input className="w-20" value="#f59e0b" readOnly />
                          <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                            <Palette className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Brand Voice & Messaging */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Brand Voice & Messaging *
                      </h3>

                      <div>
                        <Label htmlFor="tagline">Tagline *</Label>
                        <Input
                          id="tagline"
                          placeholder="e.g., Authentic flavors, modern experience"
                          value={profileData.tagline}
                          onChange={(e) => setProfileData({ ...profileData, tagline: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="brand-voice">Brand Voice *</Label>
                        <Select
                          value={profileData.brandVoice}
                          onValueChange={(value) => setProfileData({ ...profileData, brandVoice: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select brand voice" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="elegant">Elegant</SelectItem>
                            <SelectItem value="playful">Playful</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="brand-positioning">Brand Positioning</Label>
                        <Textarea
                          id="brand-positioning"
                          placeholder="e.g., We position ourselves as a premium casual dining restaurant that brings authentic Indian flavors to modern food lovers..."
                          value={profileData.brandPositioning}
                          onChange={(e) => setProfileData({ ...profileData, brandPositioning: e.target.value })}
                          rows={4}
                        />
                      </div>
                    </div>

                    {/* Brand Personality */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        Brand Personality *
                      </h3>
                      <p className="text-sm text-gray-600">
                        Select at least 2 traits that describe your restaurant (helps AI generate appropriate content):
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {brandPersonalityTraits.map((trait) => (
                          <div key={trait} className="flex items-center space-x-2">
                            <Checkbox
                              id={trait}
                              checked={profileData.brandPersonality.includes(trait)}
                              onCheckedChange={(checked) => handlePersonalityChange(trait, checked as boolean)}
                            />
                            <Label htmlFor={trait} className="text-sm font-medium">
                              {trait}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={() => handleSaveTab("Brand Assets")} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Brand Assets
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-4 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Restaurant Media</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center text-teal-600"
                        onClick={handleFetchMedia}
                      >
                        <Search className="w-4 h-4 mr-1" />
                        Fetch from Platforms
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900">Restaurant Photos</h4>
                        <p className="text-sm text-gray-500 mb-3">Interior, exterior, ambiance</p>
                        <label htmlFor="restaurant-photos">
                          <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                            <span>Upload Photos</span>
                          </Button>
                          <input
                            id="restaurant-photos"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={() =>
                              toast({
                                title: "Photos Selected",
                                description: "Your photos have been selected and ready to upload.",
                              })
                            }
                          />
                        </label>
                      </div>
                      <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                        <ChefHat className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900">Food Photos</h4>
                        <p className="text-sm text-gray-500 mb-3">Signature dishes, menu items</p>
                        <label htmlFor="food-photos">
                          <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                            <span>Upload Photos</span>
                          </Button>
                          <input
                            id="food-photos"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={() =>
                              toast({
                                title: "Photos Selected",
                                description: "Your food photos have been selected and ready to upload.",
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={() => handleSaveTab("Media Assets")} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Media
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center text-blue-900">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Profile Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Website Views</span>
                  </div>
                  <span className="font-bold text-lg text-gray-900">2,847</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <ChefHat className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Menu Items</span>
                  </div>
                  <span className="font-bold text-lg text-gray-900">24</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Avg. Rating</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg text-gray-900">4.6</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Total Reviews</span>
                  </div>
                  <span className="font-bold text-lg text-gray-900">156</span>
                </div>
              </CardContent>
            </Card>

            {/* Assets (formerly Connected Modules) - Now Clickable */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => handleNavigateToAsset("Menu Builder")}
                >
                  <div className="flex items-center space-x-3">
                    <ChefHat className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Menu Builder</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                    <ExternalLink className="w-4 h-4 text-green-600" />
                  </div>
                </div>

                <div
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => handleNavigateToAsset("WhatsApp Card")}
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">WhatsApp Card</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Setup</Badge>
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                  </div>
                </div>

                <div
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                  onClick={() => handleNavigateToAsset("Reviews Aggregator")}
                >
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Reviews Aggregator</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                    <ExternalLink className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Website
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Generate WhatsApp Card
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
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
