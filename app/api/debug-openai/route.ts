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

    if (!apiKey) {
      return NextResponse.json({
        status: "error",
        message: "No OpenAI API key found in environment",
        environment: process.env.NODE_ENV,
        hasKey: false,
      })
    }

    // Try to import and use OpenAI
    try {
      console.log("Attempting to import OpenAI...")
      const { default: OpenAI } = await import("openai")

      console.log("Creating OpenAI client...")
      const client = new OpenAI({
        apiKey: apiKey,
        timeout: 10000,
        maxRetries: 1,
      })

      console.log("Making test API call...")
      const completion = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Say 'OpenAI is working!'" }],
        max_tokens: 10,
        temperature: 0.1,
      })

      const response = completion.choices[0]?.message?.content || "No response"

      return NextResponse.json({
        status: "success",
        message: "OpenAI is working!",
        response: response,
        usage: completion.usage,
        hasKey: true,
        keyLength: apiKey.length,
      })
    } catch (openaiError) {
      console.error("OpenAI Error:", openaiError)
      return NextResponse.json({
        status: "openai_error",
        message: "OpenAI import or API call failed",
        error: openaiError instanceof Error ? openaiError.message : "Unknown OpenAI error",
        hasKey: true,
        keyLength: apiKey.length,
      })
    }
  } catch (error) {
    console.error("Debug test failed:", error)
    return NextResponse.json({
      status: "error",
      message: "Debug test failed",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
