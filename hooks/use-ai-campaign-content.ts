"use client"

import { useState, useEffect } from "react"
import type { Campaign } from "@/types/marketing"

interface ContentSuggestion {
  id: string
  title: string
  description: string
  channel: string
  contentType: string
  confidence: number
  estimatedPerformance: {
    reach: number
    engagement: number
    conversions: number
  }
  mediaRequirement: {
    required: boolean
    type?: string
    description?: string
  }
  textContent: {
    caption: string
    hashtags: string[]
    callToAction?: string
  }
  schedulingRecommendation: {
    bestTime: string
    frequency: string
    duration: string
  }
}

export function useAICampaignContent(campaign?: Partial<Campaign> | null) {
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!campaign) return

    const generateContentSuggestions = async () => {
      try {
        setLoading(true)
        setError(null)

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock AI content suggestions based on campaign
        const mockSuggestions: ContentSuggestion[] = [
          {
            id: "1",
            title: "Behind-the-Scenes Kitchen Story",
            description: "Show the cooking process and chef's expertise to build trust and appetite appeal",
            channel: "instagram",
            contentType: "story",
            confidence: 92,
            estimatedPerformance: {
              reach: 3200,
              engagement: 280,
              conversions: 18,
            },
            mediaRequirement: {
              required: true,
              type: "video",
              description: "Short video (15-30 seconds) of chef preparing signature dish",
            },
            textContent: {
              caption:
                "Watch our chef create magic in the kitchen! 👨‍🍳✨ Fresh ingredients, traditional techniques, amazing flavors!",
              hashtags: ["#BehindTheScenes", "#ChefMagic", "#FreshIngredients", "#TraditionalCooking", "#FoodPrep"],
              callToAction: "Swipe up to order now!",
            },
            schedulingRecommendation: {
              bestTime: "6:00 PM - 8:00 PM",
              frequency: "2-3 times per week",
              duration: "24 hours",
            },
          },
          {
            id: "2",
            title: "Customer Testimonial Highlight",
            description: "Feature satisfied customers to build social proof and credibility",
            channel: "whatsapp",
            contentType: "broadcast",
            confidence: 88,
            estimatedPerformance: {
              reach: 850,
              engagement: 425,
              conversions: 34,
            },
            mediaRequirement: {
              required: true,
              type: "image",
              description: "Photo of happy customer with their meal or restaurant selfie",
            },
            textContent: {
              caption:
                "🌟 'Best biryani in the city! The flavors are incredible and service is top-notch.' - Priya S. ⭐⭐⭐⭐⭐",
              hashtags: ["#CustomerLove", "#FiveStars", "#BestBiryani", "#HappyCustomers"],
              callToAction: "Book your table today!",
            },
            schedulingRecommendation: {
              bestTime: "12:00 PM - 2:00 PM",
              frequency: "Once per week",
              duration: "Immediate",
            },
          },
          {
            id: "3",
            title: "Special Offer Announcement",
            description: "Promote limited-time offers to drive immediate action and urgency",
            channel: "instagram",
            contentType: "post",
            confidence: 85,
            estimatedPerformance: {
              reach: 2800,
              engagement: 195,
              conversions: 22,
            },
            mediaRequirement: {
              required: true,
              type: "image",
              description: "Eye-catching graphic with offer details and food imagery",
            },
            textContent: {
              caption:
                "🎉 WEEKEND SPECIAL! Get 20% off on all main courses this Saturday & Sunday! Limited time offer - don't miss out! 🍽️",
              hashtags: ["#WeekendSpecial", "#LimitedOffer", "#20PercentOff", "#DontMissOut", "#BookNow"],
              callToAction: "Call now to reserve your table!",
            },
            schedulingRecommendation: {
              bestTime: "10:00 AM - 12:00 PM",
              frequency: "Once per promotion",
              duration: "48 hours",
            },
          },
        ]

        setSuggestions(mockSuggestions)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate content suggestions")
      } finally {
        setLoading(false)
      }
    }

    generateContentSuggestions()
  }, [campaign])

  return { suggestions, loading, error }
}
