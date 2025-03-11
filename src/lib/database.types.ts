export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          registration_number: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['organizations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>;
      };
      portfolios: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['portfolios']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['portfolios']['Insert']>;
      };
      assets: {
        Row: {
          id: string;
          portfolio_id: string;
          name: string;
          asset_type: 'office' | 'retail' | 'industrial' | 'residential' | 'mixed_use';
          address: string;
          total_area: number;
          year_built: number | null;
          energy_rating: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['assets']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['assets']['Insert']>;
      };
      asset_tenants: {
        Row: {
          id: string;
          asset_id: string;
          tenant_id: string;
          floor_number: number | null;
          area_occupied: number;
          lease_start_date: string;
          lease_end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['asset_tenants']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['asset_tenants']['Insert']>;
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          filename: string;
          file_type: string;
          file_size: number;
          storage_path: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['documents']['Insert']>;
      };
      asset_documents: {
        Row: {
          id: string;
          asset_id: string;
          document_id: string;
          document_type: string;
          upload_date: string;
          document: {
            id: string;
            filename: string;
            file_type: string;
            file_size: number;
            storage_path: string;
          };
        };
        Insert: Omit<Database['public']['Tables']['asset_documents']['Row'], 'id' | 'upload_date'>;
        Update: Partial<Database['public']['Tables']['asset_documents']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          company_name: string | null;
          role: string | null;
          organization_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          location: string | null;
          project_type: string;
          price_per_credit: number;
          available_credits: number;
          total_emissions_reduction: number | null;
          status: string;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      credits: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          quantity: number;
          transaction_type: string;
          price_per_credit: number;
          total_amount: number;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['credits']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['credits']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
    };
  };
}; 