"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Wand2,
  Loader2,
  CheckCircle,
  X,
  Sparkles,
  Building,
  Palette,
  Star,
  ImageIcon,
  AlertCircle,
  Database,
  Zap,
  Globe,
  Link,
} from "lucide-react"

interface AIAutoFillModalProps {
  isOpen: boolean
  onClose: () => void
  onAutoFill: (config: any) => Promise<void>
  restaurantData: any
  connectedPlatforms: string[]
}

function AIAutoFillModal({ isOpen, onClose, onAutoFill, restaurantData, connectedPlatforms }: AIAutoFillModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState("")
  const [progress, setProgress] = useState(0)

  const processingSteps = [
    { name: "Connecting to platforms", icon: Globe, duration: 1200 },
    { name: "Fetching restaurant data", icon: Database, duration: 1800 },
    { name: "Analyzing content", icon: Zap, duration: 1500 },
    { name: "Generating profile content", icon: Sparkles, duration: 2200 },
    { name: "Processing media assets", icon: ImageIcon, duration: 1800 },
    { name: "Creating preview link", icon: Link, duration: 800 },
  ]

  const handleAutoFill = async () => {
    setIsProcessing(true)
    setProgress(0)

    try {
      // Simulate processing steps
      for (let i = 0; i < processingSteps.length; i++) {
        const step = processingSteps[i]
        setProcessingStep(step.name)

        // Animate progress for this step
        const stepProgress = ((i + 1) / processingSteps.length) * 100

        // Gradually increase progress during this step
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            const newProgress = prev + 4
            if (newProgress >= stepProgress) {
              clearInterval(progressInterval)
              return stepProgress
            }
            return newProgress
          })
        }, step.duration / 25)

        await new Promise((resolve) => setTimeout(resolve, step.duration))
        clearInterval(progressInterval)
        setProgress(stepProgress)
      }

      const config = {
        connectedPlatforms,
        restaurantData,
      }

      await onAutoFill(config)
      onClose()
    } catch (error) {
      console.error("Auto-fill error:", error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
      setProcessingStep("")
    }
  }

  const getConnectedPlatformCount = () => {
    return connectedPlatforms.length
  }

  const hasRequiredConnections = () => {
    return connectedPlatforms.some(
      (platform) =>
        platform.toLowerCase().includes("google") ||
        platform.toLowerCase().includes("zomato") ||
        platform.toLowerCase().includes("swiggy"),
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] w-[95vw] flex flex-col bg-white overflow-hidden">
        <DialogHeader className="border-b border-gray-200 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg sm:text-xl font-bold text-black flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                  <Wand2 className="w-4 h-4 text-white" />
                </div>
                AI Profile Generator
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Automatically create your complete restaurant profile using AI
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
              <X className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!isProcessing ? (
            <div className="space-y-6">
              {/* Connection Status */}
              <Card
                className={`border ${hasRequiredConnections() ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {hasRequiredConnections() ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                    )}
                    <div className="flex-1">
                      <h3
                        className={`font-medium text-sm sm:text-base ${hasRequiredConnections() ? "text-green-900" : "text-orange-900"}`}
                      >
                        {hasRequiredConnections() ? "Platforms Connected" : "Limited Platform Access"}
                      </h3>
                      <p
                        className={`text-xs sm:text-sm ${hasRequiredConnections() ? "text-green-700" : "text-orange-700"}`}
                      >
                        {hasRequiredConnections()
                          ? `${getConnectedPlatformCount()} platforms connected for enhanced data fetching`
                          : "Connect more platforms for better results"}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {connectedPlatforms.map((platform) => (
                          <Badge
                            key={platform}
                            className={`text-xs ${hasRequiredConnections() ? "bg-green-100 text-green-800 border-green-200" : "bg-orange-100 text-orange-800 border-orange-200"}`}
                          >
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What will be generated */}
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <h3 className="font-medium text-black mb-4 text-sm sm:text-base">AI will generate:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Building className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Basic Information</p>
                        <p className="text-xs text-blue-700">Name, description, contact details</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <Palette className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-purple-900">Brand Assets</p>
                        <p className="text-xs text-purple-700">Colors, story, values</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <Star className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Features & Amenities</p>
                        <p className="text-xs text-green-700">Services and facilities</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <ImageIcon className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-orange-900">Media Assets</p>
                        <p className="text-xs text-orange-700">Photos and social media</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="bg-gray-50 border border-gray-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-black mb-3 text-sm sm:text-base">Why use AI Generation?</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs sm:text-sm text-gray-700">Complete profile in under 2 minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs sm:text-sm text-gray-700">
                        Professional content optimized for discovery
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs sm:text-sm text-gray-700">Instant preview link for sharing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs sm:text-sm text-gray-700">
                        Easy to edit and customize after generation
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Processing View */
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Generating Your Profile</h3>
                <p className="text-sm text-gray-600">
                  AI is creating your complete restaurant profile with professional content
                </p>
              </div>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-black">Overall Progress</span>
                      <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />

                    <div className="space-y-3">
                      {processingSteps.map((step, index) => {
                        const stepProgress = ((index + 1) / processingSteps.length) * 100
                        const isCompleted = progress >= stepProgress
                        const isActive = processingStep === step.name

                        return (
                          <div key={index} className="flex items-center space-x-3">
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : isActive ? (
                              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                            ) : (
                              <div className="w-4 h-4 border border-gray-300 rounded-full" />
                            )}
                            <step.icon
                              className={`w-4 h-4 ${isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-400"}`}
                            />
                            <span
                              className={`text-sm ${isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-600"}`}
                            >
                              {step.name}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Creating Your Digital Presence</h4>
                      <p className="text-xs text-blue-700 mt-1">
                        We're generating professional content and creating a shareable preview link for your restaurant
                        profile.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isProcessing && (
          <div className="border-t border-gray-200 p-4 sm:p-6 flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                <span>Ready to generate your complete restaurant profile</span>
              </div>
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="text-black border-gray-300 bg-transparent flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAutoFill}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex-1 sm:flex-none"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Profile
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AIAutoFillModal
