"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { FIELD_OPTIONS, DAYS_OF_WEEK } from "@/lib/types/restaurant-data"
import { Info, MapPin, DollarSign, Utensils, Clock, Save, CheckCircle, Plus, X } from "lucide-react"

interface InfoFormProps {
  initialData?: {
    map: { latitude: number; longitude: number }
    priceRange: string
    cuisines: string[]
    dietaryOptions: string[]
    type: string
    timings: Record<string, { isOpen: boolean; openTime: string; closeTime: string }>
  }
  onSave: (data: any) => void
  loading?: boolean
  completed?: boolean
}

export default function InfoForm({ initialData, onSave, loading = false, completed = false }: InfoFormProps) {
  const [formData, setFormData] = useState({
    map: initialData?.map || { latitude: 0, longitude: 0 },
    priceRange: initialData?.priceRange || "",
    cuisines: initialData?.cuisines || [],
    dietaryOptions: initialData?.dietaryOptions || [],
    type: initialData?.type || "",
    timings:
      initialData?.timings ||
      DAYS_OF_WEEK.reduce(
        (acc, day) => ({
          ...acc,
          [day.key]: { isOpen: true, openTime: "09:00", closeTime: "22:00" },
        }),
        {},
      ),
  })

  const [newCuisine, setNewCuisine] = useState("")
  const [locationInput, setLocationInput] = useState("")
  const { toast } = useToast()

  const addCuisine = (cuisine: string) => {
    if (cuisine && !formData.cuisines.includes(cuisine)) {
      setFormData((prev) => ({
        ...prev,
        cuisines: [...prev.cuisines, cuisine],
      }))
    }
  }

  const removeCuisine = (cuisine: string) => {
    setFormData((prev) => ({
      ...prev,
      cuisines: prev.cuisines.filter((c) => c !== cuisine),
    }))
  }

  const toggleDietaryOption = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      dietaryOptions: prev.dietaryOptions.includes(option)
        ? prev.dietaryOptions.filter((o) => o !== option)
        : [...prev.dietaryOptions, option],
    }))
  }

  const updateTiming = (day: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      timings: {
        ...prev.timings,
        [day]: {
          ...prev.timings[day],
          [field]: value,
        },
      },
    }))
  }

  const handleLocationSearch = async () => {
    if (!locationInput.trim()) return

    try {
      // Simple geocoding simulation - in real app, use Google Maps API
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(locationInput)}&key=YOUR_API_KEY`,
      )
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry
        setFormData((prev) => ({
          ...prev,
          map: { latitude: lat, longitude: lng },
        }))
        toast({
          title: "Location Found",
          description: "Coordinates updated successfully",
        })
      }
    } catch (error) {
      // Fallback to manual entry
      toast({
        title: "Location Search",
        description: "Please enter coordinates manually",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.priceRange || !formData.cuisines.length || !formData.type) {
      toast({
        title: "Error",
        description: "Price range, at least one cuisine, and restaurant type are required",
        variant: "destructive",
      })
      return
    }

    try {
      await onSave({
        section: "info",
        data: {
          info: formData,
        },
        autoFill: true, // Auto-generate highlights based on cuisines
      })

      toast({
        title: "Success",
        description: "Restaurant information saved successfully",
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
    <Card className="border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center text-gray-900">
              <Info className="w-5 h-5 mr-2 text-gray-600" />
              Restaurant Information
            </CardTitle>
            <CardDescription className="text-gray-600">Detailed information about your restaurant</CardDescription>
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
          {/* Map Location */}
          <div className="space-y-4">
            <Label className="text-gray-700 font-medium flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Location Coordinates
            </Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Search address or enter manually"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="flex-1 border-gray-300 focus:border-gray-900"
              />
              <Button
                type="button"
                onClick={handleLocationSearch}
                variant="outline"
                className="border-gray-300 bg-transparent"
              >
                Search
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-sm text-gray-600">
                  Latitude
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.map.latitude}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      map: { ...prev.map, latitude: Number.parseFloat(e.target.value) || 0 },
                    }))
                  }
                  className="border-gray-300 focus:border-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-sm text-gray-600">
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.map.longitude}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      map: { ...prev.map, longitude: Number.parseFloat(e.target.value) || 0 },
                    }))
                  }
                  className="border-gray-300 focus:border-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Price Range *
            </Label>
            <Select
              value={formData.priceRange}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, priceRange: value }))}
            >
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                {FIELD_OPTIONS.priceRange.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cuisines */}
          <div className="space-y-4">
            <Label className="text-gray-700 font-medium flex items-center">
              <Utensils className="w-4 h-4 mr-2" />
              Cuisines *
            </Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.cuisines.map((cuisine, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">
                  {cuisine}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCuisine(cuisine)}
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
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OPTIONS.cuisines
                    .filter((c) => !formData.cuisines.includes(c))
                    .map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={() => {
                  addCuisine(newCuisine)
                  setNewCuisine("")
                }}
                variant="outline"
                size="sm"
                className="border-gray-300 bg-transparent"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Dietary Options */}
          <div className="space-y-4">
            <Label className="text-gray-700 font-medium">Dietary Options</Label>
            <div className="grid grid-cols-2 gap-3">
              {FIELD_OPTIONS.dietaryOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Switch
                    checked={formData.dietaryOptions.includes(option)}
                    onCheckedChange={() => toggleDietaryOption(option)}
                  />
                  <Label className="text-sm text-gray-700">{option}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Restaurant Type */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Restaurant Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select restaurant type" />
              </SelectTrigger>
              <SelectContent>
                {FIELD_OPTIONS.restaurantType.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Operating Hours */}
          <div className="space-y-4">
            <Label className="text-gray-700 font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Operating Hours
            </Label>
            <div className="space-y-3">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day.key}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  <div className="w-full sm:w-24">
                    <Label className="font-medium text-gray-700">{day.label}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.timings[day.key]?.isOpen}
                      onCheckedChange={(checked) => updateTiming(day.key, "isOpen", checked)}
                    />
                    <Label className="text-sm text-gray-600">Open</Label>
                  </div>
                  {formData.timings[day.key]?.isOpen && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={formData.timings[day.key]?.openTime || "09:00"}
                        onChange={(e) => updateTiming(day.key, "openTime", e.target.value)}
                        className="w-32 border-gray-300 focus:border-gray-900"
                      />
                      <span className="text-gray-500">to</span>
                      <Input
                        type="time"
                        value={formData.timings[day.key]?.closeTime || "22:00"}
                        onChange={(e) => updateTiming(day.key, "closeTime", e.target.value)}
                        className="w-32 border-gray-300 focus:border-gray-900"
                      />
                    </div>
                  )}
                  {!formData.timings[day.key]?.isOpen && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                      Closed
                    </Badge>
                  )}
                </div>
              ))}
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
                Save Restaurant Info
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
