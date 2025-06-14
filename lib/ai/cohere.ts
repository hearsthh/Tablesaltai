import { CohereClient } from "cohere-ai"

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
})

// Enhanced text classification for reviews and feedback
export async function classifyCustomerFeedback(text: string) {
  try {
    const response = await cohere.classify({
      model: "embed-english-v3.0",
      inputs: [text],
      examples: [
        { text: "The food was amazing and service was excellent!", label: "positive" },
        { text: "Long wait times and cold food", label: "negative" },
        { text: "Average experience, nothing special", label: "neutral" },
        { text: "Great atmosphere but expensive", label: "mixed" },
        { text: "Will definitely come back again!", label: "positive" },
        { text: "Worst dining experience ever", label: "negative" },
      ],
    })

    const classification = response.classifications[0]

    return {
      sentiment: classification.prediction,
      confidence: Math.max(...classification.confidences.map((c) => c.confidence)),
      categories: classification.confidences,
      error: null,
    }
  } catch (error) {
    console.error("Error classifying feedback:", error)
    return {
      sentiment: null,
      confidence: 0,
      categories: [],
      error: "Failed to classify feedback",
    }
  }
}

// Generate embeddings for semantic search
export async function generateTextEmbeddings(texts: string[]) {
  try {
    const response = await cohere.embed({
      model: "embed-english-v3.0",
      texts: texts,
      inputType: "search_document",
    })

    return {
      embeddings: response.embeddings,
      error: null,
    }
  } catch (error) {
    console.error("Error generating embeddings:", error)
    return {
      embeddings: null,
      error: "Failed to generate embeddings",
    }
  }
}

// Semantic search for customers and content
export async function semanticSearch({
  query,
  documents,
  topK = 10,
}: {
  query: string
  documents: { id: string; text: string }[]
  topK?: number
}) {
  try {
    // Generate query embedding
    const queryResponse = await cohere.embed({
      model: "embed-english-v3.0",
      texts: [query],
      inputType: "search_query",
    })

    // Generate document embeddings
    const docTexts = documents.map((doc) => doc.text)
    const docResponse = await cohere.embed({
      model: "embed-english-v3.0",
      texts: docTexts,
      inputType: "search_document",
    })

    // Calculate similarities (simplified - in production, use proper vector similarity)
    const queryEmbedding = queryResponse.embeddings[0]
    const docEmbeddings = docResponse.embeddings

    const similarities = docEmbeddings.map((docEmb, index) => {
      // Cosine similarity calculation
      const dotProduct = queryEmbedding.reduce((sum, val, i) => sum + val * docEmb[i], 0)
      const queryMagnitude = Math.sqrt(queryEmbedding.reduce((sum, val) => sum + val * val, 0))
      const docMagnitude = Math.sqrt(docEmb.reduce((sum, val) => sum + val * val, 0))
      const similarity = dotProduct / (queryMagnitude * docMagnitude)

      return {
        id: documents[index].id,
        text: documents[index].text,
        similarity,
      }
    })

    // Sort by similarity and return top K
    const results = similarities.sort((a, b) => b.similarity - a.similarity).slice(0, topK)

    return {
      results,
      error: null,
    }
  } catch (error) {
    console.error("Error performing semantic search:", error)
    return {
      results: [],
      error: "Failed to perform search",
    }
  }
}

// Generate content summaries
export async function summarizeContent(text: string, length: "short" | "medium" | "long" = "medium") {
  try {
    const maxTokens = length === "short" ? 50 : length === "medium" ? 150 : 300

    const response = await cohere.summarize({
      text: text,
      length: length,
      format: "paragraph",
      model: "summarize-xlarge",
      additionalCommand: "Focus on key insights and actionable information for restaurant management.",
    })

    return {
      summary: response.summary,
      error: null,
    }
  } catch (error) {
    console.error("Error summarizing content:", error)
    return {
      summary: null,
      error: "Failed to summarize content",
    }
  }
}

// Disabled for deployment
export async function generateWithCohere() {
  return {
    text: null,
    error: "Cohere disabled for deployment",
  }
}

export { cohere }
