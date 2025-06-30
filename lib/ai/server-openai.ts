// Direct OpenAI API calls using fetch (no client library)

export async function callOpenAI(prompt: string, options: any = {}) {
  try {
    console.log("🚀 Direct OpenAI API call starting...")

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey || !apiKey.startsWith("sk-")) {
      throw new Error("Invalid or missing OpenAI API key")
    }

    const requestBody = {
      model: options.model || "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 500,
    }

    console.log("📡 Making direct fetch request to OpenAI API...")

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("❌ OpenAI API error:", response.status, errorData)
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`)
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ""

    console.log("✅ Direct OpenAI API call successful!")
    console.log("Response length:", text.length)

    // Calculate costs
    const usage = data.usage
    const cost = usage
      ? {
          inputCost: (usage.prompt_tokens / 1000) * 0.0015,
          outputCost: (usage.completion_tokens / 1000) * 0.002,
          totalCost: (usage.prompt_tokens / 1000) * 0.0015 + (usage.completion_tokens / 1000) * 0.002,
        }
      : null

    return {
      success: true,
      text,
      mode: "openai",
      usage: usage,
      cost: cost,
    }
  } catch (error) {
    console.error("❌ Direct OpenAI API call failed:", error)
    throw error
  }
}

export async function testServerOpenAI() {
  try {
    console.log("🧪 Testing direct OpenAI API...")

    const result = await callOpenAI("Say 'Hello from direct OpenAI API!'", {
      maxTokens: 20,
      temperature: 0.1,
    })

    return {
      success: true,
      status: "success",
      message: result.text,
      mode: "openai",
      usage: result.usage,
      cost: result.cost,
      note: "Connected via direct API call (no client library)",
    }
  } catch (error) {
    console.error("❌ Direct OpenAI API test failed:", error)
    return {
      success: false,
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      mode: "error",
    }
  }
}
