"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Sparkles, Target, X, Plus } from "lucide-react"
import type { MarketingStrategy } from "@/lib/types/marketing-system"
import { format } from "date-fns"

interface StrategyBuilderProps {
  isOpen: boolean
  onClose: () => void
  onCreateStrategy: (data: Partial<MarketingStrategy>) => void
  onGenerateAIStrategy: (goal: string) => void
}

export function StrategyBuilder({ isOpen, onClose, onCreateStrategy, onGenerateAIStrategy }: StrategyBuilderProps) {
  const [formData, setFormData] = useState({
    title: "",
    goal: "",
    objectiveTags: [] as string[],
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    linkedEntities: {
      menuIds: [] as string[],
      offerIds: [] as string[],
      reviewIds: [] as string[],
      customerTags: [] as string[],
    },
  })

  const [newTag, setNewTag] = useState("")
  const [isAIMode, setIsAIMode] = useState(false)

  const predefinedGoals = [
    "Increase weekday footfall",
    "Promote new menu items",
    "Re-engage churned customers",
    "Boost customer reviews",
    "Increase average order value",
    "Drive weekend reservations",
    "Launch loyalty program",
    "Seasonal promotion campaign",
  ]

  const commonTags = [
    "footfall",
    "reviews",
    "AOV",
    "retention",
    "acquisition",
    "menu",
    "seasonal",
    "loyalty",
    "social_media",
    "email",
  ]

  const handleAddTag = () => {
    if (newTag && !formData.objectiveTags.includes(newTag)) {
      setFormData((prev) => ({
        ...prev,
        objectiveTags: [...prev.objectiveTags, newTag],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      objectiveTags: prev.objectiveTags.filter((t) => t !== tag),
    }))
  }

  const handleSubmit = () => {
    if (isAIMode && formData.goal) {
      onGenerateAIStrategy(formData.goal)
    } else {
      onCreateStrategy(formData)
    }
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      goal: "",
      objectiveTags: [],
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      linkedEntities: {
        menuIds: [],
        offerIds: [],
        reviewIds: [],
        customerTags: [],
      },
    })
    setIsAIMode(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span>Create Marketing Strategy</span>
          </DialogTitle>
          <DialogDescription>Define your high-level marketing goals and let AI help you execute them</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* AI Mode Toggle */}
          <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Button
              variant={!isAIMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAIMode(false)}
              className={!isAIMode ? "bg-gray-900 text-white" : "bg-white"}
            >
              Manual Setup
            </Button>
            <Button
              variant={isAIMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAIMode(true)}
              className={isAIMode ? "bg-blue-600 text-white" : "bg-white"}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              AI Assistant
            </Button>
          </div>

          {isAIMode ? (
            /* AI Mode */
            <div className="space-y-4">
              <div>
                <Label>What's your marketing goal?</Label>
                <Select
                  value={formData.goal}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, goal: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a goal for AI to help with" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedGoals.map((goal) => (
                      <SelectItem key={goal} value={goal.toLowerCase().replace(/\s+/g, "_")}>
                        {goal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">AI Will Generate:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Complete strategy framework</li>
                      <li>• 3-5 targeted campaigns</li>
                      <li>• Content suggestions for each channel</li>
                      <li>• Automated task scheduling</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Manual Mode */
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Strategy Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Q4 Customer Retention Strategy"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="goal">Marketing Goal</Label>
                <Textarea
                  id="goal"
                  value={formData.goal}
                  onChange={(e) => setFormData((prev) => ({ ...prev, goal: e.target.value }))}
                  placeholder="Describe what you want to achieve with this strategy..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label>Objective Tags</Label>
                <div className="mt-1 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {commonTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={formData.objectiveTags.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          formData.objectiveTags.includes(tag) ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          if (formData.objectiveTags.includes(tag)) {
                            handleRemoveTag(tag)
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              objectiveTags: [...prev.objectiveTags, tag],
                            }))
                          }
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add custom tag"
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={handleAddTag} className="bg-white">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {formData.objectiveTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formData.objectiveTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800">
                          {tag}
                          <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal mt-1 bg-white">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.startDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => date && setFormData((prev) => ({ ...prev, startDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal mt-1 bg-white">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.endDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => date && setFormData((prev) => ({ ...prev, endDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="bg-white">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.goal}
              className={
                isAIMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-900 hover:bg-gray-800 text-white"
              }
            >
              {isAIMode ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Strategy
                </>
              ) : (
                "Create Strategy"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
