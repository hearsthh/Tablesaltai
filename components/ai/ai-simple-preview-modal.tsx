"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Clock,
  Star,
  CheckCircle,
  Award,
  Loader2,
  Share2,
  Edit,
  ExternalLink,
} from "lucide-react"

interface ProfileData {
  restaurantName: string
  tagline: string
  description: string
  cuisine: string
  priceRange: string
  address: string
  phone: string
  email: string
  website: string
  brandColors: {
    primary: string
    secondary: string
  }
  features: string[]
  amenities: string[]
  socialMedia: {
    instagram: string
    facebook: string
    twitter: string
    youtube: string
  }
  mediaAssets?: {
    foodPhotos: string[]
    restaurantPhotos: string[]
    kitchenPhotos: string[]
    menuPhotos: string[]
  }
  hours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  story: string
  values: string
  awards: string
}

interface AISimplePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  profileData: ProfileData
  onPublish: () => void
}

function AISimplePreviewModal({ isOpen, onClose, profileData, onPublish }: AISimplePreviewModalProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [activeTab, setActiveTab] = useState<"preview" | "edit">("preview")

  const handlePublish = async () => {
    setIsPublishing(true)

    // Simulate publishing process
    setTimeout(() => {
      setIsPublishing(false)
      onPublish()
    }, 2000)
  }

  const formatTime = (time: string) => {
    if (!time) return ""
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getTodayHours = () => {
    const today = new Date()
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const todayName = dayNames[today.getDay()]

    const hours = profileData.hours[todayName]

    if (!hours || hours.closed) return "Closed"
    return `${formatTime(hours.open)} - ${formatTime(hours.close)}`
  }

  const getOperatingStatus = () => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const todayName = dayNames[now.getDay()]

    const hours = profileData.hours[todayName]

    if (!hours || hours.closed) return { status: "Closed", color: "text-red-600" }

    const openTime = Number.parseInt(hours.open.split(":")[0]) * 60 + Number.parseInt(hours.open.split(":")[1])
    const closeTime = Number.parseInt(hours.close.split(":")[0]) * 60 + Number.parseInt(hours.close.split(":")[1])

    if (currentTime >= openTime && currentTime <= closeTime) {
      return { status: "Open Now", color: "text-green-600" }
    }

    return { status: "Closed", color: "text-red-600" }
  }

  const operatingStatus = getOperatingStatus()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] w-[95vw] flex flex-col bg-white overflow-hidden">
        <DialogHeader className="border-b border-gray-200 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg sm:text-xl font-bold text-black">Profile Preview</DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Review your restaurant profile before publishing
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
              <X className="w-4 h-4 text-gray-600" />
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 mt-4">
            <Button
              variant={activeTab === "preview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("preview")}
              className={activeTab === "preview" ? "bg-black text-white" : "text-gray-600"}
            >
              Preview
            </Button>
            <Button
              variant={activeTab === "edit" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("edit")}
              className={activeTab === "edit" ? "bg-black text-white" : "text-gray-600"}
            >
              <Edit className="w-3 h-3 mr-1" />
              Quick Edit
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {activeTab === "preview" ? (
            <ScrollArea className="h-full w-full">
              <div className="p-4 sm:p-6">
                {/* Restaurant Profile Preview */}
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Header Section */}
                  <div className="relative">
                    {/* Cover Image */}
                    <div
                      className="h-48 sm:h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-4"
                      style={{
                        background: profileData.brandColors?.primary
                          ? `linear-gradient(135deg, ${profileData.brandColors.primary}20, ${profileData.brandColors.secondary || profileData.brandColors.primary}20)`
                          : "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
                      }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                        <div className="text-center text-white">
                          <h1 className="text-2xl sm:text-4xl font-bold mb-2">
                            {profileData.restaurantName || "Restaurant Name"}
                          </h1>
                          {profileData.tagline && (
                            <p className="text-sm sm:text-lg opacity-90">{profileData.tagline}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Info Bar */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                      {profileData.cuisine && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">{profileData.cuisine}</Badge>
                      )}
                      {profileData.priceRange && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">{profileData.priceRange}</Badge>
                      )}
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-600" />
                        <span className={`text-xs sm:text-sm font-medium ${operatingStatus.color}`}>
                          {operatingStatus.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs sm:text-sm text-gray-600">4.5 (120 reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* About Section */}
                      {profileData.description && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">About</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                              {profileData.description}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Features & Amenities */}
                      {(profileData.features?.length > 0 || profileData.amenities?.length > 0) && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Features & Amenities</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {profileData.features?.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-sm mb-2">Features</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {profileData.features.map((feature, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                                        {feature}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {profileData.amenities?.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-sm mb-2">Amenities</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {profileData.amenities.map((amenity, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        <CheckCircle className="w-3 h-3 mr-1 text-blue-600" />
                                        {amenity}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Story & Values */}
                      {(profileData.story || profileData.values) && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Our Story</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {profileData.story && (
                              <div>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                  {profileData.story}
                                </p>
                              </div>
                            )}
                            {profileData.values && (
                              <div>
                                <h4 className="font-medium text-sm mb-2">Our Values</h4>
                                <p className="text-sm text-gray-700 leading-relaxed">{profileData.values}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Awards */}
                      {profileData.awards && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <Award className="w-5 h-5 mr-2 text-yellow-600" />
                              Awards & Recognition
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{profileData.awards}</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Right Column - Contact & Hours */}
                    <div className="space-y-6">
                      {/* Contact Information */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {profileData.address && (
                            <div className="flex items-start space-x-3">
                              <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{profileData.address}</span>
                            </div>
                          )}
                          {profileData.phone && (
                            <div className="flex items-center space-x-3">
                              <Phone className="w-4 h-4 text-gray-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{profileData.phone}</span>
                            </div>
                          )}
                          {profileData.email && (
                            <div className="flex items-center space-x-3">
                              <Mail className="w-4 h-4 text-gray-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{profileData.email}</span>
                            </div>
                          )}
                          {profileData.website && (
                            <div className="flex items-center space-x-3">
                              <Globe className="w-4 h-4 text-gray-600 flex-shrink-0" />
                              <span className="text-sm text-blue-600">{profileData.website}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Operating Hours */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Hours</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(profileData.hours || {}).map(([day, hours]) => (
                              <div key={day} className="flex justify-between items-center text-sm">
                                <span className="capitalize font-medium">{day}</span>
                                <span className="text-gray-600">
                                  {hours.closed ? "Closed" : `${formatTime(hours.open)} - ${formatTime(hours.close)}`}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Today</span>
                              <span className={`text-sm font-medium ${operatingStatus.color}`}>{getTodayHours()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Social Media */}
                      {(profileData.socialMedia?.instagram ||
                        profileData.socialMedia?.facebook ||
                        profileData.socialMedia?.twitter ||
                        profileData.socialMedia?.youtube) && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Follow Us</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {profileData.socialMedia?.instagram && (
                                <div className="flex items-center space-x-3">
                                  <Instagram className="w-4 h-4 text-pink-600" />
                                  <span className="text-sm text-gray-700">{profileData.socialMedia.instagram}</span>
                                </div>
                              )}
                              {profileData.socialMedia?.facebook && (
                                <div className="flex items-center space-x-3">
                                  <Facebook className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm text-gray-700">{profileData.socialMedia.facebook}</span>
                                </div>
                              )}
                              {profileData.socialMedia?.twitter && (
                                <div className="flex items-center space-x-3">
                                  <Twitter className="w-4 h-4 text-blue-400" />
                                  <span className="text-sm text-gray-700">{profileData.socialMedia.twitter}</span>
                                </div>
                              )}
                              {profileData.socialMedia?.youtube && (
                                <div className="flex items-center space-x-3">
                                  <Youtube className="w-4 h-4 text-red-600" />
                                  <span className="text-sm text-gray-700">{profileData.socialMedia.youtube}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            /* Quick Edit Tab */
            <ScrollArea className="h-full w-full">
              <div className="p-4 sm:p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Edit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Make quick changes to your profile. For detailed editing, close this preview and use the main
                        form.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Restaurant Name</label>
                          <input
                            type="text"
                            value={profileData.restaurantName || ""}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Tagline</label>
                          <input
                            type="text"
                            value={profileData.tagline || ""}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            value={profileData.description || ""}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm h-24"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-700">
                          <strong>Note:</strong> This is a preview mode. To make actual changes, close this preview and
                          edit in the main form.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 sm:p-6 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-xs bg-transparent">
                <Share2 className="w-3 h-3 mr-1" />
                Share Preview
              </Button>
              <Button variant="outline" size="sm" className="text-xs bg-transparent">
                <ExternalLink className="w-3 h-3 mr-1" />
                Open in New Tab
              </Button>
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={onClose}
                className="text-black border-gray-300 bg-transparent flex-1 sm:flex-none"
              >
                Close
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isPublishing}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex-1 sm:flex-none"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save & Publish
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AISimplePreviewModal
