"use client"

import { useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import type { MenuIntelligenceData } from "@/lib/types/menu-intelligence"
import { MenuIntelligenceService } from "@/lib/services/menu-intelligence-service"

export function useMenuIntelligence() {
  const [data, setData] = useState<MenuIntelligenceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // In a real app, this would fetch from your API
      const intelligenceData = await MenuIntelligenceService.generateMockData()
      setData(intelligenceData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load menu intelligence data")
    } finally {
      setLoading(false)
    }
  }

  const generateAIDescription = async (itemId: string) => {
    try {
      // Mock AI description generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (data) {
        const updatedItems = data.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                aiDescription:
                  "AI-generated description: Delicious and expertly prepared with fresh ingredients and authentic spices.",
                missingDescription: false,
                aiScore: Math.min(100, item.aiScore + 20),
              }
            : item,
        )

        setData({
          ...data,
          items: updatedItems,
          healthScore: MenuIntelligenceService.calculateMenuHealth(updatedItems),
        })
      }

      toast({
        title: "AI Description Generated",
        description: "Item description has been enhanced with AI",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI description",
        variant: "destructive",
      })
    }
  }

  const updateItemPrice = async (itemId: string, newPrice: number) => {
    try {
      if (data) {
        const updatedItems = data.items.map((item) => (item.id === itemId ? { ...item, price: newPrice } : item))

        // Recalculate automation flags after price change
        const processedItems = MenuIntelligenceService.applyAutomationFlags(updatedItems)

        setData({
          ...data,
          items: processedItems,
          healthScore: MenuIntelligenceService.calculateMenuHealth(processedItems),
        })
      }

      toast({
        title: "Price Updated",
        description: `Item price updated to ₹${newPrice}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update price",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      if (data) {
        const updatedItems = data.items.filter((item) => item.id !== itemId)

        setData({
          ...data,
          items: updatedItems,
          healthScore: MenuIntelligenceService.calculateMenuHealth(updatedItems),
          comboSuggestions: MenuIntelligenceService.generateComboSuggestions(updatedItems),
          optimizationActions: MenuIntelligenceService.generateOptimizationActions(
            updatedItems,
            MenuIntelligenceService.calculateMenuHealth(updatedItems),
          ),
        })
      }

      toast({
        title: "Item Removed",
        description: "Menu item has been removed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const createCombo = async (itemId: string) => {
    try {
      // Mock combo creation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Combo Created",
        description: "New combo suggestion has been added to your menu builder",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create combo",
        variant: "destructive",
      })
    }
  }

  const executeOptimizationAction = async (actionId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (data) {
        let updatedItems = [...data.items]

        switch (actionId) {
          case "fix-descriptions":
            updatedItems = updatedItems.map((item) =>
              item.missingDescription
                ? {
                    ...item,
                    aiDescription: "AI-enhanced description with rich details and appealing language.",
                    missingDescription: false,
                    aiScore: Math.min(100, item.aiScore + 25),
                  }
                : item,
            )
            break

          case "fix-images":
            updatedItems = updatedItems.map((item) =>
              item.missingImage
                ? {
                    ...item,
                    imageUrl: "/placeholder.svg?height=200&width=300",
                    missingImage: false,
                  }
                : item,
            )
            break

          case "fix-pricing":
            // Mock pricing optimization
            updatedItems = updatedItems.map((item) =>
              item.suggestRepricing ? { ...item, suggestRepricing: false } : item,
            )
            break

          case "promote-items":
            // Mock promotion setup
            break
        }

        const processedItems = MenuIntelligenceService.applyAutomationFlags(updatedItems)

        setData({
          ...data,
          items: processedItems,
          healthScore: MenuIntelligenceService.calculateMenuHealth(processedItems),
          optimizationActions: MenuIntelligenceService.generateOptimizationActions(
            processedItems,
            MenuIntelligenceService.calculateMenuHealth(processedItems),
          ),
        })
      }

      toast({
        title: "Optimization Applied",
        description: "Menu optimization has been completed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute optimization",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return {
    data,
    loading,
    error,
    loadData,
    generateAIDescription,
    updateItemPrice,
    removeItem,
    createCombo,
    executeOptimizationAction,
  }
}
