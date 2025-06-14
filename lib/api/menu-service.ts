import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { generateMenuDescription } from "@/lib/ai/openai"
import { generateFoodImage } from "@/lib/ai/fal"

export const menuService = {
  // Get menu categories
  async getMenuCategories(restaurantId: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("menu_categories")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("display_order", { ascending: true })

    if (error) {
      return { categories: [], error: error.message }
    }

    return { categories: data, error: null }
  },

  // Create menu category
  async createMenuCategory(restaurantId: string, categoryData: any) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("menu_categories")
      .insert({
        restaurant_id: restaurantId,
        ...categoryData,
      })
      .select()
      .single()

    if (error) {
      return { category: null, error: error.message }
    }

    return { category: data, error: null }
  },

  // Update menu category
  async updateMenuCategory(categoryId: string, categoryData: any) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("menu_categories")
      .update(categoryData)
      .eq("id", categoryId)
      .select()
      .single()

    if (error) {
      return { category: null, error: error.message }
    }

    return { category: data, error: null }
  },

  // Delete menu category
  async deleteMenuCategory(categoryId: string) {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.from("menu_categories").delete().eq("id", categoryId)

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  },

  // Get menu items
  async getMenuItems(restaurantId: string, categoryId?: string) {
    const supabase = getSupabaseBrowserClient()
    let query = supabase.from("menu_items").select("*, menu_categories(name)").eq("restaurant_id", restaurantId)

    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    const { data, error } = await query.order("display_order", { ascending: true })

    if (error) {
      return { items: [], error: error.message }
    }

    return { items: data, error: null }
  },

  // Create menu item
  async createMenuItem(restaurantId: string, itemData: any) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        restaurant_id: restaurantId,
        ...itemData,
      })
      .select()
      .single()

    if (error) {
      return { item: null, error: error.message }
    }

    return { item: data, error: null }
  },

  // Update menu item
  async updateMenuItem(itemId: string, itemData: any) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase.from("menu_items").update(itemData).eq("id", itemId).select().single()

    if (error) {
      return { item: null, error: error.message }
    }

    return { item: data, error: null }
  },

  // Delete menu item
  async deleteMenuItem(itemId: string) {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.from("menu_items").delete().eq("id", itemId)

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  },

  // Generate AI menu description
  async generateMenuItemDescription(itemData: any) {
    const { text, error } = await generateMenuDescription({
      dishName: itemData.name,
      ingredients: itemData.ingredients || [],
      cuisine: itemData.cuisine || "International",
      isSignature: itemData.is_signature || false,
      isVegetarian: itemData.is_vegetarian || false,
    })

    if (error) {
      return { description: null, error }
    }

    return { description: text, error: null }
  },

  // Generate AI food image
  async generateMenuItemImage(itemData: any) {
    const { imageUrl, error } = await generateFoodImage({
      dishName: itemData.name,
      cuisine: itemData.cuisine || "International",
      style: "photographic",
    })

    if (error) {
      return { imageUrl: null, error }
    }

    return { imageUrl, error: null }
  },
}

// Server-side menu service
export const serverMenuService = {
  // Get full menu with categories and items
  async getFullMenu(restaurantId: string) {
    const supabase = getSupabaseServerClient()

    // Get categories
    const { data: categories, error: categoriesError } = await supabase
      .from("menu_categories")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("display_order", { ascending: true })

    if (categoriesError) {
      return { menu: null, error: categoriesError.message }
    }

    // Get items
    const { data: items, error: itemsError } = await supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("display_order", { ascending: true })

    if (itemsError) {
      return { menu: null, error: itemsError.message }
    }

    // Organize items by category
    const menu = categories.map((category) => ({
      ...category,
      items: items.filter((item) => item.category_id === category.id),
    }))

    return { menu, error: null }
  },
}
