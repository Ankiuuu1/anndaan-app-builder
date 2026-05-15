export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string
          food_item_id: string
          id: string
          notes: string | null
          pickup_window_end: string | null
          pickup_window_start: string | null
          recipient_id: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          volunteer_id: string | null
        }
        Insert: {
          created_at?: string
          food_item_id: string
          id?: string
          notes?: string | null
          pickup_window_end?: string | null
          pickup_window_start?: string | null
          recipient_id: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          volunteer_id?: string | null
        }
        Update: {
          created_at?: string
          food_item_id?: string
          id?: string
          notes?: string | null
          pickup_window_end?: string | null
          pickup_window_start?: string | null
          recipient_id?: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          volunteer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      food_items: {
        Row: {
          category: Database["public"]["Enums"]["food_category"]
          created_at: string
          cuisine: string | null
          description: string | null
          donor_id: string
          expires_at: string
          id: string
          instructions: string | null
          lat: number | null
          lng: number | null
          photo_url: string | null
          pickup_address: string
          prepared_at: string
          quantity_servings: number
          status: Database["public"]["Enums"]["food_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["food_category"]
          created_at?: string
          cuisine?: string | null
          description?: string | null
          donor_id: string
          expires_at: string
          id?: string
          instructions?: string | null
          lat?: number | null
          lng?: number | null
          photo_url?: string | null
          pickup_address: string
          prepared_at?: string
          quantity_servings?: number
          status?: Database["public"]["Enums"]["food_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["food_category"]
          created_at?: string
          cuisine?: string | null
          description?: string | null
          donor_id?: string
          expires_at?: string
          id?: string
          instructions?: string | null
          lat?: number | null
          lng?: number | null
          photo_url?: string | null
          pickup_address?: string
          prepared_at?: string
          quantity_servings?: number
          status?: Database["public"]["Enums"]["food_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          data: Json | null
          id: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          dietary_prefs: string[] | null
          full_name: string | null
          id: string
          lat: number | null
          lng: number | null
          org_details: string | null
          org_name: string | null
          phone: string | null
          updated_at: string
          verified: boolean
          volunteer_available: boolean
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          dietary_prefs?: string[] | null
          full_name?: string | null
          id: string
          lat?: number | null
          lng?: number | null
          org_details?: string | null
          org_name?: string | null
          phone?: string | null
          updated_at?: string
          verified?: boolean
          volunteer_available?: boolean
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          dietary_prefs?: string[] | null
          full_name?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          org_details?: string | null
          org_name?: string | null
          phone?: string | null
          updated_at?: string
          verified?: boolean
          volunteer_available?: boolean
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      freshness_score: {
        Args: { _expires_at: string; _prepared_at: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_food_donor: {
        Args: { _food_item_id: string; _user_id: string }
        Returns: boolean
      }
      nearby_food: {
        Args: { _lat: number; _lng: number; _radius_km?: number }
        Returns: {
          category: Database["public"]["Enums"]["food_category"]
          cuisine: string
          description: string
          distance_km: number
          donor_id: string
          expires_at: string
          freshness: number
          id: string
          lat: number
          lng: number
          photo_url: string
          pickup_address: string
          prepared_at: string
          quantity_servings: number
          status: Database["public"]["Enums"]["food_status"]
          title: string
        }[]
      }
    }
    Enums: {
      app_role: "donor" | "recipient" | "volunteer" | "ngo" | "admin"
      booking_status:
        | "pending"
        | "confirmed"
        | "ready"
        | "picked_up"
        | "cancelled"
      food_category: "veg" | "non_veg" | "vegan"
      food_status:
        | "available"
        | "reserved"
        | "picked_up"
        | "expired"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["donor", "recipient", "volunteer", "ngo", "admin"],
      booking_status: [
        "pending",
        "confirmed",
        "ready",
        "picked_up",
        "cancelled",
      ],
      food_category: ["veg", "non_veg", "vegan"],
      food_status: [
        "available",
        "reserved",
        "picked_up",
        "expired",
        "cancelled",
      ],
    },
  },
} as const
