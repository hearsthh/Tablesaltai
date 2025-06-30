"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Zap, Check, Copy, Sparkles, FileText, Clock, Users } from "lucide-react"
import React from "react"

interface ItemDescriptionsModalProps {
  isOpen: boolean
  onClose: () => void
  menuData: any
  onApplyDescriptions: (updatedItems: any[]) => void
}

interface GeneratedDescription {
  item: string
  original: string
  generated: string
  itemId: string
  tasteTags: string[]
  promoTags: string[]
}

const toneOptions = [
  { value: "exotic", label: "Exotic", icon: Sparkles, description: "Mysterious and adventurous" },
  { value: "formal", label: "Formal", icon: FileText, description: "Professional and elegant" },
  { value: "casual", label: "Casual", icon: Users, description: "Friendly and approachable" },
  { value: "young", label: "Young", icon: Clock, description: "Trendy and energetic" },
  { value: "custom", label: "Custom", icon: FileText, description: "Your own style" },
]

const lengthOptions = [
  { value: "short", label: "Short", description: "5-8 words", example: "Spicy grilled chicken with herbs" },
  {
    value: "medium",
    label: "Medium",
    description: "8-12 words",
    example: "Tender grilled chicken marinated in aromatic spices and fresh herbs",
  },
  {
    value: "long",
    label: "Long",
    description: "12-18 words",
    example:
      "Succulent grilled chicken pieces marinated overnight in aromatic spices, herbs, and traditional seasonings for maximum flavor",
  },
]

export default function ItemDescriptionsModal({
  isOpen,
  onClose,
  menuData,
  onApplyDescriptions,
}: ItemDescriptionsModalProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [tone, setTone] = useState("casual")
  const [customTone, setCustomTone] = useState("")
  const [length, setLength] = useState("medium")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDescriptions, setGeneratedDescriptions] = useState<GeneratedDescription[]>([])
  const [selectedForApply, setSelectedForApply] = useState<string[]>([])
  const [step, setStep] = useState<"configure" | "results">("configure")

  // Add null check and default value for menuData
  const safeMenuData = menuData || { categories: [] }

  // Get all items from menu with null safety
  const allItems =
    safeMenuData.categories?.flatMap(
      (category: any) =>
        category.items?.map((item: any) => ({
          ...item,
          categoryName: category.name,
        })) || [],
    ) || []

  // Initialize with all items selected when modal opens
  React.useEffect(() => {
    if (isOpen && selectedItems.length === 0 && allItems.length > 0) {
      setSelectedItems(allItems.map((item: any) => item.id))
    }
  }, [isOpen, allItems.length])

  // Early return if no menu data
  if (!menuData || !menuData.categories || menuData.categories.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>No Menu Data</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-600">No menu items available to generate descriptions for.</p>
            <Button onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const handleItemToggle = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleSelectAll = () => {
    setSelectedItems(allItems.map((item: any) => item.id))
  }

  const handleDeselectAll = () => {
    setSelectedItems([])
  }

  const handleGenerate = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one item to generate descriptions for.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const itemsToProcess = allItems.filter((item: any) => selectedItems.includes(item.id))

      const response = await fetch("/api/ai/item-descriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: itemsToProcess,
          tone: tone === "custom" ? customTone : tone,
          length: length,
          includeTags: true, // Add this line to request tag generation
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }

      const result = await response.json()

      if (result.success) {
        const descriptions = result.descriptions.map((desc: any) => ({
          ...desc,
          itemId: itemsToProcess.find((item: any) => item.name === desc.item)?.id || "",
          tasteTags: desc.tasteTags || [], // Include taste tags
          promoTags: desc.promoTags || [], // Include promo tags
        }))

        setGeneratedDescriptions(descriptions)
        setSelectedForApply(descriptions.map((desc: any) => desc.itemId))
        setStep("results")

        toast({
          title: "✅ Descriptions & Tags Generated!",
          description: `Generated ${descriptions.length} descriptions with tags using ${result.mode === "openai" ? "OpenAI GPT-3.5" : "Fallback system"}`,
        })
      } else {
        throw new Error(result.error || "Generation failed")
      }
    } catch (error) {
      console.error("Generation error:", error)
      toast({
        title: "❌ Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApply = () => {
    const descriptionsToApply = generatedDescriptions.filter((desc) => selectedForApply.includes(desc.itemId))

    if (descriptionsToApply.length === 0) {
      toast({
        title: "No Descriptions Selected",
        description: "Please select at least one description to apply.",
        variant: "destructive",
      })
      return
    }

    onApplyDescriptions(descriptionsToApply)

    toast({
      title: "✅ Descriptions Applied!",
      description: `Updated ${descriptionsToApply.length} menu items with new descriptions.`,
    })

    onClose()
    resetModal()
  }

  const resetModal = () => {
    setStep("configure")
    setSelectedItems([])
    setGeneratedDescriptions([])
    setSelectedForApply([])
    setTone("casual")
    setCustomTone("")
    setLength("medium")
  }

  const handleClose = () => {
    onClose()
    resetModal()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied to clipboard!" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            {step === "configure" ? "Generate Item Descriptions" : "Generated Descriptions"}
          </DialogTitle>
        </DialogHeader>

        {step === "configure" && (
          <div className="space-y-6">
            {/* Item Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-medium">
                  Select Items ({selectedItems.length}/{allItems.length})
                </Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                    Deselect All
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                <div className="grid gap-3">
                  {safeMenuData.categories.map((category: any) => (
                    <div key={category.id}>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">{category.name}</h4>
                      <div className="grid gap-2 ml-4">
                        {(category.items || []).map((item: any) => (
                          <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={item.id}
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => handleItemToggle(item.id)}
                            />
                            <label htmlFor={item.id} className="text-sm cursor-pointer flex-1">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-500 ml-2">${item.price.toFixed(2)}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Tone Selection */}
            <div>
              <Label className="text-base font-medium mb-3 block">Writing Tone</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {toneOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <div
                      key={option.value}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        tone === option.value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setTone(option.value)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{option.label}</span>
                      </div>
                      <p className="text-xs text-gray-600">{option.description}</p>
                    </div>
                  )
                })}
              </div>

              {tone === "custom" && (
                <div className="mt-3">
                  <Label htmlFor="customTone" className="text-sm">
                    Custom Tone Description
                  </Label>
                  <Textarea
                    id="customTone"
                    placeholder="Describe the writing style you want (e.g., 'sophisticated and luxurious', 'fun and playful', etc.)"
                    value={customTone}
                    onChange={(e) => setCustomTone(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* Length Selection */}
            <div>
              <Label className="text-base font-medium mb-3 block">Description Length</Label>
              <div className="grid gap-3">
                {lengthOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      length === option.value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setLength(option.value)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{option.label}</span>
                      <Badge variant="outline">{option.description}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 italic">"{option.example}"</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={isGenerating || selectedItems.length === 0}>
                {isGenerating ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Descriptions ({selectedItems.length} items)
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "results" && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Generated {generatedDescriptions.length} descriptions • Tone:{" "}
                  <span className="font-medium">{tone === "custom" ? customTone : tone}</span> • Length:{" "}
                  <span className="font-medium">{length}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setStep("configure")}>
                  Back to Configure
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const allDescriptions = generatedDescriptions
                      .map((desc) => `${desc.item}: ${desc.generated}`)
                      .join("\n\n")
                    copyToClipboard(allDescriptions)
                  }}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy All
                </Button>
              </div>
            </div>

            {/* Apply Selection */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="font-medium">
                  Select descriptions to apply ({selectedForApply.length}/{generatedDescriptions.length})
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedForApply(generatedDescriptions.map((desc) => desc.itemId))}
                  >
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedForApply([])}>
                    Deselect All
                  </Button>
                </div>
              </div>
            </div>

            {/* Generated Descriptions */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {generatedDescriptions.map((desc, index) => {
                const item = allItems.find((item) => item.id === desc.itemId)
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedForApply.includes(desc.itemId)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedForApply((prev) => [...prev, desc.itemId])
                            } else {
                              setSelectedForApply((prev) => prev.filter((id) => id !== desc.itemId))
                            }
                          }}
                        />
                        <div>
                          <h4 className="font-medium">{desc.item}</h4>
                          <p className="text-sm text-gray-500">
                            {item?.categoryName} • ${item?.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(desc.generated)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-500">ORIGINAL</Label>
                        <p className="text-sm text-gray-700">{desc.original}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-green-600">ENHANCED</Label>
                        <p className="text-sm font-medium text-gray-900">{desc.generated}</p>
                        {(desc.tasteTags?.length > 0 || desc.promoTags?.length > 0) && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {desc.tasteTags?.map((tag: string) => (
                              <span key={tag} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                            {desc.promoTags?.map((tag: string) => (
                              <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleApply} disabled={selectedForApply.length === 0}>
                <Check className="w-4 h-4 mr-2" />
                Apply Selected ({selectedForApply.length})
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
