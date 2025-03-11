import { supabase } from '../supabase';
import type { 
  Organization,
  Portfolio,
  Asset,
  AssetTenant,
  AssetDocument,
  CreateAssetRequest,
  UpdateAssetRequest,
  AssignTenantRequest,
  UploadDocumentRequest
} from '@/types/asset';

export const assetApi = {
  // Organizations
  getOrganizations: async () => {
    const { data, error } = await supabase
      .from('organizations')
      .select('*');
    
    if (error) throw error;
    return data as Organization[];
  },

  createOrganization: async (org: Partial<Organization>) => {
    const { data, error } = await supabase
      .from('organizations')
      .insert(org)
      .select()
      .single();
    
    if (error) throw error;
    return data as Organization;
  },

  // Portfolios
  getPortfolios: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    // Get the user's organization
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.user.id)
      .single();

    if (!profile?.organization_id) {
      // Create a default organization for the user
      const { data: org } = await supabase
        .from('organizations')
        .insert({
          name: `${user.user.email}'s Organization`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      // Update user's profile with the organization
      await supabase
        .from('profiles')
        .update({ organization_id: org.id })
        .eq('id', user.user.id);

      // Return empty array as no portfolios exist yet
      return [] as Portfolio[];
    }

    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('organization_id', profile.organization_id);
    
    if (error) throw error;
    return data as Portfolio[];
  },

  createPortfolio: async (portfolio: Partial<Portfolio>) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    // Get the user's organization
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.user.id)
      .single();

    if (!profile?.organization_id) throw new Error('No organization found');

    const { data, error } = await supabase
      .from('portfolios')
      .insert({
        ...portfolio,
        organization_id: profile.organization_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Portfolio;
  },

  // Assets
  getAssets: async (portfolioId: string) => {
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        portfolio:portfolios(name)
      `)
      .eq('portfolio_id', portfolioId);
    
    if (error) throw error;
    return data as Asset[];
  },

  createAsset: async (asset: CreateAssetRequest) => {
    const { data, error } = await supabase
      .from('assets')
      .insert({
        ...asset,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Asset;
  },

  updateAsset: async (asset: UpdateAssetRequest) => {
    const { id, ...updateData } = asset;
    const { data, error } = await supabase
      .from('assets')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Asset;
  },

  // Asset Tenants
  assignTenant: async (request: AssignTenantRequest) => {
    // First check if the user exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', request.tenant_id)
      .maybeSingle();
    
    let userId;
    
    if (!existingUser) {
      // Create a new user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: request.tenant_id,
        password: Math.random().toString(36).slice(-8), // Generate random password
      });
      
      if (authError) throw authError;
      userId = authData.user?.id;
      
      // Create profile for the new user
      await supabase.from('profiles').insert({
        id: userId,
        email: request.tenant_id,
        role: 'tenant'
      });
    } else {
      userId = existingUser.id;
    }
    
    // Create the asset tenant relationship
    const { data, error } = await supabase
      .from('asset_tenants')
      .insert({
        ...request,
        tenant_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as AssetTenant;
  },

  getTenants: async (assetId: string) => {
    const { data, error } = await supabase
      .from('asset_tenants')
      .select(`
        *,
        tenant:profiles(id, email, company_name, role)
      `)
      .eq('asset_id', assetId);
    
    if (error) throw error;
    return data as AssetTenant[];
  },

  // Asset Documents
  uploadDocument: async (request: UploadDocumentRequest) => {
    const { asset_id, document_type, file } = request;
    
    // First, upload the file to storage
    const fileExt = file.name.split('.').pop();
    const filePath = `${asset_id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;

    // Then create the document record
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert({
        filename: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: filePath,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (docError) throw docError;

    // Finally, create the asset document link
    const { data: assetDocData, error: assetDocError } = await supabase
      .from('asset_documents')
      .insert({
        asset_id,
        document_id: docData.id,
        document_type,
        upload_date: new Date().toISOString()
      })
      .select(`
        *,
        document:documents(
          id,
          filename,
          file_type,
          file_size,
          storage_path
        )
      `)
      .single();
    
    if (assetDocError) throw assetDocError;
    
    return assetDocData as AssetDocument;
  },

  getDocuments: async (assetId: string) => {
    const { data, error } = await supabase
      .from('asset_documents')
      .select(`
        *,
        document:documents(
          id,
          filename,
          file_type,
          file_size,
          storage_path
        )
      `)
      .eq('asset_id', assetId);
    
    if (error) throw error;
    return data as AssetDocument[];
  }
};