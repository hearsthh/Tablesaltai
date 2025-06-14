"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  pricingTiers,
  calculateMargins,
  alternativePricingStrategies,
  competitorPricing,
  calculateRestaurantROI,
} from "@/lib/pricing/pricing-calculator"
import { TrendingUp, Target, Calculator } from "lucide-react"

export function PricingAnalysisDashboard() {
  const [selectedTier, setSelectedTier] = useState(pricingTiers[1])
  const [roiInputs, setRoiInputs] = useState({
    monthlyRevenue: 50000,
    customerAcquisitionCost: 25,
    averageOrderValue: 45,
    customerLifetimeValue: 500,
  })

  const margins = calculateMargins(selectedTier)
  const roi = calculateRestaurantROI({ ...roiInputs, pricingTier: selectedTier })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pricing Strategy Analysis</h1>
        <Badge variant="outline" className="text-lg px-4 py-2">
          TableSalt AI Pricing
        </Badge>
      </div>

      <Tabs defaultValue="current-pricing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="current-pricing">Current Pricing</TabsTrigger>
          <TabsTrigger value="margins">Margin Analysis</TabsTrigger>
          <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="roi-calculator">ROI Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="current-pricing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative ${selectedTier.name === tier.name ? "ring-2 ring-orange-500" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    {tier.name === "Professional" && <Badge className="bg-orange-500">Most Popular</Badge>}
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">
                      ${tier.monthlyPrice}
                      <span className="text-lg font-normal">/month</span>
                    </div>
                    <div className="text-sm text-gray-600">${tier.yearlyPrice}/year (save 2 months)</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Features:</h4>
                    <ul className="text-sm space-y-1">
                      {tier.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                      {tier.features.length > 4 && (
                        <li className="text-gray-500">+{tier.features.length - 4} more features</li>
                      )}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Limits:</h4>
                    <div className="text-sm space-y-1">
                      <div>Restaurants: {tier.limits.restaurants === -1 ? "Unlimited" : tier.limits.restaurants}</div>
                      <div>Customers: {tier.limits.customers.toLocaleString()}</div>
                      <div>AI Credits: {tier.limits.aiCredits.toLocaleString()}/month</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedTier(tier)}
                    variant={selectedTier.name === tier.name ? "default" : "outline"}
                    className="w-full"
                  >
                    {selectedTier.name === tier.name ? "Selected" : "Analyze This Tier"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="margins" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Margin Analysis - {selectedTier.name} Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Revenue & Costs</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Monthly Revenue:</span>
                      <span className="font-semibold text-green-600">${margins.revenue}</span>
                    </div>
                    <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span>AI Services:</span>
                        <span>${margins.costs.ai}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Infrastructure:</span>
                        <span>${margins.costs.infrastructure}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Support:</span>
                        <span>${margins.costs.support}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Development:</span>
                        <span>${margins.costs.development}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Marketing:</span>
                        <span>${margins.costs.marketing}</span>
                      </div>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Total Costs:</span>
                      <span className="font-semibold text-red-600">${margins.costs.total}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Profitability</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Gross Profit:</span>
                      <span className="font-semibold text-blue-600">${margins.grossProfit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Margin:</span>
                      <span
                        className={`font-bold text-lg ${margins.marginPercentage > 20 ? "text-green-600" : margins.marginPercentage > 10 ? "text-yellow-600" : "text-red-600"}`}
                      >
                        {margins.marginPercentage}%
                      </span>
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Margin Health:</h4>
                      <p className="text-sm">
                        {margins.marginPercentage > 20 ? (
                          <span className="text-green-600">✅ Healthy margin - Good profitability</span>
                        ) : margins.marginPercentage > 10 ? (
                          <span className="text-yellow-600">⚠️ Moderate margin - Room for improvement</span>
                        ) : (
                          <span className="text-red-600">❌ Low margin - Needs optimization</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricingTiers.map((tier) => {
              const tierMargins = calculateMargins(tier)
              return (
                <Card key={tier.name}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Revenue:</span>
                        <span>${tierMargins.revenue}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Costs:</span>
                        <span>${tierMargins.costs.total}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Margin:</span>
                        <span
                          className={
                            tierMargins.marginPercentage > 20
                              ? "text-green-600"
                              : tierMargins.marginPercentage > 10
                                ? "text-yellow-600"
                                : "text-red-600"
                          }
                        >
                          {tierMargins.marginPercentage}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="alternatives" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {alternativePricingStrategies.map((strategy) => (
              <Card key={strategy.name}>
                <CardHeader>
                  <CardTitle>{strategy.name}</CardTitle>
                  <p className="text-sm text-gray-600">{strategy.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Pros:</h4>
                    <ul className="text-sm space-y-1">
                      {strategy.pros.map((pro, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Cons:</h4>
                    <ul className="text-sm space-y-1">
                      {strategy.cons.map((con, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">-</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Pricing Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitorPricing.map((competitor) => (
                  <div key={competitor.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{competitor.name}</h3>
                      <p className="text-sm text-gray-600">{competitor.features}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{competitor.pricing}</div>
                    </div>
                  </div>
                ))}
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h3 className="font-semibold text-orange-800">TableSalt AI</h3>
                  <p className="text-sm text-orange-600">
                    Complete AI-powered marketing suite with advanced automation
                  </p>
                  <div className="text-right">
                    <div className="font-semibold text-orange-800">$49-399/month</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi-calculator" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  Restaurant Inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="monthlyRevenue">Monthly Revenue ($)</Label>
                  <Input
                    id="monthlyRevenue"
                    type="number"
                    value={roiInputs.monthlyRevenue}
                    onChange={(e) => setRoiInputs({ ...roiInputs, monthlyRevenue: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="cac">Customer Acquisition Cost ($)</Label>
                  <Input
                    id="cac"
                    type="number"
                    value={roiInputs.customerAcquisitionCost}
                    onChange={(e) => setRoiInputs({ ...roiInputs, customerAcquisitionCost: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="aov">Average Order Value ($)</Label>
                  <Input
                    id="aov"
                    type="number"
                    value={roiInputs.averageOrderValue}
                    onChange={(e) => setRoiInputs({ ...roiInputs, averageOrderValue: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="clv">Customer Lifetime Value ($)</Label>
                  <Input
                    id="clv"
                    type="number"
                    value={roiInputs.customerLifetimeValue}
                    onChange={(e) => setRoiInputs({ ...roiInputs, customerLifetimeValue: Number(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  ROI Analysis - {selectedTier.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Monthly Benefit:</span>
                    <span className="font-semibold text-green-600">${roi.monthlyBenefit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Cost:</span>
                    <span className="font-semibold text-red-600">${roi.monthlyCost}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Monthly ROI:</span>
                    <span
                      className={`font-bold text-lg ${roi.monthlyROI > 200 ? "text-green-600" : roi.monthlyROI > 100 ? "text-yellow-600" : "text-red-600"}`}
                    >
                      {roi.monthlyROI}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payback Period:</span>
                    <span className="font-semibold">{roi.paybackPeriod} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual ROI:</span>
                    <span className="font-bold text-blue-600">{roi.annualROI}%</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">ROI Assessment:</h4>
                  <p className="text-sm">
                    {roi.monthlyROI > 200 ? (
                      <span className="text-green-600">🚀 Excellent ROI - Strong value proposition</span>
                    ) : roi.monthlyROI > 100 ? (
                      <span className="text-yellow-600">✅ Good ROI - Solid investment</span>
                    ) : (
                      <span className="text-red-600">⚠️ Low ROI - May need pricing adjustment</span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
