"use client"

import type React from "react"

import { useState } from "react"
import { useMarketingStore } from "@/lib/store/marketing-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Plus } from "lucide-react"

interface CampaignFormProps {
  onSuccess?: () => void
}

export function CampaignForm({ onSuccess }: CampaignFormProps) {
  const addCampaign = useMarketingStore((state) => state.addCampaign)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    objective: "",
    description: "",
    budget: "",
    duration: "",
    platforms: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.name || !formData.type || !formData.objective || !formData.budget) {
        throw new Error("Please fill in all required fields")
      }

      // Calculate dates based on duration
      const startDate = new Date().toLocaleDateString()
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() // 30 days from now

      // Create campaign object
      const newCampaign = {
        name: formData.name,
        type: formData.type,
        budget: Number.parseInt(formData.budget),
        spent: 0,
        reach: "0",
        engagement: "0%",
        status: "draft" as const,
        startDate,
        endDate,
        description: formData.description,
        platforms: formData.platforms,
        objective: formData.objective,
      }

      // Add to store
      addCampaign(newCampaign)

      // Show success message
      toast({
        title: "Campaign Created",
        description: `${formData.name} has been created successfully.`,
      })

      // Reset form
      setFormData({
        name: "",
        type: "",
        objective: "",
        description: "",
        budget: "",
        duration: "",
        platforms: [],
      })

      // Call success callback
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create campaign",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      platforms: checked ? [...prev.platforms, platform] : prev.platforms.filter((p) => p !== platform),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="campaign-name">Campaign Name *</Label>
          <Input
            id="campaign-name"
            placeholder="e.g., Winter Menu Launch"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="campaign-type">Campaign Type *</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seasonal">Seasonal</SelectItem>
              <SelectItem value="organic">Organic</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="social">Social Media</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="campaign-objective">Campaign Objective *</Label>
        <Select
          value={formData.objective}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, objective: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select objective" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
            <SelectItem value="lead-generation">Lead Generation</SelectItem>
            <SelectItem value="conversions">Conversions</SelectItem>
            <SelectItem value="customer-retention">Customer Retention</SelectItem>
            <SelectItem value="engagement">Engagement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="campaign-description">Description</Label>
        <Textarea
          id="campaign-description"
          placeholder="Describe your campaign goals and target audience..."
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="campaign-budget">Budget (₹) *</Label>
          <Input
            id="campaign-budget"
            type="number"
            placeholder="25000"
            value={formData.budget}
            onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="campaign-duration">Duration</Label>
          <Select
            value={formData.duration}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-week">1 Week</SelectItem>
              <SelectItem value="2-weeks">2 Weeks</SelectItem>
              <SelectItem value="1-month">1 Month</SelectItem>
              <SelectItem value="3-months">3 Months</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Platforms</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {["Instagram", "Facebook", "Google", "YouTube", "Email", "WhatsApp"].map((platform) => (
            <div key={platform} className="flex items-center space-x-2">
              <Checkbox
                id={platform}
                checked={formData.platforms.includes(platform)}
                onCheckedChange={(checked) => handlePlatformChange(platform, checked as boolean)}
              />
              <Label htmlFor={platform} className="text-sm font-medium">
                {platform}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
