"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { FIELD_OPTIONS } from "@/lib/types/restaurant-data"
import { FileText, ChefHat, Award, Star, Utensils, Save, CheckCircle, Plus, X } from "lucide-react"

interface MoreInfoFormProps {
  initialData?: {
    chefIntro: string
    conceptDescription: string
    legacy: string
    awardsRecognition: string[]
    mediaCoverage: string[]
    highlights: string[]
    amenities: string[]
    features: string[]
  }
  onSave: (data: any) => void
  loading?: boolean
  completed?: boolean
}

export default function MoreInfoForm({ initialData, onSave, loading = false, completed = false }: MoreInfoFormProps) {
  const [formData, setFormData] = useState({
    chefIntro: initialData?.chefIntro || "",
    conceptDescription: initialData?.conceptDescription || "",
    legacy: initialData?.legacy || "",
    awardsRecognition: initialData?.awardsRecognition || [],
    mediaCoverage: initialData?.mediaCoverage || [],
    highlights: initialData?.highlights || [],
    amenities: initialData?.amenities || [],
    features: initialData?.features || [],
  })

  const [newItems, setNewItems] = useState({
    award: "",
    media: "",
    highlight: "",
    customAmenity: "",
    customFeature: "",
  })

  const { toast } = useToast()

  const addItem = (field: keyof typeof formData, value: string) => {
    if (value.trim() && Array.isArray(formData[field])) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()],
      }))
    }
  }

  const removeItem = (field: keyof typeof formData, index: number) => {
    if (Array.isArray(formData[field])) {
      setFormData((prev) => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((_, i) => i !== index),
      }))
    }
  }

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const toggleFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.conceptDescription.trim()) {
      toast({
        title: "Error",
        description: "Concept/Description is required",
        variant: "destructive",
      })
      return
    }

    try {
      await onSave({
        section: "moreInfo",
        data: {
          moreInfo: formData,
        },
      })

      toast({
        title: "Success",
        description: "Additional information saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save additional information",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center text-gray-900">
              <FileText className="w-5 h-5 mr-2 text-gray-600" />
              Additional Information
            </CardTitle>
            <CardDescription className="text-gray-600">
              Detailed information about your restaurant's story and offerings
            </CardDescription>
          </div>
          {completed && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-1" />
              <span className="text-sm font-medium">Complete</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Chef Introduction */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium flex items-center">
              <ChefHat className="w-4 h-4 mr-2" />
              Chef Introduction
            </Label>
            <Textarea
              value={formData.chefIntro}
              onChange={(e) => setFormData((prev) => ({ ...prev, chefIntro: e.target.value }))}
              placeholder="Tell us about your chef and their culinary journey..."
              rows={4}
              className="border-gray-300 focus:border-gray-900 resize-none"
            />
          </div>

          {/* Concept/Description */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Concept/Description *</Label>
            <Textarea
              value={formData.conceptDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, conceptDescription: e.target.value }))}
              placeholder="Describe your restaurant's concept, atmosphere, and what makes it unique..."
              rows={5}
              className="border-gray-300 focus:border-gray-900 resize-none"
              required
            />
          </div>

          {/* Legacy */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Legacy</Label>
            <Textarea
              value={formData.legacy}
              onChange={(e) => setFormData((prev) => ({ ...prev, legacy: e.target.value }))}
              placeholder="Share your restaurant's history, traditions, and heritage..."
              rows={4}
              className="border-gray-300 focus:border-gray-900 resize-none"
            />
          </div>

          {/* Awards & Recognition */}
          <div className="space-y-4">
            <Label className="text-gray-700 font-medium flex items-center">
              <Award className="w-4 h-4 mr-2" />
              Awards & Recognition
            </Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.awardsRecognition.map((award, index) => (
                <Badge key={index} variant="secondary" className="bg-yellow-50 border-yellow-300 text-yellow-800">
                  <Award className="w-3 h-3 mr-1" />
                  {award}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem("awardsRecognition", index)}
                    className="ml-1 h-auto p-0 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newItems.award}
                onChange={(e) => setNewItems((prev) => ({ ...prev, award: e.target.value }))}
                placeholder="Add award or recognition"
                className="flex-1 border-gray-300 focus:border-gray-900"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addItem("awardsRecognition", newItems.award)
                    setNewItems((prev) => ({ ...prev, award: "" }))
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  addItem("awardsRecognition", newItems.award)
                  setNewItems((prev) => ({ ...prev, award: "" }))
                }}
                variant="outline"
                size="sm"
                className="border-gray-300 bg-transparent"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Media Coverage */}
          <div className="space-y-4">
            <Label className="text-gray-700 font-medium">Media Coverage</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.mediaCoverage.map((media, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-50 border-blue-300 text-blue-800">
                  {media}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem("mediaCoverage", index)}
                    className="ml-1 h-auto p-0 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newItems.media}
                onChange={(e) => setNewItems((prev) => ({ ...prev, media: e.target.value }))}
                placeholder="Add media coverage"
                className="flex-1 border-gray-300 focus:border-gray-900"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addItem("mediaCoverage", newItems.media)
                    setNewItems((prev) => ({ ...prev, media: "" }))
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  addItem("mediaCoverage", newItems.media)
                  setNewItems((prev) => ({ ...prev, media: "" }))
                }}
                variant="outline"
                size="sm"
                className="border-gray-300 bg-transparent"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-4">
            <Label className="text-gray-700 font-medium flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Highlights
            </Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.highlights.map((highlight, index) => (
                <Badge key={index} variant="secondary" className="bg-green-50 border-green-300 text-green-800">
                  <Star className="w-3 h-3 mr-1" />
                  {highlight}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem("highlights", index)}
                    className="ml-1 h-auto p-0 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newItems.highlight}
                onChange={(e) => setNewItems((prev) => ({ ...prev, highlight: e.target.value }))}
                placeholder="Add restaurant highlight"
                className="flex-1 border-gray-300 focus:border-gray-900"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addItem("highlights", newItems.highlight)
                    setNewItems((prev) => ({ ...prev, highlight: "" }))
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  addItem("highlights", newItems.highlight)
                  setNewItems((prev) => ({ ...prev, highlight: "" }))
                }}
                variant="outline"
                size="sm"
                className="border-gray-300 bg-transparent"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <Label className="text-gray-700 font-medium flex items-center">
              <Utensils className="w-4 h-4 mr-2" />
              Amenities
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FIELD_OPTIONS.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Switch
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  <Label className="text-sm text-gray-700">{amenity}</Label>
                </div>
              ))}
            </div>

            {/* Custom Amenities */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Custom Amenities</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.amenities
                  .filter((amenity) => !FIELD_OPTIONS.amenities.includes(amenity))
                  .map((amenity, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
                      {amenity}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            amenities: prev.amenities.filter((a) => a !== amenity),
                          }))
                        }}
                        className="ml-1 h-auto p-0 hover:bg-transparent"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newItems.customAmenity}
                  onChange={(e) => setNewItems((prev) => ({ ...prev, customAmenity: e.target.value }))}
                  placeholder="Add custom amenity"
                  className="flex-1 border-gray-300 focus:border-gray-900"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      if (newItems.customAmenity.trim()) {
                        toggleAmenity(newItems.customAmenity.trim())
                        setNewItems((prev) => ({ ...prev, customAmenity: "" }))
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (newItems.customAmenity.trim()) {
                      toggleAmenity(newItems.customAmenity.trim())
                      setNewItems((prev) => ({ ...prev, customAmenity: "" }))
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 bg-transparent"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <Label className="text-gray-700 font-medium">Features</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FIELD_OPTIONS.features.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Switch
                    checked={formData.features.includes(feature)}
                    onCheckedChange={() => toggleFeature(feature)}
                  />
                  <Label className="text-sm text-gray-700">{feature}</Label>
                </div>
              ))}
            </div>

            {/* Custom Features */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Custom Features</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.features
                  .filter((feature) => !FIELD_OPTIONS.features.includes(feature))
                  .map((feature, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
                      {feature}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            features: prev.features.filter((f) => f !== feature),
                          }))
                        }}
                        className="ml-1 h-auto p-0 hover:bg-transparent"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newItems.customFeature}
                  onChange={(e) => setNewItems((prev) => ({ ...prev, customFeature: e.target.value }))}
                  placeholder="Add custom feature"
                  className="flex-1 border-gray-300 focus:border-gray-900"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      if (newItems.customFeature.trim()) {
                        toggleFeature(newItems.customFeature.trim())
                        setNewItems((prev) => ({ ...prev, customFeature: "" }))
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (newItems.customFeature.trim()) {
                      toggleFeature(newItems.customFeature.trim())
                      setNewItems((prev) => ({ ...prev, customFeature: "" }))
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 bg-transparent"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Additional Info
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
