import { generateCustomerInsights } from "./openai"
import { classifyCustomerFeedback } from "./cohere"
import { generateEmbeddings } from "./deepinfra"

export class CustomerAIEngine {
  // AI-powered customer segmentation
  static async generateCustomerSegments(customers: any[]) {
    try {
      const { insights } = await generateCustomerInsights(customers)

      // AI-based clustering and segmentation
      const segments = await this.performAISegmentation(customers)

      // Generate segment strategies
      const segmentStrategies = await Promise.all(segments.map((segment) => this.generateSegmentStrategy(segment)))

      return {
        segments: segments.map((segment, index) => ({
          ...segment,
          strategy: segmentStrategies[index],
        })),
        insights,
        error: null,
      }
    } catch (error) {
      return {
        segments: null,
        insights: null,
        error: "Failed to generate customer segments",
      }
    }
  }

  // AI-powered churn prediction
  static async predictCustomerChurn(customers: any[]) {
    try {
      const churnPredictions = customers.map((customer) => {
        const churnScore = this.calculateChurnScore(customer)
        const churnRisk = this.categorizeChurnRisk(churnScore)
        const recommendations = this.generateRetentionRecommendations(customer, churnScore)

        return {
          customerId: customer.id,
          customerName: customer.name,
          churnScore,
          churnRisk,
          recommendations,
          lastVisit: customer.behavior.lastVisit,
          totalSpent: customer.behavior.totalSpent,
          frequency: customer.behavior.frequency,
        }
      })

      // Sort by churn risk (highest first)
      churnPredictions.sort((a, b) => b.churnScore - a.churnScore)

      const summary = {
        highRisk: churnPredictions.filter((p) => p.churnRisk === "high").length,
        mediumRisk: churnPredictions.filter((p) => p.churnRisk === "medium").length,
        lowRisk: churnPredictions.filter((p) => p.churnRisk === "low").length,
        totalCustomers: customers.length,
      }

      return {
        predictions: churnPredictions,
        summary,
        error: null,
      }
    } catch (error) {
      return {
        predictions: null,
        summary: null,
        error: "Failed to predict customer churn",
      }
    }
  }

  // AI-powered customer lifetime value prediction
  static async predictCustomerLTV(customers: any[]) {
    try {
      const ltvPredictions = customers.map((customer) => {
        const predictedLTV = this.calculatePredictedLTV(customer)
        const currentLTV = customer.metrics.ltv
        const ltvGrowthPotential = ((predictedLTV - currentLTV) / currentLTV) * 100
        const recommendations = this.generateLTVRecommendations(customer, predictedLTV)

        return {
          customerId: customer.id,
          customerName: customer.name,
          currentLTV,
          predictedLTV,
          ltvGrowthPotential: Math.round(ltvGrowthPotential),
          recommendations,
          segment: customer.segment,
        }
      })

      // Sort by LTV growth potential
      ltvPredictions.sort((a, b) => b.ltvGrowthPotential - a.ltvGrowthPotential)

      return {
        predictions: ltvPredictions,
        averageLTV: Math.round(ltvPredictions.reduce((sum, p) => sum + p.predictedLTV, 0) / ltvPredictions.length),
        error: null,
      }
    } catch (error) {
      return {
        predictions: null,
        averageLTV: null,
        error: "Failed to predict customer LTV",
      }
    }
  }

  // AI-powered personalized recommendations
  static async generatePersonalizedRecommendations(customer: any, menuItems: any[]) {
    try {
      // Analyze customer preferences and behavior
      const preferences = customer.preferences.cuisine
      const pastOrders = customer.behavior.preferredItems
      const dietaryRestrictions = customer.preferences.dietary

      // Generate embeddings for customer preferences
      const customerProfile = `${preferences.join(" ")} ${pastOrders.join(" ")} ${dietaryRestrictions.join(" ")}`
      const { embedding: customerEmbedding } = await generateEmbeddings(customerProfile)

      // Generate embeddings for menu items
      const menuWithEmbeddings = await Promise.all(
        menuItems.map(async (item) => {
          const itemDescription = `${item.name} ${item.category} ${item.cuisine} ${item.ingredients?.join(" ") || ""}`
          const { embedding } = await generateEmbeddings(itemDescription)
          return { ...item, embedding }
        }),
      )

      // Calculate similarity scores
      const recommendations = menuWithEmbeddings
        .map((item) => ({
          ...item,
          similarityScore: this.calculateCosineSimilarity(customerEmbedding, item.embedding),
        }))
        .filter((item) => item.similarityScore > 0.6)
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, 5)

      return {
        recommendations,
        reasoning: this.generateRecommendationReasoning(customer, recommendations),
        error: null,
      }
    } catch (error) {
      return {
        recommendations: [],
        reasoning: null,
        error: "Failed to generate personalized recommendations",
      }
    }
  }

  // AI-powered customer feedback analysis
  static async analyzeFeedback(feedbacks: any[]) {
    try {
      const analysisResults = await Promise.all(
        feedbacks.map(async (feedback) => {
          const classification = await classifyCustomerFeedback(feedback.text)

          return {
            id: feedback.id,
            text: feedback.text,
            sentiment: classification.sentiment,
            categories: classification.categories,
            urgency: this.calculateUrgency(classification),
            suggestedResponse: await this.generateResponseSuggestion(feedback, classification),
          }
        }),
      )

      // Aggregate insights
      const insights = {
        totalFeedbacks: feedbacks.length,
        sentimentDistribution: this.calculateSentimentDistribution(analysisResults),
        topIssues: this.extractTopIssues(analysisResults),
        urgentFeedbacks: analysisResults.filter((f) => f.urgency === "high").length,
        averageSentiment: this.calculateAverageSentiment(analysisResults),
      }

      return {
        analysis: analysisResults,
        insights,
        error: null,
      }
    } catch (error) {
      return {
        analysis: null,
        insights: null,
        error: "Failed to analyze customer feedback",
      }
    }
  }

  // Helper methods
  private static async performAISegmentation(customers: any[]) {
    // Simplified AI segmentation based on RFM analysis
    return customers.reduce((segments: any[], customer) => {
      const recency = this.calculateRecency(customer.behavior.lastVisit)
      const frequency = customer.behavior.frequency
      const monetary = customer.behavior.avgSpend

      let segmentName = "Regular"
      if (recency <= 7 && frequency >= 8 && monetary >= 1500) {
        segmentName = "VIP Champions"
      } else if (recency <= 14 && frequency >= 4 && monetary >= 1000) {
        segmentName = "Loyal Customers"
      } else if (recency > 30 && frequency < 2) {
        segmentName = "At Risk"
      } else if (recency <= 30 && frequency < 2 && monetary < 800) {
        segmentName = "New Customers"
      }

      const existingSegment = segments.find((s) => s.name === segmentName)
      if (existingSegment) {
        existingSegment.customers.push(customer)
        existingSegment.size++
      } else {
        segments.push({
          name: segmentName,
          customers: [customer],
          size: 1,
          characteristics: this.getSegmentCharacteristics(segmentName),
        })
      }

      return segments
    }, [])
  }

  private static async generateSegmentStrategy(segment: any) {
    const strategies: { [key: string]: any } = {
      "VIP Champions": {
        approach: "Reward and retain",
        tactics: ["Exclusive offers", "VIP events", "Personal chef interactions"],
        budget: "High",
        expectedROI: "4.5x",
      },
      "Loyal Customers": {
        approach: "Maintain engagement",
        tactics: ["Loyalty program", "Birthday offers", "Referral rewards"],
        budget: "Medium",
        expectedROI: "3.2x",
      },
      "At Risk": {
        approach: "Win back",
        tactics: ["Comeback offers", "Personal outreach", "Feedback collection"],
        budget: "Medium",
        expectedROI: "2.8x",
      },
      "New Customers": {
        approach: "Onboard and educate",
        tactics: ["Welcome series", "Menu recommendations", "First visit discount"],
        budget: "Low",
        expectedROI: "2.1x",
      },
    }

    return strategies[segment.name] || strategies["Regular"]
  }

  private static calculateChurnScore(customer: any): number {
    const daysSinceLastVisit = this.calculateRecency(customer.behavior.lastVisit)
    const frequency = customer.behavior.frequency
    const avgSpend = customer.behavior.avgSpend
    const engagement = customer.engagement.emailOpens + customer.engagement.socialInteraction

    // Weighted churn score calculation
    let score = 0

    // Recency factor (higher days = higher churn risk)
    if (daysSinceLastVisit > 60) score += 0.4
    else if (daysSinceLastVisit > 30) score += 0.2
    else if (daysSinceLastVisit > 14) score += 0.1

    // Frequency factor (lower frequency = higher churn risk)
    if (frequency < 1) score += 0.3
    else if (frequency < 2) score += 0.2
    else if (frequency < 4) score += 0.1

    // Engagement factor
    if (engagement < 2) score += 0.2
    else if (engagement < 5) score += 0.1

    // Spending factor
    if (avgSpend < 500) score += 0.1

    return Math.min(score, 1.0)
  }

  private static categorizeChurnRisk(score: number): "low" | "medium" | "high" {
    if (score >= 0.7) return "high"
    if (score >= 0.4) return "medium"
    return "low"
  }

  private static generateRetentionRecommendations(customer: any, churnScore: number): string[] {
    if (churnScore >= 0.7) {
      return [
        "Send personalized win-back offer",
        "Call customer directly",
        "Offer exclusive discount",
        "Request feedback on experience",
      ]
    } else if (churnScore >= 0.4) {
      return [
        "Send re-engagement email",
        "Offer loyalty program enrollment",
        "Share new menu items",
        "Invite to special events",
      ]
    } else {
      return ["Continue regular communication", "Reward loyalty", "Ask for referrals", "Maintain service quality"]
    }
  }

  private static calculatePredictedLTV(customer: any): number {
    const currentLTV = customer.metrics.ltv
    const frequency = customer.behavior.frequency
    const avgSpend = customer.behavior.avgSpend
    const tenure = this.calculateTenure(customer.acquisition.date)
    const churnScore = this.calculateChurnScore(customer)

    // LTV prediction formula
    const monthlyValue = frequency * avgSpend
    const predictedLifespan = (1 - churnScore) * 24 // months
    const growthFactor = tenure > 12 ? 1.2 : 1.1

    return Math.round(monthlyValue * predictedLifespan * growthFactor)
  }

  private static generateLTVRecommendations(customer: any, predictedLTV: number): string[] {
    const currentLTV = customer.metrics.ltv
    const growthPotential = ((predictedLTV - currentLTV) / currentLTV) * 100

    if (growthPotential > 50) {
      return [
        "High growth potential customer",
        "Invest in personalized experiences",
        "Offer premium menu items",
        "Enroll in VIP program",
      ]
    } else if (growthPotential > 20) {
      return [
        "Moderate growth potential",
        "Increase visit frequency",
        "Cross-sell complementary items",
        "Improve customer experience",
      ]
    } else {
      return ["Stable customer", "Focus on retention", "Maintain service quality", "Encourage referrals"]
    }
  }

  private static calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
    if (!vec1 || !vec2 || vec1.length !== vec2.length) return 0

    const dotProduct = vec1.reduce((sum, a, i) => sum + a * vec2[i], 0)
    const magnitude1 = Math.sqrt(vec1.reduce((sum, a) => sum + a * a, 0))
    const magnitude2 = Math.sqrt(vec2.reduce((sum, a) => sum + a * a, 0))

    return dotProduct / (magnitude1 * magnitude2)
  }

  private static generateRecommendationReasoning(customer: any, recommendations: any[]): string {
    const preferences = customer.preferences.cuisine.join(", ")
    const topRecommendation = recommendations[0]?.name || "items"

    return `Based on your preference for ${preferences} and past orders, we recommend ${topRecommendation} and similar items that match your taste profile.`
  }

  private static calculateUrgency(classification: any): "low" | "medium" | "high" {
    if (classification.sentiment === "negative" && classification.categories.includes("service")) {
      return "high"
    } else if (classification.sentiment === "negative") {
      return "medium"
    }
    return "low"
  }

  private static async generateResponseSuggestion(feedback: any, classification: any): Promise<string> {
    // Simplified response generation
    if (classification.sentiment === "positive") {
      return "Thank you for your wonderful feedback! We're delighted you enjoyed your experience with us."
    } else if (classification.sentiment === "negative") {
      return "We sincerely apologize for your experience. We'd love to make this right. Please contact us directly so we can address your concerns."
    } else {
      return "Thank you for your feedback. We appreciate you taking the time to share your thoughts with us."
    }
  }

  // Utility methods
  private static calculateRecency(lastVisit: string): number {
    const lastVisitDate = new Date(lastVisit)
    const today = new Date()
    return Math.floor((today.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24))
  }

  private static calculateTenure(acquisitionDate: string): number {
    const acquisitionDateObj = new Date(acquisitionDate)
    const today = new Date()
    return Math.floor((today.getTime() - acquisitionDateObj.getTime()) / (1000 * 60 * 60 * 24 * 30))
  }

  private static getSegmentCharacteristics(segmentName: string): string[] {
    const characteristics: { [key: string]: string[] } = {
      "VIP Champions": ["High frequency", "High spend", "Recent visits", "High engagement"],
      "Loyal Customers": ["Regular visits", "Moderate spend", "Good engagement"],
      "At Risk": ["Infrequent visits", "Low engagement", "Potential churn"],
      "New Customers": ["Recent acquisition", "Low frequency", "Growth potential"],
    }
    return characteristics[segmentName] || ["Regular customer behavior"]
  }

  private static calculateSentimentDistribution(analysis: any[]) {
    const total = analysis.length
    const positive = analysis.filter((a) => a.sentiment === "positive").length
    const negative = analysis.filter((a) => a.sentiment === "negative").length
    const neutral = total - positive - negative

    return {
      positive: Math.round((positive / total) * 100),
      negative: Math.round((negative / total) * 100),
      neutral: Math.round((neutral / total) * 100),
    }
  }

  private static extractTopIssues(analysis: any[]): string[] {
    const issues = analysis
      .filter((a) => a.sentiment === "negative")
      .flatMap((a) => a.categories)
      .reduce((acc: { [key: string]: number }, category) => {
        acc[category] = (acc[category] || 0) + 1
        return acc
      }, {})

    return Object.entries(issues)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([issue]) => issue)
  }

  private static calculateAverageSentiment(analysis: any[]): number {
    const sentimentScores = analysis.map((a) => {
      if (a.sentiment === "positive") return 1
      if (a.sentiment === "negative") return -1
      return 0
    })

    return sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length
  }
}
