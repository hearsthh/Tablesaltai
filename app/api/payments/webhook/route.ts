import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/payments/stripe-config"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get("stripe-signature")!

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  const supabase = getSupabaseServerClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        const { userId, restaurantId, planId } = session.metadata!

        // Create subscription record
        await supabase.from("subscriptions").insert({
          user_id: userId,
          restaurant_id: restaurantId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          plan_id: planId,
          status: "active",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })

        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object

        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id)

        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object

        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id)

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
