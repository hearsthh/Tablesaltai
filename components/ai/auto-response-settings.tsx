"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { MessageCircle, Bell, Settings, Save, TestTube } from "lucide-react"

interface AutoResponseSettingsProps {
  enabled?: boolean
  prompt?: string
  onSettingsChange?: (settings: { enabled: boolean; prompt: string }) => void
}

export function AutoResponseSettings({
  enabled = false,
  prompt = "Respond professionally and warmly to customer reviews. Address specific points mentioned. Thank positive reviewers and acknowledge concerns in negative reviews with solutions.",
  onSettingsChange,
}: AutoResponseSettingsProps) {
  const [autoResponseEnabled, setAutoResponseEnabled] = useState(enabled)
  const [responsePrompt, setResponsePrompt] = useState(prompt)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onSettingsChange?.({ enabled: autoResponseEnabled, prompt: responsePrompt })
    setIsSaving(false)
  }

  const handleTest = () => {
    console.log("Testing AI response with current settings...")
    // This would trigger a test response generation
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg flex items-center text-gray-900">
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Auto-Response Settings
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Configure AI to automatically respond to customer reviews
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 text-sm">Enable Auto-Response</h4>
            <p className="text-xs text-gray-600">AI will respond to reviews within 2 hours</p>
          </div>
          <Switch checked={autoResponseEnabled} onCheckedChange={setAutoResponseEnabled} />
        </div>

        {autoResponseEnabled && (
          <div className="space-y-4">
            {/* Response Guidelines */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Response Guidelines</label>
              <Textarea
                value={responsePrompt}
                onChange={(e) => setResponsePrompt(e.target.value)}
                placeholder="Enter guidelines for AI responses..."
                className="text-sm"
                rows={4}
              />
              <p className="text-xs text-gray-500">
                These guidelines help AI understand your brand voice and response style.
              </p>
            </div>

            {/* Response Settings */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 text-sm mb-2">Response Timing</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Positive reviews</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">Immediate</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Neutral reviews</span>
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">2 hours</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Negative reviews</span>
                    <Badge className="bg-red-100 text-red-800 text-xs">Manual approval</Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 text-sm mb-2">Safety Features</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600">Notification before negative responses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600">Brand voice consistency check</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-black hover:bg-gray-800 flex-1 sm:flex-none"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
              <Button onClick={handleTest} variant="outline" className="flex-1 sm:flex-none bg-transparent">
                <TestTube className="w-4 h-4 mr-2" />
                Test Response
              </Button>
            </div>

            {/* Preview */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 text-sm mb-2">Sample AI Response Preview</h4>
              <div className="text-xs text-gray-600 italic">
                "Thank you so much for your wonderful review, Sarah! We're thrilled to hear that you enjoyed our pasta
                and found our staff attentive. Your feedback means the world to us, and we look forward to welcoming you
                back soon!"
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
