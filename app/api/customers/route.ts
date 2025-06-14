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

    // Generate embeddings for the profile (with graceful fallback)
    const profileText = typeof profile === "string" ? profile : JSON.stringify(profile || {})
    const { embeddings, error: embeddingsError } = await generateEmbeddings(profileText)

    if (embeddingsError) {
      console.warn("Embeddings generation failed:", embeddingsError)
      // Continue without embeddings rather than failing
      return NextResponse.json(
        {
          profile,
          embeddings: null,
          warning: "Embeddings not available - AI features may be limited",
        },
        { status: 200 },
      )
    }

    // Return the profile with embeddings
    return NextResponse.json({ profile, embeddings }, { status: 200 })
  } catch (error) {
    console.error("Error in GET request:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
