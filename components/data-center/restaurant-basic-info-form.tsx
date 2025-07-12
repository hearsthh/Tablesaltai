"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Building, MapPin, Phone, Mail, Globe, Sparkles, Save, Plus, X, Utensils } from "lucide-react"

interface RestaurantBasicInfoFormProps {
  initialData?: any
  onSave: (data: any) => void
  loading?: boolean
}

const CUISINE_TYPES = [
  "Italian",
  "Chinese",
  "Indian",
  "Mexican",
  "Japanese",
  "Thai",
  "French",
  "American",
  "Mediterranean",
  "Korean",
  "Vietnamese",
  "Greek",
  "Spanish",
  "Lebanese",
  "Turkish",
  "Brazilian",
  "Fusion",
  "Other",
]

const RESTAURANT_TYPES = [
  "Fine Dining",
  "Casual Dining",
  "Fast Casual",
  "Quick Service",
  "Food Truck",
  "Cafe",
  "Bakery",
  "Bar & Grill",
  "Buffet",
  "Catering",
]

const PRICE_RANGES = [
  { value: "$", label: "$ - Budget Friendly" },
  { value: "$$", label: "$$ - Moderate" },
  { value: "$$$", label: "$$$ - Upscale" },
  { value: "$$$$", label: "$$$$ - Fine Dining" },
]

export default function RestaurantBasicInfoForm({
  initialData,
  onSave,
  loading = false,
}: RestaurantBasicInfoFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    tagline: initialData?.tagline || "",
    description: initialData?.description || "",
    cuisineTypes: initialData?.cuisineTypes || [],
    restaurantType: initialData?.restaurantType || "",
    priceRange: initialData?.priceRange || "",
    establishedYear: initialData?.establishedYear || "",
    capacity: initialData?.capacity || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    website: initialData?.website || "",
    address: {
      line1: initialData?.address?.line1 || "",
      line2: initialData?.address?.line2 || "",
      city: initialData?.address?.city || "",
      state: initialData?.address?.state || "",
      postalCode: initialData?.address?.postalCode || "",
      country: initialData?.address?.country || "India",
    },
  })

  const [aiAutoFill, setAiAutoFill] = useState(false)
  const [newCuisine, setNewCuisine] = useState("")
  const { toast } = useToast()

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateAddress = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }))
  }

  const addCuisineType = () => {
    if (newCuisine.trim() && !formData.cuisineTypes.includes(newCuisine.trim())) {
      setFormData((prev) => ({
        ...prev,
        cuisineTypes: [...prev.cuisineTypes, newCuisine.trim()],
      }))
      setNewCuisine("")
    }
  }

  const removeCuisineType = (cuisine: string) => {
    setFormData((prev) => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.filter((c) => c !== cuisine),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Restaurant name is required",
        variant: "destructive",
      })
      return
    }

    try {
      await onSave({
        ...formData,
        autoFill: aiAutoFill,
      })

      toast({
        title: "Success",
        description: aiAutoFill
          ? "Restaurant information saved and enhanced with AI"
          : "Restaurant information saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save restaurant information",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Auto-fill Toggle */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center text-gray-900">
                <Sparkles className="w-5 h-5 mr-2 text-gray-600" />
                AI Enhancement
              </CardTitle>
              <CardDescription className="text-gray-600">
                Let AI help fill in missing information based on your description
              </CardDescription>
            </div>
            <Switch checked={aiAutoFill} onCheckedChange={setAiAutoFill} />
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-gray-900">
              <Building className="w-5 h-5 mr-2 text-gray-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Restaurant Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="Enter restaurant name"
                className="border-gray-300 focus:border-gray-900"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline" className="text-gray-700 font-medium">
                Tagline
              </Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => updateFormData("tagline", e.target.value)}
                placeholder="A catchy tagline for your restaurant"
                className="border-gray-300 focus:border-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700 font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Describe your restaurant, cuisine, and atmosphere..."
                rows={4}
                className="border-gray-300 focus:border-gray-900 resize-none"
              />
              {aiAutoFill && (
                <p className="text-xs text-gray-500">AI will use this description to enhance other fields</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="establishedYear" className="text-gray-700 font-medium">
                  Established Year
                </Label>
                <Input
                  id="establishedYear"
                  type="number"
                  value={formData.establishedYear}
                  onChange={(e) => updateFormData("establishedYear", e.target.value)}
                  placeholder="2020"
                  className="border-gray-300 focus:border-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-gray-700 font-medium">
                  Seating Capacity
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => updateFormData("capacity", e.target.value)}
                  placeholder="50"
                  className="border-gray-300 focus:border-gray-900"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cuisine & Type */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-gray-900">
              <Utensils className="w-5 h-5 mr-2 text-gray-600" />
              Cuisine & Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Cuisine Types</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.cuisineTypes.map((cuisine, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">
                    {cuisine}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCuisineType(cuisine)}
                      className="ml-1 h-auto p-0 hover:bg-transparent"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Select value={newCuisine} onValueChange={setNewCuisine}>
                  <SelectTrigger className="flex-1 border-gray-300">
                    <SelectValue placeholder="Select cuisine type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CUISINE_TYPES.filter((c) => !formData.cuisineTypes.includes(c)).map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={addCuisineType}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 bg-transparent"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="restaurantType" className="text-gray-700 font-medium">
                  Restaurant Type *
                </Label>
                <Select
                  value={formData.restaurantType}
                  onValueChange={(value) => updateFormData("restaurantType", value)}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESTAURANT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceRange" className="text-gray-700 font-medium">
                  Price Range *
                </Label>
                <Select value={formData.priceRange} onValueChange={(value) => updateFormData("priceRange", value)}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_RANGES.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-gray-900">
              <Phone className="w-5 h-5 mr-2 text-gray-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10 border-gray-300 focus:border-gray-900"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="restaurant@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    className="pl-10 border-gray-300 focus:border-gray-900"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-gray-700 font-medium">
                Website
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="website"
                  type="url"
                  className="pl-10 border-gray-300 focus:border-gray-900"
                  value={formData.website}
                  onChange={(e) => updateFormData("website", e.target.value)}
                  placeholder="https://yourrestaurant.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-gray-900">
              <MapPin className="w-5 h-5 mr-2 text-gray-600" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="addressLine1" className="text-gray-700 font-medium">
                Address Line 1 *
              </Label>
              <Input
                id="addressLine1"
                value={formData.address.line1}
                onChange={(e) => updateAddress("line1", e.target.value)}
                placeholder="Street address"
                className="border-gray-300 focus:border-gray-900"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine2" className="text-gray-700 font-medium">
                Address Line 2
              </Label>
              <Input
                id="addressLine2"
                value={formData.address.line2}
                onChange={(e) => updateAddress("line2", e.target.value)}
                placeholder="Apartment, suite, etc."
                className="border-gray-300 focus:border-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-gray-700 font-medium">
                  City *
                </Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => updateAddress("city", e.target.value)}
                  placeholder="City"
                  className="border-gray-300 focus:border-gray-900"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-gray-700 font-medium">
                  State *
                </Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => updateAddress("state", e.target.value)}
                  placeholder="State"
                  className="border-gray-300 focus:border-gray-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-gray-700 font-medium">
                  Postal Code *
                </Label>
                <Input
                  id="postalCode"
                  value={formData.address.postalCode}
                  onChange={(e) => updateAddress("postalCode", e.target.value)}
                  placeholder="123456"
                  className="border-gray-300 focus:border-gray-900"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-gray-700 font-medium">
                  Country *
                </Label>
                <Input
                  id="country"
                  value={formData.address.country}
                  onChange={(e) => updateAddress("country", e.target.value)}
                  placeholder="India"
                  className="border-gray-300 focus:border-gray-900"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4">
          <Button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {aiAutoFill ? "Save & Enhance with AI" : "Save Information"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
