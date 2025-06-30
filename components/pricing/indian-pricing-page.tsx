"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown, Rocket } from "lucide-react"

interface RazorpayConfig {
  keyId: string
  currency: string
}

interface PricingPlan {
  id: string
  name: string
  price: number
  originalPrice?: number
  currency: string
  period: string
  description: string
  features: string[]
  popular?: boolean
  icon: React.ReactNode
  color: string
}

const plans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 999,
    originalPrice: 1499,
    currency: "INR",
    period: "month",
    description: "Perfect for small restaurants getting started with AI",
    features: [
      "AI Menu Optimization",
      "Basic Customer Insights",
      "Social Media Content (10/month)",
      "Email Support",
      "Basic Analytics",
      "1 Restaurant Profile",
    ],
    icon: <Zap className="h-6 w-6" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "professional",
    name: "Professional",
    price: 2499,
    originalPrice: 3499,
    currency: "INR",
    period: "month",
    description: "Ideal for growing restaurants with multiple locations",
    features: [
      "Everything in Starter",
      "Advanced AI Analytics",
      "Unlimited Social Media Content",
      "Customer Segmentation",
      "Review Management",
      "WhatsApp Integration",
      "Priority Support",
      "Up to 3 Restaurant Profiles",
    ],
    popular: true,
    icon: <Crown className="h-6 w-6" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 4999,
    originalPrice: 6999,
    currency: "INR",
    period: "month",
    description: "Complete solution for restaurant chains and franchises",
    features: [
      "Everything in Professional",
      "Custom AI Models",
      "Multi-location Management",
      "Advanced Integrations",
      "Dedicated Account Manager",
      "Custom Reporting",
      "API Access",
      "Unlimited Restaurant Profiles",
    ],
    icon: <Rocket className="h-6 w-6" />,
    color: "from-orange-500 to-red-500",
  },
]

export default function IndianPricingPage() {
  const [razorpayConfig, setRazorpayConfig] = useState<RazorpayConfig | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchRazorpayConfig()
  }, [])

  const fetchRazorpayConfig = async () => {
    try {
      const response = await fetch("/api/payments/razorpay-config")
      const data = await response.json()

      if (data.success) {
        setRazorpayConfig({
          keyId: data.keyId,
          currency: data.currency,
        })
      }
    } catch (error) {
      console.error("Failed to fetch Razorpay config:", error)
    }
  }

  const handleSubscribe = async (plan: PricingPlan) => {
    if (!razorpayConfig) {
      alert("Payment system not configured. Please try again later.")
      return
    }

    setLoading(plan.id)

    try {
      // Create order on server
      const orderResponse = await fetch("/api/payments/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: plan.id,
          amount: plan.price * 100, // Convert to paise
          currency: plan.currency,
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order")
      }

      // Initialize Razorpay
      const options = {
        key: razorpayConfig.keyId,
        amount: plan.price * 100,
        currency: plan.currency,
        name: "TableSalt AI",
        description: `${plan.name} Plan Subscription`,
        order_id: orderData.orderId,
        handler: (response: any) => {
          // Handle successful payment
          console.log("Payment successful:", response)
          alert("Payment successful! Welcome to TableSalt AI!")

          // Redirect to dashboard or success page
          window.location.href = "/dashboard"
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: () => {
            setLoading(null)
          },
        },
      }

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.onload = () => {
          const rzp = new window.Razorpay(options)
          rzp.open()
        }
        document.body.appendChild(script)
      } else {
        const rzp = new window.Razorpay(options)
        rzp.open()
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              AI-Powered{" "}
            </span>
            Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your restaurant with AI-driven insights, automated marketing, and intelligent customer management.
            Special launch pricing for Indian restaurants!
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
            <Star className="h-4 w-4 fill-current" />
            <span>Limited Time: Save up to 30% on all plans</span>
            <Star className="h-4 w-4 fill-current" />
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                plan.popular ? "ring-2 ring-purple-500 scale-105" : "hover:scale-105"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className={`bg-gradient-to-r ${plan.color} text-white ${plan.popular ? "pt-12" : "pt-6"}`}>
                <div className="flex items-center gap-3 mb-2">
                  {plan.icon}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">₹{plan.price.toLocaleString()}</span>
                  {plan.originalPrice && (
                    <span className="text-lg line-through opacity-75">₹{plan.originalPrice.toLocaleString()}</span>
                  )}
                  <span className="text-sm opacity-90">/{plan.period}</span>
                </div>
                {plan.originalPrice && (
                  <Badge variant="secondary" className="w-fit mt-2">
                    Save ₹{(plan.originalPrice - plan.price).toLocaleString()}
                  </Badge>
                )}
                <CardDescription className="text-white/90 mt-2">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.id}
                  className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-medium py-3 text-lg`}
                >
                  {loading === plan.id ? "Processing..." : `Start ${plan.name} Plan`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Why Choose TableSalt AI?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600 text-sm">
                Get intelligent recommendations for menu optimization and customer engagement
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Automated Marketing</h3>
              <p className="text-gray-600 text-sm">
                Generate social media content and marketing campaigns automatically
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Intelligence</h3>
              <p className="text-gray-600 text-sm">
                Understand your customers better with AI-driven analytics and segmentation
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Growth Acceleration</h3>
              <p className="text-gray-600 text-sm">
                Scale your restaurant business with data-driven decisions and automation
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
          <p className="text-gray-600 mb-6">Our team is here to help you choose the right plan for your restaurant.</p>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  )
}

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any
  }
}
