import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export interface SentimentAnalysisResult {
  sentiment: "positive" | "negative" | "neutral"
  sentimentScore: number // -1 to 1
  emotion: string
  confidence: number
  topics: string[]
  keywords: string[]
  urgency: "low" | "medium" | "high"
}

export interface BatchSentimentResult {
  results: Array<{
    id: string
    sentiment: SentimentAnalysisResult
    error?: string
  }>
  summary: {
    totalProcessed: number
    positiveCount: number
    negativeCount: number
    neutralCount: number
    avgSentimentScore: number
  }
}

export class SentimentAnalysisService {
  // Analyze single text for sentiment
  static async analyzeSentiment(text: string, context?: string): Promise<SentimentAnalysisResult> {
    try {
      const { text: result } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Analyze the sentiment of this text and provide detailed insights:

Text: "${text}"
Context: ${context || "Restaurant review/feedback"}

Please analyze and return a JSON response with:
1. sentiment: "positive", "negative", or "neutral"
2. sentimentScore: number from -1 (very negative) to 1 (very positive)
3. emotion: primary emotion detected (happy, angry, disappointed, excited, frustrated, satisfied, etc.)
4. confidence: confidence level from 0-1
5. topics: array of main topics/themes mentioned (max 5)
6. keywords: array of key phrases that influenced the sentiment (max 8)
7. urgency: "low", "medium", or "high" based on how urgently this needs attention

Consider:
- Emotional language and tone
- Specific complaints or praise
- Context clues about expectations
- Severity of issues mentioned
- Overall customer satisfaction indicators

Format as valid JSON only.`,
        temperature: 0.3,
      })

      const analysis = JSON.parse(result)
      return {
        sentiment: analysis.sentiment || "neutral",
        sentimentScore: analysis.sentimentScore || 0,
        emotion: analysis.emotion || "neutral",
        confidence: analysis.confidence || 0.5,
        topics: analysis.topics || [],
        keywords: analysis.keywords || [],
        urgency: analysis.urgency || "low",
      }
    } catch (error) {
      console.error("Error analyzing sentiment:", error)
      // Return fallback analysis
      return {
        sentiment: "neutral",
        sentimentScore: 0,
        emotion: "neutral",
        confidence: 0.3,
        topics: [],
        keywords: [],
        urgency: "low",
      }
    }
  }

  // Batch analyze multiple texts
  static async batchAnalyzeSentiment(
    texts: Array<{ id: string; text: string; context?: string }>,
  ): Promise<BatchSentimentResult> {
    const results: BatchSentimentResult["results"] = []
    let positiveCount = 0
    let negativeCount = 0
    let neutralCount = 0
    let totalSentimentScore = 0

    // Process in batches of 10 to avoid rate limits
    const batchSize = 10
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize)
      const batchPromises = batch.map(async (item) => {
        try {
          const sentiment = await this.analyzeSentiment(item.text, item.context)
          return { id: item.id, sentiment }
        } catch (error) {
          return {
            id: item.id,
            sentiment: {
              sentiment: "neutral" as const,
              sentimentScore: 0,
              emotion: "neutral",
              confidence: 0,
              topics: [],
              keywords: [],
              urgency: "low" as const,
            },
            error: error instanceof Error ? error.message : "Unknown error",
          }
        }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)

      // Update counters
      batchResults.forEach((result) => {
        if (!result.error) {
          switch (result.sentiment.sentiment) {
            case "positive":
              positiveCount++
              break
            case "negative":
              negativeCount++
              break
            case "neutral":
              neutralCount++
              break
          }
          totalSentimentScore += result.sentiment.sentimentScore
        }
      })

      // Add delay between batches to respect rate limits
      if (i + batchSize < texts.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return {
      results,
      summary: {
        totalProcessed: results.length,
        positiveCount,
        negativeCount,
        neutralCount,
        avgSentimentScore: results.length > 0 ? totalSentimentScore / results.length : 0,
      },
    }
  }

  // Update stored sentiment for reviews
  static async updateReviewSentiments(restaurantId: string): Promise<{ updated: number; errors: number }> {
    try {
      const supabase = getSupabaseServerClient()

      // Get reviews without sentiment analysis or old analysis
      const { data: reviews, error } = await supabase
        .from("reviews")
        .select("id, content, rating, platform")
        .eq("restaurant_id", restaurantId)
        .or("sentiment.is.null,updated_at.lt.2024-01-01") // Update old or missing sentiment
        .limit(100) // Process in batches

      if (error) throw error
      if (!reviews || reviews.length === 0) return { updated: 0, errors: 0 }

      // Prepare texts for batch analysis
      const textsToAnalyze = reviews.map((review) => ({
        id: review.id,
        text: review.content,
        context: `${review.platform} review with ${review.rating}/5 stars`,
      }))

      // Batch analyze sentiments
      const batchResult = await this.batchAnalyzeSentiment(textsToAnalyze)

      // Update database with results
      let updated = 0
      let errors = 0

      for (const result of batchResult.results) {
        if (result.error) {
          errors++
          continue
        }

        const { error: updateError } = await supabase
          .from("reviews")
          .update({
            sentiment: result.sentiment.sentiment,
            sentiment_score: result.sentiment.sentimentScore,
            emotion: result.sentiment.emotion,
            sentiment_confidence: result.sentiment.confidence,
            sentiment_topics: result.sentiment.topics,
            sentiment_keywords: result.sentiment.keywords,
            urgency_level: result.sentiment.urgency,
            sentiment_updated_at: new Date().toISOString(),
          })
          .eq("id", result.id)

        if (updateError) {
          console.error("Error updating review sentiment:", updateError)
          errors++
        } else {
          updated++
        }
      }

      return { updated, errors }
    } catch (error) {
      console.error("Error updating review sentiments:", error)
      return { updated: 0, errors: 1 }
    }
  }

  // Get sentiment trends over time
  static async getSentimentTrends(
    restaurantId: string,
    days = 30,
  ): Promise<Array<{ date: string; positive: number; negative: number; neutral: number; avgScore: number }>> {
    try {
      const supabase = getSupabaseServerClient()

      const { data, error } = await supabase
        .from("reviews")
        .select("review_date, sentiment, sentiment_score")
        .eq("restaurant_id", restaurantId)
        .gte("review_date", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order("review_date")

      if (error) throw error
      if (!data) return []

      // Group by date
      const dateGroups: { [date: string]: { positive: number; negative: number; neutral: number; scores: number[] } } =
        {}

      data.forEach((review) => {
        const date = new Date(review.review_date).toISOString().split("T")[0]
        if (!dateGroups[date]) {
          dateGroups[date] = { positive: 0, negative: 0, neutral: 0, scores: [] }
        }

        switch (review.sentiment) {
          case "positive":
            dateGroups[date].positive++
            break
          case "negative":
            dateGroups[date].negative++
            break
          case "neutral":
            dateGroups[date].neutral++
            break
        }

        if (review.sentiment_score !== null) {
          dateGroups[date].scores.push(review.sentiment_score)
        }
      })

      // Convert to array format
      return Object.entries(dateGroups).map(([date, data]) => ({
        date,
        positive: data.positive,
        negative: data.negative,
        neutral: data.neutral,
        avgScore: data.scores.length > 0 ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length : 0,
      }))
    } catch (error) {
      console.error("Error getting sentiment trends:", error)
      return []
    }
  }

  // Analyze customer feedback sentiment
  static async analyzeCustomerFeedback(restaurantId: string, feedbackId: string): Promise<SentimentAnalysisResult> {
    try {
      const supabase = getSupabaseServerClient()

      const { data: feedback, error } = await supabase
        .from("customer_feedback")
        .select("message, feedback_type, feedback_category")
        .eq("id", feedbackId)
        .single()

      if (error) throw error
      if (!feedback) throw new Error("Feedback not found")

      const context = `Customer ${feedback.feedback_type} about ${feedback.feedback_category}`
      const sentiment = await this.analyzeSentiment(feedback.message, context)

      // Update feedback with sentiment analysis
      await supabase
        .from("customer_feedback")
        .update({
          sentiment: sentiment.sentiment,
          sentiment_score: sentiment.sentimentScore,
          emotion: sentiment.emotion,
          urgency_score: sentiment.urgency === "high" ? 9 : sentiment.urgency === "medium" ? 5 : 2,
          sentiment_topics: sentiment.topics,
          sentiment_keywords: sentiment.keywords,
        })
        .eq("id", feedbackId)

      return sentiment
    } catch (error) {
      console.error("Error analyzing customer feedback:", error)
      throw error
    }
  }

  // Get real-time sentiment for new content
  static async getRealtimeSentiment(
    text: string,
    type: "review" | "feedback" | "social",
  ): Promise<SentimentAnalysisResult> {
    const context = {
      review: "Restaurant review",
      feedback: "Customer feedback",
      social: "Social media mention",
    }[type]

    return await this.analyzeSentiment(text, context)
  }
}
