"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  X,
  CheckCircle,
  Star,
  Users,
  Calendar,
  CreditCard,
  Globe,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Zap,
  Smartphone,
  Camera,
  MessageCircle,
} from "lucide-react"

interface Platform {
  id: string
  name: string
  description: string
  icon: any
  isConnected: boolean
  dataQuality: number
  features: string[]
  requiredSections: string[]
}

interface Section {
  id: string
  name: string
  description: string
  required: boolean
  icon: any
  fields: string[]
}

interface AIProfileGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (config: any) => void
  connectedPlatforms: string[]
}

export default function AIPlatformSelectionModal({
  isOpen,
  onClose,
  onGenerate,
  connectedPlatforms,
}: AIProfileGenerationModalProps) {
  const [step, setStep] = useState<"platform" | "sections" | "options">("platform")
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [retainExistingData, setRetainExistingData] = useState(true)
  const [generationOptions, setGenerationOptions] = useState({
    tone: "professional",
    length: "detailed",
    language: "english",
    includeEmojis: true,
    includePricing: true,
    includeHours: true,
  })

  // Map connected platforms to platform objects
  const platforms: Platform[] = [
    {
      id: "google-business",
      name: "Google My Business",
      description: "Rich business data, reviews, and photos from Google",
      icon: Globe,
      isConnected: connectedPlatforms.includes("Google My Business"),
      dataQuality: 95,
      features: ["Business Info", "Reviews", "Photos", "Hours", "Location Data"],
      requiredSections: ["basic", "contact", "hours"],
    },
    {
      id: "zomato",
      name: "Zomato",
      description: "Menu items, reviews, and restaurant details from Zomato",
      icon: Star,
      isConnected: connectedPlatforms.includes("Zomato"),
      dataQuality: 90,
      features: ["Menu Data", "Reviews", "Photos", "Ratings", "Delivery Info"],
      requiredSections: ["basic", "contact", "menu"],
    },
    {
      id: "swiggy",
      name: "Swiggy",
      description: "Order data, popular items, and customer preferences",
      icon: Smartphone,
      isConnected: connectedPlatforms.includes("Swiggy"),
      dataQuality: 85,
      features: ["Order Analytics", "Popular Items", "Customer Data", "Delivery Metrics"],
      requiredSections: ["basic", "menu", "offers"],
    },
    {
      id: "pos-system",
      name: "PetPooja POS",
      description: "Sales data, popular items, and customer insights from POS",
      icon: CreditCard,
      isConnected: connectedPlatforms.includes("PetPooja POS"),
      dataQuality: 98,
      features: ["Sales Data", "Popular Items", "Customer Analytics", "Inventory Data"],
      requiredSections: ["basic", "menu", "analytics"],
    },
    {
      id: "facebook",
      name: "Facebook",
      description: "Social media engagement and customer interactions",
      icon: Users,
      isConnected: connectedPlatforms.includes("Facebook"),
      dataQuality: 75,
      features: ["Social Engagement", "Customer Posts", "Event Data", "Page Analytics"],
      requiredSections: ["basic", "brand", "social"],
    },
    {
      id: "instagram",
      name: "Instagram",
      description: "Visual content and social media presence data",
      icon: Camera,
      isConnected: connectedPlatforms.includes("Instagram"),
      dataQuality: 80,
      features: ["Visual Content", "Hashtag Analytics", "Story Data", "Engagement Metrics"],
      requiredSections: ["basic", "brand", "media"],
    },
  ]

  const sections: Section[] = [
    {
      id: "basic",
      name: "Basic Information",
      description: "Restaurant name, cuisine, description, contact details",
      required: true,
      icon: Users,
      fields: ["Restaurant Name", "Cuisine Type", "Description", "Phone", "Email", "Address"],
    },
    {
      id: "brand",
      name: "Brand Assets",
      description: "Brand voice, story, values, and unique selling points",
      required: false,
      icon: Sparkles,
      fields: ["Brand Voice", "Brand Story", "Brand Values", "Target Audience", "USP"],
    },
    {
      id: "menu",
      name: "Menu & Offerings",
      description: "Menu items, specialties, dietary options, popular dishes",
      required: false,
      icon: Star,
      fields: ["Menu Items", "Specialties", "Dietary Options", "Popular Dishes", "Price Range"],
    },
    {
      id: "hours",
      name: "Operating Hours",
      description: "Business hours, special hours, holiday schedules",
      required: false,
      icon: Calendar,
      fields: ["Daily Hours", "Special Hours", "Holiday Schedule", "Peak Times"],
    },
    {
      id: "offers",
      name: "Special Offers",
      description: "Promotions, deals, loyalty programs, seasonal offers",
      required: false,
      icon: Zap,
      fields: ["Current Promotions", "Seasonal Offers", "Loyalty Programs", "Happy Hour Deals"],
    },
    {
      id: "media",
      name: "Photos & Media",
      description: "Restaurant photos, food images, team photos, videos",
      required: false,
      icon: Camera,
      fields: ["Restaurant Photos", "Food Photos", "Team Photos", "Videos", "Virtual Tours"],
    },
    {
      id: "reviews",
      name: "Reviews & Testimonials",
      description: "Customer reviews, testimonials, ratings, feedback",
      required: false,
      icon: MessageCircle,
      fields: ["Customer Reviews", "Testimonials", "Ratings", "Response Templates"],
    },
  ]

  const selectedPlatformData = platforms.find((p) => p.id === selectedPlatform)
  const availablePlatforms = platforms.filter((p) => p.isConnected)

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatform(platformId)
    const platform = platforms.find((p) => p.id === platformId)
    if (platform) {
      // Auto-select required sections
      setSelectedSections(platform.requiredSections)
    }
  }

  const handleSectionToggle = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId)
    const isRequired = section?.required || selectedPlatformData?.requiredSections.includes(sectionId)

    if (isRequired) return // Can't deselect required sections

    setSelectedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const handleGenerate = () => {
    const config = {
      platform: selectedPlatform,
      sections: selectedSections,
      retainExistingData,
      options: generationOptions,
    }
    onGenerate(config)
  }

  const canProceed = () => {
    if (step === "platform") return selectedPlatform !== ""
    if (step === "sections") return selectedSections.length > 0
    return true
  }

  const getStepTitle = () => {
    switch (step) {
      case "platform":
        return "Select Data Source"
      case "sections":
        return "Choose Profile Sections"
      case "options":
        return "Generation Options"
      default:
        return "AI Profile Generation"
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case "platform":
        return "Choose which connected integration to use as the primary data source"
      case "sections":
        return "Select which sections to include in your profile generation"
      case "options":
        return "Customize how your profile content should be generated"
      default:
        return ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] flex flex-col bg-white overflow-hidden">
        <DialogHeader className="border-b border-gray-200 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-black flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mr-2">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                {getStepTitle()}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">{getStepDescription()}</DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
              <X className="w-4 h-4 text-gray-600" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-2 mt-4">
            {["platform", "sections", "options"].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === stepName
                      ? "bg-black text-white"
                      : index < ["platform", "sections", "options"].indexOf(step)
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index < ["platform", "sections", "options"].indexOf(step) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 2 && <div className="w-8 h-0.5 bg-gray-200 mx-2" />}
              </div>
            ))}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Step 1: Platform Selection */}
            {step === "platform" && (
              <div className="space-y-4">
                {availablePlatforms.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-black mb-2">No Connected Platforms</h3>
                    <p className="text-gray-600 mb-4">
                      You need to connect at least one platform to generate an AI profile.
                    </p>
                    <Button onClick={onClose} className="bg-black hover:bg-gray-800 text-white">
                      Go to Integrations
                    </Button>
                  </div>
                ) : (
                  <RadioGroup value={selectedPlatform} onValueChange={handlePlatformSelect}>
                    {availablePlatforms.map((platform) => (
                      <div
                        key={platform.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedPlatform === platform.id
                            ? "border-black bg-gray-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value={platform.id} id={platform.id} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                <platform.icon className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <Label htmlFor={platform.id} className="font-medium text-black cursor-pointer">
                                  {platform.name}
                                </Label>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                    Connected
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {platform.dataQuality}% data quality
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{platform.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {platform.features.map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            )}

            {/* Step 2: Section Selection */}
            {step === "sections" && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800">
                        <strong>Required sections</strong> are automatically selected based on your chosen platform.
                        Optional sections will enhance your profile.
                      </p>
                    </div>
                  </div>
                </div>

                {sections.map((section) => {
                  const isSelected = selectedSections.includes(section.id)
                  const isRequired = section.required || selectedPlatformData?.requiredSections.includes(section.id)

                  return (
                    <div
                      key={section.id}
                      className={`border rounded-lg p-4 ${
                        isSelected ? "border-black bg-gray-50" : "border-gray-200"
                      } ${isRequired ? "opacity-100" : "cursor-pointer hover:border-gray-300"}`}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleSectionToggle(section.id)}
                          disabled={isRequired}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <section.icon className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-black">{section.name}</h3>
                              {isRequired && (
                                <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">Required</Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {section.fields.slice(0, 4).map((field, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                            {section.fields.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{section.fields.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Checkbox checked={retainExistingData} onCheckedChange={setRetainExistingData} />
                  <Label className="text-sm text-yellow-900">
                    Retain existing data and enhance with AI-generated content
                  </Label>
                </div>
              </div>
            )}

            {/* Step 3: Generation Options */}
            {step === "options" && (
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-black mb-3 block">Content Language</Label>
                  <Select
                    value={generationOptions.language}
                    onValueChange={(value) => setGenerationOptions((prev) => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="bilingual">Bilingual (English + Hindi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-black mb-3 block">Content Tone</Label>
                  <RadioGroup
                    value={generationOptions.tone}
                    onValueChange={(value) => setGenerationOptions((prev) => ({ ...prev, tone: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="professional" id="professional" />
                      <Label htmlFor="professional" className="cursor-pointer">
                        Professional & Formal
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="friendly" id="friendly" />
                      <Label htmlFor="friendly" className="cursor-pointer">
                        Friendly & Welcoming
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="casual" id="casual" />
                      <Label htmlFor="casual" className="cursor-pointer">
                        Casual & Conversational
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="elegant" id="elegant" />
                      <Label htmlFor="elegant" className="cursor-pointer">
                        Elegant & Sophisticated
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-sm font-medium text-black mb-3 block">Content Length</Label>
                  <RadioGroup
                    value={generationOptions.length}
                    onValueChange={(value) => setGenerationOptions((prev) => ({ ...prev, length: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="concise" id="concise" />
                      <Label htmlFor="concise" className="cursor-pointer">
                        Concise & Brief
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="detailed" id="detailed" />
                      <Label htmlFor="detailed" className="cursor-pointer">
                        Detailed & Comprehensive
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-black">Additional Options</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={generationOptions.includeEmojis}
                        onCheckedChange={(checked) =>
                          setGenerationOptions((prev) => ({ ...prev, includeEmojis: checked as boolean }))
                        }
                      />
                      <Label className="cursor-pointer">Include emojis in content</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={generationOptions.includePricing}
                        onCheckedChange={(checked) =>
                          setGenerationOptions((prev) => ({ ...prev, includePricing: checked as boolean }))
                        }
                      />
                      <Label className="cursor-pointer">Include pricing information</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={generationOptions.includeHours}
                        onCheckedChange={(checked) =>
                          setGenerationOptions((prev) => ({ ...prev, includeHours: checked as boolean }))
                        }
                      />
                      <Label className="cursor-pointer">Include operating hours</Label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-gray-200 p-6 flex-shrink-0">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (step === "platform") {
                  onClose()
                } else if (step === "sections") {
                  setStep("platform")
                } else {
                  setStep("sections")
                }
              }}
              className="bg-white border-gray-300"
            >
              {step === "platform" ? "Cancel" : "Back"}
            </Button>

            <Button
              onClick={() => {
                if (step === "platform") {
                  setStep("sections")
                } else if (step === "sections") {
                  setStep("options")
                } else {
                  handleGenerate()
                }
              }}
              disabled={!canProceed()}
              className="bg-black hover:bg-gray-800 text-white"
            >
              {step === "options" ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Profile
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
