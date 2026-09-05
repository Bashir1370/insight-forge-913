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
      consultations: {
        Row: {
          admin_note: string | null
          consultation_type: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          meeting_url: string | null
          project_id: string | null
          scheduled_at: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          consultation_type?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_url?: string | null
          project_id?: string | null
          scheduled_at?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          consultation_type?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_url?: string | null
          project_id?: string | null
          scheduled_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_content_drafts: {
        Row: {
          content: Json
          created_at: string
          page_key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: Json
          created_at?: string
          page_key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          created_at?: string
          page_key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      learning_content_published: {
        Row: {
          content: Json
          page_key: string
          published_at: string
          published_by: string | null
        }
        Insert: {
          content?: Json
          page_key: string
          published_at?: string
          published_by?: string | null
        }
        Update: {
          content?: Json
          page_key?: string
          published_at?: string
          published_by?: string | null
        }
        Relationships: []
      }
      learning_content_revisions: {
        Row: {
          content: Json
          created_at: string
          created_by: string | null
          id: number
          page_key: string
        }
        Insert: {
          content: Json
          created_at?: string
          created_by?: string | null
          id?: number
          page_key: string
        }
        Update: {
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: number
          page_key?: string
        }
        Relationships: []
      }
      learning_progress: {
        Row: {
          confidence: string | null
          created_at: string
          id: string
          is_correct: boolean | null
          node_id: string
          progress_state: Json
          research_line: string
          selected_answer: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean | null
          node_id: string
          progress_state?: Json
          research_line: string
          selected_answer?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean | null
          node_id?: string
          progress_state?: Json
          research_line?: string
          selected_answer?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          organization: string | null
          research_field: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          organization?: string | null
          research_field?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          organization?: string | null
          research_field?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_files: {
        Row: {
          bucket_id: string
          category: string
          created_at: string
          id: string
          mime_type: string | null
          original_name: string
          project_id: string
          size_bytes: number
          storage_path: string
          uploader_id: string
        }
        Insert: {
          bucket_id?: string
          category?: string
          created_at?: string
          id?: string
          mime_type?: string | null
          original_name: string
          project_id: string
          size_bytes?: number
          storage_path: string
          uploader_id: string
        }
        Update: {
          bucket_id?: string
          category?: string
          created_at?: string
          id?: string
          mime_type?: string | null
          original_name?: string
          project_id?: string
          size_bytes?: number
          storage_path?: string
          uploader_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_invoices: {
        Row: {
          admin_note: string | null
          amount: number
          created_at: string
          created_by: string
          currency: string
          due_at: string | null
          id: string
          paid_at: string | null
          payment_instructions: string | null
          payment_reference: string | null
          project_id: string
          quote_id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          amount: number
          created_at?: string
          created_by: string
          currency?: string
          due_at?: string | null
          id?: string
          paid_at?: string | null
          payment_instructions?: string | null
          payment_reference?: string | null
          project_id: string
          quote_id: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          amount?: number
          created_at?: string
          created_by?: string
          currency?: string
          due_at?: string | null
          id?: string
          paid_at?: string | null
          payment_instructions?: string | null
          payment_reference?: string | null
          project_id?: string
          quote_id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_invoices_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: true
            referencedRelation: "project_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      project_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          project_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          project_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          project_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_quotes: {
        Row: {
          admin_note: string | null
          amount: number
          created_at: string
          created_by: string
          currency: string
          deliverables: string | null
          estimated_days: number | null
          id: string
          project_id: string
          responded_at: string | null
          scope_summary: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          valid_until: string | null
        }
        Insert: {
          admin_note?: string | null
          amount: number
          created_at?: string
          created_by: string
          currency?: string
          deliverables?: string | null
          estimated_days?: number | null
          id?: string
          project_id: string
          responded_at?: string | null
          scope_summary?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          valid_until?: string | null
        }
        Update: {
          admin_note?: string | null
          amount?: number
          created_at?: string
          created_by?: string
          currency?: string
          deliverables?: string | null
          estimated_days?: number | null
          id?: string
          project_id?: string
          responded_at?: string | null
          scope_summary?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_quotes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          analysis_type: string | null
          created_at: string
          id: string
          research_stage: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          wizard_data: Json
        }
        Insert: {
          analysis_type?: string | null
          created_at?: string
          id?: string
          research_stage?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          wizard_data?: Json
        }
        Update: {
          analysis_type?: string | null
          created_at?: string
          id?: string
          research_stage?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          wizard_data?: Json
        }
        Relationships: []
      }
      research_assessments: {
        Row: {
          analysis_goal: string | null
          answers: Json
          created_at: string
          data_stage: string | null
          id: string
          metadata_level: string | null
          question_type: string | null
          recommendation_destination: string | null
          recommendation_level: string | null
          replicate_level: string | null
          research_line: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_goal?: string | null
          answers?: Json
          created_at?: string
          data_stage?: string | null
          id?: string
          metadata_level?: string | null
          question_type?: string | null
          recommendation_destination?: string | null
          recommendation_level?: string | null
          replicate_level?: string | null
          research_line: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_goal?: string | null
          answers?: Json
          created_at?: string
          data_stage?: string | null
          id?: string
          metadata_level?: string | null
          question_type?: string | null
          recommendation_destination?: string | null
          recommendation_level?: string | null
          replicate_level?: string | null
          research_line?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      research_profiles: {
        Row: {
          bioinformatics_level: string | null
          career_stage: string | null
          created_at: string
          discipline: string | null
          id: string
          interests: string[]
          notes: string | null
          preferred_support: string | null
          primary_goal: string | null
          primary_research_line: string | null
          programming_level: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bioinformatics_level?: string | null
          career_stage?: string | null
          created_at?: string
          discipline?: string | null
          id?: string
          interests?: string[]
          notes?: string | null
          preferred_support?: string | null
          primary_goal?: string | null
          primary_research_line?: string | null
          programming_level?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bioinformatics_level?: string | null
          career_stage?: string | null
          created_at?: string
          discipline?: string | null
          id?: string
          interests?: string[]
          notes?: string | null
          preferred_support?: string | null
          primary_goal?: string | null
          primary_research_line?: string | null
          programming_level?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resource_content_blocks: {
        Row: {
          created_at: string | null
          id: string
          key: string
          label: string
          resource_id: string | null
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          label: string
          resource_id?: string | null
          updated_at?: string | null
          value?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          label?: string
          resource_id?: string | null
          updated_at?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_content_blocks_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resource_tours"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_hotspots: {
        Row: {
          action: string | null
          common_mistake: string
          created_at: string | null
          description: string | null
          exercise_answer: string
          exercise_question: string
          height: number
          hotspot_key: string
          id: string
          persian_label: string
          research_example: string
          resource_id: string | null
          step: number
          title: string
          updated_at: string | null
          why_it_matters: string
          width: number
          x: number
          y: number
        }
        Insert: {
          action?: string | null
          common_mistake?: string
          created_at?: string | null
          description?: string | null
          exercise_answer?: string
          exercise_question?: string
          height?: number
          hotspot_key: string
          id?: string
          persian_label?: string
          research_example?: string
          resource_id?: string | null
          step: number
          title: string
          updated_at?: string | null
          why_it_matters?: string
          width?: number
          x?: number
          y?: number
        }
        Update: {
          action?: string | null
          common_mistake?: string
          created_at?: string | null
          description?: string | null
          exercise_answer?: string
          exercise_question?: string
          height?: number
          hotspot_key?: string
          id?: string
          persian_label?: string
          research_example?: string
          resource_id?: string | null
          step?: number
          title?: string
          updated_at?: string | null
          why_it_matters?: string
          width?: number
          x?: number
          y?: number
        }
        Relationships: [
          {
            foreignKeyName: "resource_hotspots_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resource_tours"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_tours: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      respond_to_project_quote: {
        Args: { quote_id: string; response: string }
        Returns: {
          admin_note: string | null
          amount: number
          created_at: string
          created_by: string
          currency: string
          deliverables: string | null
          estimated_days: number | null
          id: string
          project_id: string
          responded_at: string | null
          scope_summary: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          valid_until: string | null
        }
        SetofOptions: {
          from: "*"
          to: "project_quotes"
          isOneToOne: true
          isSetofReturn: false
        }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
