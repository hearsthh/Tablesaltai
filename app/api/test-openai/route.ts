import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== Testing Direct OpenAI API ===")

    const apiKey = process.env.OPENAI_API_KEY

    console.log("Environment check:")
    console.log("- OPENAI_API_KEY exists:", !!apiKey)
    console.log("- API key length:", apiKey ? apiKey.length : 0)
    console.log("- API key starts with sk-:", apiKey ? apiKey.startsWith("sk-") : false)

    if (!apiKey || !apiKey.startsWith("sk-")) {
      return NextResponse.json({
        success: true,
        status: "fallback",
        message: "Hello from TableSalt AI! (No API key configured)",
        mode: "fallback",
        note: "OpenAI API key not configured - using fallback responses",
      })
    }

    // Test direct API call
    try {
      console.log("🚀 Testing direct OpenAI API call...")

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: "Say 'Hello from OpenAI API!'" }],
          max_tokens: 15,
          temperature: 0.1,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ OpenAI API error:", response.status, errorText)

        return NextResponse.json({
          success: true,
          status: "fallback",
          message: "Hello from TableSalt AI! (API error - using fallback)",
          mode: "fallback",
          note: `OpenAI API error: ${response.status} - falling back to intelligent responses`,
          error: errorText,
        })
      }

      const data = await response.json()
      const message = data.choices?.[0]?.message?.content || "No response from OpenAI"

      console.log("✅ Direct OpenAI API test successful!")

      return NextResponse.json({
        success: true,
        status: "success",
        message: message,
        mode: "openai",
        note: "Connected to OpenAI via direct API call",
        usage: data.usage,
        cost: data.usage
          ? {
              inputCost: (data.usage.prompt_tokens / 1000) * 0.0015,
              outputCost: (data.usage.completion_tokens / 1000) * 0.002,
              totalCost: (data.usage.prompt_tokens / 1000) * 0.0015 + (data.usage.completion_tokens / 1000) * 0.002,
            }
          : null,
      })
    } catch (fetchError) {
      console.error("❌ Direct API call failed:", fetchError)

      return NextResponse.json({
        success: true,
        status: "fallback",
        message: "Hello from TableSalt AI! (Connection error - using fallback)",
        mode: "fallback",
        note: `Network error: ${fetchError instanceof Error ? fetchError.message : "Unknown error"}`,
      })
    }
  } catch (error) {
    console.error("❌ Test route error:", error)

    return NextResponse.json({
      success: false,
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      mode: "error",
    })
  }
}
