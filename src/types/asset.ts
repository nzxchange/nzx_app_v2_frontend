// Asset Management Types
export type UserRole = 'owner' | 'tenant' | 'operator' | 'consultant';

// Define enum for asset type values
export type AssetTypeEnum = 'office' | 'retail' | 'industrial' | 'residential' | 'mixed_use';

// Define interface for asset type objects with id and name
export interface AssetType {
  id: string;
  name: string;
}

export interface Organization {
  id: string;
  name: string;
  registration_number?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  name: string;
  description?: string;
  address: string;
  asset_type: string;
  portfolio_id: string;
  floor_area?: number;
  occupancy_rate?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AssetTenant {
  id: string;
  asset_id: string;
  tenant_id: string;
  floor_number?: number;
  area_occupied: number;
  lease_start_date: string;
  lease_end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface AssetDocument {
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
}

// API Request/Response Types
export interface CreateAssetRequest {
  portfolio_id: string;
  name: string;
  asset_type: AssetType;
  address: string;
  total_area: number;
  year_built?: number;
  energy_rating?: string;
}

export interface UpdateAssetRequest extends Partial<CreateAssetRequest> {
  id: string;
}

export interface AssignTenantRequest {
  asset_id: string;
  tenant_id: string; // This will be the email address
  floor_number?: number;
  area_occupied: number;
  lease_start_date: string;
  lease_end_date?: string;
}

export interface UploadDocumentRequest {
  asset_id: string;
  document_type: string;
  file: File;
}

export interface AssetCreate {
  name: string;
  description?: string;
  address: string;
  asset_type: string;
  portfolio_id: string;
  floor_area?: number;
  occupancy_rate?: number;
}

// Add a type for the asset creation form
export interface AssetFormData {
  name: string;
  description?: string;
  address: string;
  asset_type: AssetTypeEnum;
  portfolio_id: string;
  floor_area?: number;
  occupancy_rate?: number;
}