export interface Project {
  id: string;
  name: string;
  description?: string;
  location?: string;
  project_type: string;
  price_per_credit: number;
  available_credits: number;
  total_emissions_reduction?: number;
  status: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Credit {
  id: string;
  user_id: string;
  project_id: string;
  quantity: number;
  transaction_type: string;
  price_per_credit: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface CreditPurchaseRequest {
  project_id: string;
  quantity: number;
  price_per_credit: number;
}

export interface CreditSummary {
  available: number;
  used: number;
  pending: number;
}

export interface Portfolio {
  id: number;
  name: string;
  description: string;
  price: string;
  credits: number;
  image: string;
}