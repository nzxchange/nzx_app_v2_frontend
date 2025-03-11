export interface Profile {
  id: string;
  organization_id: string | null;
  email: string;
  created_at: string;
  updated_at: string;
  role: string;
  company_name?: string;
}

export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Add other types as needed