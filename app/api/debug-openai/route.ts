import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== OpenAI Debug Test ===")

    // Check environment
    const apiKey = process.env.OPENAI_API_KEY

    console.log("Environment check:")
    console.log("- Running on server:", typeof window === "undefined")
    console.log("- API key exists:", !!apiKey)
    console.log("- API key length:", apiKey ? apiKey.length : 0)
    console.log("- API key starts with sk-:", apiKey ? apiKey.startsWith("sk-") : false)
    console.log("- API key first 10 chars:", apiKey ? apiKey.substring(0, 10) : "none")

    return NextResponse.json({
      hasApiKey: !!apiKey && apiKey.trim() !== "" && apiKey !== "undefined",
      keyLength: apiKey ? apiKey.length : 0,
      keyPrefix: apiKey ? apiKey.substring(0, 7) + "..." : "Not set",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug test failed:", error)
    return NextResponse.json(
      {
        error: "Failed to check API key status",
        hasApiKey: false,
      },
      { status: 500 },
    )
  }
}
