export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          details: Json | null
          id: string
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      formiq_analyses: {
        Row: {
          created_at: string | null
          design_issues: Json | null
          id: string
          material_recommendations: string[] | null
          model_id: string | null
          oem_compatibility: Json | null
          printability_score: number
          printing_techniques: string[] | null
        }
        Insert: {
          created_at?: string | null
          design_issues?: Json | null
          id?: string
          material_recommendations?: string[] | null
          model_id?: string | null
          oem_compatibility?: Json | null
          printability_score: number
          printing_techniques?: string[] | null
        }
        Update: {
          created_at?: string | null
          design_issues?: Json | null
          id?: string
          material_recommendations?: string[] | null
          model_id?: string | null
          oem_compatibility?: Json | null
          printability_score?: number
          printing_techniques?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "formiq_analyses_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      formiq_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          formiq_job_id: string | null
          id: string
          job_status: string | null
          model_id: string
          result_data: Json | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          formiq_job_id?: string | null
          id?: string
          job_status?: string | null
          model_id: string
          result_data?: Json | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          formiq_job_id?: string | null
          id?: string
          job_status?: string | null
          model_id?: string
          result_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "formiq_jobs_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      license_types: {
        Row: {
          allows_commercial: boolean | null
          created_at: string | null
          description: string | null
          duration_days: number | null
          id: string
          is_exclusive: boolean | null
          max_downloads: number | null
          name: string
        }
        Insert: {
          allows_commercial?: boolean | null
          created_at?: string | null
          description?: string | null
          duration_days?: number | null
          id?: string
          is_exclusive?: boolean | null
          max_downloads?: number | null
          name: string
        }
        Update: {
          allows_commercial?: boolean | null
          created_at?: string | null
          description?: string | null
          duration_days?: number | null
          id?: string
          is_exclusive?: boolean | null
          max_downloads?: number | null
          name?: string
        }
        Relationships: []
      }
      model_downloads: {
        Row: {
          download_token: string | null
          downloaded_at: string | null
          expires_at: string | null
          id: string
          ip_address: unknown | null
          license_id: string
          model_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          download_token?: string | null
          downloaded_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          license_id: string
          model_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          download_token?: string | null
          downloaded_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          license_id?: string
          model_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_downloads_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "user_licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_downloads_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      model_licenses: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          license_type_id: string
          model_id: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          license_type_id: string
          model_id: string
          price?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          license_type_id?: string
          model_id?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "model_licenses_license_type_id_fkey"
            columns: ["license_type_id"]
            isOneToOne: false
            referencedRelation: "license_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_licenses_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      model_reports: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          description: string | null
          id: string
          model_id: string
          reason: string
          reporter_id: string
          resolved_at: string | null
          status: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          model_id: string
          reason: string
          reporter_id: string
          resolved_at?: string | null
          status?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          model_id?: string
          reason?: string
          reporter_id?: string
          resolved_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "model_reports_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          admin_status: string | null
          category: string | null
          created_at: string | null
          description: string | null
          design_issues: Json | null
          difficulty_level: string | null
          downloads: number | null
          file_format: string | null
          file_hash: string | null
          file_path: string
          file_size: number | null
          file_size_mb: number | null
          file_type: string | null
          geometry_data: Json | null
          id: string
          is_featured: boolean | null
          is_reported: boolean | null
          license_type: string | null
          material_recommendations: string[] | null
          name: string
          oem_compatibility: Json | null
          preview_image: string | null
          price: number | null
          printability_score: number | null
          printing_techniques: string[] | null
          report_count: number | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          admin_status?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          design_issues?: Json | null
          difficulty_level?: string | null
          downloads?: number | null
          file_format?: string | null
          file_hash?: string | null
          file_path: string
          file_size?: number | null
          file_size_mb?: number | null
          file_type?: string | null
          geometry_data?: Json | null
          id?: string
          is_featured?: boolean | null
          is_reported?: boolean | null
          license_type?: string | null
          material_recommendations?: string[] | null
          name: string
          oem_compatibility?: Json | null
          preview_image?: string | null
          price?: number | null
          printability_score?: number | null
          printing_techniques?: string[] | null
          report_count?: number | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          admin_status?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          design_issues?: Json | null
          difficulty_level?: string | null
          downloads?: number | null
          file_format?: string | null
          file_hash?: string | null
          file_path?: string
          file_size?: number | null
          file_size_mb?: number | null
          file_type?: string | null
          geometry_data?: Json | null
          id?: string
          is_featured?: boolean | null
          is_reported?: boolean | null
          license_type?: string | null
          material_recommendations?: string[] | null
          name?: string
          oem_compatibility?: Json | null
          preview_image?: string | null
          price?: number | null
          printability_score?: number | null
          printing_techniques?: string[] | null
          report_count?: number | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          location: string | null
          razorpay_customer_id: string | null
          role: string | null
          specialties: string[] | null
          stripe_customer_id: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          location?: string | null
          razorpay_customer_id?: string | null
          role?: string | null
          specialties?: string[] | null
          stripe_customer_id?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          razorpay_customer_id?: string | null
          role?: string | null
          specialties?: string[] | null
          stripe_customer_id?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          currency: string | null
          id: string
          license_type_id: string
          metadata: Json | null
          model_id: string
          payment_id: string | null
          payment_method: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          license_type_id: string
          metadata?: Json | null
          model_id: string
          payment_id?: string | null
          payment_method?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          license_type_id?: string
          metadata?: Json | null
          model_id?: string
          payment_id?: string | null
          payment_method?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_license_type_id_fkey"
            columns: ["license_type_id"]
            isOneToOne: false
            referencedRelation: "license_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      user_licenses: {
        Row: {
          download_count: number | null
          expires_at: string | null
          id: string
          is_revoked: boolean | null
          license_type_id: string
          model_id: string
          purchased_at: string | null
          revocation_reason: string | null
          revoked_at: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          download_count?: number | null
          expires_at?: string | null
          id?: string
          is_revoked?: boolean | null
          license_type_id: string
          model_id: string
          purchased_at?: string | null
          revocation_reason?: string | null
          revoked_at?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          download_count?: number | null
          expires_at?: string | null
          id?: string
          is_revoked?: boolean | null
          license_type_id?: string
          model_id?: string
          purchased_at?: string | null
          revocation_reason?: string | null
          revoked_at?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_licenses_license_type_id_fkey"
            columns: ["license_type_id"]
            isOneToOne: false
            referencedRelation: "license_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_licenses_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      sales_analytics: {
        Row: {
          avg_sale_amount: number | null
          sale_date: string | null
          total_revenue: number | null
          total_sales: number | null
          unique_buyers: number | null
          unique_models: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_download_token: {
        Args: {
          user_id_param: string
          model_id_param: string
          license_id_param: string
        }
        Returns: string
      }
      revoke_existing_licenses: {
        Args: { target_model_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
