import { type NextRequest, NextResponse } from "next/server"
import { RazorpayService } from "@/lib/payments/razorpay-integration"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { indianPricingTiers } from "@/lib/pricing/india-pricing-strategy"

const razorpayService = new RazorpayService({
  keyId: process.env.RAZORPAY_KEY_ID!,
  keySecret: process.env.RAZORPAY_KEY_SECRET!,
  webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { userId, planId, billingCycle } = await request.json()

    // Get plan details
    const plan = indianPricingTiers.find((p) => p.id === planId)
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const amount = billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice
    const interval = billingCycle === "yearly" ? "yearly" : "monthly"

    // Create Razorpay subscription plan
    const planResult = await razorpayService.createSubscriptionPlan({
      name: `${plan.name} - ${billingCycle}`,
      amount,
      currency: "INR",
      interval,
      intervalCount: billingCycle === "yearly" ? 12 : 1,
    })

    if (!planResult.success) {
      return NextResponse.json({ error: "Failed to create plan" }, { status: 500 })
    }

    // Create subscription
    const subscriptionResult = await razorpayService.createSubscription(userId, planResult.planId)

    if (!subscriptionResult.success) {
      return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
    }

    // Save subscription to database
    const supabase = getSupabaseServerClient()
    await supabase.from("user_subscriptions").insert({
      user_id: userId,
      plan_id: planId,
      billing_cycle: billingCycle,
      amount,
      currency: "INR",
      razorpay_plan_id: planResult.planId,
      razorpay_subscription_id: subscriptionResult.subscriptionId,
      status: "created",
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      subscriptionId: subscriptionResult.subscriptionId,
      planId: planResult.planId,
    })
  } catch (error) {
    console.error("Subscription creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
