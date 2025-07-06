"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import {
  MessageSquare,
  Send,
  Sparkles,
  TrendingUp,
  Target,
  Users,
  Calendar,
  BarChart3,
  Lightbulb,
  ArrowRight,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
}

export default function AIAssistantPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI Marketing Assistant. I can help you create strategies, optimize campaigns, analyze performance, and generate content ideas. What would you like to work on today?",
      timestamp: new Date(),
      suggestions: [
        "Create a new marketing strategy",
        "Analyze campaign performance",
        "Generate content ideas",
        "Optimize ad spending",
      ],
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const quickActions = [
    {
      title: "Strategy Planning",
      description: "Get AI-powered marketing strategy recommendations",
      icon: Target,
      color: "bg-blue-100 text-blue-600",
      action: () => handleQuickAction("Help me create a marketing strategy for my restaurant"),
    },
    {
      title: "Content Ideas",
      description: "Generate engaging content for social media",
      icon: Lightbulb,
      color: "bg-yellow-100 text-yellow-600",
      action: () => handleQuickAction("Give me content ideas for Instagram posts"),
    },
    {
      title: "Performance Analysis",
      description: "Analyze and improve campaign performance",
      icon: BarChart3,
      color: "bg-green-100 text-green-600",
      action: () => handleQuickAction("Analyze my campaign performance and suggest improvements"),
    },
    {
      title: "Audience Targeting",
      description: "Optimize your target audience strategy",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
      action: () => handleQuickAction("Help me define my target audience better"),
    },
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage)
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const handleQuickAction = (message: string) => {
    setInputMessage(message)
    handleSendMessage()
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const generateAIResponse = (userInput: string): Message => {
    const responses = {
      strategy: {
        content:
          "I'd be happy to help you create a marketing strategy! Based on restaurant industry best practices, here's what I recommend:\n\n1. **Local Community Focus**: Target customers within 5km radius\n2. **Social Media Presence**: Focus on Instagram and WhatsApp for visual content\n3. **Customer Retention**: Implement a loyalty program\n4. **Seasonal Campaigns**: Create special offers for festivals and events\n\nWould you like me to create a detailed strategy document for any of these areas?",
        suggestions: [
          "Create Instagram content calendar",
          "Design loyalty program",
          "Plan festival campaign",
          "Analyze local competition",
        ],
      },
      content: {
        content:
          'Here are some engaging Instagram content ideas for your restaurant:\n\n📸 **Visual Content**:\n• Behind-the-scenes cooking videos\n• Fresh ingredient close-ups\n• Chef preparing signature dishes\n• Happy customers enjoying meals\n\n📝 **Post Ideas**:\n• "Dish of the Day" features\n• Customer testimonials\n• Cooking tips and tricks\n• Restaurant story highlights\n\n🎯 **Engagement Boosters**:\n• Food photography contests\n• Recipe sharing\n• Live cooking sessions\n• Q&A with the chef\n\nShall I help you create a content calendar for the next month?',
        suggestions: [
          "Create content calendar",
          "Write post captions",
          "Plan video content",
          "Design posting schedule",
        ],
      },
      performance: {
        content:
          "Let me analyze your current campaign performance:\n\n📊 **Current Metrics**:\n• Total Reach: 36.5K (+12% vs last month)\n• Engagement Rate: 5.8% (Above industry average)\n• Conversion Rate: 3.7%\n• ROI: 2.8x\n\n🎯 **Key Insights**:\n• WhatsApp campaigns performing best (5.9x ROI)\n• Instagram engagement above average\n• Facebook needs optimization\n\n💡 **Recommendations**:\n1. Increase WhatsApp budget allocation\n2. A/B test Facebook ad creatives\n3. Post Instagram content during peak hours (6-8 PM)\n\nWould you like detailed recommendations for any specific channel?",
        suggestions: [
          "Optimize Facebook ads",
          "Increase WhatsApp budget",
          "Improve Instagram timing",
          "Create A/B test plan",
        ],
      },
      audience: {
        content:
          "Let's define your target audience more precisely:\n\n👥 **Primary Audience**:\n• Age: 25-45 years\n• Location: Within 5km radius\n• Income: Middle to upper-middle class\n• Interests: Food, dining out, local experiences\n\n🎯 **Audience Segments**:\n1. **Family Diners** (35-50): Weekend family meals\n2. **Young Professionals** (25-35): Quick lunches, dinner dates\n3. **Food Enthusiasts** (30-60): Special occasions, new experiences\n4. **Local Residents** (All ages): Regular customers, takeaways\n\n📱 **Channel Preferences**:\n• Instagram: Visual content, stories\n• WhatsApp: Direct offers, reservations\n• Facebook: Events, community engagement\n\nShould I create targeted campaigns for each segment?",
        suggestions: [
          "Create family campaign",
          "Target young professionals",
          "Design loyalty program",
          "Plan community events",
        ],
      },
    }

    const input = userInput.toLowerCase()
    let response = responses.strategy

    if (input.includes("content") || input.includes("post") || input.includes("instagram")) {
      response = responses.content
    } else if (input.includes("performance") || input.includes("analyze") || input.includes("campaign")) {
      response = responses.performance
    } else if (input.includes("audience") || input.includes("target") || input.includes("customer")) {
      response = responses.audience
    }

    return {
      id: Date.now().toString(),
      type: "ai",
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions,
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">AI Marketing Assistant</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Get intelligent insights and recommendations for your marketing campaigns
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto p-3 bg-white"
                      onClick={action.action}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-sm">{action.title}</div>
                          <div className="text-xs text-gray-600 mt-1">{action.description}</div>
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">AI Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span>Strategy Planning</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>Campaign Optimization</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>Audience Analysis</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <BarChart3 className="w-4 h-4 text-orange-600" />
                  <span>Performance Insights</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-yellow-600" />
                  <span>Content Planning</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Lightbulb className="w-4 h-4 text-pink-600" />
                  <span>Creative Ideas</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="border-gray-200 h-[600px] flex flex-col">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-lg">Chat with AI Assistant</CardTitle>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      <div className={`text-xs mt-2 ${message.type === "user" ? "text-gray-300" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>

                      {/* AI Suggestions */}
                      {message.type === "ai" && message.suggestions && (
                        <div className="mt-3 space-y-2">
                          <div className="text-xs text-gray-600 font-medium">Suggested follow-ups:</div>
                          <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs bg-white hover:bg-gray-50"
                              >
                                {suggestion}
                                <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything about marketing..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
