"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Star, Zap, Users, TrendingUp, Brain, Globe, ArrowRight, Target, BarChart3 } from "lucide-react"
import { COMPLETE_PRICING_TIERS, calculateROI } from "@/lib/pricing/complete-pricing-strategy"

export function CompletePricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [selectedBusinessType, setSelectedBusinessType] = useState("Restaurant")
  const [monthlyRevenue, setMonthlyRevenue] = useState(200000)

  const getDiscountedPrice = (price: number) => {
    return isAnnual ? Math.round(price * 10) : price // 2 months free on annual
  }

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "profile":
        return <Users className="w-5 h-5" />
      case "marketing":
        return <TrendingUp className="w-5 h-5" />
      case "customers":
        return <Target className="w-5 h-5" />
      case "ai":
        return <Brain className="w-5 h-5" />
      default:
        return <Zap className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-slate-900">AI-Powered Restaurant Platform</h1>
          </div>
          <p className="text-xl text-slate-600 mb-6">
            Complete restaurant management with AI automation for the Indian market
          </p>
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className="text-sm text-slate-600">Monthly</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} className="data-[state=checked]:bg-blue-600" />
            <span className="text-sm text-slate-600">Annual</span>
            <Badge className="bg-green-100 text-green-700 ml-2">Save 2 months free!</Badge>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {COMPLETE_PRICING_TIERS.map((tier) => {
            const price = getDiscountedPrice(tier.price)
            const roi = calculateROI(tier.id, monthlyRevenue)

            return (
              <Card
                key={tier.id}
                className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
                  tier.popular ? "border-blue-500 shadow-lg scale-105" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-slate-900">{tier.name}</CardTitle>
                  <div className="text-sm text-slate-500 mb-2">{tier.nameHindi}</div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-slate-900">₹{price.toLocaleString()}</span>
                    <span className="text-slate-600">/{isAnnual ? "year" : "month"}</span>
                    <div className="text-sm text-slate-500">(~${tier.priceUSD} USD)</div>
                  </div>
                  <div className="text-xs text-slate-600 mb-4">Perfect for: {tier.targetAudience.join(", ")}</div>

                  {/* ROI Calculator */}
                  <div className="bg-green-50 p-3 rounded-lg mb-4">
                    <div className="text-sm font-medium text-green-800">Expected ROI</div>
                    <div className="text-lg font-bold text-green-900">{roi.annualROI}% annually</div>
                    <div className="text-xs text-green-700">Payback in {roi.paybackPeriod} months</div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features by Module */}
                  <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="profile" className="text-xs">
                        <Users className="w-3 h-3" />
                      </TabsTrigger>
                      <TabsTrigger value="marketing" className="text-xs">
                        <TrendingUp className="w-3 h-3" />
                      </TabsTrigger>
                      <TabsTrigger value="customers" className="text-xs">
                        <Target className="w-3 h-3" />
                      </TabsTrigger>
                      <TabsTrigger value="ai" className="text-xs">
                        <Brain className="w-3 h-3" />
                      </TabsTrigger>
                    </TabsList>

                    {Object.entries(tier.features).map(([module, features]) => (
                      <TabsContent key={module} value={module} className="space-y-2">
                        <div className="flex items-center mb-2">
                          {getModuleIcon(module)}
                          <span className="ml-2 font-medium capitalize">{module}</span>
                        </div>
                        {features.slice(0, 4).map((feature, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-700">{feature}</span>
                          </div>
                        ))}
                        {features.length > 4 && (
                          <div className="text-xs text-slate-500">+{features.length - 4} more features</div>
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>

                  {/* Limits */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-slate-900 mb-2">Usage Limits</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        Menu Items: <span className="font-medium">{tier.limits.menuItems}</span>
                      </div>
                      <div>
                        Campaigns: <span className="font-medium">{tier.limits.campaigns}</span>
                      </div>
                      <div>
                        Customers: <span className="font-medium">{tier.limits.customers}</span>
                      </div>
                      <div>
                        AI Credits: <span className="font-medium">{tier.limits.aiCredits}/mo</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full ${
                      tier.popular ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-900 hover:bg-slate-800"
                    }`}
                    size="lg"
                  >
                    Start {tier.name} Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <div className="text-center text-xs text-slate-500">
                    14-day free trial • No setup fees • Cancel anytime
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* AI Features Highlight */}
        <Card className="mb-16 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center">
              <Brain className="w-6 h-6 mr-2 text-blue-600" />
              AI-Powered Features
            </CardTitle>
            <CardDescription>
              Advanced artificial intelligence to automate and optimize your restaurant operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Smart Marketing</h3>
                <p className="text-sm text-slate-600">
                  AI generates campaigns, content, and predicts ROI for maximum impact
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Customer Intelligence</h3>
                <p className="text-sm text-slate-600">
                  Predict churn, segment customers, and personalize experiences automatically
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Predictive Analytics</h3>
                <p className="text-sm text-slate-600">
                  Forecast revenue, optimize pricing, and make data-driven decisions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Analysis */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
              <Globe className="w-6 h-6 mr-2 text-green-600" />
              Indian Restaurant Market
            </CardTitle>
            <CardDescription>Positioned for the growing Indian restaurant technology market</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹2,400 Cr</div>
                <div className="text-sm text-slate-600">Market Size by 2025</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">7,00,000</div>
                <div className="text-sm text-slate-600">Total Restaurants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">35%</div>
                <div className="text-sm text-slate-600">Digital Adoption</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">25%</div>
                <div className="text-sm text-slate-600">YoY Growth Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">How does the AI actually help my restaurant?</h3>
              <p className="text-slate-600">
                Our AI automates content creation, predicts customer behavior, optimizes marketing campaigns, and
                provides actionable insights to increase revenue by 15-35% on average.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">What payment methods do you accept in India?</h3>
              <p className="text-slate-600">
                We accept all major payment methods including UPI (PhonePe, Google Pay, Paytm), credit/debit cards, net
                banking, and digital wallets through Razorpay.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Can I integrate with Zomato and Swiggy?</h3>
              <p className="text-slate-600">
                Yes! We have direct integrations with Zomato for Business, Swiggy Partner, Google My Business, and all
                major Indian food delivery platforms.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Is there support in Hindi and regional languages?</h3>
              <p className="text-slate-600">
                Yes, our platform supports Hindi and major regional languages. Our support team also provides assistance
                in Hindi and English.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
