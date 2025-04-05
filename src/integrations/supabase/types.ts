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
      assessments: {
        Row: {
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id: string
          questions: Json
          title: string
          topic_id: string | null
        }
        Insert: {
          created_at?: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          questions: Json
          title: string
          topic_id?: string | null
        }
        Update: {
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          questions?: Json
          title?: string
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          created_at: string | null
          deadline: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id: string
          points: number | null
          title: string
          topic_id: string | null
        }
        Insert: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          points?: number | null
          title: string
          topic_id?: string | null
        }
        Update: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          points?: number | null
          title?: string
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          category: Database["public"]["Enums"]["subject_category"]
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: Database["public"]["Enums"]["subject_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: Database["public"]["Enums"]["subject_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          challenge_id: string | null
          content: string
          feedback: string | null
          id: string
          score: number | null
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          content: string
          feedback?: string | null
          id?: string
          score?: number | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          content?: string
          feedback?: string | null
          id?: string
          score?: number | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          content: Json
          created_at: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id: string
          name: string
          prerequisites: string[] | null
          subject_id: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          description?: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          name: string
          prerequisites?: string[] | null
          subject_id?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          name?: string
          prerequisites?: string[] | null
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          assessment_id: string | null
          completed_at: string | null
          id: string
          score: number | null
          topic_id: string | null
          user_id: string | null
        }
        Insert: {
          assessment_id?: string | null
          completed_at?: string | null
          id?: string
          score?: number | null
          topic_id?: string | null
          user_id?: string | null
        }
        Update: {
          assessment_id?: string | null
          completed_at?: string | null
          id?: string
          score?: number | null
          topic_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          full_name: string | null
          grade: number | null
          id: string
          learning_style: Database["public"]["Enums"]["learning_style"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          grade?: number | null
          id: string
          learning_style?: Database["public"]["Enums"]["learning_style"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          grade?: number | null
          id?: string
          learning_style?: Database["public"]["Enums"]["learning_style"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      difficulty_level: "beginner" | "intermediate" | "advanced"
      learning_style: "visual" | "auditory" | "kinesthetic" | "reading_writing"
      subject_category: "math" | "science" | "technology" | "engineering"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
