"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CheckCircle, Star, Zap, Crown, Rocket, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small restaurants getting started with AI",
      icon: Rocket,
      price: {
        monthly: 2999,
        annual: 29990,
      },
      originalPrice: {
        monthly: 4999,
        annual: 49990,
      },
      features: [
        "AI-powered restaurant profile",
        "Basic menu optimization",
        "Social media content generation",
        "Review management",
        "2 platform integrations",
        "Email support",
        "Basic analytics",
        "Mobile app access",
      ],
      limitations: ["Up to 50 menu items", "100 AI-generated posts/month", "Basic templates only"],
      cta: "Start Free Trial",
      popular: false,
      color: "border-gray-200",
      buttonColor: "bg-gray-900 hover:bg-gray-800",
    },
    {
      name: "Professional",
      description: "Advanced AI features for growing restaurants",
      icon: Star,
      price: {
        monthly: 4999,
        annual: 49990,
      },
      originalPrice: {
        monthly: 7999,
        annual: 79990,
      },
      features: [
        "Everything in Starter",
        "Advanced AI content generation",
        "Customer segmentation & insights",
        "Marketing campaign automation",
        "5 platform integrations",
        "Priority support",
        "Advanced analytics & reporting",
        "Custom branding",
        "A/B testing tools",
        "Inventory management integration",
      ],
      limitations: ["Up to 200 menu items", "500 AI-generated posts/month"],
      cta: "Start Free Trial",
      popular: true,
      color: "border-blue-500 ring-2 ring-blue-500/20",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Enterprise",
      description: "Complete AI solution for restaurant chains",
      icon: Crown,
      price: {
        monthly: 9999,
        annual: 99990,
      },
      originalPrice: {
        monthly: 15999,
        annual: 159990,
      },
      features: [
        "Everything in Professional",
        "Multi-location management",
        "Custom AI model training",
        "Advanced predictive analytics",
        "Unlimited platform integrations",
        "Dedicated account manager",
        "Custom integrations & API access",
        "White-label solutions",
        "Advanced security & compliance",
        "Custom reporting & dashboards",
        "Staff training & onboarding",
      ],
      limitations: ["Unlimited menu items", "Unlimited AI generation"],
      cta: "Contact Sales",
      popular: false,
      color: "border-purple-500",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateSavings = (monthly: number, annual: number) => {
    const monthlyCost = monthly * 12
    const savings = monthlyCost - annual
    const percentage = Math.round((savings / monthlyCost) * 100)
    return { amount: savings, percentage }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your restaurant. All plans include a 14-day free trial.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Launch Offer Banner */}
        <div className="mb-12 p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white text-center">
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">🇮🇳 India Launch Special</h2>
          </div>
          <p className="text-lg mb-4">
            Get 40% off all plans for the first 6 months! Limited time offer for early adopters.
          </p>
          <Badge className="bg-white text-green-600 font-semibold px-4 py-2">Offer valid until March 31, 2024</Badge>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4 bg-white p-2 rounded-lg border border-gray-200">
            <span className={`text-sm font-medium ${!isAnnual ? "text-gray-900" : "text-gray-500"}`}>Monthly</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span className={`text-sm font-medium ${isAnnual ? "text-gray-900" : "text-gray-500"}`}>Annual</span>
            {isAnnual && <Badge className="bg-green-100 text-green-800 ml-2">Save up to 17%</Badge>}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const savings = calculateSavings(plan.price.monthly, plan.price.annual)
            const currentPrice = isAnnual ? plan.price.annual : plan.price.monthly
            const originalPrice = isAnnual ? plan.originalPrice.annual : plan.originalPrice.monthly
            const discountedPrice = Math.round(currentPrice * 0.6) // 40% off

            return (
              <Card
                key={plan.name}
                className={`relative ${plan.color} ${plan.popular ? "scale-105" : ""} transition-all duration-200 hover:shadow-lg`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div className="flex items-center justify-center mb-4">
                    <plan.icon className="w-8 h-8 text-gray-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600 mt-2">{plan.description}</CardDescription>

                  <div className="mt-6">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-3xl font-bold text-gray-900">{formatPrice(discountedPrice)}</span>
                      <span className="text-lg text-gray-500 line-through">{formatPrice(currentPrice)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">per {isAnnual ? "year" : "month"}</p>
                    {isAnnual && (
                      <p className="text-sm text-green-600 font-medium mt-2">
                        Save {formatPrice(savings.amount)} ({savings.percentage}% off)
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Features included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Plan limits:</h4>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button className={`w-full ${plan.buttonColor} text-white font-medium py-3`} asChild>
                    <Link href={plan.name === "Enterprise" ? "/contact" : "/auth/signup"}>
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Compare All Features</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Features</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Starter</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Professional</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  {
                    feature: "AI Content Generation",
                    starter: "Basic",
                    professional: "Advanced",
                    enterprise: "Custom AI Models",
                  },
                  { feature: "Platform Integrations", starter: "2", professional: "5", enterprise: "Unlimited" },
                  { feature: "Menu Items", starter: "50", professional: "200", enterprise: "Unlimited" },
                  {
                    feature: "Analytics & Reporting",
                    starter: "Basic",
                    professional: "Advanced",
                    enterprise: "Custom Dashboards",
                  },
                  { feature: "Support", starter: "Email", professional: "Priority", enterprise: "Dedicated Manager" },
                  { feature: "Multi-location", starter: "❌", professional: "❌", enterprise: "✅" },
                  { feature: "API Access", starter: "❌", professional: "❌", enterprise: "✅" },
                  { feature: "White-label", starter: "❌", professional: "❌", enterprise: "✅" },
                ].map((row, index) => (
                  <tr key={index}>
                    <td className="py-4 px-4 font-medium text-gray-900">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-gray-700">{row.starter}</td>
                    <td className="py-4 px-4 text-center text-gray-700">{row.professional}</td>
                    <td className="py-4 px-4 text-center text-gray-700">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Is there a free trial?",
                answer:
                  "Yes! All plans include a 14-day free trial with full access to features. No credit card required.",
              },
              {
                question: "Can I change plans anytime?",
                answer:
                  "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, UPI, net banking, and digital wallets for Indian customers.",
              },
              {
                question: "Is my data secure?",
                answer: "Yes, we use enterprise-grade security with encryption, regular backups, and SOC 2 compliance.",
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee if you're not satisfied with our service.",
              },
              {
                question: "Can I integrate with my existing POS?",
                answer: "Yes, we support integration with popular POS systems like PetPooja, Ezetap, and Square.",
              },
            ].map((faq, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Restaurant?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of restaurants already using TableSalt AI to grow their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8" asChild>
              <Link href="/auth/signup">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 bg-transparent"
              asChild
            >
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
