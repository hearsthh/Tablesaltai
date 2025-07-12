"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import RegistrationForm from "@/components/restaurant-data/registration-form"
import IdentificationForm from "@/components/restaurant-data/identification-form"
import InfoForm from "@/components/restaurant-data/info-form"
import BrandAssetsForm from "@/components/restaurant-data/brand-assets-form"
import MoreInfoForm from "@/components/restaurant-data/more-info-form"
import type { RestaurantData } from "@/lib/types/restaurant-data"
import { Database, CheckCircle, Clock, Save, Eye, Mail, Building, Info, Palette, FileText } from "lucide-react"

export default function RestaurantDataPage() {
  const [restaurantData, setRestaurantData] = useState<Partial<RestaurantData> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("registration")
  const { toast } = useToast()

  // Mock user ID - in real app, get from auth
  const userId = "user_123"

  useEffect(() => {
    fetchRestaurantData()
  }, [])

  const fetchRestaurantData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/restaurant-data?userId=${userId}`)
      const result = await response.json()

      if (result.success && result.data) {
        setRestaurantData(result.data)
      } else {
        // Initialize empty data structure
        setRestaurantData({
          id: `restaurant_${Date.now()}`,
          userId,
          registration: { emailId: "", mobileNo: "" },
          identification: { restaurantName: "", address: "", location: "", restaurantPhoneNumber: "" },
          info: {
            map: { latitude: 0, longitude: 0 },
            priceRange: "",
            cuisines: [],
            dietaryOptions: [],
            type: "",
            timings: {},
          },
          brandAssets: {
            logo: null,
            logoColors: [],
            brandVoice: "",
            positioning: "",
          },
          moreInfo: {
            chefIntro: "",
            conceptDescription: "",
            legacy: "",
            awardsRecognition: [],
            mediaCoverage: [],
            highlights: [],
            amenities: [],
            features: [],
          },
          completionStatus: {
            registration: false,
            identification: false,
            info: false,
            brandAssets: false,
            moreInfo: false,
            overall: 0,
          },
        })
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error)
      toast({
        title: "Error",
        description: "Failed to load restaurant data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveData = async (updateData: any) => {
    try {
      setSaving(true)

      const updatedData = {
        ...restaurantData,
        ...updateData.data,
        id: restaurantData?.id || `restaurant_${Date.now()}`,
        userId,
      }

      const response = await fetch("/api/restaurant-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantData: updatedData,
          section: updateData.section,
          autoFill: updateData.autoFill || false,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setRestaurantData(result.data)

        // Auto-advance to next incomplete section
        const nextSection = getNextIncompleteSection(result.data.completionStatus)
        if (nextSection) {
          setActiveTab(nextSection)
        }

        return result.data
      } else {
        throw new Error(result.error || "Failed to save data")
      }
    } catch (error) {
      console.error("Error saving data:", error)
      throw error
    } finally {
      setSaving(false)
    }
  }

  const getNextIncompleteSection = (completionStatus: any) => {
    const sections = ["registration", "identification", "info", "brandAssets", "moreInfo"]
    return sections.find((section) => !completionStatus[section])
  }

  const getSectionIcon = (section: string) => {
    switch (section) {
      case "registration":
        return Mail
      case "identification":
        return Building
      case "info":
        return Info
      case "brandAssets":
        return Palette
      case "moreInfo":
        return FileText
      default:
        return Database
    }
  }

  const getSectionStatus = (section: string) => {
    if (!restaurantData?.completionStatus) return "pending"
    return restaurantData.completionStatus[section as keyof typeof restaurantData.completionStatus]
      ? "complete"
      : "pending"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-96 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center">
                  <Database className="w-6 h-6 mr-2 text-gray-600" />
                  Restaurant Data
                </h1>
                <p className="text-sm text-gray-600">Complete your restaurant profile</p>
              </div>
              <Button variant="outline" size="sm" className="border-gray-300 bg-transparent">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Profile Completion</span>
                <span className="font-medium text-gray-900">{restaurantData?.completionStatus?.overall || 0}%</span>
              </div>
              <Progress value={restaurantData?.completionStatus?.overall || 0} className="h-2 bg-gray-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            {/* Mobile-First Tab Navigation */}
            <div className="overflow-x-auto">
              <TabsList className="grid grid-cols-5 w-max min-w-full bg-white border border-gray-200">
                {[
                  { id: "registration", label: "Register", icon: Mail },
                  { id: "identification", label: "Identity", icon: Building },
                  { id: "info", label: "Info", icon: Info },
                  { id: "brandAssets", label: "Brand", icon: Palette },
                  { id: "moreInfo", label: "Details", icon: FileText },
                ].map((tab) => {
                  const Icon = tab.icon
                  const status = getSectionStatus(tab.id)

                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex flex-col items-center space-y-1 p-3 data-[state=active]:bg-gray-100"
                    >
                      <div className="flex items-center space-x-1">
                        <Icon className="w-4 h-4" />
                        {status === "complete" && <CheckCircle className="w-3 h-3 text-green-600" />}
                        {status === "pending" && <Clock className="w-3 h-3 text-gray-400" />}
                      </div>
                      <span className="text-xs">{tab.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>

            {/* Section Status Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
              {[
                { id: "registration", label: "Registration" },
                { id: "identification", label: "Identification" },
                { id: "info", label: "Information" },
                { id: "brandAssets", label: "Brand Assets" },
                { id: "moreInfo", label: "More Info" },
              ].map((section) => {
                const status = getSectionStatus(section.id)
                const Icon = getSectionIcon(section.id)

                return (
                  <Card
                    key={section.id}
                    className={`border cursor-pointer transition-all ${
                      activeTab === section.id ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab(section.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-gray-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{section.label}</p>
                        </div>
                        {status === "complete" ? (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Form Sections */}
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-6">
                <TabsContent value="registration" className="mt-0">
                  <RegistrationForm
                    initialData={restaurantData?.registration}
                    onSave={saveData}
                    loading={saving}
                    completed={getSectionStatus("registration") === "complete"}
                  />
                </TabsContent>

                <TabsContent value="identification" className="mt-0">
                  <IdentificationForm
                    initialData={restaurantData?.identification}
                    onSave={saveData}
                    loading={saving}
                    completed={getSectionStatus("identification") === "complete"}
                  />
                </TabsContent>

                <TabsContent value="info" className="mt-0">
                  <InfoForm
                    initialData={restaurantData?.info}
                    onSave={saveData}
                    loading={saving}
                    completed={getSectionStatus("info") === "complete"}
                  />
                </TabsContent>

                <TabsContent value="brandAssets" className="mt-0">
                  <BrandAssetsForm
                    initialData={restaurantData?.brandAssets}
                    onSave={saveData}
                    loading={saving}
                    completed={getSectionStatus("brandAssets") === "complete"}
                  />
                </TabsContent>

                <TabsContent value="moreInfo" className="mt-0">
                  <MoreInfoForm
                    initialData={restaurantData?.moreInfo}
                    onSave={saveData}
                    loading={saving}
                    completed={getSectionStatus("moreInfo") === "complete"}
                  />
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>
      </div>

      {/* Completion Summary */}
      {restaurantData?.completionStatus?.overall === 100 && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  <h3 className="font-medium text-green-900">Profile Complete!</h3>
                  <p className="text-sm text-green-700">
                    Your restaurant data is now complete and ready for integration.
                  </p>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Publish
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
