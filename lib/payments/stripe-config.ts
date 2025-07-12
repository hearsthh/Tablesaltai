import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
})

export const PRICING_PLANS = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    features: [
      "Basic restaurant profile",
      "Up to 50 menu items",
      "Basic analytics",
      "1 marketing campaign",
      "Email support",
    ],
    limits: {
      menuItems: 50,
      campaigns: 1,
      aiGenerations: 10,
      customers: 100,
    },
  },
  starter: {
    id: "price_starter_monthly",
    name: "Starter",
    price: 29,
    interval: "month",
    features: [
      "Everything in Free",
      "Unlimited menu items",
      "Advanced analytics",
      "5 marketing campaigns",
      "AI content generation",
      "Review management",
      "Priority support",
    ],
    limits: {
      menuItems: -1, // unlimited
      campaigns: 5,
      aiGenerations: 100,
      customers: 1000,
    },
  },
  professional: {
    id: "price_professional_monthly",
    name: "Professional",
    price: 79,
    interval: "month",
    features: [
      "Everything in Starter",
      "Unlimited campaigns",
      "Advanced AI features",
      "Multi-location support",
      "Custom integrations",
      "White-label options",
      "Phone support",
    ],
    limits: {
      menuItems: -1,
      campaigns: -1,
      aiGenerations: 500,
      customers: 10000,
    },
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    interval: "month",
    features: [
      "Everything in Professional",
      "Unlimited everything",
      "Custom AI training",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom development",
      "24/7 support",
    ],
    limits: {
      menuItems: -1,
      campaigns: -1,
      aiGenerations: -1,
      customers: -1,
    },
  },
} as const

export type PricingPlan = keyof typeof PRICING_PLANS
