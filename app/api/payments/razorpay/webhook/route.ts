import { type NextRequest, NextResponse } from "next/server"
import { RazorpayService } from "@/lib/payments/razorpay-integration"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const razorpayService = new RazorpayService({
  keyId: process.env.RAZORPAY_KEY_ID!,
  keySecret: process.env.RAZORPAY_KEY_SECRET!,
  webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-razorpay-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    const payload = JSON.parse(body)
    const result = await razorpayService.handleWebhook(payload, signature)

    // Update subscription status in Supabase
    if (result.processed) {
      const supabase = getSupabaseServerClient()

      switch (result.action) {
        case "subscription_activated":
          await supabase
            .from("user_subscriptions")
            .update({
              status: "active",
              activated_at: new Date().toISOString(),
            })
            .eq("razorpay_subscription_id", payload.payload.subscription.entity.id)
          break

        case "subscription_cancelled":
          await supabase
            .from("user_subscriptions")
            .update({
              status: "cancelled",
              cancelled_at: new Date().toISOString(),
            })
            .eq("razorpay_subscription_id", payload.payload.subscription.entity.id)
          break

        case "payment_failed":
          await supabase.from("payment_logs").insert({
            payment_id: payload.payload.payment.entity.id,
            status: "failed",
            amount: payload.payload.payment.entity.amount,
            currency: payload.payload.payment.entity.currency,
            failure_reason: payload.payload.payment.entity.error_description,
          })
          break
      }
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
