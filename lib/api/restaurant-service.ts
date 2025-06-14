import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const restaurantService = {
  // Get restaurant profile
  async getRestaurantProfile(userId: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase.from("restaurant_profiles").select("*").eq("user_id", userId).single()

    if (error) {
      return { profile: null, error: error.message }
    }

    return { profile: data, error: null }
  },

  // Update restaurant profile
  async updateRestaurantProfile(userId: string, profileData: any) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("restaurant_profiles")
      .update(profileData)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      return { profile: null, error: error.message }
    }

    return { profile: data, error: null }
  },

  // Upload restaurant logo
  async uploadLogo(userId: string, file: File) {
    const supabase = getSupabaseBrowserClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/logo.${fileExt}`

    const { data, error } = await supabase.storage.from("restaurant_assets").upload(fileName, file, { upsert: true })

    if (error) {
      return { url: null, error: error.message }
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("restaurant_assets").getPublicUrl(fileName)

    // Update profile with logo URL
    await restaurantService.updateRestaurantProfile(userId, {
      logo_url: publicUrlData.publicUrl,
    })

    return { url: publicUrlData.publicUrl, error: null }
  },

  // Upload restaurant images
  async uploadImage(userId: string, file: File, category: string) {
    const supabase = getSupabaseBrowserClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${category}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage.from("restaurant_assets").upload(fileName, file, { upsert: true })

    if (error) {
      return { url: null, error: error.message }
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("restaurant_assets").getPublicUrl(fileName)

    // Add image to restaurant_images table
    const { error: dbError } = await supabase.from("restaurant_images").insert({
      restaurant_id: userId,
      image_url: publicUrlData.publicUrl,
      category,
    })

    if (dbError) {
      return { url: publicUrlData.publicUrl, error: dbError.message }
    }

    return { url: publicUrlData.publicUrl, error: null }
  },

  // Get restaurant images
  async getRestaurantImages(userId: string, category?: string) {
    const supabase = getSupabaseBrowserClient()
    let query = supabase.from("restaurant_images").select("*").eq("restaurant_id", userId)

    if (category) {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) {
      return { images: [], error: error.message }
    }

    return { images: data, error: null }
  },
}

// Server-side restaurant service
export const serverRestaurantService = {
  // Get restaurant profile
  async getRestaurantProfile(userId: string) {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("restaurant_profiles").select("*").eq("user_id", userId).single()

    if (error) {
      return { profile: null, error: error.message }
    }

    return { profile: data, error: null }
  },

  // Get all restaurant images
  async getRestaurantImages(userId: string, category?: string) {
    const supabase = getSupabaseServerClient()
    let query = supabase.from("restaurant_images").select("*").eq("restaurant_id", userId)

    if (category) {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) {
      return { images: [], error: error.message }
    }

    return { images: data, error: null }
  },
}
