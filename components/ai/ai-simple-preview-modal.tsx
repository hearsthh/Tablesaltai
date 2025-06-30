"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, ExternalLink, Share2 } from "lucide-react"

interface AISimplePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  profileData: any
  onPublish: () => void
}

export function AISimplePreviewModal({ isOpen, onClose, profileData, onPublish }: AISimplePreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <span>Profile Preview</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-black">{profileData.restaurantName || "Your Restaurant Name"}</h1>
            {profileData.tagline && <p className="text-lg text-gray-600">{profileData.tagline}</p>}
            <div className="flex justify-center space-x-2">
              {profileData.cuisine && <Badge variant="outline">{profileData.cuisine}</Badge>}
              {profileData.priceRange && <Badge variant="outline">{profileData.priceRange}</Badge>}
            </div>
          </div>

          {/* Description */}
          {profileData.description && (
            <div className="space-y-2">
              <h3 className="font-semibold text-black">About Us</h3>
              <p className="text-gray-700">{profileData.description}</p>
            </div>
          )}

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileData.address && (
              <div>
                <h4 className="font-medium text-black mb-1">Address</h4>
                <p className="text-sm text-gray-600">{profileData.address}</p>
              </div>
            )}
            {profileData.phone && (
              <div>
                <h4 className="font-medium text-black mb-1">Phone</h4>
                <p className="text-sm text-gray-600">{profileData.phone}</p>
              </div>
            )}
          </div>

          {/* Features & Amenities */}
          {(profileData.features.length > 0 || profileData.amenities.length > 0) && (
            <div className="space-y-3">
              <h3 className="font-semibold text-black">Features & Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.features.map((feature: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {feature}
                  </Badge>
                ))}
                {profileData.amenities.map((amenity: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Operating Hours */}
          <div className="space-y-3">
            <h3 className="font-semibold text-black">Operating Hours</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {Object.entries(profileData.hours).map(([day, hours]: [string, any]) => (
                <div key={day} className="flex justify-between">
                  <span className="capitalize text-gray-700">{day}</span>
                  <span className="text-black">{hours.closed ? "Closed" : `${hours.open} - ${hours.close}`}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Story & Values */}
          {(profileData.story || profileData.values) && (
            <div className="space-y-3">
              {profileData.story && (
                <div>
                  <h4 className="font-medium text-black mb-2">Our Story</h4>
                  <p className="text-sm text-gray-700">{profileData.story}</p>
                </div>
              )}
              {profileData.values && (
                <div>
                  <h4 className="font-medium text-black mb-2">Our Values</h4>
                  <p className="text-sm text-gray-700">{profileData.values}</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Close Preview
            </Button>
            <Button onClick={onPublish} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Publish Profile
            </Button>
            <Button variant="outline" className="px-3 bg-transparent">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
