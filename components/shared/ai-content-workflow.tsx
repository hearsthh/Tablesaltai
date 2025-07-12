"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, RefreshCw, Send, Copy, Edit } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AIContentWorkflowProps {
  onGenerate?: (content: string) => void
  onSave?: (content: string) => void
  initialPrompt?: string
  contentType?: string
  channel?: string
}

export function AIContentWorkflow({
  onGenerate,
  onSave,
  initialPrompt = "",
  contentType = "post",
  channel = "instagram",
}: AIContentWorkflowProps) {
  const { toast } = useToast()
  const [prompt, setPrompt] = useState(initialPrompt)
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [tone, setTone] = useState("friendly")
  const [goal, setGoal] = useState("engagement")

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt to generate content",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockContent = {
        instagram_post: `✨ ${prompt} ✨\n\nCome and experience the magic of authentic flavors! 🍽️\n\n📍 Visit us today for an unforgettable dining experience\n\n#FoodLovers #AuthenticCuisine #RestaurantLife #Foodie`,
        whatsapp_message: `🍽️ ${prompt}\n\nVisit us today for an amazing dining experience! 🌟\n\nBook your table now: [Link]`,
        email_subject: `Special Offer: ${prompt}`,
        sms: `${prompt.substring(0, 100)}... Visit us today!`,
      }

      const content =
        mockContent[`${channel}_${contentType}` as keyof typeof mockContent] ||
        `Generated content for ${prompt} in ${tone} tone for ${goal}`

      setGeneratedContent(content)
      onGenerate?.(content)

      toast({
        title: "Content Generated",
        description: "AI has created your content successfully!",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    })
  }

  const handleSave = () => {
    onSave?.(generatedContent)
    toast({
      title: "Content Saved",
      description: "Content has been saved to your library",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span>AI Content Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configuration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Tone</label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="exciting">Exciting</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="elegant">Elegant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Goal</label>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="awareness">Awareness</SelectItem>
                <SelectItem value="retention">Retention</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            What would you like to create content about?
          </label>
          <Textarea
            placeholder="e.g., Weekend special menu, New dish launch, Customer testimonial..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Content
            </>
          )}
        </Button>

        {/* Generated Content */}
        {generatedContent && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Generated Content</h4>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {tone} • {goal}
                </Badge>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{generatedContent}</p>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={handleCopy} className="bg-white">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button size="sm" variant="outline" className="bg-white">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button size="sm" onClick={handleSave} className="bg-black hover:bg-gray-800 text-white">
                <Send className="w-4 h-4 mr-2" />
                Save & Use
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
