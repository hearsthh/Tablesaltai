import { type NextRequest, NextResponse } from "next/server"
import { serverAuthService } from "@/lib/auth/auth-service"
import { generateEmbeddings } from "@/lib/ai/deepinfra"

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { user, error: authError } = await serverAuthService.getCurrentUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get restaurant profile
    const { profile, error: profileError } = await serverAuthService.getUserProfile(user.id)

    if (profileError) {
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    // Generate embeddings for the profile
    const { embeddings, error: embeddingsError } = await generateEmbeddings(profile)

    if (embeddingsError) {
      return NextResponse.json({ error: "Failed to generate embeddings" }, { status: 500 })
    }

    // Return the profile with embeddings
    return NextResponse.json({ profile, embeddings }, { status: 200 })
  } catch (error) {
    console.error("Error in GET request:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
