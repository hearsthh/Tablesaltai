"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  aiServiceCosts,
  aiFeatureCosts,
  calculateTotalAICosts,
  calculateOptimizationSavings,
  calculateValueToCostRatio,
} from "@/lib/analytics/ai-cost-analyzer"
import { Lightbulb, DollarSign, TrendingDown, BarChart3 } from "lucide-react"

const COLORS = ["#FF6B6B", "#4ECDC4", "#FFD166", "#06D6A0", "#118AB2", "#073B4C", "#8338EC", "#3A86FF", "#FB5607"]

export function AICostBreakdown() {
  const [selectedTier, setSelectedTier] = useState<"starter" | "professional" | "enterprise">("professional")

  const totalCosts = calculateTotalAICosts()
  const optimizationSavings = calculateOptimizationSavings()
  const valueRatio = calculateValueToCostRatio()

  // Prepare data for service cost chart
  const serviceChartData = aiServiceCosts.map((service) => ({
    name: service.service.replace("OpenAI ", "").replace(" Turbo", ""),
    cost: service.monthlyCost[selectedTier],
  }))

  // Prepare data for feature cost chart
  const featureChartData = aiFeatureCosts.map((feature) => ({
    name: feature.feature,
    cost: feature.monthlyCost[selectedTier],
    value: feature.businessValue,
  }))

  // Prepare data for pie chart
  const pieChartData = aiServiceCosts.map((service) => ({
    name: service.service.replace("OpenAI ", "").replace(" Turbo", ""),
    value: service.monthlyCost[selectedTier],
  }))

  // Prepare optimization data
  const optimizationData = [
    {
      name: "Current Cost",
      value: totalCosts[selectedTier],
    },
    {
      name: "Potential Savings",
      value: optimizationSavings[selectedTier],
    },
    {
      name: "Optimized Cost",
      value: totalCosts[selectedTier] - optimizationSavings[selectedTier],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Cost Breakdown</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Pricing Tier:</span>
          <div className="flex rounded-md border">
            <button
              onClick={() => setSelectedTier("starter")}
              className={`px-3 py-1 text-sm ${selectedTier === "starter" ? "bg-orange-500 text-white" : "bg-white"}`}
            >
              Starter
            </button>
            <button
              onClick={() => setSelectedTier("professional")}
              className={`px-3 py-1 text-sm ${selectedTier === "professional" ? "bg-orange-500 text-white" : "bg-white"}`}
            >
              Professional
            </button>
            <button
              onClick={() => setSelectedTier("enterprise")}
              className={`px-3 py-1 text-sm ${selectedTier === "enterprise" ? "bg-orange-500 text-white" : "bg-white"}`}
            >
              Enterprise
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Total Monthly AI Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalCosts[selectedTier].toFixed(2)}</div>
            <p className="text-sm text-gray-500 mt-1">
              {selectedTier === "starter"
                ? "Basic AI capabilities"
                : selectedTier === "professional"
                  ? "Advanced AI features"
                  : "Complete AI suite"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingDown className="w-5 h-5 mr-2" />
              Optimization Potential
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">${optimizationSavings[selectedTier].toFixed(2)}</div>
            <p className="text-sm text-gray-500 mt-1">
              {Math.round((optimizationSavings[selectedTier] / totalCosts[selectedTier]) * 100)}% potential savings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              Value-to-Cost Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{valueRatio[selectedTier].toFixed(2)}x</div>
            <p className="text-sm text-gray-500 mt-1">
              Business value relative to AI cost
              {valueRatio[selectedTier] > 1 ? " (positive ROI)" : " (negative ROI)"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="by-service" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="by-service">By Service</TabsTrigger>
          <TabsTrigger value="by-feature">By Feature</TabsTrigger>
          <TabsTrigger value="distribution">Cost Distribution</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="by-service" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                AI Service Costs - {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={serviceChartData.sort((a, b) => b.cost - a.cost)}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 70,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis label={{ value: "Cost ($)", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value) => [`$${value}`, "Monthly Cost"]} />
                    <Legend />
                    <Bar dataKey="cost" fill="#FF6B6B" name="Monthly Cost ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {aiServiceCosts
                    .sort((a, b) => b.monthlyCost[selectedTier] - a.monthlyCost[selectedTier])
                    .map((service, index) => (
                      <div key={index} className="border-b pb-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{service.service}</h3>
                          <Badge variant="outline">${service.monthlyCost[selectedTier]}/mo</Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          ${service.costPerUnit} per {service.unitType}
                        </div>
                        <div className="text-sm mt-2">
                          <span className="font-medium">Used for: </span>
                          {service.features.slice(0, 2).join(", ")}
                          {service.features.length > 2 ? ` +${service.features.length - 2} more` : ""}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {aiServiceCosts
                    .sort((a, b) => b.optimizationPotential - a.optimizationPotential)
                    .map((service, index) => (
                      <div key={index} className="border-b pb-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{service.service}</h3>
                          <Badge
                            variant="outline"
                            className={service.optimizationPotential > 0.5 ? "bg-green-100" : "bg-yellow-100"}
                          >
                            {Math.round(service.optimizationPotential * 100)}% savings potential
                          </Badge>
                        </div>
                        <div className="text-sm mt-2">
                          <span className="font-medium">Potential savings: </span>$
                          {(service.monthlyCost[selectedTier] * service.optimizationPotential).toFixed(2)}/mo
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {service.optimizationPotential > 0.5
                            ? "High optimization potential"
                            : service.optimizationPotential > 0.3
                              ? "Medium optimization potential"
                              : "Low optimization potential"}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="by-feature" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                AI Feature Costs - {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={featureChartData.sort((a, b) => b.cost - a.cost)}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 70,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis yAxisId="left" label={{ value: "Cost ($)", angle: -90, position: "insideLeft" }} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 10]}
                      label={{ value: "Business Value", angle: 90, position: "insideRight" }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="cost" fill="#4ECDC4" name="Monthly Cost ($)" />
                    <Bar yAxisId="right" dataKey="value" fill="#FFD166" name="Business Value (1-10)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Details</CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {aiFeatureCosts
                    .sort(
                      (a, b) =>
                        b.businessValue / b.monthlyCost[selectedTier] - a.businessValue / a.monthlyCost[selectedTier],
                    )
                    .map((feature, index) => (
                      <div key={index} className="border-b pb-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{feature.feature}</h3>
                          <Badge variant="outline">${feature.monthlyCost[selectedTier]}/mo</Badge>
                        </div>
                        <div className="text-sm mt-2">
                          <span className="font-medium">Value-to-Cost: </span>
                          <span
                            className={
                              feature.businessValue / feature.monthlyCost[selectedTier] > 0.5
                                ? "text-green-600"
                                : "text-yellow-600"
                            }
                          >
                            {(feature.businessValue / feature.monthlyCost[selectedTier]).toFixed(2)}x
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">Services: </span>
                          {feature.services.slice(0, 2).join(", ")}
                          {feature.services.length > 2 ? ` +${feature.services.length - 2} more` : ""}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">Usage: </span>
                          {feature.usageMetrics.averagePerRestaurant} {feature.usageMetrics.unitType}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Value Analysis</CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {aiFeatureCosts
                    .sort((a, b) => b.businessValue - a.businessValue)
                    .map((feature, index) => (
                      <div key={index} className="border-b pb-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{feature.feature}</h3>
                          <div className="flex items-center">
                            <Badge
                              variant="outline"
                              className={
                                feature.businessValue >= 9
                                  ? "bg-green-100"
                                  : feature.businessValue >= 7
                                    ? "bg-blue-100"
                                    : "bg-yellow-100"
                              }
                            >
                              Value: {feature.businessValue}/10
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm mt-2">
                          <span className="font-medium">Cost Efficiency: </span>
                          <span
                            className={
                              feature.costEfficiency >= 8
                                ? "text-green-600"
                                : feature.costEfficiency >= 6
                                  ? "text-blue-600"
                                  : "text-yellow-600"
                            }
                          >
                            {feature.costEfficiency}/10
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">Monthly Cost: </span>${feature.monthlyCost[selectedTier]}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">Cost per use: </span>$
                          {(feature.monthlyCost[selectedTier] / feature.usageMetrics.averagePerRestaurant).toFixed(2)}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                AI Cost Distribution - {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData.filter((item) => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, "Monthly Cost"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Percentage Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pieChartData
                    .filter((item) => item.value > 0)
                    .sort((a, b) => b.value - a.value)
                    .map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span>{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span>${item.value}</span>
                          <span className="text-gray-500">
                            {((item.value / totalCosts[selectedTier]) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Top Cost Drivers</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {pieChartData
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 3)
                        .map((item, index) => (
                          <li key={index}>
                            {item.name}: ${item.value} ({((item.value / totalCosts[selectedTier]) * 100).toFixed(1)}%)
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Cost Efficiency</h3>
                    <p className="text-sm">
                      {selectedTier === "starter"
                        ? "The Starter tier focuses on essential AI services with good cost efficiency."
                        : selectedTier === "professional"
                          ? "The Professional tier balances advanced AI capabilities with reasonable costs."
                          : "The Enterprise tier provides comprehensive AI capabilities with some premium services."}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Recommendations</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>
                        {pieChartData.sort((a, b) => b.value - a.value)[0].name} represents the highest cost - consider
                        optimization strategies
                      </li>
                      <li>
                        {pieChartData.filter((item) => item.value > 0).length} active AI services - evaluate if all are
                        providing sufficient value
                      </li>
                      <li>
                        Consider{" "}
                        {selectedTier === "starter"
                          ? "upgrading to Professional tier"
                          : selectedTier === "professional"
                            ? "custom optimization"
                            : "volume discounts"}{" "}
                        for better economics
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Optimization Potential</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={optimizationData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: "Cost ($)", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                    <Legend />
                    <Bar dataKey="value" name="Amount ($)">
                      {optimizationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? "#FF6B6B" : index === 1 ? "#4ECDC4" : "#06D6A0"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md bg-green-50">
                    <h3 className="font-medium mb-1">Caching & Reuse</h3>
                    <p className="text-sm">
                      Implement caching for common AI responses and content. Potential savings: 20-30%
                    </p>
                  </div>

                  <div className="p-3 border rounded-md bg-blue-50">
                    <h3 className="font-medium mb-1">Prompt Engineering</h3>
                    <p className="text-sm">
                      Optimize prompts to reduce token usage and improve response quality. Potential savings: 15-25%
                    </p>
                  </div>

                  <div className="p-3 border rounded-md bg-yellow-50">
                    <h3 className="font-medium mb-1">Tiered Processing</h3>
                    <p className="text-sm">
                      Use cheaper models for initial processing, premium models only when needed. Potential savings:
                      30-40%
                    </p>
                  </div>

                  <div className="p-3 border rounded-md bg-purple-50">
                    <h3 className="font-medium mb-1">Batch Processing</h3>
                    <p className="text-sm">
                      Group similar requests and process them together. Potential savings: 10-20%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Implementation Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Phase 1: Quick Wins</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Implement basic response caching (2 weeks)</li>
                      <li>Optimize top 5 most expensive prompts (1 week)</li>
                      <li>Reduce image generation resolution where appropriate (1 week)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Phase 2: Advanced Optimization</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Develop tiered processing system (4 weeks)</li>
                      <li>Implement content reuse across customers (3 weeks)</li>
                      <li>Create AI usage analytics dashboard (2 weeks)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Phase 3: Long-term Efficiency</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Fine-tune custom models for restaurant domain (8 weeks)</li>
                      <li>Develop proprietary embeddings system (6 weeks)</li>
                      <li>Implement cross-customer knowledge sharing (4 weeks)</li>
                    </ul>
                  </div>

                  <div className="p-3 border rounded-md bg-green-50">
                    <h3 className="font-medium mb-1">Expected Outcome</h3>
                    <p className="text-sm">
                      Total potential savings: ${optimizationSavings[selectedTier].toFixed(2)}/month (
                      {Math.round((optimizationSavings[selectedTier] / totalCosts[selectedTier]) * 100)}%)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
