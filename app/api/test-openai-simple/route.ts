import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== Simple OpenAI Test ===")

    const apiKey = process.env.OPENAI_API_KEY

    console.log("API Key Check:")
    console.log("- Exists:", !!apiKey)
    console.log("- Length:", apiKey ? apiKey.length : 0)
    console.log("- Starts with sk-:", apiKey ? apiKey.startsWith("sk-") : false)
    console.log("- First 10 chars:", apiKey ? apiKey.substring(0, 10) : "N/A")

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "No OPENAI_API_KEY found in environment variables",
        hasKey: false,
      })
    }

    if (!apiKey.startsWith("sk-")) {
      return NextResponse.json({
        success: false,
        error: "Invalid API key format - should start with 'sk-'",
        hasKey: true,
        keyFormat: "invalid",
      })
    }

    // Try a simple OpenAI call
    const OpenAI = (await import("openai")).default
    const client = new OpenAI({
      apiKey: apiKey,
      timeout: 10000,
    })

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say 'OpenAI is working!'" }],
      max_tokens: 10,
    })

    const response = completion.choices[0]?.message?.content || "No response"

    return NextResponse.json({
      success: true,
      message: response,
      hasKey: true,
      keyFormat: "valid",
      mode: "real",
    })
  } catch (error) {
    console.error("OpenAI Test Error:", error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      hasKey: !!process.env.OPENAI_API_KEY,
      mode: "error",
    })
  }
}
