// Universal Menu Parser - Production-grade AI system for any restaurant format

interface MenuParsingOptions {
  preserveOriginalFormat?: boolean
  generateDescriptions?: boolean
  inferCategories?: boolean
  detectCurrency?: boolean
  handleMultipleLanguages?: boolean
}

interface ParsedMenuStructure {
  categories: Array<{
    id: string
    name: string
    description: string
    items: Array<{
      id: string
      name: string
      description: string
      price: number
      originalPrice?: string
      currency: string
      available: boolean
      tasteTags: string[]
      promoTags: string[]
      allergens?: string[]
      spiceLevel?: number
    }>
  }>
  metadata: {
    totalItems: number
    totalCategories: number
    currency: string
    language: string
    extractionMethod: string
    confidence: number
  }
}

export class UniversalMenuParser {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || ""
  }

  async parseMenuFromContent(
    content: string,
    sourceInfo: string,
    options: MenuParsingOptions = {},
  ): Promise<ParsedMenuStructure> {
    console.log("🤖 Starting universal menu parsing...")
    console.log("Content length:", content.length)
    console.log("Source:", sourceInfo)

    // Step 1: Analyze content structure
    const analysis = await this.analyzeContentStructure(content)
    console.log("📊 Content analysis:", analysis)

    // Step 2: Use advanced AI parsing with multiple strategies
    const parsedMenu = await this.parseWithAdvancedAI(content, analysis, options)

    // Step 3: Validate and enhance the parsed data
    const validatedMenu = await this.validateAndEnhance(parsedMenu, content)

    console.log("✅ Menu parsing completed successfully")
    return validatedMenu
  }

  private async analyzeContentStructure(content: string) {
    const lines = content.split("\n").filter((line) => line.trim())

    // Detect various patterns
    const patterns = {
      // Category patterns (flexible for any restaurant)
      categories: [
        /^[A-Z\s&-]{3,50}$/,
        /^(APPETIZERS?|STARTERS?|SOUPS?|SALADS?|MAINS?|MAIN\s+COURSE|ENTREES?|DESSERTS?|BEVERAGES?|DRINKS?|BREADS?|RICE|NOODLES?|PASTA|PIZZA|BURGERS?|SANDWICHES?|WRAPS?|TACOS?|SUSHI|ROLLS?|SPECIALS?)/i,
        /^(前菜|主菜|デザート|飲み物)/, // Japanese
        /^(开胃菜|主菜|甜点|饮料)/, // Chinese
        /^(Entrées|Plats|Desserts|Boissons)/i, // French
        /^(Antipasti|Primi|Secondi|Dolci)/i, // Italian
      ],

      // Price patterns (universal currency support)
      prices: [
        /₹\s*(\d+(?:[.,]\d{2})?)/g, // Indian Rupee
        /\$\s*(\d+(?:[.,]\d{2})?)/g, // US Dollar
        /€\s*(\d+(?:[.,]\d{2})?)/g, // Euro
        /£\s*(\d+(?:[.,]\d{2})?)/g, // British Pound
        /¥\s*(\d+(?:[.,]\d{2})?)/g, // Yen/Yuan
        /Rs\.?\s*(\d+(?:[.,]\d{2})?)/gi, // Rupees
        /(\d+(?:[.,]\d{2})?)\s*[₹$€£¥]/g, // Currency after number
        /(\d+(?:[.,]\d{2})?)\s*(?:USD|EUR|GBP|INR|JPY|CNY)/gi, // Currency codes
      ],

      // Item separators
      separators: ["-", "–", "—", ":", "|", "\t", "....", "___"],

      // Description indicators
      descriptions: [
        /^(.+?)\s*[-–—]\s*(.+?)\s*[-–—]\s*(.+)$/, // Name - Description - Price
        /^(.+?)\s*[-–—]\s*(.+)$/, // Name - Price or Name - Description
      ],
    }

    // Analyze structure
    const categoryLines = lines.filter((line) => patterns.categories.some((pattern) => pattern.test(line.trim())))

    const priceMatches = lines.flatMap((line) =>
      patterns.prices.flatMap((pattern) => Array.from(line.matchAll(pattern))),
    )

    // Detect currency
    let currency = "USD"
    let currencySymbol = "$"

    if (content.includes("₹") || /Rs\.?\s*\d+/i.test(content)) {
      currency = "INR"
      currencySymbol = "₹"
    } else if (content.includes("€")) {
      currency = "EUR"
      currencySymbol = "€"
    } else if (content.includes("£")) {
      currency = "GBP"
      currencySymbol = "£"
    } else if (content.includes("¥")) {
      currency = "JPY"
      currencySymbol = "¥"
    }

    // Detect language
    let language = "en"
    if (/[一-龯]/.test(content)) language = "zh"
    else if (/[ひらがなカタカナ]/.test(content)) language = "ja"
    else if (/[àâäéèêëïîôöùûüÿç]/i.test(content)) language = "fr"
    else if (/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþß]/i.test(content)) language = "multi"

    return {
      totalLines: lines.length,
      categoryLines: categoryLines.length,
      itemsWithPrices: priceMatches.length,
      currency,
      currencySymbol,
      language,
      hasStructuredCategories: categoryLines.length > 0,
      averageLineLength: lines.reduce((sum, line) => sum + line.length, 0) / lines.length,
      contentType: this.detectContentType(content),
      patterns: patterns,
    }
  }

  private detectContentType(content: string): string {
    if (content.includes("\t") || content.includes("|")) return "table"
    if (content.includes("....") || content.includes("___")) return "dotted"
    if (/^\d+\./.test(content)) return "numbered"
    if (/^[-*•]/.test(content)) return "bulleted"
    return "freeform"
  }

  private async parseWithAdvancedAI(content: string, analysis: any, options: MenuParsingOptions): Promise<any> {
    if (!this.apiKey) {
      throw new Error("OpenAI API key not configured")
    }

    const prompt = this.buildIntelligentPrompt(content, analysis, options)

    console.log("🚀 Sending advanced parsing request to OpenAI...")

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4", // Use GPT-4 for maximum accuracy
        messages: [
          {
            role: "system",
            content:
              "You are an expert menu parsing AI with perfect accuracy. You extract menu data exactly as it appears in the source content without adding, modifying, or hallucinating any information.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1, // Low temperature for consistency
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenAI API error:", response.status, errorText)
      throw new Error(`OpenAI API failed: ${response.status}`)
    }

    const result = await response.json()
    const aiResponse = result.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error("No response from OpenAI")
    }

    return this.parseAIResponse(aiResponse)
  }

  private buildIntelligentPrompt(content: string, analysis: any, options: MenuParsingOptions): string {
    return `
MENU PARSING TASK - MAXIMUM ACCURACY REQUIRED

CONTENT ANALYSIS:
- Language: ${analysis.language}
- Currency: ${analysis.currency} (${analysis.currencySymbol})
- Content Type: ${analysis.contentType}
- Categories Detected: ${analysis.categoryLines}
- Items with Prices: ${analysis.itemsWithPrices}
- Has Structure: ${analysis.hasStructuredCategories}

PARSING INSTRUCTIONS:
1. Extract ONLY items that actually exist in the content
2. Preserve exact item names and prices as written
3. Detect categories automatically (even if not explicitly marked)
4. Handle any currency format (${analysis.currencySymbol}, USD, EUR, etc.)
5. Extract descriptions only if they exist in the source
6. Maintain original language and terminology
7. Group items logically if no categories are present

REQUIRED JSON OUTPUT:
{
  "categories": [
    {
      "name": "Category Name (exactly as written or intelligently inferred)",
      "description": "Brief category description",
      "items": [
        {
          "name": "Exact item name from source",
          "description": "Description if exists, otherwise empty string",
          "price": 299.99,
          "originalPrice": "${analysis.currencySymbol}299.99",
          "currency": "${analysis.currency}",
          "available": true,
          "tasteTags": ["spicy", "vegetarian", etc.],
          "promoTags": ["popular", "signature", etc.]
        }
      ]
    }
  ],
  "metadata": {
    "totalItems": 0,
    "totalCategories": 0,
    "currency": "${analysis.currency}",
    "language": "${analysis.language}",
    "confidence": 0.95
  }
}

CRITICAL RULES:
- NO hallucination - extract only what exists
- Preserve original formatting and names
- Handle multi-language content appropriately
- Detect prices in any format
- Infer logical categories if none exist
- Maintain cultural context (e.g., Indian dishes, Italian pasta, etc.)

MENU CONTENT TO PARSE:
${content}

Return ONLY the JSON object. No explanations or markdown.
`
  }

  private parseAIResponse(aiResponse: string): any {
    try {
      // Clean the response
      let jsonString = aiResponse.trim()

      // Remove markdown code blocks
      jsonString = jsonString.replace(/```json\s*/g, "").replace(/```\s*/g, "")

      // Find JSON boundaries
      const jsonStart = jsonString.indexOf("{")
      const jsonEnd = jsonString.lastIndexOf("}") + 1

      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error("No JSON object found in AI response")
      }

      jsonString = jsonString.substring(jsonStart, jsonEnd)

      // Parse and validate
      const parsed = JSON.parse(jsonString)

      if (!parsed.categories || !Array.isArray(parsed.categories)) {
        throw new Error("Invalid menu structure - missing categories array")
      }

      return parsed
    } catch (error) {
      console.error("Failed to parse AI response:", error)
      console.error("Raw response:", aiResponse.substring(0, 500))
      throw new Error(`AI response parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private async validateAndEnhance(parsedMenu: any, originalContent: string): Promise<ParsedMenuStructure> {
    // Add unique IDs
    const enhancedMenu: ParsedMenuStructure = {
      categories: parsedMenu.categories.map((category: any, catIndex: number) => ({
        id: `cat_${Date.now()}_${catIndex}`,
        name: category.name || `Category ${catIndex + 1}`,
        description: category.description || `${category.name} items`,
        items: (category.items || []).map((item: any, itemIndex: number) => ({
          id: `item_${Date.now()}_${catIndex}_${itemIndex}`,
          name: item.name || `Item ${itemIndex + 1}`,
          description: item.description || "",
          price: this.normalizePrice(item.price),
          originalPrice: item.originalPrice || `${item.price}`,
          currency: item.currency || parsedMenu.metadata?.currency || "USD",
          available: item.available !== false,
          tasteTags: Array.isArray(item.tasteTags) ? item.tasteTags : [],
          promoTags: Array.isArray(item.promoTags) ? item.promoTags : [],
          allergens: Array.isArray(item.allergens) ? item.allergens : [],
          spiceLevel: typeof item.spiceLevel === "number" ? item.spiceLevel : undefined,
        })),
      })),
      metadata: {
        totalItems: parsedMenu.categories.reduce((sum: number, cat: any) => sum + (cat.items?.length || 0), 0),
        totalCategories: parsedMenu.categories.length,
        currency: parsedMenu.metadata?.currency || "USD",
        language: parsedMenu.metadata?.language || "en",
        extractionMethod: "ai-advanced",
        confidence: parsedMenu.metadata?.confidence || 0.9,
      },
    }

    // Validate data integrity
    this.validateMenuData(enhancedMenu, originalContent)

    return enhancedMenu
  }

  private normalizePrice(price: any): number {
    if (typeof price === "number") return price
    if (typeof price === "string") {
      const numericPrice = Number.parseFloat(price.replace(/[^0-9.]/g, ""))
      return isNaN(numericPrice) ? 0 : numericPrice
    }
    return 0
  }

  private validateMenuData(menu: ParsedMenuStructure, originalContent: string): void {
    // Check if we have reasonable data
    if (menu.categories.length === 0) {
      throw new Error("No menu categories were extracted from the content")
    }

    const totalItems = menu.metadata.totalItems
    if (totalItems === 0) {
      throw new Error("No menu items were extracted from the content")
    }

    // Check if prices are reasonable
    const allPrices = menu.categories.flatMap((cat) => cat.items.map((item) => item.price))
    const validPrices = allPrices.filter((price) => price > 0)

    if (validPrices.length === 0) {
      console.warn("Warning: No valid prices found in extracted menu")
    }

    console.log(`✅ Validation passed: ${menu.categories.length} categories, ${totalItems} items`)
  }
}

// Export the main parsing function
export async function parseUniversalMenu(
  content: string,
  sourceInfo: string,
  options: MenuParsingOptions = {},
): Promise<ParsedMenuStructure> {
  const parser = new UniversalMenuParser()
  return await parser.parseMenuFromContent(content, sourceInfo, options)
}
