export interface User {
  id: string;
  email: string;
  company_name?: string;
  role?: string;
  organization_id?: string;
}

export interface Profile {
  id: string;
  email?: string;
  company_name?: string;
  role?: string;
  organization_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}