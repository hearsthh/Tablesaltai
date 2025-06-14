import { DeepInfra } from "deepinfra"

// Initialize DeepInfra client
const deepInfraClient = new DeepInfra({
  apiKey: process.env.DEEPINFRA_API_KEY,
})

// Generate text embeddings for semantic search
export async function generateEmbeddings(text: string) {
  try {
    const response = await deepInfraClient.embeddings.create({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      input: text,
    })

    return { embedding: response.data[0].embedding, error: null }
  } catch (error) {
    console.error("Error generating embeddings:", error)
    return { embedding: null, error: "Failed to generate embeddings" }
  }
}

// Analyze customer review sentiment
export async function analyzeReviewSentiment(reviewText: string) {
  try {
    const response = await deepInfraClient.completions.create({
      model: "deepinfra/sentiment-analysis",
      prompt: reviewText,
    })

    return {
      sentiment: response.choices[0].text,
      error: null,
    }
  } catch (error) {
    console.error("Error analyzing sentiment:", error)
    return { sentiment: null, error: "Failed to analyze sentiment" }
  }
}

// Export the DeepInfra client for direct use when needed
export { deepInfraClient }
