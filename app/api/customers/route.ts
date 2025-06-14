import { type NextRequest, NextResponse } from "next/server"
import { generateEmbeddings } from "@/lib/ai/deepinfra"

export async function GET(request: NextRequest) {
  try {
    // Mock restaurant profile for now
    const mockProfile = {
      id: "mock-restaurant-id",
      name: "Sample Restaurant",
      cuisine: "Italian",
      description: "A wonderful Italian restaurant",
    }

    // Generate embeddings for the profile (with graceful fallback)
    const profileText = JSON.stringify(mockProfile)
    const { embeddings, error: embeddingsError } = await generateEmbeddings(profileText)

    if (embeddingsError) {
      console.warn("Embeddings generation failed:", embeddingsError)
      // Continue without embeddings rather than failing
      return NextResponse.json(
        {
          profile: mockProfile,
          embeddings: null,
          warning: "Embeddings not available - AI features may be limited",
        },
        { status: 200 },
      )
    }

    // Return the profile with embeddings
    return NextResponse.json({ profile: mockProfile, embeddings }, { status: 200 })
  } catch (error) {
    console.error("Error in GET request:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    return NextResponse.json({
      message: "Customer API endpoint - ready for integration",
      received: body,
    })
  } catch (error) {
    console.error("Error in POST request:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
