"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Sparkles, Wand2 } from "lucide-react"

export interface ProfileConfig {
  brandPositioning: "casual" | "premium" | "family" | "trendy"
  contentStyle: "professional" | "friendly" | "storytelling" | "minimal"
  includeHistory: boolean
  includeAwards: boolean
  focusOnCuisine: boolean
  emphasizeService: boolean
}

interface AIProfileConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (config: ProfileConfig) => void
  isGenerating: boolean
}

export function AIProfileConfigModal({ isOpen, onClose, onGenerate, isGenerating }: AIProfileConfigModalProps) {
  const [config, setConfig] = useState<ProfileConfig>({
    brandPositioning: "casual",
    contentStyle: "friendly",
    includeHistory: true,
    includeAwards: false,
    focusOnCuisine: true,
    emphasizeService: true,
  })

  const handleGenerate = () => {
    onGenerate(config)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wand2 className="w-5 h-5 text-emerald-600" />
            <span>AI Profile Generator</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Brand Positioning</Label>
            <RadioGroup
              value={config.brandPositioning}
              onValueChange={(value) => setConfig((prev) => ({ ...prev, brandPositioning: value as any }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="casual" id="casual" />
                <Label htmlFor="casual" className="text-sm">
                  Casual & Approachable
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="premium" id="premium" />
                <Label htmlFor="premium" className="text-sm">
                  Premium & Upscale
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="family" id="family" />
                <Label htmlFor="family" className="text-sm">
                  Family-Friendly
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="trendy" id="trendy" />
                <Label htmlFor="trendy" className="text-sm">
                  Trendy & Modern
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Content Style</Label>
            <RadioGroup
              value={config.contentStyle}
              onValueChange={(value) => setConfig((prev) => ({ ...prev, contentStyle: value as any }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional" id="professional" />
                <Label htmlFor="professional" className="text-sm">
                  Professional & Formal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friendly" id="friendly" />
                <Label htmlFor="friendly" className="text-sm">
                  Friendly & Conversational
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="storytelling" id="storytelling" />
                <Label htmlFor="storytelling" className="text-sm">
                  Storytelling & Narrative
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="minimal" id="minimal" />
                <Label htmlFor="minimal" className="text-sm">
                  Minimal & Concise
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Include in Profile</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeHistory"
                  checked={config.includeHistory}
                  onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, includeHistory: checked as boolean }))}
                />
                <Label htmlFor="includeHistory" className="text-sm">
                  Restaurant history & story
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeAwards"
                  checked={config.includeAwards}
                  onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, includeAwards: checked as boolean }))}
                />
                <Label htmlFor="includeAwards" className="text-sm">
                  Awards & recognition
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="focusOnCuisine"
                  checked={config.focusOnCuisine}
                  onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, focusOnCuisine: checked as boolean }))}
                />
                <Label htmlFor="focusOnCuisine" className="text-sm">
                  Emphasize cuisine & ingredients
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emphasizeService"
                  checked={config.emphasizeService}
                  onCheckedChange={(checked) =>
                    setConfig((prev) => ({ ...prev, emphasizeService: checked as boolean }))
                  }
                />
                <Label htmlFor="emphasizeService" className="text-sm">
                  Highlight service quality
                </Label>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
