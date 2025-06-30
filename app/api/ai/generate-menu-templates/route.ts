import { type NextRequest, NextResponse } from "next/server"
import { generateAIText } from "@/lib/ai/openai"

export async function POST(request: NextRequest) {
  try {
    const { menuData, templateType = "comprehensive", format = "print" } = await request.json()

    if (!menuData) {
      return NextResponse.json({ error: "Menu data is required" }, { status: 400 })
    }

    const totalItems = menuData.categories?.reduce((acc: number, cat: any) => acc + (cat.items?.length || 0), 0) || 0
    const categories = menuData.categories?.map((cat: any) => cat.name).join(", ") || ""
    const priceRange = menuData.categories?.flatMap((cat: any) => cat.items?.map((item: any) => item.price) || []) || []
    const minPrice = Math.min(...priceRange)
    const maxPrice = Math.max(...priceRange)

    const prompt = `Create professional menu templates based on this restaurant's menu data:

Menu Overview:
- Categories: ${categories}
- Total items: ${totalItems}
- Price range: $${minPrice} - $${maxPrice}
- Template type: ${templateType}
- Format: ${format}

Please provide 3 different template options:

**TEMPLATE 1: Classic Elegant**
- Layout structure and organization
- Typography recommendations (fonts, sizes, hierarchy)
- Color scheme (sophisticated, timeless)
- Section dividers and visual elements
- Logo and branding placement
- Price display formatting
- Paper size and margins for print

**TEMPLATE 2: Modern Minimalist**
- Clean, contemporary layout approach
- Typography (modern, readable fonts)
- Color palette (minimal, high contrast)
- White space utilization
- Category organization
- Item presentation style
- Digital-first design considerations

**TEMPLATE 3: Warm & Inviting**
- Cozy, welcoming design approach
- Typography (friendly, approachable fonts)
- Color scheme (warm, inviting tones)
- Decorative elements and borders
- Category styling and icons
- Special item highlighting
- Family-friendly presentation

For each template, include:

1. **Layout Specifications:**
   - Page dimensions and orientation
   - Column structure and grid system
   - Header and footer areas
   - Category section organization

2. **Typography Guide:**
   - Restaurant name/logo font
   - Category header fonts
   - Item name fonts
   - Description text fonts
   - Price fonts and alignment

3. **Color Palette:**
   - Primary brand colors
   - Secondary accent colors
   - Background colors
   - Text colors for readability

4. **Visual Elements:**
   - Border styles and thickness
   - Divider lines and separators
   - Icon suggestions for categories
   - Image placement guidelines

5. **Implementation Notes:**
   - Software recommendations (Canva, InDesign, etc.)
   - Print specifications and requirements
   - Digital adaptation guidelines
   - Maintenance and update procedures

Make each template distinct and suitable for different restaurant personalities and target audiences.`

    console.log("📋 Generating menu templates...")
    const result = await generateAIText(prompt, {
      temperature: 0.7,
      maxTokens: 1000,
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      content: result.text,
      mode: result.mode,
      templateType,
      format,
      templateCount: 3,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Menu templates generation error:", error)
    return NextResponse.json({ error: "Failed to generate menu templates" }, { status: 500 })
  }
}
