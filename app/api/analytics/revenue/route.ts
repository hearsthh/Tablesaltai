import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()

    // Get revenue analytics for the last 12 months
    const { data: revenueData, error } = await supabase
      .from("revenue_analytics")
      .select("*")
      .gte("date", new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
      .order("date", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate key metrics
    const totalRevenue = revenueData.reduce((sum, record) => sum + record.total_revenue, 0)
    const currentMRR = revenueData[revenueData.length - 1]?.mrr || 0
    const avgChurnRate = revenueData.reduce((sum, record) => sum + record.churn_rate, 0) / revenueData.length

    // Get subscription distribution
    const { data: subscriptionData, error: subError } = await supabase
      .from("user_subscriptions")
      .select("plan_id, status")
      .eq("status", "active")

    if (subError) {
      return NextResponse.json({ error: subError.message }, { status: 500 })
    }

    const planDistribution = subscriptionData.reduce(
      (acc, sub) => {
        acc[sub.plan_id] = (acc[sub.plan_id] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      totalRevenue: totalRevenue / 100, // Convert from paise to rupees
      currentMRR: currentMRR / 100,
      avgChurnRate,
      planDistribution,
      monthlyData: revenueData.map((record) => ({
        ...record,
        total_revenue: record.total_revenue / 100,
        mrr: record.mrr / 100,
      })),
    })
  } catch (error) {
    console.error("Revenue analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
