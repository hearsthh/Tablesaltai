import { createClient } from "@supabase/supabase-js"
import type {
  CompleteSocialProfile,
  SpecialOffer,
  RestaurantAward,
  PressCoverage,
  MediaAsset,
} from "@/types/social-profile"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export class SocialProfileService {
  // Save complete social profile
  static async saveSocialProfile(restaurantId: string, profileData: CompleteSocialProfile) {
    try {
      // Update main restaurant profile
      const { error: profileError } = await supabase
        .from("restaurant_profiles")
        .update({
          restaurant_name: profileData.restaurantName,
          tagline: profileData.tagline,
          description: profileData.description,
          cuisine_type: profileData.cuisine,
          price_range: profileData.priceRange,
          phone: profileData.phone,
          email: profileData.email,
          website: profileData.website,
          address: profileData.address,
          operating_hours: profileData.operatingHours,
          amenities: profileData.amenities,
          social_media: profileData.socialMedia,
          social_media_followers: profileData.socialMediaFollowers,

          // Brand assets
          logo_url: profileData.brandAssets.logo,
          logo_dark_url: profileData.brandAssets.logoDark,
          favicon_url: profileData.brandAssets.favicon,
          brand_colors: {
            primary: profileData.brandAssets.primaryColor,
            secondary: profileData.brandAssets.secondaryColor,
          },
          brand_voice: profileData.brandAssets.brandVoice,
          brand_positioning: profileData.brandAssets.brandPositioning,
          brand_guidelines: profileData.brandAssets.brandGuidelines,

          // Chef info
          chef_name: profileData.chef.name,
          chef_title: profileData.chef.title,
          chef_bio: profileData.chef.bio,
          chef_photo_url: profileData.chef.photoUrl,
          chef_experience_years: profileData.chef.experienceYears,
          chef_specialties: profileData.chef.specialties,
          chef_awards: profileData.chef.awards,

          // Loyalty program
          loyalty_program_enabled: profileData.loyaltyProgram.enabled,
          loyalty_program_name: profileData.loyaltyProgram.name,
          loyalty_program_description: profileData.loyaltyProgram.description,
          loyalty_points_per_rupee: profileData.loyaltyProgram.pointsPerRupee,
          loyalty_reward_threshold: profileData.loyaltyProgram.rewardThreshold,
          loyalty_reward_value: profileData.loyaltyProgram.rewardValue,

          // Reservation system
          reservation_enabled: profileData.reservationSystem.enabled,
          reservation_system_type: profileData.reservationSystem.systemType,
          reservation_external_url: profileData.reservationSystem.externalUrl,
          reservation_advance_days: profileData.reservationSystem.advanceDays,
          reservation_min_party_size: profileData.reservationSystem.minPartySize,
          reservation_max_party_size: profileData.reservationSystem.maxPartySize,

          // AI generation info
          ai_profile_generated: profileData.aiGeneration.generated,
          ai_generation_date: profileData.aiGeneration.generationDate,
          ai_generation_source: profileData.aiGeneration.generationSource,
          profile_completion_percentage: profileData.aiGeneration.completionPercentage,

          updated_at: new Date().toISOString(),
        })
        .eq("id", restaurantId)

      if (profileError) throw profileError

      // Save special offers
      if (profileData.specialOffers.length > 0) {
        await this.saveSpecialOffers(restaurantId, profileData.specialOffers)
      }

      // Save awards
      if (profileData.awards.length > 0) {
        await this.saveAwards(restaurantId, profileData.awards)
      }

      // Save press coverage
      if (profileData.pressCoverage.length > 0) {
        await this.savePressCoverage(restaurantId, profileData.pressCoverage)
      }

      // Save media assets
      if (profileData.mediaAssets.length > 0) {
        await this.saveMediaAssets(restaurantId, profileData.mediaAssets)
      }

      return { success: true }
    } catch (error) {
      console.error("Error saving social profile:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  // Save special offers
  private static async saveSpecialOffers(restaurantId: string, offers: SpecialOffer[]) {
    // Delete existing offers
    await supabase.from("special_offers").delete().eq("restaurant_id", restaurantId)

    // Insert new offers
    const offersData = offers.map((offer) => ({
      restaurant_id: restaurantId,
      title: offer.title,
      description: offer.description,
      offer_type: offer.offerType,
      discount_value: offer.discountValue,
      discount_percentage: offer.discountPercentage,
      minimum_order_value: offer.minimumOrderValue,
      maximum_discount: offer.maximumDiscount,
      valid_from: offer.validFrom,
      valid_until: offer.validUntil,
      valid_days: offer.validDays,
      valid_times: offer.validTimes,
      terms_conditions: offer.termsConditions,
      usage_limit: offer.usageLimit,
      usage_count: offer.usageCount,
      is_active: offer.isActive,
      is_featured: offer.isFeatured,
    }))

    const { error } = await supabase.from("special_offers").insert(offersData)
    if (error) throw error
  }

  // Save awards
  private static async saveAwards(restaurantId: string, awards: RestaurantAward[]) {
    // Delete existing awards
    await supabase.from("restaurant_awards").delete().eq("restaurant_id", restaurantId)

    // Insert new awards
    const awardsData = awards.map((award) => ({
      restaurant_id: restaurantId,
      award_name: award.awardName,
      award_description: award.awardDescription,
      issuing_organization: award.issuingOrganization,
      award_year: award.awardYear,
      award_date: award.awardDate,
      award_category: award.awardCategory,
      award_level: award.awardLevel,
      certificate_url: award.certificateUrl,
      is_featured: award.isFeatured,
      display_order: award.displayOrder,
    }))

    const { error } = await supabase.from("restaurant_awards").insert(awardsData)
    if (error) throw error
  }

  // Save press coverage
  private static async savePressCoverage(restaurantId: string, coverage: PressCoverage[]) {
    // Delete existing coverage
    await supabase.from("press_coverage").delete().eq("restaurant_id", restaurantId)

    // Insert new coverage
    const coverageData = coverage.map((item) => ({
      restaurant_id: restaurantId,
      publication_name: item.publicationName,
      article_title: item.articleTitle,
      article_url: item.articleUrl,
      author_name: item.authorName,
      publication_date: item.publicationDate,
      article_excerpt: item.articleExcerpt,
      coverage_type: item.coverageType,
      sentiment: item.sentiment,
      reach_estimate: item.reachEstimate,
      is_featured: item.isFeatured,
    }))

    const { error } = await supabase.from("press_coverage").insert(coverageData)
    if (error) throw error
  }

  // Save media assets
  private static async saveMediaAssets(restaurantId: string, assets: MediaAsset[]) {
    // Delete existing assets
    await supabase.from("media_assets").delete().eq("restaurant_id", restaurantId)

    // Insert new assets
    const assetsData = assets.map((asset) => ({
      restaurant_id: restaurantId,
      file_name: asset.fileName,
      file_url: asset.fileUrl,
      file_type: asset.fileType,
      file_size: asset.fileSize,
      mime_type: asset.mimeType,
      width: asset.width,
      height: asset.height,
      category: asset.category,
      subcategory: asset.subcategory,
      title: asset.title,
      description: asset.description,
      alt_text: asset.altText,
      is_featured: asset.isFeatured,
      display_order: asset.displayOrder,
    }))

    const { error } = await supabase.from("media_assets").insert(assetsData)
    if (error) throw error
  }

  // Load complete social profile
  static async loadSocialProfile(restaurantId: string): Promise<CompleteSocialProfile | null> {
    try {
      // Load main profile
      const { data: profile, error: profileError } = await supabase
        .from("restaurant_profiles")
        .select("*")
        .eq("id", restaurantId)
        .single()

      if (profileError) throw profileError
      if (!profile) return null

      // Load related data
      const [offersResult, awardsResult, coverageResult, assetsResult] = await Promise.all([
        supabase.from("special_offers").select("*").eq("restaurant_id", restaurantId).order("display_order"),
        supabase.from("restaurant_awards").select("*").eq("restaurant_id", restaurantId).order("display_order"),
        supabase
          .from("press_coverage")
          .select("*")
          .eq("restaurant_id", restaurantId)
          .order("publication_date", { ascending: false }),
        supabase.from("media_assets").select("*").eq("restaurant_id", restaurantId).order("display_order"),
      ])

      // Transform to CompleteSocialProfile format
      const socialProfile: CompleteSocialProfile = {
        restaurantName: profile.restaurant_name,
        cuisine: profile.cuisine_type,
        description: profile.description,
        tagline: profile.tagline,
        priceRange: profile.price_range,
        phone: profile.phone,
        email: profile.email,
        website: profile.website,
        address: profile.address,
        operatingHours: profile.operating_hours,
        amenities: profile.amenities || [],
        socialMedia: profile.social_media || {},
        socialMediaFollowers: profile.social_media_followers || {},

        brandAssets: {
          logo: profile.logo_url,
          logoDark: profile.logo_dark_url,
          favicon: profile.favicon_url,
          primaryColor: profile.brand_colors?.primary || "#000000",
          secondaryColor: profile.brand_colors?.secondary || "#666666",
          brandVoice: profile.brand_voice || "",
          brandPositioning: profile.brand_positioning || "casual",
          brandGuidelines: profile.brand_guidelines || "",
        },

        chef: {
          name: profile.chef_name || "",
          title: profile.chef_title || "",
          bio: profile.chef_bio || "",
          photoUrl: profile.chef_photo_url,
          experienceYears: profile.chef_experience_years || 0,
          specialties: profile.chef_specialties || [],
          awards: profile.chef_awards || [],
        },

        loyaltyProgram: {
          enabled: profile.loyalty_program_enabled || false,
          name: profile.loyalty_program_name || "",
          description: profile.loyalty_program_description || "",
          pointsPerRupee: profile.loyalty_points_per_rupee || 1,
          rewardThreshold: profile.loyalty_reward_threshold || 100,
          rewardValue: profile.loyalty_reward_value || 0,
        },

        reservationSystem: {
          enabled: profile.reservation_enabled || false,
          systemType: profile.reservation_system_type || "builtin",
          externalUrl: profile.reservation_external_url,
          advanceDays: profile.reservation_advance_days || 30,
          minPartySize: profile.reservation_min_party_size || 1,
          maxPartySize: profile.reservation_max_party_size || 12,
        },

        aiGeneration: {
          generated: profile.ai_profile_generated || false,
          generationDate: profile.ai_generation_date,
          generationSource: profile.ai_generation_source,
          completionPercentage: profile.profile_completion_percentage || 0,
        },

        specialOffers: offersResult.data || [],
        awards: awardsResult.data || [],
        pressCoverage: coverageResult.data || [],
        mediaAssets: assetsResult.data || [],
      }

      return socialProfile
    } catch (error) {
      console.error("Error loading social profile:", error)
      return null
    }
  }
}
