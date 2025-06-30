"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  X,
  CheckCircle,
  Loader2,
  Sparkles,
  Building,
  Users,
  Star,
  Camera,
  ThumbsUp,
  Palette,
  Globe,
  BarChart3,
} from "lucide-react"

interface AIProfileGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (profileData: any) => void
  selectedPlatform: string
  tabConfig: any[]
  restaurantData: any
}

export default function AIProfileGenerationModal({
  isOpen,
  onClose,
  onComplete,
  selectedPlatform,
  tabConfig,
  restaurantData,
}: AIProfileGenerationModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [generatedData, setGeneratedData] = useState<any>({})

  const generationSteps = [
    {
      id: "analyzing",
      title: "Analyzing Platform Data",
      description: `Extracting insights from ${selectedPlatform}`,
      icon: BarChart3,
      duration: 2000,
    },
    {
      id: "basic",
      title: "Generating Basic Information",
      description: "Creating restaurant details and contact info",
      icon: Building,
      duration: 1500,
    },
    {
      id: "brand",
      title: "Building Brand Assets",
      description: "Developing brand story and visual identity",
      icon: Palette,
      duration: 2000,
    },
    {
      id: "profile",
      title: "Creating Profile Content",
      description: "Writing about section and restaurant story",
      icon: Users,
      duration: 1800,
    },
    {
      id: "features",
      title: "Mapping Features & Amenities",
      description: "Identifying services and facilities",
      icon: Star,
      duration: 1200,
    },
    {
      id: "marketing",
      title: "Analyzing Marketing Data",
      description: "Generating use cases and target segments",
      icon: ThumbsUp,
      duration: 2200,
    },
    {
      id: "media",
      title: "Processing Media Assets",
      description: "Organizing photos and videos",
      icon: Camera,
      duration: 1000,
    },
    {
      id: "finalizing",
      title: "Creating TableSalt Profile",
      description: "Generating shareable profile link",
      icon: Globe,
      duration: 1500,
    },
  ]

  useEffect(() => {
    if (isOpen && !isGenerating) {
      startGeneration()
    }
  }, [isOpen])

  const startGeneration = async () => {
    setIsGenerating(true)
    setCurrentStep(0)
    setProgress(0)
    setCompletedSteps([])
    setGeneratedData({})

    for (let i = 0; i < generationSteps.length; i++) {
      const step = generationSteps[i]
      setCurrentStep(i)

      // Simulate step processing
      await new Promise((resolve) => setTimeout(resolve, step.duration))

      // Generate mock data for each step
      const stepData = await generateStepData(step.id)
      setGeneratedData((prev: any) => ({ ...prev, ...stepData }))

      setCompletedSteps((prev) => [...prev, step.id])
      setProgress(((i + 1) / generationSteps.length) * 100)
    }

    // Complete generation
    setTimeout(() => {
      const completeProfileData = generateCompleteProfile()
      onComplete(completeProfileData)
      setIsGenerating(false)
    }, 500)
  }

  const generateStepData = async (stepId: string) => {
    switch (stepId) {
      case "analyzing":
        return {
          platformAnalysis: {
            totalReviews: 1247,
            averageRating: 4.3,
            photoCount: 89,
            dataQuality: 92,
          },
        }

      case "basic":
        return {
          basicInfo: {
            restaurantName: restaurantData.restaurantName || "Spice Garden Restaurant",
            tagline: "Authentic Indian flavors with a modern twist",
            email: restaurantData.email || "contact@spicegarden.com",
            phone: restaurantData.phone || "+91 98765 43210",
            address: restaurantData.address || "123 Food Street, Koramangala, Bangalore 560034",
            cuisine: restaurantData.cuisine || "Indian",
            restaurantType: "Casual Dining",
            priceRange: "₹₹",
          },
        }

      case "brand":
        return {
          brandAssets: {
            brandStory:
              "Founded in 2018 with a passion for authentic Indian cuisine, Spice Garden brings together traditional recipes passed down through generations with contemporary culinary techniques.",
            mission:
              "To provide an exceptional dining experience that celebrates the rich heritage of Indian cuisine while embracing modern culinary innovation.",
            vision:
              "To become the most beloved Indian restaurant in the city, known for authentic flavors, warm hospitality, and memorable dining experiences.",
            brandVoice: "warm",
            colors: {
              primary: "#e65c00",
              secondary: "#f9a602",
              accent: "#4a1e09",
            },
          },
        }

      case "profile":
        return {
          profileInfo: {
            about:
              "Experience the finest Indian culinary traditions at Spice Garden, where authentic spices meet contemporary presentation. Our skilled chefs craft each dish with care, using traditional techniques and the freshest ingredients to create memorable dining experiences.",
            concept:
              "Our restaurant concept centers around bringing authentic Indian flavors to modern diners, combining traditional cooking methods with contemporary service and ambiance.",
            philosophy:
              "We believe that great food brings people together. Every dish tells a story of tradition, passion, and the joy of sharing exceptional meals with loved ones.",
          },
        }

      case "features":
        return {
          featuresAmenities: {
            diningOptions: ["Dine-in", "Takeout", "Delivery", "Outdoor Seating"],
            amenities: ["Free WiFi", "Parking", "Air Conditioning", "Credit Cards", "Family Friendly"],
            paymentMethods: ["Cash", "Credit Cards", "Debit Cards", "UPI", "Digital Wallets"],
            atmosphere: ["Casual", "Family-friendly", "Romantic"],
          },
        }

      case "marketing":
        return {
          marketingInfo: {
            valueProposition:
              "Authentic Indian cuisine with modern flair, exceptional service, and a warm, welcoming atmosphere perfect for any occasion.",
            targetSegments: ["Families", "Young Professionals", "Food Enthusiasts", "Date Night Couples"],
            useCases: ["Family Dinners", "Date Nights", "Business Lunches", "Special Occasions", "Casual Dining"],
            useCaseAnalysis: {
              totalReviews: 1247,
              topUseCases: [
                { useCase: "Family Dinners", percentage: 34, mentions: 424 },
                { useCase: "Date Nights", percentage: 28, mentions: 349 },
                { useCase: "Business Lunches", percentage: 18, mentions: 224 },
                { useCase: "Special Occasions", percentage: 12, mentions: 150 },
                { useCase: "Casual Dining", percentage: 8, mentions: 100 },
              ],
            },
            uniqueSellingPoints: [
              "Authentic family recipes",
              "Fresh spices ground daily",
              "Vegetarian and vegan options",
              "Warm, welcoming atmosphere",
            ],
          },
        }

      case "media":
        return {
          mediaAssets: {
            restaurantPhotos: [
              {
                id: 1,
                name: "Restaurant Interior",
                url: "/placeholder.svg?height=200&width=300&text=Restaurant+Interior",
              },
              {
                id: 2,
                name: "Dining Area",
                url: "/placeholder.svg?height=200&width=300&text=Dining+Area",
              },
            ],
            foodPhotos: [
              {
                id: 3,
                name: "Signature Curry",
                url: "/placeholder.svg?height=200&width=300&text=Signature+Curry",
              },
              {
                id: 4,
                name: "Fresh Naan",
                url: "/placeholder.svg?height=200&width=300&text=Fresh+Naan",
              },
            ],
          },
        }

      default:
        return {}
    }
  }

  const generateCompleteProfile = () => {
    return {
      basicInfo: {
        restaurantName: restaurantData.restaurantName || "Spice Garden Restaurant",
        tagline: "Authentic Indian flavors with a modern twist",
        email: restaurantData.email || "contact@spicegarden.com",
        phone: restaurantData.phone || "+91 98765 43210",
        address: restaurantData.address || "123 Food Street, Koramangala, Bangalore 560034",
        cuisine: restaurantData.cuisine || "Indian",
        restaurantType: "Casual Dining",
        priceRange: "₹₹",
        socialMedia: {
          facebook: "https://facebook.com/spicegardenrestaurant",
          instagram: "https://instagram.com/spicegardenblr",
          twitter: "https://twitter.com/spicegarden",
          youtube: "",
          linkedin: "",
        },
      },
      brandAssets: {
        brandStory:
          "Founded in 2018 with a passion for authentic Indian cuisine, Spice Garden brings together traditional recipes passed down through generations with contemporary culinary techniques.",
        mission:
          "To provide an exceptional dining experience that celebrates the rich heritage of Indian cuisine while embracing modern culinary innovation.",
        vision:
          "To become the most beloved Indian restaurant in the city, known for authentic flavors, warm hospitality, and memorable dining experiences.",
        brandVoice: "warm",
        colors: {
          primary: "#e65c00",
          secondary: "#f9a602",
          accent: "#4a1e09",
        },
      },
      profileInfo: {
        about:
          "Experience the finest Indian culinary traditions at Spice Garden, where authentic spices meet contemporary presentation. Our skilled chefs craft each dish with care, using traditional techniques and the freshest ingredients to create memorable dining experiences.",
        concept:
          "Our restaurant concept centers around bringing authentic Indian flavors to modern diners, combining traditional cooking methods with contemporary service and ambiance.",
        philosophy:
          "We believe that great food brings people together. Every dish tells a story of tradition, passion, and the joy of sharing exceptional meals with loved ones.",
        chefProfile: {
          name: "Chef Rajesh Kumar",
          experience: "15+ years",
          background: "Trained in traditional Indian cooking with modern culinary techniques",
          specialties: ["North Indian", "Tandoor", "Regional Specialties"],
        },
      },
      featuresAmenities: {
        diningOptions: ["Dine-in", "Takeout", "Delivery", "Outdoor Seating"],
        amenities: ["Free WiFi", "Parking", "Air Conditioning", "Credit Cards", "Family Friendly"],
        paymentMethods: ["Cash", "Credit Cards", "Debit Cards", "UPI", "Digital Wallets"],
        atmosphere: ["Casual", "Family-friendly", "Romantic"],
        musicType: "background",
        dressCode: "casual",
      },
      marketingInfo: {
        valueProposition:
          "Authentic Indian cuisine with modern flair, exceptional service, and a warm, welcoming atmosphere perfect for any occasion.",
        targetSegments: ["Families", "Young Professionals", "Food Enthusiasts", "Date Night Couples"],
        useCases: ["Family Dinners", "Date Nights", "Business Lunches", "Special Occasions", "Casual Dining"],
        useCaseAnalysis: {
          totalReviews: 1247,
          topUseCases: [
            { useCase: "Family Dinners", percentage: 34, mentions: 424 },
            { useCase: "Date Nights", percentage: 28, mentions: 349 },
            { useCase: "Business Lunches", percentage: 18, mentions: 224 },
            { useCase: "Special Occasions", percentage: 12, mentions: 150 },
            { useCase: "Casual Dining", percentage: 8, mentions: 100 },
          ],
        },
        uniqueSellingPoints: [
          "Authentic family recipes",
          "Fresh spices ground daily",
          "Vegetarian and vegan options",
          "Warm, welcoming atmosphere",
        ],
      },
      mediaAssets: {
        restaurantPhotos: [
          {
            id: 1,
            name: "Restaurant Interior",
            url: "/placeholder.svg?height=200&width=300&text=Restaurant+Interior",
          },
          {
            id: 2,
            name: "Dining Area",
            url: "/placeholder.svg?height=200&width=300&text=Dining+Area",
          },
        ],
        foodPhotos: [
          {
            id: 3,
            name: "Signature Curry",
            url: "/placeholder.svg?height=200&width=300&text=Signature+Curry",
          },
          {
            id: 4,
            name: "Fresh Naan",
            url: "/placeholder.svg?height=200&width=300&text=Fresh+Naan",
          },
        ],
        kitchenPhotos: [],
        teamPhotos: [],
        videos: [],
      },
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] w-[95vw] flex flex-col bg-white overflow-hidden">
        <DialogHeader className="border-b border-gray-200 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-black flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-2">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                AI Profile Generation
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Creating your complete restaurant profile using {selectedPlatform} data
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isGenerating} className="hover:bg-gray-100">
              <X className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Progress Overview */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-black">Generation Progress</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200" />
          </div>

          {/* Current Step */}
          {isGenerating && currentStep < generationSteps.length && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-900">{generationSteps[currentStep]?.title}</h3>
                  <p className="text-xs text-blue-700">{generationSteps[currentStep]?.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Steps List */}
          <div className="space-y-3">
            {generationSteps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id)
              const isCurrent = currentStep === index && isGenerating
              const isPending = index > currentStep

              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    isCompleted
                      ? "border-green-200 bg-green-50"
                      : isCurrent
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isCompleted ? "bg-green-500" : isCurrent ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <step.icon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`text-sm font-medium ${
                        isCompleted ? "text-green-900" : isCurrent ? "text-blue-900" : "text-gray-600"
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p
                      className={`text-xs ${
                        isCompleted ? "text-green-700" : isCurrent ? "text-blue-700" : "text-gray-500"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                  {isCompleted && (
                    <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                      Complete
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>

          {/* Completion Message */}
          {progress === 100 && !isGenerating && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-sm font-medium text-green-900">Profile Generation Complete!</h3>
              </div>
              <p className="text-xs text-green-700">
                Your TableSalt profile has been successfully generated with comprehensive data from {selectedPlatform}.
                The profile includes use case analysis, brand assets, and optimized content.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {completedSteps.length} of {generationSteps.length} steps completed
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isGenerating}
                className="text-black border-gray-300 bg-transparent"
              >
                {isGenerating ? "Generating..." : "Close"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
