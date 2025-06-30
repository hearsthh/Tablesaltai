"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Zap,
  Target,
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  Lightbulb,
  Sparkles,
  Brain,
  Rocket,
  Star,
} from "lucide-react"

interface MarketingAIDashboardProps {
  restaurantData?: {
    name: string
    cuisine: string
    location: string
    budget: number
  }
}

export function MarketingAIDashboard({ restaurantData }: MarketingAIDashboardProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null)

  const aiCapabilities = [
    {
      title: "Campaign Strategy AI",
      description: "Generate complete marketing strategies with budget allocation and timeline",
      accuracy: "92%",
      timesSaved: "15 hours/week",
      icon: Target,
      color: "bg-blue-50 border-blue-200 text-blue-700",
      features: ["Budget optimization", "Timeline planning", "Channel selection", "ROI prediction"],
    },
    {
      title: "Content Creation AI",
      description: "Create engaging social media posts, captions, and hashtags automatically",
      accuracy: "89%",
      timesSaved: "20 hours/week",
      icon: Sparkles,
      color: "bg-purple-50 border-purple-200 text-purple-700",
      features: ["Multi-platform content", "Visual suggestions", "Hashtag optimization", "Scheduling"],
    },
    {
      title: "Performance Prediction AI",
      description: "Predict campaign performance and ROI before launching",
      accuracy: "87%",
      timesSaved: "8 hours/week",
      icon: BarChart3,
      color: "bg-green-50 border-green-200 text-green-700",
      features: ["ROI forecasting", "Engagement prediction", "Budget optimization", "Risk assessment"],
    },
    {
      title: "Competitor Analysis AI",
      description: "Analyze competitors and identify market opportunities",
      accuracy: "94%",
      timesSaved: "12 hours/week",
      icon: Brain,
      color: "bg-orange-50 border-orange-200 text-orange-700",
      features: ["Market positioning", "Pricing analysis", "Content gaps", "Opportunity mapping"],
    },
  ]

  const aiInsights = [
    {
      type: "opportunity",
      title: "Instagram Reel Opportunity",
      description: "Food preparation videos get 340% more engagement for restaurants like yours",
      confidence: 94,
      impact: "High",
      action: "Create behind-the-scenes cooking content",
      icon: TrendingUp,
      color: "bg-green-50 border-green-200",
    },
    {
      type: "optimization",
      title: "Posting Time Optimization",
      description: "Your audience is 65% more active between 7-9 PM on weekdays",
      confidence: 89,
      impact: "Medium",
      action: "Reschedule posts to evening hours",
      icon: Calendar,
      color: "bg-blue-50 border-blue-200",
    },
    {
      type: "budget",
      title: "Budget Reallocation",
      description: "Shifting 30% budget from Facebook to Instagram could increase ROI by 45%",
      confidence: 87,
      impact: "High",
      action: "Reallocate advertising budget",
      icon: DollarSign,
      color: "bg-purple-50 border-purple-200",
    },
  ]

  const handleGenerateStrategy = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* AI Overview */}
      <Card className="border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">AI Marketing Assistant</CardTitle>
              <CardDescription>Advanced AI engine powering your restaurant's growth</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-slate-600">AI-Generated Posts</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">+35%</div>
              <div className="text-sm text-slate-600">Revenue Increase</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">92%</div>
              <div className="text-sm text-slate-600">Prediction Accuracy</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-orange-600">55hrs</div>
              <div className="text-sm text-slate-600">Time Saved/Month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Capabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {aiCapabilities.map((capability, index) => (
          <Card key={index} className={`border hover:shadow-md transition-shadow ${capability.color}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center">
                    <capability.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{capability.title}</CardTitle>
                    <CardDescription className="text-sm">{capability.description}</CardDescription>
                  </div>
                </div>
                <Badge className="bg-white/50" variant="secondary">
                  {capability.accuracy} accurate
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Time Saved:</span>
                  <span className="font-medium">{capability.timesSaved}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-700 mb-2 block">Key Features:</span>
                  <div className="grid grid-cols-2 gap-1">
                    {capability.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="w-full" size="sm">
                  <Zap className="w-4 h-4 mr-2" />
                  Try {capability.title}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <CardTitle className="text-xl">AI Marketing Insights</CardTitle>
            </div>
            <Badge className="bg-yellow-100 text-yellow-700">Live Insights</Badge>
          </div>
          <CardDescription>Real-time AI recommendations to boost your marketing performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className={`p-4 border rounded-lg ${insight.color}`}>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/50 rounded-md flex items-center justify-center">
                    <insight.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900">{insight.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                        <Badge
                          className={`text-xs ${
                            insight.impact === "High" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                          }`}
                          variant="secondary"
                        >
                          {insight.impact} Impact
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Recommended: {insight.action}</span>
                      <Button size="sm" variant="outline">
                        <Rocket className="w-3 h-3 mr-1" />
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick AI Actions */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Quick AI Actions
          </CardTitle>
          <CardDescription>Generate marketing content and strategies instantly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-20 flex flex-col space-y-2 bg-blue-600 hover:bg-blue-700">
                  <Target className="w-6 h-6" />
                  <span>Generate Campaign</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>AI Campaign Generator</DialogTitle>
                  <DialogDescription>
                    AI will create a complete marketing campaign strategy for your restaurant
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Campaign Goal</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="awareness">Brand Awareness</SelectItem>
                        <SelectItem value="acquisition">Customer Acquisition</SelectItem>
                        <SelectItem value="retention">Customer Retention</SelectItem>
                        <SelectItem value="revenue">Revenue Growth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Budget Range</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5k-15k">₹5,000 - ₹15,000</SelectItem>
                        <SelectItem value="15k-50k">₹15,000 - ₹50,000</SelectItem>
                        <SelectItem value="50k-100k">₹50,000 - ₹1,00,000</SelectItem>
                        <SelectItem value="100k+">₹1,00,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Additional Context</Label>
                    <Textarea placeholder="Tell us about your restaurant, target audience, or specific requirements..." />
                  </div>
                  <Button onClick={handleGenerateStrategy} disabled={isGenerating} className="w-full">
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Generating Strategy...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Generate AI Campaign
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button className="h-20 flex flex-col space-y-2 bg-purple-600 hover:bg-purple-700">
              <Sparkles className="w-6 h-6" />
              <span>Create Content</span>
            </Button>

            <Button className="h-20 flex flex-col space-y-2 bg-green-600 hover:bg-green-700">
              <BarChart3 className="w-6 h-6" />
              <span>Analyze Performance</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
