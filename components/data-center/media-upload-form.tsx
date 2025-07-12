"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Upload, Video, X, Plus, Sparkles, Camera, FileImage, Tag } from "lucide-react"

interface MediaUploadFormProps {
  restaurantId: string
  onUploadComplete: (mediaAsset: any) => void
}

const MEDIA_CATEGORIES = [
  {
    value: "food",
    label: "Food & Dishes",
    subcategories: ["appetizers", "mains", "desserts", "beverages", "specials"],
  },
  { value: "interior", label: "Interior", subcategories: ["dining_area", "bar", "kitchen", "private_rooms", "decor"] },
  { value: "exterior", label: "Exterior", subcategories: ["facade", "signage", "patio", "parking", "entrance"] },
  { value: "staff", label: "Staff & Team", subcategories: ["chef", "servers", "management", "team_photos"] },
  { value: "events", label: "Events", subcategories: ["parties", "celebrations", "live_music", "special_occasions"] },
  { value: "menu", label: "Menu", subcategories: ["menu_boards", "digital_menu", "specials_board"] },
  { value: "logo", label: "Logo & Branding", subcategories: ["logo", "business_cards", "signage", "merchandise"] },
]

const ASPECT_RATIOS = [
  { value: "1:1", label: "Square (1:1)" },
  { value: "4:3", label: "Standard (4:3)" },
  { value: "16:9", label: "Widescreen (16:9)" },
  { value: "9:16", label: "Portrait (9:16)" },
  { value: "custom", label: "Custom" },
]

export default function MediaUploadForm({ restaurantId, onUploadComplete }: MediaUploadFormProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [aiAutoTag, setAiAutoTag] = useState(true)
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    title: "",
    description: "",
    tags: [] as string[],
    isFeatured: false,
  })
  const [newTag, setNewTag] = useState("")
  const { toast } = useToast()

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || [])
      const validFiles = selectedFiles.filter((file) => {
        const isImage = file.type.startsWith("image/")
        const isVideo = file.type.startsWith("video/")
        const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit

        if (!isImage && !isVideo) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a valid image or video file`,
            variant: "destructive",
          })
          return false
        }

        if (!isValidSize) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds 10MB limit`,
            variant: "destructive",
          })
          return false
        }

        return true
      })

      setFiles((prev) => [...prev, ...validFiles])
    },
    [toast],
  )

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload",
        variant: "destructive",
      })
      return
    }

    if (!formData.category) {
      toast({
        title: "Category required",
        description: "Please select a category for your media",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const uploadPromises = files.map(async (file) => {
        const uploadFormData = new FormData()
        uploadFormData.append("file", file)
        uploadFormData.append("restaurantId", restaurantId)
        uploadFormData.append("autoTag", aiAutoTag.toString())
        uploadFormData.append("category", formData.category)
        uploadFormData.append("subcategory", formData.subcategory)
        uploadFormData.append("title", formData.title || file.name)
        uploadFormData.append("description", formData.description)
        uploadFormData.append("tags", JSON.stringify(formData.tags))
        uploadFormData.append("isFeatured", formData.isFeatured.toString())

        const response = await fetch("/api/data-center/media", {
          method: "POST",
          body: uploadFormData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        return response.json()
      })

      const results = await Promise.all(uploadPromises)

      results.forEach((result) => {
        if (result.success) {
          onUploadComplete(result.data)
        }
      })

      toast({
        title: "Upload successful",
        description: `${files.length} file(s) uploaded successfully${aiAutoTag ? " and auto-tagged with AI" : ""}`,
      })

      // Reset form
      setFiles([])
      setFormData({
        category: "",
        subcategory: "",
        title: "",
        description: "",
        tags: [],
        isFeatured: false,
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const selectedCategory = MEDIA_CATEGORIES.find((cat) => cat.value === formData.category)

  return (
    <div className="space-y-6">
      {/* AI Auto-tagging Toggle */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center text-gray-900">
                <Sparkles className="w-5 h-5 mr-2 text-gray-600" />
                AI Auto-Tagging
              </CardTitle>
              <CardDescription className="text-gray-600">
                Automatically categorize and tag your media using AI
              </CardDescription>
            </div>
            <Switch checked={aiAutoTag} onCheckedChange={setAiAutoTag} />
          </div>
        </CardHeader>
      </Card>

      {/* File Upload */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center text-gray-900">
            <Upload className="w-5 h-5 mr-2 text-gray-600" />
            Upload Media
          </CardTitle>
          <CardDescription className="text-gray-600">Upload images and videos for your restaurant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Click to upload files</p>
              <p className="text-sm text-gray-600">PNG, JPG, GIF, MP4 up to 10MB each</p>
            </label>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Selected Files</Label>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {file.type.startsWith("image/") ? (
                        <FileImage className="w-5 h-5 text-gray-600" />
                      ) : (
                        <Video className="w-5 h-5 text-gray-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media Information */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center text-gray-900">
            <Tag className="w-5 h-5 mr-2 text-gray-600" />
            Media Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-700 font-medium">
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value, subcategory: "" }))}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {MEDIA_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategory && (
              <div className="space-y-2">
                <Label htmlFor="subcategory" className="text-gray-700 font-medium">
                  Subcategory
                </Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, subcategory: value }))}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory.subcategories.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 font-medium">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter a title for your media"
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
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your media..."
              rows={3}
              className="border-gray-300 focus:border-gray-900 resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(tag)}
                    className="ml-1 h-auto p-0 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="border-gray-300 focus:border-gray-900"
                onKeyPress={(e) => e.key === "Enter" && addTag()}
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                size="sm"
                className="border-gray-300 bg-transparent"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {aiAutoTag && (
              <p className="text-xs text-gray-500">AI will automatically add relevant tags based on image content</p>
            )}
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-700 font-medium">Featured Media</Label>
              <p className="text-sm text-gray-600">Mark as featured content</p>
            </div>
            <Switch
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isFeatured: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Upload Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4">
        <Button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload {files.length} File{files.length !== 1 ? "s" : ""}
              {aiAutoTag && " with AI Tagging"}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
