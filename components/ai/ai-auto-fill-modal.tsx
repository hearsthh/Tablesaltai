"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
  Users,
  Star,
  Gift,
  ThumbsUp,
  ImageIcon,
  Database,
  Zap,
  Globe,
  FileText,
  Clock,
  AlertCircle,
} from "lucide-react"

interface AIAutoFillModalProps {
  isOpen: boolean
  onClose: () => void
  onAutoFill: (config: any) => Promise<void>
  restaurantData: any
  connectedPlatforms: string[]
}

export default function AIAutoFillModal({
  isOpen,
  onClose,
  onAutoFill,
  restaurantData,
  connectedPlatforms,
}: AIAutoFillModalProps) {
  const [selectedTabs, setSelectedTabs] = useState(["basic", "brand", "profile"])
  const [autoFillConfig, setAutoFillConfig] = useState({
    useConnectedData: true,
    fetchMedia: true,
    generateMissingContent: true,
    preserveExisting: true,
    enhanceExisting: false,
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState("")
  const [progress, setProgress] = useState(0)

  const tabOptions = [
    {
      id: "basic",
      name: "Basic Information",
      description: "Restaurant name, contact details, hours, location",
      icon: Building,
      estimatedFields: 12,
      dataSource: "Google My Business, Zomato",
    },
    {
      id: "brand",
      name: "Brand Assets",
      description: "Logo, colors, brand story, mission, vision",
      icon: Palette,
      estimatedFields: 8,
      dataSource: "Website, Social Media",
    },
    {
      id: "profile",
      name: "Profile Content",
      description: "About section, concept, history, chef profile",
      icon: Users,
      estimatedFields: 10,
      dataSource: "Website, Reviews, AI Generation",
    },
    {
      id: "features",
      name: "Features & Amenities",
      description: "Dining options, amenities, payment methods",
      icon: Star,
      estimatedFields: 15,
      dataSource: "Platform Data, AI Analysis",
    },
    {
      id: "rewards",
      name: "Rewards Program",
      description: "Loyalty program details and benefits",
      icon: Gift,
      estimatedFields: 6,
      dataSource: "AI Suggestions",
    },
    {
      id: "marketing",
      name: "Marketing Info",
      description: "Target segments, value proposition, USPs",
      icon: ThumbsUp,
      estimatedFields: 8,
      dataSource: "AI Analysis, Reviews",
    },
    {
      id: "media",
      name: "Media Assets",
      description: "Photos, videos, gallery images",
      icon: ImageIcon,
      estimatedFields: 20,
      dataSource: "Google Photos, Social Media",
    },
  ]

  const processingSteps = [
    { name: "Connecting to platforms", icon: Globe, duration: 2000 },
    { name: "Fetching restaurant data", icon: Database, duration: 3000 },
    { name: "Analyzing content", icon: Zap, duration: 2500 },
    { name: "Generating missing content", icon: Sparkles, duration: 4000 },
    { name: "Processing media assets", icon: ImageIcon, duration: 3500 },
    { name: "Finalizing profile", icon: FileText, duration: 1500 },
  ]

  const handleTabToggle = (tabId: string) => {
    setSelectedTabs((prev) => (prev.includes(tabId) ? prev.filter((id) => id !== tabId) : [...prev, tabId]))
  }

  const handleAutoFill = async () => {
    if (selectedTabs.length === 0) {
      toast({
        title: "Select Sections",
        description: "Please select at least one section to auto-fill.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      // Simulate processing steps
      for (let i = 0; i < processingSteps.length; i++) {
        const step = processingSteps[i]
        setProcessingStep(step.name)

        // Animate progress for this step
        const stepProgress = ((i + 1) / processingSteps.length) * 100
        const startProgress = (i / processingSteps.length) * 100

        // Gradually increase progress during this step
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            const newProgress = prev + 2
            if (newProgress >= stepProgress) {
              clearInterval(progressInterval)
              return stepProgress
            }
            return newProgress
          })
        }, step.duration / 50)

        await new Promise((resolve) => setTimeout(resolve, step.duration))
        clearInterval(progressInterval)
        setProgress(stepProgress)
      }

      const config = {
        selectedTabs,
        autoFillConfig,
        connectedPlatforms,
        restaurantData,
      }

      await onAutoFill(config)

      toast({
        title: "Smart Fill Complete! ✨",
        description: `Successfully filled ${selectedTabs.length} sections with AI-powered data`,
      })

      onClose()
    } catch (error) {
      console.error("Auto-fill error:", error)
      toast({
        title: "Smart Fill Failed",
        description: "Failed to auto-fill profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
      setProcessingStep("")
    }
  }

  const getTotalEstimatedFields = () => {
    return selectedTabs.reduce((total, tabId) => {
      const tab = tabOptions.find((t) => t.id === tabId)
      return total + (tab?.estimatedFields || 0)
    }, 0)
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
      <DialogContent className="max-w-4xl max-h-[95vh] w-[95vw] flex flex-col bg-white overflow-hidden">
        <DialogHeader className="border-b border-gray-200 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-black flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                  <Wand2 className="w-4 h-4 text-white" />
                </div>
                Smart Fill Profile
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Automatically fill your profile sections using AI and connected platform data
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
              <X className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
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
                      <h3 className={`font-medium ${hasRequiredConnections() ? "text-green-900" : "text-orange-900"}`}>
                        {hasRequiredConnections() ? "Platforms Connected" : "Limited Platform Access"}
                      </h3>
                      <p className={`text-sm ${hasRequiredConnections() ? "text-green-700" : "text-orange-700"}`}>
                        {hasRequiredConnections()
                          ? `${getConnectedPlatformCount()} platforms connected for enhanced data fetching`
                          : "Connect more platforms for better auto-fill results"}
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
                    {!hasRequiredConnections() && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-orange-700 border-orange-300 hover:bg-orange-100 bg-transparent"
                        onClick={() => {
                          // Navigate to integrations page
                          window.open("/profile/integrations", "_blank")
                        }}
                      >
                        <ImageIcon className="w-3 h-3 mr-1" />
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Section Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-black">Select Sections to Fill</h3>
                  <div className="text-sm text-gray-600">
                    {selectedTabs.length} sections • ~{getTotalEstimatedFields()} fields
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tabOptions.map((tab) => (
                    <Card
                      key={tab.id}
                      className={`border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedTabs.includes(tab.id)
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleTabToggle(tab.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              selectedTabs.includes(tab.id) ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <tab.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-black">{tab.name}</h4>
                              {selectedTabs.includes(tab.id) && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{tab.description}</p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">~{tab.estimatedFields} fields</span>
                              <span className="text-gray-500">{tab.dataSource}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Configuration Options */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-black">Smart Fill Options</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Configure how the auto-fill process should work
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-black">Use Connected Platform Data</Label>
                          <p className="text-xs text-gray-600">Fetch data from connected platforms</p>
                        </div>
                        <Switch
                          checked={autoFillConfig.useConnectedData}
                          onCheckedChange={(checked) =>
                            setAutoFillConfig({ ...autoFillConfig, useConnectedData: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-black">Fetch Media Assets</Label>
                          <p className="text-xs text-gray-600">Download photos and videos</p>
                        </div>
                        <Switch
                          checked={autoFillConfig.fetchMedia}
                          onCheckedChange={(checked) => setAutoFillConfig({ ...autoFillConfig, fetchMedia: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-black">Generate Missing Content</Label>
                          <p className="text-xs text-gray-600">AI creates content for empty fields</p>
                        </div>
                        <Switch
                          checked={autoFillConfig.generateMissingContent}
                          onCheckedChange={(checked) =>
                            setAutoFillConfig({ ...autoFillConfig, generateMissingContent: checked })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-black">Preserve Existing Data</Label>
                          <p className="text-xs text-gray-600">Keep current data, only fill empty fields</p>
                        </div>
                        <Switch
                          checked={autoFillConfig.preserveExisting}
                          onCheckedChange={(checked) =>
                            setAutoFillConfig({ ...autoFillConfig, preserveExisting: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-black">Enhance Existing Content</Label>
                          <p className="text-xs text-gray-600">Improve existing content with AI</p>
                        </div>
                        <Switch
                          checked={autoFillConfig.enhanceExisting}
                          onCheckedChange={(checked) =>
                            setAutoFillConfig({ ...autoFillConfig, enhanceExisting: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card className="bg-gray-50 border border-gray-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-black mb-3">Smart Fill Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Sections to Fill</div>
                      <div className="font-medium text-black">{selectedTabs.length} sections</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Estimated Fields</div>
                      <div className="font-medium text-black">~{getTotalEstimatedFields()} fields</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Data Sources</div>
                      <div className="font-medium text-black">{getConnectedPlatformCount()} platforms + AI</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Processing View */
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Smart Fill in Progress</h3>
                <p className="text-sm text-gray-600">
                  AI is analyzing and filling your profile sections with relevant data
                </p>
              </div>

              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-black">Overall Progress</span>
                      <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />

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
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Processing Your Data</h4>
                      <p className="text-xs text-blue-700 mt-1">
                        This may take a few moments as we fetch and analyze data from multiple sources to create the
                        best possible profile for your restaurant.
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
          <div className="border-t border-gray-200 p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedTabs.length > 0 && (
                  <span>
                    Ready to fill {selectedTabs.length} sections with ~{getTotalEstimatedFields()} fields
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={onClose} className="text-black border-gray-300 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleAutoFill}
                  disabled={selectedTabs.length === 0}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Start Smart Fill
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
