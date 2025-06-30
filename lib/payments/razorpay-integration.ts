// Razorpay integration for Indian payments
export interface RazorpayConfig {
  keyId: string
  keySecret: string
  webhookSecret: string
}

export interface SubscriptionPlan {
  planId: string
  name: string
  amount: number
  currency: "INR"
  interval: "monthly" | "yearly"
  intervalCount: 1 | 12
}

export class RazorpayService {
  private config: RazorpayConfig

  constructor(config: RazorpayConfig) {
    this.config = config
  }

  // Create subscription plan
  async createSubscriptionPlan(plan: Omit<SubscriptionPlan, "planId">) {
    try {
      const response = await fetch("https://api.razorpay.com/v1/plans", {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.config.keyId}:${this.config.keySecret}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          period: plan.interval,
          interval: plan.intervalCount,
          item: {
            name: plan.name,
            amount: plan.amount * 100, // Convert to paise
            currency: plan.currency,
            description: `TableSalt ${plan.name} Plan`,
          },
        }),
      })

      const data = await response.json()
      return { success: true, planId: data.id, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Create subscription
  async createSubscription(customerId: string, planId: string) {
    try {
      const response = await fetch("https://api.razorpay.com/v1/subscriptions", {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.config.keyId}:${this.config.keySecret}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_id: planId,
          customer_notify: 1,
          total_count: 12, // For yearly plans
          start_at: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // Start tomorrow
          expire_by: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // Expire in 1 year
          notes: {
            service: "TableSalt Profile Module",
          },
        }),
      })

      const data = await response.json()
      return { success: true, subscriptionId: data.id, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Handle webhook
  async handleWebhook(payload: any, signature: string) {
    // Verify webhook signature
    const crypto = require("crypto")
    const expectedSignature = crypto
      .createHmac("sha256", this.config.webhookSecret)
      .update(JSON.stringify(payload))
      .digest("hex")

    if (signature !== expectedSignature) {
      throw new Error("Invalid webhook signature")
    }

    // Process webhook events
    switch (payload.event) {
      case "subscription.activated":
        return this.handleSubscriptionActivated(payload.payload.subscription.entity)
      case "subscription.cancelled":
        return this.handleSubscriptionCancelled(payload.payload.subscription.entity)
      case "payment.failed":
        return this.handlePaymentFailed(payload.payload.payment.entity)
      default:
        return { processed: false, event: payload.event }
    }
  }

  private async handleSubscriptionActivated(subscription: any) {
    // Update user subscription status in database
    return { processed: true, action: "subscription_activated" }
  }

  private async handleSubscriptionCancelled(subscription: any) {
    // Handle subscription cancellation
    return { processed: true, action: "subscription_cancelled" }
  }

  private async handlePaymentFailed(payment: any) {
    // Handle failed payment
    return { processed: true, action: "payment_failed" }
  }
}

// UPI integration for direct payments
export class UPIService {
  static generateUPILink(amount: number, merchantId: string, merchantName: string, transactionId: string) {
    const upiUrl = `upi://pay?pa=${merchantId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`TableSalt Subscription - ${transactionId}`)}&tr=${transactionId}`
    return upiUrl
  }

  static generateQRCode(upiLink: string) {
    // Generate QR code for UPI payment
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`
  }
}
