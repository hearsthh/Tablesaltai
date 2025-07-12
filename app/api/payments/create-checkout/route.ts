import { type NextRequest, NextResponse } from "next/server"
import { stripe, PRICING_PLANS } from "@/lib/payments/stripe-config"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { planId, restaurantId } = await request.json()

    if (!planId || !restaurantId) {
      return NextResponse.json({ error: "Plan ID and Restaurant ID are required" }, { status: 400 })
    }

    const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS]
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 })
    }

    // Get user session
    const supabase = getSupabaseServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: plan.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        restaurantId,
        planId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
