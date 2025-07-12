"use client"

import { useState, useEffect } from "react"
import type { Customer, RestaurantCustomerSummary, AutomationTrigger } from "@/lib/types/customer-tagging"
import { CustomerTaggingService } from "@/lib/services/customer-tagging-service"
import { AutomationTriggerService } from "@/lib/services/automation-trigger-service"

export function useCustomerTagging(restaurantId: string) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [summary, setSummary] = useState<RestaurantCustomerSummary | null>(null)
  const [triggers, setTriggers] = useState<AutomationTrigger[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load customer data
  useEffect(() => {
    loadCustomerData()
  }, [restaurantId])

  const loadCustomerData = async () => {
    try {
      setLoading(true)
      // In real implementation, this would be an API call
      const mockCustomers = generateMockCustomers(restaurantId)
      setCustomers(mockCustomers)

      // Calculate tags and summary
      await recalculateTags(mockCustomers)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customer data")
    } finally {
      setLoading(false)
    }
  }

  const recalculateTags = async (customerList: Customer[] = customers) => {
    try {
      // Calculate restaurant average visit gap
      const restaurantAvgGap = customerList.reduce((sum, c) => sum + c.average_visit_gap, 0) / customerList.length

      // Calculate new tags
      const tagResults = CustomerTaggingService.calculateCustomerTags({
        customers: customerList,
        restaurant_avg_visit_gap: restaurantAvgGap,
      })

      // Update customers with new tags
      const updatedCustomers = customerList.map((customer) => {
        const result = tagResults.find((r) => r.customer_id === customer.id)
        if (result) {
          return {
            ...customer,
            spend_tag: result.new_tags.spend_tag,
            activity_tag: result.new_tags.activity_tag,
            behavior_tags: result.new_tags.behavior_tags,
          }
        }
        return customer
      })

      setCustomers(updatedCustomers)

      // Generate automation triggers
      const newTriggers = AutomationTriggerService.processTagChanges(tagResults)
      setTriggers((prev) => [...prev, ...newTriggers])

      // Calculate summary
      const newSummary = CustomerTaggingService.calculateRestaurantSummary(updatedCustomers, restaurantId)
      setSummary(newSummary)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to recalculate tags")
    }
  }

  const getCustomersByTag = (tagType: "spend" | "activity" | "behavior", tagValue: string) => {
    return customers.filter((customer) => {
      switch (tagType) {
        case "spend":
          return customer.spend_tag === tagValue
        case "activity":
          return customer.activity_tag === tagValue
        case "behavior":
          return customer.behavior_tags.includes(tagValue as any)
        default:
          return false
      }
    })
  }

  const processTrigger = async (triggerId: string) => {
    const trigger = triggers.find((t) => t.id === triggerId)
    if (!trigger) return

    const customer = customers.find((c) => c.id === trigger.customer_id)
    if (!customer) return

    // Generate personalized content
    const personalization = AutomationTriggerService.generatePersonalizedContent(customer)
    const messages = AutomationTriggerService.generateCampaignMessage(trigger, personalization)

    // Mark trigger as processed
    setTriggers((prev) =>
      prev.map((t) => (t.id === triggerId ? { ...t, processed: true, campaign_sent: new Date().toISOString() } : t)),
    )

    return { personalization, messages }
  }

  return {
    customers,
    summary,
    triggers,
    loading,
    error,
    recalculateTags,
    getCustomersByTag,
    processTrigger,
    loadCustomerData,
  }
}

// Mock data generator for testing
function generateMockCustomers(restaurantId: string): Customer[] {
  const mockCustomers: Customer[] = []

  const names = ["Rajesh Kumar", "Priya Sharma", "Amit Patel", "Sneha Gupta", "Vikram Singh"]
  const categories = ["North Indian", "South Indian", "Chinese", "Beverages", "Desserts"]

  for (let i = 0; i < 50; i++) {
    const firstVisit = new Date()
    firstVisit.setDate(firstVisit.getDate() - Math.random() * 365)

    const lastVisit = new Date()
    lastVisit.setDate(lastVisit.getDate() - Math.random() * 30)

    const totalVisits = Math.floor(Math.random() * 20) + 1
    const totalSpend = Math.floor(Math.random() * 10000) + 500
    const avgOrderValue = totalSpend / totalVisits
    const avgVisitGap = Math.floor(Math.random() * 30) + 5

    // Generate order history
    const orderHistory = []
    for (let j = 0; j < totalVisits; j++) {
      const orderDate = new Date(firstVisit)
      orderDate.setDate(orderDate.getDate() + j * avgVisitGap)

      const itemCount = Math.floor(Math.random() * 5) + 1
      const items = []
      for (let k = 0; k < itemCount; k++) {
        items.push({
          id: `item_${k}`,
          name: `Dish ${k + 1}`,
          category: categories[Math.floor(Math.random() * categories.length)],
          price: Math.floor(Math.random() * 300) + 100,
          quantity: 1,
          is_combo: Math.random() > 0.7,
        })
      }

      orderHistory.push({
        id: `order_${j}`,
        timestamp: orderDate.toISOString(),
        items,
        categories: [...new Set(items.map((item) => item.category))],
        total_amount: items.reduce((sum, item) => sum + item.price, 0),
        guest_count_estimate: Math.floor(itemCount / 1.5),
        order_source: ["dine_in", "takeaway", "delivery"][Math.floor(Math.random() * 3)] as any,
      })
    }

    const guestEstimateAvg =
      orderHistory.reduce((sum, order) => sum + order.guest_count_estimate, 0) / orderHistory.length

    mockCustomers.push({
      id: `customer_${i}`,
      name: names[i % names.length],
      phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      email: `customer${i}@example.com`,
      first_visit_date: firstVisit.toISOString(),
      last_visit_date: lastVisit.toISOString(),
      total_visits: totalVisits,
      total_spend: totalSpend,
      average_order_value: Math.round(avgOrderValue),
      average_visit_gap: avgVisitGap,
      guest_estimate_avg: Math.round(guestEstimateAvg * 100) / 100,
      order_history: orderHistory,
      spend_tag: "mid_spender", // Will be recalculated
      activity_tag: "active", // Will be recalculated
      behavior_tags: [], // Will be recalculated
      created_at: firstVisit.toISOString(),
      updated_at: new Date().toISOString(),
      restaurant_id: restaurantId,
    })
  }

  return mockCustomers
}
