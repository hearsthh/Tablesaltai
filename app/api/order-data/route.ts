import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { OrderData } from "@/lib/types/order-data"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderData, section, generateAnalytics = false } = body

    // Generate analytics if requested
    let processedData = orderData
    if (generateAnalytics) {
      processedData = await generateOrderAnalytics(orderData)
    }

    // Calculate completion status
    const completionStatus = calculateOrderCompletionStatus(processedData)

    // Add metadata
    const finalData = {
      ...processedData,
      completionStatus,
      updatedAt: new Date().toISOString(),
      createdAt: processedData.createdAt || new Date().toISOString(),
    }

    // Save to database
    const { data, error } = await supabase.from("order_data").upsert(finalData, { onConflict: "id" }).select().single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data,
      completionStatus,
      analyticsGenerated: generateAnalytics,
    })
  } catch (error) {
    console.error("Error saving order data:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save order data" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("id")
    const userId = searchParams.get("userId")
    const restaurantId = searchParams.get("restaurantId")

    let query = supabase.from("order_data").select("*")

    if (orderId) {
      query = query.eq("id", orderId)
    } else if (restaurantId) {
      query = query.eq("restaurantId", restaurantId)
    } else if (userId) {
      query = query.eq("userId", userId)
    } else {
      return NextResponse.json({ error: "Order ID, Restaurant ID, or User ID required" }, { status: 400 })
    }

    const { data, error } = await query.single()

    if (error && error.code !== "PGRST116") {
      throw new Error(`Database error: ${error.message}`)
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching order data:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch order data" },
      { status: 500 },
    )
  }
}

function calculateOrderCompletionStatus(data: Partial<OrderData>) {
  const sections = {
    orders: !!(data.orders && data.orders.length > 0),
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

async function generateOrderAnalytics(data: Partial<OrderData>) {
  try {
    if (!data.orders || data.orders.length === 0) {
      return data
    }

    const orders = data.orders
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.finalAmount, 0)
    const avgOrderValue = totalRevenue / totalOrders

    // Top selling items
    const itemCounts = new Map()
    orders.forEach((order) => {
      order.itemList.forEach((item) => {
        const existing = itemCounts.get(item.name) || { quantity: 0, revenue: 0 }
        itemCounts.set(item.name, {
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + item.totalPrice,
        })
      })
    })

    const topSellingItems = Array.from(itemCounts.entries())
      .map(([itemName, data]) => ({ itemName, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)

    // Orders by slot
    const slotCounts = new Map()
    orders.forEach((order) => {
      const existing = slotCounts.get(order.orderSlot) || { count: 0, revenue: 0 }
      slotCounts.set(order.orderSlot, {
        count: existing.count + 1,
        revenue: existing.revenue + order.finalAmount,
      })
    })

    const ordersBySlot = Array.from(slotCounts.entries()).map(([slot, data]) => ({ slot, ...data }))

    // Orders by source
    const sourceCounts = new Map()
    orders.forEach((order) => {
      const existing = sourceCounts.get(order.orderSource) || { count: 0, revenue: 0 }
      sourceCounts.set(order.orderSource, {
        count: existing.count + 1,
        revenue: existing.revenue + order.finalAmount,
      })
    })

    const ordersBySource = Array.from(sourceCounts.entries()).map(([source, data]) => ({ source, ...data }))

    // Daily trends (last 30 days)
    const dailyTrends = generateDailyTrends(orders)
    const monthlyTrends = generateMonthlyTrends(orders)
    const peakHours = generatePeakHours(orders)

    const analytics = {
      totalOrders,
      totalRevenue,
      avgOrderValue,
      topSellingItems,
      ordersBySlot,
      ordersBySource,
      dailyTrends,
      monthlyTrends,
      peakHours,
      avgPreparationTime: 25, // Mock data
      customerRetention: 65, // Mock data
    }

    return {
      ...data,
      analytics,
    }
  } catch (error) {
    console.error("Analytics generation error:", error)
    return data
  }
}

function generateDailyTrends(orders: any[]) {
  const dailyData = new Map()

  orders.forEach((order) => {
    const date = order.orderDate
    const existing = dailyData.get(date) || { orders: 0, revenue: 0 }
    dailyData.set(date, {
      orders: existing.orders + 1,
      revenue: existing.revenue + order.finalAmount,
    })
  })

  return Array.from(dailyData.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30) // Last 30 days
}

function generateMonthlyTrends(orders: any[]) {
  const monthlyData = new Map()

  orders.forEach((order) => {
    const month = order.orderDate.substring(0, 7) // YYYY-MM
    const existing = monthlyData.get(month) || { orders: 0, revenue: 0 }
    monthlyData.set(month, {
      orders: existing.orders + 1,
      revenue: existing.revenue + order.finalAmount,
    })
  })

  return Array.from(monthlyData.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12) // Last 12 months
}

function generatePeakHours(orders: any[]) {
  const hourlyData = new Map()

  orders.forEach((order) => {
    const hour = order.orderTime.substring(0, 2) // HH
    const existing = hourlyData.get(hour) || 0
    hourlyData.set(hour, existing + 1)
  })

  return Array.from(hourlyData.entries())
    .map(([hour, orderCount]) => ({ hour: `${hour}:00`, orderCount }))
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 6) // Top 6 peak hours
}
