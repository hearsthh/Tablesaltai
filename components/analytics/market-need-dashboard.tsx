"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  marketSegments,
  competitors,
  marketTrends,
  marketSizeData,
  calculateRestaurantROI,
  analyzeMarketFit,
} from "@/lib/analytics/market-need-analysis"
import { Target, TrendingUp, Users, BarChart3 } from "lucide-react"

export function MarketNeedDashboard() {
  const marketFit = analyzeMarketFit()
  const sampleROI = calculateRestaurantROI(50000, "professional")

  // Prepare data for segment chart
  const segmentChartData = marketSegments.map((segment) => ({
    name: segment.segment,
    willingness: segment.willingnessToPay,
    readiness: segment.adoptionReadiness,
    pressure: segment.competitivePressure,
  }))

  // Prepare data for competitor chart
  const competitorChartData = competitors.map((competitor) => ({
    name: competitor.name,
    threat: competitor.threatLevel,
  }))

  // Prepare data for trend chart
  const trendChartData = marketTrends.map((trend) => ({
    name: trend.trend,
    relevance: trend.relevanceScore,
  }))

  // Prepare data for radar chart
  const radarChartData = [
    {
      subject: "Willingness to Pay",
      A: marketFit.keyMetrics.willingnessToPay,
      fullMark: 10,
    },
    {
      subject: "Adoption Readiness",
      A: marketFit.keyMetrics.adoptionReadiness,
      fullMark: 10,
    },
    {
      subject: "Competitive Pressure",
      A: marketFit.keyMetrics.competitivePressure,
      fullMark: 10,
    },
    {
      subject: "Low Threat Level",
      A: 10 - marketFit.keyMetrics.competitorThreatLevel,
      fullMark: 10,
    },
    {
      subject: "Trend Relevance",
      A: marketFit.keyMetrics.trendRelevance,
      fullMark: 10,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Market Need Analysis</h1>
        <Badge
          variant="outline"
          className={`text-lg px-4 py-2 ${
            marketFit.marketFitCategory === "Excellent" || marketFit.marketFitCategory === "Strong"
              ? "bg-green-100"
              : marketFit.marketFitCategory === "Good"
                ? "bg-blue-100"
                : "bg-yellow-100"
          }`}
        >
          Market Fit: {marketFit.marketFitCategory}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Market Fit Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{marketFit.marketFitScore}/100</div>
            <Progress
              value={marketFit.marketFitScore}
              className="h-2 mt-2"
              indicatorClassName={
                marketFit.marketFitScore >= 85
                  ? "bg-green-500"
                  : marketFit.marketFitScore >= 70
                    ? "bg-blue-500"
                    : marketFit.marketFitScore >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
              }
            />
            <p className="text-sm text-gray-500 mt-2">
              {marketFit.marketFitScore >= 85
                ? "Excellent product-market fit"
                : marketFit.marketFitScore >= 70
                  ? "Strong market opportunity"
                  : marketFit.marketFitScore >= 50
                    ? "Good potential with optimization"
                    : "Needs significant repositioning"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Market Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$850M</div>
            <p className="text-sm text-gray-500 mt-1">AI restaurant marketing segment</p>
            <p className="text-sm font-medium text-green-600 mt-2">Growing at 25% annually</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Target Audience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">860,000+ Restaurants</div>
            <p className="text-sm text-gray-500 mt-1">in the US market</p>
            <div className="mt-3">
              <div className="text-sm font-medium">Top Segments:</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {marketFit.topSegments.map((segment, index) => (
                  <Badge key={index} variant="secondary">
                    {segment}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="segments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="segments">Market Segments</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="segments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Market Segment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={segmentChartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 70,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis domain={[0, 10]} label={{ value: "Score (1-10)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="willingness" name="Willingness to Pay" fill="#FF6B6B" />
                    <Bar dataKey="readiness" name="Adoption Readiness" fill="#4ECDC4" />
                    <Bar dataKey="pressure" name="Competitive Pressure" fill="#FFD166" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Segment Details</CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="space-y-6">
                  {marketSegments
                    .sort(
                      (a, b) => b.willingnessToPay + b.adoptionReadiness - (a.willingnessToPay + a.adoptionReadiness),
                    )
                    .map((segment, index) => (
                      <div key={index} className="border-b pb-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{segment.segment}</h3>
                          <Badge
                            variant="outline"
                            className={
                              segment.willingnessToPay >= 8
                                ? "bg-green-100"
                                : segment.willingnessToPay >= 6
                                  ? "bg-blue-100"
                                  : "bg-yellow-100"
                            }
                          >
                            Willingness: {segment.willingnessToPay}/10
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{segment.size}</div>
                        <div className="mt-2">
                          <div className="text-sm font-medium">Key Pain Points:</div>
                          <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                            {segment.painPoints.slice(0, 3).map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-2">
                          <div className="text-sm font-medium">AI Solutions:</div>
                          <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                            {segment.aiSolutions.slice(0, 3).map((solution, i) => (
                              <li key={i}>{solution}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-center justify-between mt-3 text-sm">
                          <div>
                            <span className="font-medium">Adoption Readiness: </span>
                            {segment.adoptionReadiness}/10
                          </div>
                          <div>
                            <span className="font-medium">Growth: </span>
                            {segment.growthRate}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Fit Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={radarChartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis domain={[0, 10]} />
                      <Radar name="Market Fit Factors" dataKey="A" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium mb-2">Key Insights</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>
                      <span className="font-medium">Best Target Segments: </span>
                      {marketFit.topSegments.join(", ")}
                    </li>
                    <li>
                      <span className="font-medium">Market Size: </span>
                      {marketSizeData.aiMarketingSegment} with {marketSizeData.digitalTransformationRate} of restaurants
                      increasing tech investment
                    </li>
                    <li>
                      <span className="font-medium">Competitive Landscape: </span>
                      Fragmented with no dominant AI-first solution
                    </li>
                    <li>
                      <span className="font-medium">Adoption Barriers: </span>
                      Technical complexity, cost concerns, and proof of ROI
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Landscape</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={competitorChartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      domain={[0, 10]}
                      label={{ value: "Threat Level (1-10)", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="threat" name="Competitive Threat" fill="#FF6B6B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="space-y-6">
                  {competitors
                    .sort((a, b) => b.threatLevel - a.threatLevel)
                    .map((competitor, index) => (
                      <div key={index} className="border-b pb-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{competitor.name}</h3>
                          <Badge
                            variant="outline"
                            className={
                              competitor.threatLevel >= 8
                                ? "bg-red-100"
                                : competitor.threatLevel >= 6
                                  ? "bg-yellow-100"
                                  : "bg-green-100"
                            }
                          >
                            Threat: {competitor.threatLevel}/10
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{competitor.primaryFocus}</div>
                        <div className="mt-2">
                          <div className="text-sm">
                            <span className="font-medium">AI Capabilities: </span>
                            {competitor.aiCapabilities}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Market Share: </span>
                            {competitor.marketShare}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Pricing: </span>
                            {competitor.pricing}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <div className="text-sm font-medium">Strengths:</div>
                            <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                              {competitor.strengths.slice(0, 3).map((strength, i) => (
                                <li key={i}>{strength}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Weaknesses:</div>
                            <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                              {competitor.weaknesses.slice(0, 3).map((weakness, i) => (
                                <li key={i}>{weakness}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitive Advantage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md bg-green-50">
                    <h3 className="font-medium mb-1">AI-First Approach</h3>
                    <p className="text-sm">
                      Unlike most competitors who add AI as a feature, TableSalt is built from the ground up with AI at
                      its core, enabling deeper integration and more powerful capabilities.
                    </p>
                  </div>

                  <div className="p-3 border rounded-md bg-blue-50">
                    <h3 className="font-medium mb-1">Comprehensive Solution</h3>
                    <p className="text-sm">
                      While competitors focus on specific areas (websites, reviews, social media), TableSalt provides an
                      all-in-one platform for restaurant marketing needs.
                    </p>
                  </div>

                  <div className="p-3 border rounded-md bg-yellow-50">
                    <h3 className="font-medium mb-1">Restaurant-Specific AI</h3>
                    <p className="text-sm">
                      Our AI models are specifically trained for restaurant marketing, menu optimization, and customer
                      insights, unlike generic marketing tools.
                    </p>
                  </div>

                  <div className="p-3 border rounded-md bg-purple-50">
                    <h3 className="font-medium mb-1">Competitive Gap Analysis</h3>
                    <p className="text-sm">
                      No current competitor offers comprehensive AI-powered marketing, customer insights, and menu
                      optimization in a single platform at this price point.
                    </p>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Market Entry Strategy</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>
                        <span className="font-medium">Initial Focus: </span>
                        Independent Fine Dining and Restaurant Groups (5-20 locations)
                      </li>
                      <li>
                        <span className="font-medium">Differentiation: </span>
                        AI-powered content generation and customer insights
                      </li>
                      <li>
                        <span className="font-medium">Positioning: </span>
                        Premium solution with clear ROI metrics
                      </li>
                      <li>
                        <span className="font-medium">Partnership Strategy: </span>
                        Integrate with POS systems and reservation platforms
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={trendChartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 70,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis
                      domain={[0, 10]}
                      label={{ value: "Relevance Score (1-10)", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="relevance" name="Trend Relevance" fill="#4ECDC4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trend Details</CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {marketTrends
                    .sort((a, b) => b.relevanceScore - a.relevanceScore)
                    .map((trend, index) => (
                      <div key={index} className="border-b pb-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{trend.trend}</h3>
                          <Badge
                            variant="outline"
                            className={
                              trend.relevanceScore >= 9
                                ? "bg-green-100"
                                : trend.relevanceScore >= 7
                                  ? "bg-blue-100"
                                  : "bg-yellow-100"
                            }
                          >
                            Relevance: {trend.relevanceScore}/10
                          </Badge>
                        </div>
                        <div className="text-sm mt-2">
                          <span className="font-medium">Impact: </span>
                          {trend.impact}
                        </div>
                        <div className="text-sm mt-1">
                          <span className="font-medium">Timeframe: </span>
                          {trend.timeframe}
                        </div>
                        <div className="text-sm mt-1">
                          <span className="font-medium">Opportunity Size: </span>
                          {trend.opportunitySize}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trend Implications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Top Trends to Leverage</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      {marketFit.topTrends.map((trend, index) => (
                        <li key={index}>{trend}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 border rounded-md bg-green-50">
                    <h3 className="font-medium mb-1">Product Roadmap Implications</h3>
                    <p className="text-sm">
                      Prioritize AI-generated visual content, personalized customer journeys, and predictive menu
                      engineering in the product roadmap to align with the highest-impact market trends.
                    </p>
                  </div>

                  <div className="p-3 border rounded-md bg-blue-50">
                    <h3 className="font-medium mb-1">Competitive Positioning</h3>
                    <p className="text-sm">
                      Position TableSalt as the leader in AI-powered restaurant marketing by emphasizing capabilities
                      that align with the top market trends before competitors can fully develop these features.
                    </p>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Market Timing</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>
                        <span className="font-medium">Early Majority Phase: </span>
                        The market is transitioning from early adopters to early majority for AI marketing tools
                      </li>
                      <li>
                        <span className="font-medium">Adoption Acceleration: </span>
                        Post-pandemic digital transformation has accelerated adoption timeline by 2-3 years
                      </li>
                      <li>
                        <span className="font-medium">Competitive Window: </span>
                        12-18 month window before major competitors develop comparable AI capabilities
                      </li>
                      <li>
                        <span className="font-medium">Market Education: </span>
                        Focus on ROI and case studies to accelerate adoption
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant ROI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Sample Restaurant ROI (Professional Tier)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Monthly Revenue</span>
                      <span className="font-medium">$50,000</span>
                    </div>
                    <div className="flex justify-between items-center p-2">
                      <span>Additional Revenue</span>
                      <span className="font-medium text-green-600">+${sampleROI.additionalRevenue}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Retention Value</span>
                      <span className="font-medium text-green-600">+${sampleROI.retentionValue}</span>
                    </div>
                    <div className="flex justify-between items-center p-2">
                      <span>Operational Savings</span>
                      <span className="font-medium text-green-600">+${sampleROI.operationalSavings}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Marketing Savings</span>
                      <span className="font-medium text-green-600">+${sampleROI.marketingSavings}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 border-t border-b">
                      <span className="font-medium">Total Monthly Benefit</span>
                      <span className="font-medium text-green-600">+${sampleROI.totalMonthlyBenefit}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Monthly Cost</span>
                      <span className="font-medium text-red-600">-${sampleROI.monthlyCost}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 border-t border-b">
                      <span className="font-medium">Net Monthly Benefit</span>
                      <span className="font-medium text-green-600">
                        +${sampleROI.totalMonthlyBenefit - sampleROI.monthlyCost}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>ROI</span>
                      <span className="font-medium text-green-600">{sampleROI.roi}%</span>
                    </div>
                    <div className="flex justify-between items-center p-2">
                      <span>Payback Period</span>
                      <span className="font-medium">{sampleROI.paybackPeriodMonths} months</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3 border rounded-md bg-green-50">
                    <h3 className="font-medium mb-1">Key ROI Drivers</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>
                        <span className="font-medium">Revenue Growth: </span>
                        Better marketing, menu optimization, and customer targeting
                      </li>
                      <li>
                        <span className="font-medium">Customer Retention: </span>
                        Personalized engagement and improved experience
                      </li>
                      <li>
                        <span className="font-medium">Operational Efficiency: </span>
                        Automation of marketing tasks and content creation
                      </li>
                      <li>
                        <span className="font-medium">Marketing Cost Reduction: </span>
                        Lower content creation and campaign management costs
                      </li>
                    </ul>
                  </div>

                  <div className="p-3 border rounded-md bg-blue-50">
                    <h3 className="font-medium mb-1">ROI by Restaurant Type</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Fine Dining</span>
                        <span className="font-medium">650-850% ROI</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fast Casual</span>
                        <span className="font-medium">450-650% ROI</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Small Independent</span>
                        <span className="font-medium">300-500% ROI</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ghost Kitchen</span>
                        <span className="font-medium">500-700% ROI</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Restaurant Group</span>
                        <span className="font-medium">700-900% ROI</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border rounded-md bg-yellow-50">
                    <h3 className="font-medium mb-1">ROI Comparison</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Traditional Marketing Agency</span>
                        <span className="font-medium">150-250% ROI</span>
                      </div>
                      <div className="flex justify-between">
                        <span>DIY Marketing</span>
                        <span className="font-medium">100-200% ROI</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Basic Marketing Software</span>
                        <span className="font-medium">200-300% ROI</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TableSalt AI</span>
                        <span className="font-medium text-green-600">400-800% ROI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-3">Market Need Validation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 border rounded-md">
                    <h4 className="font-medium mb-2">Customer Acquisition Cost</h4>
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Without AI:</span>
                        <span>$15-30 per customer</span>
                      </div>
                      <div className="flex justify-between">
                        <span>With TableSalt AI:</span>
                        <span className="text-green-600">$5-15 per customer</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border rounded-md">
                    <h4 className="font-medium mb-2">Marketing ROI</h4>
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Traditional Methods:</span>
                        <span>3-5x return</span>
                      </div>
                      <div className="flex justify-between">
                        <span>With TableSalt AI:</span>
                        <span className="text-green-600">7-12x return</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border rounded-md">
                    <h4 className="font-medium mb-2">Time Efficiency</h4>
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Without AI:</span>
                        <span>15-20 hours/week</span>
                      </div>
                      <div className="flex justify-between">
                        <span>With TableSalt AI:</span>
                        <span className="text-green-600">3-5 hours/week</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
