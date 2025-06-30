export interface Database {
  public: {
    Tables: {
      restaurant_profiles: {
        Row: {
          id: string
          user_id: string
          restaurant_name: string
          tagline: string | null
          email: string
          phone: string | null
          address: string
          cuisine_type: string
          restaurant_type: string
          price_range: string
          website: string | null
          description: string | null
          operating_hours: any
          social_media: any
          brand_colors: any
          brand_voice: string
          amenities: string[]
          logo_url: string | null
          cover_image_url: string | null
          gallery_images: string[]
          is_active: boolean
          setup_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_name: string
          tagline?: string | null
          email: string
          phone?: string | null
          address: string
          cuisine_type: string
          restaurant_type: string
          price_range: string
          website?: string | null
          description?: string | null
          operating_hours?: any
          social_media?: any
          brand_colors?: any
          brand_voice?: string
          amenities?: string[]
          logo_url?: string | null
          cover_image_url?: string | null
          gallery_images?: string[]
          is_active?: boolean
          setup_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_name?: string
          tagline?: string | null
          email?: string
          phone?: string | null
          address?: string
          cuisine_type?: string
          restaurant_type?: string
          price_range?: string
          website?: string | null
          description?: string | null
          operating_hours?: any
          social_media?: any
          brand_colors?: any
          brand_voice?: string
          amenities?: string[]
          logo_url?: string | null
          cover_image_url?: string | null
          gallery_images?: string[]
          is_active?: boolean
          setup_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      menu_categories: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          description: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          description?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          restaurant_id: string
          category_id: string | null
          name: string
          description: string | null
          price: number
          image_url: string | null
          dietary_tags: string[]
          allergen_info: string[]
          is_available: boolean
          is_featured: boolean
          display_order: number
          preparation_time: number | null
          calories: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          category_id?: string | null
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          dietary_tags?: string[]
          allergen_info?: string[]
          is_available?: boolean
          is_featured?: boolean
          display_order?: number
          preparation_time?: number | null
          calories?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          dietary_tags?: string[]
          allergen_info?: string[]
          is_available?: boolean
          is_featured?: boolean
          display_order?: number
          preparation_time?: number | null
          calories?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          restaurant_id: string
          customer_name: string | null
          customer_email: string | null
          rating: number
          title: string | null
          content: string | null
          is_verified: boolean
          is_published: boolean
          source: string
          source_id: string | null
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          customer_name?: string | null
          customer_email?: string | null
          rating: number
          title?: string | null
          content?: string | null
          is_verified?: boolean
          is_published?: boolean
          source?: string
          source_id?: string | null
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          customer_name?: string | null
          customer_email?: string | null
          rating?: number
          title?: string | null
          content?: string | null
          is_verified?: boolean
          is_published?: boolean
          source?: string
          source_id?: string | null
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      review_settings: {
        Row: {
          id: string
          restaurant_id: string
          enabled: boolean
          require_email: boolean
          moderation_required: boolean
          auto_publish: boolean
          email_notifications: boolean
          thank_you_message: string
          min_rating: number
          max_rating: number
          allow_anonymous: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          enabled?: boolean
          require_email?: boolean
          moderation_required?: boolean
          auto_publish?: boolean
          email_notifications?: boolean
          thank_you_message?: string
          min_rating?: number
          max_rating?: number
          allow_anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          enabled?: boolean
          require_email?: boolean
          moderation_required?: boolean
          auto_publish?: boolean
          email_notifications?: boolean
          thank_you_message?: string
          min_rating?: number
          max_rating?: number
          allow_anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      restaurant_analytics: {
        Row: {
          id: string
          restaurant_id: string
          profile_views: number
          menu_views: number
          review_count: number
          average_rating: number
          total_reservations: number
          conversion_rate: number
          last_updated: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          profile_views?: number
          menu_views?: number
          review_count?: number
          average_rating?: number
          total_reservations?: number
          conversion_rate?: number
          last_updated?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          profile_views?: number
          menu_views?: number
          review_count?: number
          average_rating?: number
          total_reservations?: number
          conversion_rate?: number
          last_updated?: string
        }
      }
      platform_integrations: {
        Row: {
          id: string
          restaurant_id: string
          platform_name: string
          platform_type: string
          is_enabled: boolean
          api_key_hash: string | null
          configuration: any
          last_sync: string | null
          sync_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          platform_name: string
          platform_type: string
          is_enabled?: boolean
          api_key_hash?: string | null
          configuration?: any
          last_sync?: string | null
          sync_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          platform_name?: string
          platform_type?: string
          is_enabled?: boolean
          api_key_hash?: string | null
          configuration?: any
          last_sync?: string | null
          sync_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      generated_content: {
        Row: {
          id: string
          restaurant_id: string
          content_type: string
          title: string | null
          content: any
          status: string
          ai_model: string | null
          generation_prompt: string | null
          is_applied: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          content_type: string
          title?: string | null
          content: any
          status?: string
          ai_model?: string | null
          generation_prompt?: string | null
          is_applied?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          content_type?: string
          title?: string | null
          content?: any
          status?: string
          ai_model?: string | null
          generation_prompt?: string | null
          is_applied?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      marketing_campaigns: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          description: string | null
          campaign_type: string
          status: string
          target_audience: any
          content: any
          schedule: any
          budget: number | null
          metrics: any
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description?: string | null
          campaign_type: string
          status?: string
          target_audience?: any
          content?: any
          schedule?: any
          budget?: number | null
          metrics?: any
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          description?: string | null
          campaign_type?: string
          status?: string
          target_audience?: any
          content?: any
          schedule?: any
          budget?: number | null
          metrics?: any
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customer_segments: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          description: string | null
          criteria: any
          customer_count: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description?: string | null
          criteria: any
          customer_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          description?: string | null
          criteria?: any
          customer_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          restaurant_id: string
          activity_type: string
          activity_data: any
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          activity_type: string
          activity_data?: any
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          activity_type?: string
          activity_data?: any
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
  }
}
