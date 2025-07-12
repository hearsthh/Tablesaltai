import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { CustomerData } from "@/lib/types/customer-data"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerData, section, generateInsights = false } = body

    // Generate AI insights if requested
    let processedData = customerData
    if (generateInsights) {
      processedData = await enhanceWithAIInsights(customerData)
    }

    // Calculate completion status
    const completionStatus = calculateCustomerCompletionStatus(processedData)

    // Add metadata
    const finalData = {
      ...processedData,
      completionStatus,
      updatedAt: new Date().toISOString(),
      createdAt: processedData.createdAt || new Date().toISOString(),
    }

    // Save to database
    const { data, error } = await supabase
      .from("customer_data")
      .upsert(finalData, { onConflict: "id" })
      .select()
      .single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data,
      completionStatus,
      aiEnhanced: generateInsights,
    })
  } catch (error) {
    console.error("Error saving customer data:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save customer data" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("id")
    const userId = searchParams.get("userId")
    const restaurantId = searchParams.get("restaurantId")

    let query = supabase.from("customer_data").select("*")

    if (customerId) {
      query = query.eq("id", customerId)
    } else if (restaurantId) {
      query = query.eq("restaurantId", restaurantId)
    } else if (userId) {
      query = query.eq("userId", userId)
    } else {
      return NextResponse.json({ error: "Customer ID, Restaurant ID, or User ID required" }, { status: 400 })
    }

    const { data, error } = await query.single()

    if (error && error.code !== "PGRST116") {
      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching customer data:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch customer data" },
      { status: 500 },
    )
  }
}

function calculateCustomerCompletionStatus(data: Partial<CustomerData>) {
  const sections = {
    customers: !!(data.customers && data.customers.length > 0),
    segments: !!(data.segments && data.segments.length > 0),
    analytics: !!data.analytics,
  }

  const completedSections = Object.values(sections).filter(Boolean).length
  const totalSections = Object.keys(sections).length
  const overall = Math.round((completedSections / totalSections) * 100)

  return {
    ...sections,
    overall,
  }
}

async function enhanceWithAIInsights(data: Partial<CustomerData>) {
  try {
    // Simulate AI insights generation
    if (data.customers) {
      const enhancedCustomers = data.customers.map((customer) => ({
        ...customer,
        aiInsights: {
          orderingPattern: generateOrderingPattern(customer),
          preferences: generatePreferences(customer),
          predictedChurnRisk: calculateChurnRisk(customer),
          recommendedItems: generateRecommendations(customer),
          bestContactTime: determineBestContactTime(customer),
          preferredOrderSlot: determinePreferredSlot(customer),
          seasonalTrends: generateSeasonalTrends(customer),
        },
      }))

      return {
        ...data,
        customers: enhancedCustomers,
      }
    }

    return data
  } catch (error) {
    console.error("AI insights generation error:", error)
    return data
  }
}

function generateOrderingPattern(customer: any): string {
  const frequency = customer.orderFrequency
  const avgSpend = customer.avgSpend

  if (frequency === "weekly" && avgSpend > 500) {
    return "High-value regular customer with consistent weekly ordering pattern"
  } else if (frequency === "monthly" && avgSpend < 200) {
    return "Occasional customer with budget-conscious ordering behavior"
  } else {
    return "Moderate customer with irregular ordering pattern"
  }
}

function generatePreferences(customer: any): string[] {
  // Based on items ordered list
  const preferences = []
  if (customer.itemsOrderedList?.length > 0) {
    const topItems = customer.itemsOrderedList
      .sort((a: any, b: any) => b.orderCount - a.orderCount)
      .slice(0, 3)
      .map((item: any) => item.itemName)
    preferences.push(...topItems)
  }
  return preferences
}

function calculateChurnRisk(customer: any): "low" | "medium" | "high" {
  const daysSinceLastOrder = customer.lastOrderDate
    ? Math.floor((Date.now() - new Date(customer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))
    : 999

  if (daysSinceLastOrder > 90) return "high"
  if (daysSinceLastOrder > 30) return "medium"
  return "low"
}

function generateRecommendations(customer: any): string[] {
  // Simple recommendation logic
  return ["Chef's Special", "Popular Combo", "Seasonal Dish"]
}

function determineBestContactTime(customer: any): string {
  // Based on order slot pattern
  if (customer.orderSlotPattern?.length > 0) {
    const preferredSlot = customer.orderSlotPattern.sort((a: any, b: any) => b.orderCount - a.orderCount)[0]

    switch (preferredSlot.slot) {
      case "bf":
        return "8:00 AM - 10:00 AM"
      case "lunch":
        return "12:00 PM - 2:00 PM"
      case "dinner":
        return "7:00 PM - 9:00 PM"
      default:
        return "6:00 PM - 8:00 PM"
    }
  }
  return "6:00 PM - 8:00 PM"
}

function determinePreferredSlot(customer: any): string {
  if (customer.orderSlotPattern?.length > 0) {
    return customer.orderSlotPattern.sort((a: any, b: any) => b.orderCount - a.orderCount)[0].slot
  }
  return "dinner"
}

function generateSeasonalTrends(customer: any): string[] {
  return ["Prefers spicy food in winter", "Orders more beverages in summer"]
}
