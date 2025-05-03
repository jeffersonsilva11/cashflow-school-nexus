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
      audit_logs: {
        Row: {
          action: string
          changed_at: string | null
          changed_by: string | null
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      devices: {
        Row: {
          assigned_at: string | null
          batch_id: string | null
          created_at: string | null
          device_model: string | null
          device_type: string
          firmware_version: string | null
          id: string
          last_used_at: string | null
          replacement_device_id: string | null
          replacement_reason: string | null
          school_id: string | null
          serial_number: string
          status: string
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_at?: string | null
          batch_id?: string | null
          created_at?: string | null
          device_model?: string | null
          device_type: string
          firmware_version?: string | null
          id?: string
          last_used_at?: string | null
          replacement_device_id?: string | null
          replacement_reason?: string | null
          school_id?: string | null
          serial_number: string
          status: string
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_at?: string | null
          batch_id?: string | null
          created_at?: string | null
          device_model?: string | null
          device_type?: string
          firmware_version?: string | null
          id?: string
          last_used_at?: string | null
          replacement_device_id?: string | null
          replacement_reason?: string | null
          school_id?: string | null
          serial_number?: string
          status?: string
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_replacement_device_id_fkey"
            columns: ["replacement_device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_student: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          parent_id: string | null
          relationship: string | null
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          parent_id?: string | null
          relationship?: string | null
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          parent_id?: string | null
          relationship?: string | null
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_student_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_student_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateway_configs: {
        Row: {
          api_key: string | null
          app_id: string | null
          app_key: string | null
          config: Json | null
          created_at: string | null
          enabled: boolean | null
          environment: string | null
          gateway: string
          id: string
          stone_code: string | null
          updated_at: string | null
        }
        Insert: {
          api_key?: string | null
          app_id?: string | null
          app_key?: string | null
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          environment?: string | null
          gateway: string
          id?: string
          stone_code?: string | null
          updated_at?: string | null
        }
        Update: {
          api_key?: string | null
          app_id?: string | null
          app_key?: string | null
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          environment?: string | null
          gateway?: string
          id?: string
          stone_code?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_gateway_transactions: {
        Row: {
          amount: number
          authorization_code: string | null
          card_brand: string | null
          created_at: string | null
          device_id: string | null
          id: string
          installments: number | null
          metadata: Json | null
          nsu: string | null
          payment_gateway: string
          payment_method: string
          school_id: string | null
          status: string
          student_id: string | null
          terminal_id: string
          transaction_date: string
          transaction_id: string
          type: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          amount: number
          authorization_code?: string | null
          card_brand?: string | null
          created_at?: string | null
          device_id?: string | null
          id?: string
          installments?: number | null
          metadata?: Json | null
          nsu?: string | null
          payment_gateway: string
          payment_method: string
          school_id?: string | null
          status: string
          student_id?: string | null
          terminal_id: string
          transaction_date?: string
          transaction_id: string
          type: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          authorization_code?: string | null
          card_brand?: string | null
          created_at?: string | null
          device_id?: string | null
          id?: string
          installments?: number | null
          metadata?: Json | null
          nsu?: string | null
          payment_gateway?: string
          payment_method?: string
          school_id?: string | null
          status?: string
          student_id?: string | null
          terminal_id?: string
          transaction_date?: string
          transaction_id?: string
          type?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_gateway_transactions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_gateway_transactions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_gateway_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_provider_configs: {
        Row: {
          api_key: string | null
          config: Json | null
          created_at: string | null
          enabled: boolean | null
          environment: string | null
          id: string
          provider: string
          publishable_key: string | null
          updated_at: string | null
          webhook_secret: string | null
        }
        Insert: {
          api_key?: string | null
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          environment?: string | null
          id?: string
          provider: string
          publishable_key?: string | null
          updated_at?: string | null
          webhook_secret?: string | null
        }
        Update: {
          api_key?: string | null
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          environment?: string | null
          id?: string
          provider?: string
          publishable_key?: string | null
          updated_at?: string | null
          webhook_secret?: string | null
        }
        Relationships: []
      }
      payment_terminals: {
        Row: {
          app_version: string | null
          battery_level: number | null
          connection_status: string | null
          created_at: string | null
          device_id: string | null
          firmware_version: string | null
          gateway: string
          id: string
          ip_address: string | null
          last_sync_at: string | null
          mac_address: string | null
          model: string
          school_id: string | null
          serial_number: string
          status: string
          stone_terminal_id: string | null
          terminal_id: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          app_version?: string | null
          battery_level?: number | null
          connection_status?: string | null
          created_at?: string | null
          device_id?: string | null
          firmware_version?: string | null
          gateway?: string
          id?: string
          ip_address?: string | null
          last_sync_at?: string | null
          mac_address?: string | null
          model?: string
          school_id?: string | null
          serial_number?: string
          status: string
          stone_terminal_id?: string | null
          terminal_id: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          app_version?: string | null
          battery_level?: number | null
          connection_status?: string | null
          created_at?: string | null
          device_id?: string | null
          firmware_version?: string | null
          gateway?: string
          id?: string
          ip_address?: string | null
          last_sync_at?: string | null
          mac_address?: string | null
          model?: string
          school_id?: string | null
          serial_number?: string
          status?: string
          stone_terminal_id?: string | null
          terminal_id?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_terminals_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_terminals_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_terminals_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
          school_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          role: string
          school_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          school_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      schools: {
        Row: {
          active: boolean | null
          address: string | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          state: string | null
          subscription_plan: string | null
          subscription_status: string | null
          updated_at: string | null
          zipcode: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          state?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Relationships: []
      }
      student_balances: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          last_topup_at: string | null
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          last_topup_at?: string | null
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          last_topup_at?: string | null
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_balances_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          active: boolean | null
          created_at: string | null
          date_of_birth: string | null
          document_id: string | null
          geofencing_enabled: boolean | null
          geofencing_radius: number | null
          grade: string | null
          id: string
          name: string
          notes: string | null
          notify_on_approach: boolean | null
          photo_url: string | null
          school_id: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          date_of_birth?: string | null
          document_id?: string | null
          geofencing_enabled?: boolean | null
          geofencing_radius?: number | null
          grade?: string | null
          id?: string
          name: string
          notes?: string | null
          notify_on_approach?: boolean | null
          photo_url?: string | null
          school_id?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          date_of_birth?: string | null
          document_id?: string | null
          geofencing_enabled?: boolean | null
          geofencing_radius?: number | null
          grade?: string | null
          id?: string
          name?: string
          notes?: string | null
          notify_on_approach?: boolean | null
          photo_url?: string | null
          school_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      system_configs: {
        Row: {
          auto_read: boolean | null
          buffer_time: number | null
          card_protocols: string[] | null
          company_name: string | null
          config: Json | null
          config_key: string
          created_at: string | null
          date_format: string | null
          debug_mode: boolean | null
          default_currency: string | null
          enabled: boolean | null
          id: string
          logo_url: string | null
          map_style: string | null
          mapbox_token: string | null
          privacy_url: string | null
          support_email: string | null
          support_phone: string | null
          terms_url: string | null
          time_format: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          auto_read?: boolean | null
          buffer_time?: number | null
          card_protocols?: string[] | null
          company_name?: string | null
          config?: Json | null
          config_key: string
          created_at?: string | null
          date_format?: string | null
          debug_mode?: boolean | null
          default_currency?: string | null
          enabled?: boolean | null
          id?: string
          logo_url?: string | null
          map_style?: string | null
          mapbox_token?: string | null
          privacy_url?: string | null
          support_email?: string | null
          support_phone?: string | null
          terms_url?: string | null
          time_format?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_read?: boolean | null
          buffer_time?: number | null
          card_protocols?: string[] | null
          company_name?: string | null
          config?: Json | null
          config_key?: string
          created_at?: string | null
          date_format?: string | null
          debug_mode?: boolean | null
          default_currency?: string | null
          enabled?: boolean | null
          id?: string
          logo_url?: string | null
          map_style?: string | null
          mapbox_token?: string | null
          privacy_url?: string | null
          support_email?: string | null
          support_phone?: string | null
          terms_url?: string | null
          time_format?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          device_id: string | null
          id: string
          notes: string | null
          payment_gateway_id: string | null
          payment_method: string | null
          status: string
          student_id: string | null
          transaction_date: string | null
          transaction_id: string
          type: string
          vendor_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          device_id?: string | null
          id?: string
          notes?: string | null
          payment_gateway_id?: string | null
          payment_method?: string | null
          status: string
          student_id?: string | null
          transaction_date?: string | null
          transaction_id: string
          type: string
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          device_id?: string | null
          id?: string
          notes?: string | null
          payment_gateway_id?: string | null
          payment_method?: string | null
          status?: string
          student_id?: string | null
          transaction_date?: string | null
          transaction_id?: string
          type?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_commission_tiers: {
        Row: {
          commission_rate: number
          created_at: string | null
          id: string
          max_sales_amount: number | null
          min_sales_amount: number
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          commission_rate?: number
          created_at?: string | null
          id?: string
          max_sales_amount?: number | null
          min_sales_amount?: number
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          commission_rate?: number
          created_at?: string | null
          id?: string
          max_sales_amount?: number | null
          min_sales_amount?: number
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_commission_tiers_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_products: {
        Row: {
          active: boolean | null
          allergens: string[] | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          price: number
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          active?: boolean | null
          allergens?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price: number
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          active?: boolean | null
          allergens?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_sales_reports: {
        Row: {
          commission_amount: number
          end_date: string
          id: string
          net_amount: number
          report_data: Json | null
          report_generated_at: string | null
          report_status: string | null
          reporting_period: string
          start_date: string
          total_sales: number
          total_transactions: number
          vendor_id: string
        }
        Insert: {
          commission_amount?: number
          end_date: string
          id?: string
          net_amount?: number
          report_data?: Json | null
          report_generated_at?: string | null
          report_status?: string | null
          reporting_period: string
          start_date: string
          total_sales?: number
          total_transactions?: number
          vendor_id: string
        }
        Update: {
          commission_amount?: number
          end_date?: string
          id?: string
          net_amount?: number
          report_data?: Json | null
          report_generated_at?: string | null
          report_status?: string | null
          reporting_period?: string
          start_date?: string
          total_sales?: number
          total_transactions?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_sales_reports_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_transfers: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          notes: string | null
          payment_details: Json | null
          payment_method: string | null
          reference_period_end: string | null
          reference_period_start: string | null
          status: string
          transfer_date: string | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          reference_period_end?: string | null
          reference_period_start?: string | null
          status?: string
          transfer_date?: string | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          reference_period_end?: string | null
          reference_period_start?: string | null
          status?: string
          transfer_date?: string | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_transfers_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          active: boolean | null
          commission_rate: number | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          location: string | null
          name: string
          school_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          commission_rate?: number | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          school_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          commission_rate?: number | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          school_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors_financials: {
        Row: {
          balance: number
          created_at: string | null
          id: string
          last_transfer_date: string | null
          next_transfer_date: string | null
          payment_details: Json | null
          payment_method: string | null
          pending_transfer: number
          transfer_frequency: string | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          balance?: number
          created_at?: string | null
          id?: string
          last_transfer_date?: string | null
          next_transfer_date?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          pending_transfer?: number
          transfer_frequency?: string | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          id?: string
          last_transfer_date?: string | null
          next_transfer_date?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          pending_transfer?: number
          transfer_frequency?: string | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_financials_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_profile_access: {
        Args: { profile_id: string; profile_role: string }
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
