"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { FIELD_OPTIONS } from "@/lib/types/restaurant-data"
import { Palette, Upload, Save, CheckCircle, ImageIcon } from "lucide-react"

interface BrandAssetsFormProps {
  initialData?: {
    logo: { url: string; fileName: string; fileSize: number } | null
    logoColors: string[]
    brandVoice: string
    positioning: string
  }
  onSave: (data: any) => void
  loading?: boolean
  completed?: boolean
}

export default function BrandAssetsForm({
  initialData,
  onSave,
  loading = false,
  completed = false,
}: BrandAssetsFormProps) {
  const [formData, setFormData] = useState({
    logo: initialData?.logo || null,
    logoColors: initialData?.logoColors || [],
    brandVoice: initialData?.brandVoice || "",
    positioning: initialData?.positioning || "",
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Error",
          description: "Logo file size should be less than 5MB",
          variant: "destructive",
        })
        return
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please upload an image file",
          variant: "destructive",
        })
        return
      }

      setLogoFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          logo: {
            url: e.target?.result as string,
            fileName: file.name,
            fileSize: file.size,
          },
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleLogoColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      logoColors: prev.logoColors.includes(color)
        ? prev.logoColors.filter((c) => c !== color)
        : [...prev.logoColors, color],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.brandVoice || !formData.positioning) {
      toast({
        title: "Error",
        description: "Brand voice and positioning are required",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real app, upload logo to storage service first
      let logoData = formData.logo
      if (logoFile) {
        // Simulate file upload
        logoData = {
          url: `/uploads/logos/${logoFile.name}`,
          fileName: logoFile.name,
          fileSize: logoFile.size,
        }
      }

      await onSave({
        section: "brandAssets",
        data: {
          brandAssets: {
            ...formData,
            logo: logoData,
          },
        },
      })

      toast({
        title: "Success",
        description: "Brand assets saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save brand assets",
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
              <Palette className="w-5 h-5 mr-2 text-gray-600" />
              Brand Assets
            </CardTitle>
            <CardDescription className="text-gray-600">
              Visual identity and brand elements for your restaurant
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
          {/* Logo Upload */}
          <div className="space-y-4">
            <Label className="text-gray-700 font-medium flex items-center">
              <ImageIcon className="w-4 h-4 mr-2" />
              Restaurant Logo
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {formData.logo ? (
                <div className="text-center">
                  <img
                    src={formData.logo.url || "/placeholder.svg"}
                    alt="Restaurant Logo"
                    className="mx-auto h-24 w-24 object-contain rounded"
                  />
                  <p className="mt-2 text-sm text-gray-600">{formData.logo.fileName}</p>
                  <p className="text-xs text-gray-500">{(formData.logo.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Upload your restaurant logo</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              )}
              <div className="mt-4 text-center">
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("logo-upload")?.click()}
                  className="border-gray-300 bg-transparent"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {formData.logo ? "Change Logo" : "Upload Logo"}
                </Button>
              </div>
            </div>
          </div>

          {/* Logo Colors */}
          <div className="space-y-4">
            <Label className="text-gray-700 font-medium">Logo Colors</Label>
            <div className="grid grid-cols-6 gap-3">
              {FIELD_OPTIONS.logoColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleLogoColor(color)}
                  className={`w-12 h-12 rounded-lg border-2 transition-all ${
                    formData.logoColors.includes(color)
                      ? "border-gray-900 scale-110"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            {formData.logoColors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.logoColors.map((color) => (
                  <div key={color} className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                    <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color }} />
                    <span className="text-gray-700">{color}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Brand Voice */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Brand Voice *</Label>
            <Select
              value={formData.brandVoice}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, brandVoice: value }))}
            >
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select brand voice" />
              </SelectTrigger>
              <SelectContent>
                {FIELD_OPTIONS.brandVoice.map((voice) => (
                  <SelectItem key={voice} value={voice}>
                    {voice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Positioning */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Positioning *</Label>
            <Select
              value={formData.positioning}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, positioning: value }))}
            >
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select positioning" />
              </SelectTrigger>
              <SelectContent>
                {FIELD_OPTIONS.positioning.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                Save Brand Assets
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
