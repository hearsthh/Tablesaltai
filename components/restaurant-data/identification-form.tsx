"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Building, MapPin, Phone, Sparkles, Save, CheckCircle } from "lucide-react"

interface IdentificationFormProps {
  initialData?: {
    restaurantName: string
    address: string
    location: string
    restaurantPhoneNumber: string
  }
  onSave: (data: any) => void
  loading?: boolean
  completed?: boolean
}

export default function IdentificationForm({
  initialData,
  onSave,
  loading = false,
  completed = false,
}: IdentificationFormProps) {
  const [formData, setFormData] = useState({
    restaurantName: initialData?.restaurantName || "",
    address: initialData?.address || "",
    location: initialData?.location || "",
    restaurantPhoneNumber: initialData?.restaurantPhoneNumber || "",
  })

  const [aiAutoFill, setAiAutoFill] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.restaurantName.trim() || !formData.address.trim() || !formData.location.trim()) {
      toast({
        title: "Error",
        description: "Restaurant name, address, and PIN code are required",
        variant: "destructive",
      })
      return
    }

    // PIN code validation
    const pinRegex = /^\d{6}$/
    if (!pinRegex.test(formData.location)) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit PIN code",
        variant: "destructive",
      })
      return
    }

    try {
      await onSave({
        section: "identification",
        data: {
          identification: {
            restaurantName: formData.restaurantName.trim(),
            address: formData.address.trim(),
            location: formData.location.trim(),
            restaurantPhoneNumber: formData.restaurantPhoneNumber.trim(),
          },
        },
        autoFill: aiAutoFill,
      })

      toast({
        title: "Success",
        description: aiAutoFill
          ? "Identification saved and enhanced with AI"
          : "Identification information saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save identification information",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* AI Auto-fill Toggle */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm flex items-center text-gray-900">
                <Sparkles className="w-4 h-4 mr-2 text-gray-600" />
                AI Enhancement
              </CardTitle>
              <CardDescription className="text-xs text-gray-600">
                Auto-fill additional details based on restaurant name
              </CardDescription>
            </div>
            <Switch checked={aiAutoFill} onCheckedChange={setAiAutoFill} />
          </div>
        </CardHeader>
      </Card>

      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center text-gray-900">
                <Building className="w-5 h-5 mr-2 text-gray-600" />
                Restaurant Identification
              </CardTitle>
              <CardDescription className="text-gray-600">
                Basic identification details for your restaurant
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName" className="text-gray-700 font-medium">
                Restaurant Name *
              </Label>
              <Input
                id="restaurantName"
                className="border-gray-300 focus:border-gray-900"
                value={formData.restaurantName}
                onChange={(e) => setFormData((prev) => ({ ...prev, restaurantName: e.target.value }))}
                placeholder="Enter your restaurant name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-700 font-medium">
                Address *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="address"
                  className="pl-10 border-gray-300 focus:border-gray-900"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Complete address with landmark"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700 font-medium">
                PIN Code *
              </Label>
              <Input
                id="location"
                type="text"
                maxLength={6}
                className="border-gray-300 focus:border-gray-900"
                value={formData.location}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                  setFormData((prev) => ({ ...prev, location: value }))
                }}
                placeholder="123456"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurantPhoneNumber" className="text-gray-700 font-medium">
                Restaurant Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="restaurantPhoneNumber"
                  type="tel"
                  className="pl-10 border-gray-300 focus:border-gray-900"
                  value={formData.restaurantPhoneNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, restaurantPhoneNumber: e.target.value }))}
                  placeholder="+91 98765 43210"
                />
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
                  {aiAutoFill ? "Save & Enhance with AI" : "Save Identification"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
