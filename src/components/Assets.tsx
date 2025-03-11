import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Upload, 
  Users, 
  File, 
  Download, 
  Trash2,
  FolderPlus,
  UserPlus,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../lib/supabase';
import { Database } from '@/types/supabase';
import { User } from '@supabase/supabase-js';
import { Profile, Organization } from '@/types/database.types';

interface Portfolio {
  id: string;
  name: string;
  description: string | null;
}

interface Asset {
  id: string;
  portfolio_id: string;
  name: string;
  asset_type: 'office' | 'retail' | 'industrial' | 'residential' | 'mixed_use';
  address: string;
  total_area: number;
  year_built?: number;
  energy_rating?: string;
}

interface AssetTenant {
  id: string;
  asset_id: string;
  tenant_id: string;
  floor_number?: number;
  area_occupied: number;
  lease_start_date: string;
  lease_end_date?: string;
}

interface AssetDocument {
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

export const Assets = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [documents, setDocuments] = useState<AssetDocument[]>([]);
  const [tenants, setTenants] = useState<AssetTenant[]>([]);
  const [showNewPortfolioForm, setShowNewPortfolioForm] = useState(false);
  const [showNewAssetForm, setShowNewAssetForm] = useState(false);
  const [showAssignUserForm, setShowAssignUserForm] = useState(false);
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newPortfolio, setNewPortfolio] = useState({
    name: '',
    description: ''
  });

  const [newAsset, setNewAsset] = useState({
    name: '',
    asset_type: 'office' as const,
    address: '',
    total_area: 0,
    year_built: undefined as number | undefined,
    energy_rating: undefined as string | undefined
  });

  const [newUser, setNewUser] = useState({
    email: '',
    role: 'tenant' as const,
    floor_number: '',
    area_occupied: 0,
    lease_start_date: '',
    lease_end_date: ''
  });

  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);

  const assetTypes = [
    { value: 'office', label: 'Office' },
    { value: 'retail', label: 'Retail' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'residential', label: 'Residential' },
    { value: 'mixed_use', label: 'Mixed Use' }
  ];

  const userRoles = [
    { value: 'tenant', label: 'Tenant' },
    { value: 'operator', label: 'Operator' },
    { value: 'consultant', label: 'Consultant' }
  ];

  // Fetch portfolios
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First check if we need to create a demo organization and portfolio
        const { data: userData } = await supabase.auth.getUser();
        
        // If not authenticated, create a demo user
        if (!userData.user) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: 'demo@example.com',
            password: 'demo12345',
            options: {
              data: {
                name: 'Demo User'
              }
            }
          });
          
          if (signUpError) {
            console.error('Error creating demo user:', signUpError);
            throw signUpError;
          }
          
          // Sign in with the demo user
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: 'demo@example.com',
            password: 'demo12345'
          });
          
          if (signInError) {
            console.error('Error signing in with demo user:', signInError);
            throw signInError;
          }
        }
        
        // Get current user's email domain
        const email = userData.user?.email || '';
        const domain = email.includes('@') ? email.split('@')[1] : '';

        // Check if an organization exists for this domain
        if (domain) {
          const { data: existingOrg } = await supabase
            .from('organizations')
            .select('id')
            .eq('domain', domain)
            .maybeSingle();
          
          if (existingOrg) {
            // Update user's profile with existing organization
            const { error: updateProfileError } = await supabase
              .from('profiles')
              .update({
                organization_id: existingOrg.id,
                updated_at: new Date().toISOString()
              })
              .eq('id', userData.user?.id || '');
            
            if (updateProfileError) {
              console.error('Error updating profile with organization:', updateProfileError);
            }
          }
        }
        
        // Now fetch portfolios
        const { data: portfoliosData, error: portfoliosError } = await supabase
          .from('portfolios')
          .select('*');
        
        if (portfoliosError) {
          console.error('Error fetching portfolios:', portfoliosError);
          throw portfoliosError;
        }
        
        // If no portfolios, create a demo organization and portfolio
        if (!portfoliosData || portfoliosData.length === 0) {
          // Create a demo organization
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .insert({
              name: 'Demo Organization',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (orgError) {
            console.error('Error creating demo organization:', orgError);
            throw orgError;
          }
          
          // Create a demo portfolio
          const { data: portfolioData, error: portfolioError } = await supabase
            .from('portfolios')
            .insert({
              name: 'Demo Portfolio',
              description: 'A portfolio for demonstration purposes',
              organization_id: orgData.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (portfolioError) {
            console.error('Error creating demo portfolio:', portfolioError);
            throw portfolioError;
          }
          
          setPortfolios([portfolioData]);
          setSelectedPortfolio(portfolioData.id);
        } else {
          setPortfolios(portfoliosData);
          if (portfoliosData.length > 0) {
            setSelectedPortfolio(portfoliosData[0].id);
          }
        }
      } catch (err) {
        console.error('Error in portfolio setup:', err);
        setError('Failed to load portfolios. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  // Fetch assets when portfolio is selected
  useEffect(() => {
    if (!selectedPortfolio) {
      setAssets([]);
      return;
    }

    const fetchAssets = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('assets')
          .select('*')
          .eq('portfolio_id', selectedPortfolio);
        
        if (error) throw error;
        
        setAssets(data || []);
        
        // If no assets, create a demo asset
        if (!data || data.length === 0) {
          const { data: assetData, error: assetError } = await supabase
            .from('assets')
            .insert({
              portfolio_id: selectedPortfolio,
              name: 'Demo Office Building',
              asset_type: 'office',
              address: '123 Main Street, New York, NY 10001',
              total_area: 50000,
              year_built: 2010,
              energy_rating: 'B',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (assetError) throw assetError;
          
          setAssets([assetData]);
          setSelectedAsset(assetData.id);
          setExpandedAsset(assetData.id);
        }
      } catch (err) {
        console.error('Error fetching assets:', err);
        setError('Failed to load assets. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [selectedPortfolio]);

  // Fetch documents and tenants when asset is selected
  useEffect(() => {
    if (!selectedAsset) {
      setDocuments([]);
      setTenants([]);
      return;
    }

    const fetchAssetDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch documents
        const { data: docsData, error: docsError } = await supabase
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
          .eq('asset_id', selectedAsset);
        
        if (docsError) throw docsError;
        
        // Fetch tenants
        const { data: tenantsData, error: tenantsError } = await supabase
          .from('asset_tenants')
          .select('*')
          .eq('asset_id', selectedAsset);
        
        if (tenantsError) throw tenantsError;
        
        setDocuments(docsData || []);
        setTenants(tenantsData || []);
      } catch (err) {
        console.error('Error fetching asset details:', err);
        setError('Failed to load asset details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssetDetails();
  }, [selectedAsset]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .single();

        if (error) throw error;
        setProfile(profile);

      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPortfolio.name.trim()) {
      setError('Portfolio name is required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      let organizationId;
      
      if (!profile?.organization_id) {
        // Create a new organization
        const { data: newOrgData, error: newOrgError } = await supabase
          .from('organizations')
          .insert({
            name: 'My Organization',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (newOrgError) throw newOrgError;
        
        // Update user's profile with the new organization
        const { error: updateProfileError } = await supabase
          .from('profiles')
          .update({
            organization_id: newOrgData.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile?.id || '');
        
        if (updateProfileError) throw updateProfileError;
        
        organizationId = newOrgData.id;
      } else {
        organizationId = profile.organization_id;
      }
      
      // Create the portfolio
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolios')
        .insert({
          name: newPortfolio.name,
          description: newPortfolio.description || null,
          organization_id: organizationId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (portfolioError) throw portfolioError;
      
      setPortfolios([...portfolios, portfolioData]);
      setSelectedPortfolio(portfolioData.id);
      setShowNewPortfolioForm(false);
      setNewPortfolio({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating portfolio:', error);
      setError('Failed to create portfolio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPortfolio) {
      setError('Please select a portfolio first');
      return;
    }

    if (!newAsset.name.trim() || !newAsset.address.trim() || newAsset.total_area <= 0) {
      setError('Name, address, and total area are required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('assets')
        .insert({
          portfolio_id: selectedPortfolio,
          name: newAsset.name,
          asset_type: newAsset.asset_type,
          address: newAsset.address,
          total_area: newAsset.total_area,
          year_built: newAsset.year_built || null,
          energy_rating: newAsset.energy_rating || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setAssets([...assets, data]);
      setSelectedAsset(data.id);
      setExpandedAsset(data.id);
      setShowNewAssetForm(false);
      setNewAsset({
        name: '',
        asset_type: 'office',
        address: '',
        total_area: 0,
        year_built: undefined,
        energy_rating: undefined
      });
    } catch (err) {
      console.error('Error creating asset:', err);
      setError('Failed to create asset. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAsset) {
      setError('Please select an asset first');
      return;
    }

    if (!newUser.email.trim() || newUser.area_occupied <= 0 || !newUser.lease_start_date) {
      setError('Email, area occupied, and lease start date are required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Check if user exists
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newUser.email)
        .maybeSingle();
      
      let userId;
      
      if (!existingUser) {
        // Create a new user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: newUser.email,
          password: Math.random().toString(36).slice(-8), // Generate random password
        });
        
        if (authError) throw authError;
        
        userId = authData.user?.id;
        
        // Create profile for the new user
        await supabase.from('profiles').insert({
          id: userId,
          email: newUser.email,
          role: newUser.role
        });
      } else {
        userId = existingUser.id;
      }
      
      // Create tenant assignment
      const { data, error } = await supabase
        .from('asset_tenants')
        .insert({
          asset_id: selectedAsset,
          tenant_id: userId,
          floor_number: newUser.floor_number ? parseInt(newUser.floor_number) : null,
          area_occupied: newUser.area_occupied,
          lease_start_date: newUser.lease_start_date,
          lease_end_date: newUser.lease_end_date || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setTenants([...tenants, data]);
      setShowAssignUserForm(false);
      setNewUser({
        email: '',
        role: 'tenant',
        floor_number: '',
        area_occupied: 0,
        lease_start_date: '',
        lease_end_date: ''
      });
    } catch (err) {
      console.error('Error assigning user:', err);
      setError('Failed to assign user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (!selectedAsset) {
        setError('Please select an asset first');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        for (const file of acceptedFiles) {
          // Upload file to storage
          const fileExt = file.name.split('.').pop();
          const filePath = `${selectedAsset}/${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);
          
          if (uploadError) throw uploadError;
          
          // Create document record
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
          
          // Create asset document link
          const { data: assetDocData, error: assetDocError } = await supabase
            .from('asset_documents')
            .insert({
              asset_id: selectedAsset,
              document_id: docData.id,
              document_type: 'energy_bill',
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
          
          setDocuments([...documents, assetDocData]);
        }
      } catch (err) {
        console.error('Error uploading documents:', err);
        setError('Failed to upload documents. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    }
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Asset Management</h1>
        <p className="text-gray-600">Manage your properties, tenants, and documents</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolios Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Portfolios</h2>
              <button
                onClick={() => setShowNewPortfolioForm(true)}
                className="p-2 text-primary hover:bg-primary/5 rounded-lg"
                title="Add Portfolio"
              >
                <FolderPlus className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {isLoading && portfolios.length === 0 ? (
                <div className="text-center py-4 text-gray-500">Loading...</div>
              ) : portfolios.length === 0 ? (
                <div className="text-center py-4">
                  <FolderPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No portfolios yet</p>
                  <button
                    onClick={() => setShowNewPortfolioForm(true)}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                  >
                    Create Your First Portfolio
                  </button>
                </div>
              ) : (
                portfolios.map((portfolio) => (
                  <button
                    key={portfolio.id}
                    onClick={() => setSelectedPortfolio(portfolio.id)}
                    className={`w-full text-left p-3 rounded-lg mb-2 ${
                      selectedPortfolio === portfolio.id
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 mr-3" />
                      <div>
                        <p className="font-medium">{portfolio.name}</p>
                        {portfolio.description && (
                          <p className={`text-sm ${
                            selectedPortfolio === portfolio.id
                              ? 'text-white/80'
                              : 'text-gray-500'
                          }`}>
                            {portfolio.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Assets Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Assets</h2>
              {selectedPortfolio && (
                <button
                  onClick={() => setShowNewAssetForm(true)}
                  className="p-2 text-primary hover:bg-primary/5 rounded-lg"
                  title="Add Asset"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="p-4">
              {!selectedPortfolio ? (
                <div className="text-center py-8">
                  <FolderPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Select a portfolio to view assets</p>
                </div>
              ) : isLoading && assets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Loading assets...</div>
              ) : assets.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No assets in this portfolio</p>
                  <button
                    onClick={() => setShowNewAssetForm(true)}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                  >
                    Add Your First Asset
                  </button>
                </div>
              ) : (
                assets.map((asset) => (
                  <div key={asset.id} className="mb-4">
                    <button
                      onClick={() => {
                        setSelectedAsset(asset.id);
                        setExpandedAsset(expandedAsset === asset.id ? null : asset.id);
                      }}
                      className={`w-full text-left p-4 rounded-lg border ${
                        selectedAsset === asset.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Building2 className="w-5 h-5 mr-3 text-primary" />
                          <div>
                            <p className="font-medium">{asset.name}</p>
                            <p className="text-sm text-gray-500">{asset.address}</p>
                          </div>
                        </div>
                        {expandedAsset === asset.id ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </div>
                    </button>

                    {expandedAsset === asset.id && (
                      <div className="mt-2 pl-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Type</p>
                              <p className="font-medium">
                                {assetTypes.find(t => t.value === asset.asset_type)?.label}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Total Area</p>
                              <p className="font-medium">{asset.total_area} sq ft</p>
                            </div>
                            {asset.year_built && (
                              <div>
                                <p className="text-sm text-gray-500">Year Built</p>
                                <p className="font-medium">{asset.year_built}</p>
                              </div>
                            )}
                            {asset.energy_rating && (
                              <div>
                                <p className="text-sm text-gray-500">Energy Rating</p>
                                <p className="font-medium">{asset.energy_rating}</p>
                              </div>
                            )}
                          </div>

                          {/* Tenants Section */}
                          {tenants.length > 0 && (
                            <div className="mb-4">
                              <h3 className="text-sm font-medium text-gray-700 mb-2">Tenants</h3>
                              <div className="bg-white rounded-lg border border-gray-200 p-3">
                                {tenants.map((tenant, index) => (
                                  <div key={tenant.id} className={`py-2 ${index !== 0 ? 'border-t border-gray-100' : ''}`}>
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="font-medium">{tenant.tenant_id}</p>
                                        <p className="text-xs text-gray-500">
                                          {tenant.floor_number ? `Floor ${tenant.floor_number}, ` : ''}
                                          {tenant.area_occupied} sq ft
                                        </p>
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {new Date(tenant.lease_start_date).toLocaleDateString()} - 
                                        {tenant.lease_end_date ? new Date(tenant.lease_end_date).toLocaleDateString() : 'Ongoing'}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Documents Section */}
                          {documents.length > 0 && (
                            <div className="mb-4">
                              <h3 className="text-sm font-medium text-gray-700 mb-2">Documents</h3>
                              <div className="bg-white rounded-lg border border-gray-200 p-3">
                                {documents.map((doc, index) => (
                                  <div key={doc.id} className={`py-2 ${index !== 0 ? 'border-t border-gray-100' : ''}`}>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <File className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm">{doc.document.filename}</p>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <button className="text-blue-600 hover:text-blue-800">
                                          <Download className="w-4 h-4" />
                                        </button>
                                        <button className="text-red-600 hover:text-red-800">
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedAsset(asset.id);
                                setShowAssignUserForm(true);
                              }}
                              className="flex items-center px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark"
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Assign User
                            </button>
                            <div
                              {...getRootProps()}
                              className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAsset(asset.id);
                              }}
                            >
                              <input {...getInputProps()} />
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Documents
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Portfolio Modal */}
      {showNewPortfolioForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Portfolio</h3>
            <form onSubmit={handleCreatePortfolio} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio Name
                </label>
                <input
                  type="text"
                  value={newPortfolio.name}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  rows={3}
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewPortfolioForm(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Portfolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Asset Modal */}
      {showNewAssetForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Asset</h3>
            <form onSubmit={handleCreateAsset} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset Name
                  </label>
                  <input
                    type="text"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset Type
                  </label>
                  <select
                    value={newAsset.asset_type}
                    onChange={(e) => setNewAsset({ ...newAsset, asset_type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  >
                    {assetTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={newAsset.address}
                    onChange={(e) => setNewAsset({ ...newAsset, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Area (sq ft)
                  </label>
                  <input
                    type="number"
                    value={newAsset.total_area || ''}
                    onChange={(e) => setNewAsset({ ...newAsset, total_area: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year Built
                  </label>
                  <input
                    type="number"
                    value={newAsset.year_built || ''}
                    onChange={(e) => setNewAsset({ ...newAsset, year_built: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Energy Rating
                  </label>
                  <input
                    type="text"
                    value={newAsset.energy_rating || ''}
                    onChange={(e) => setNewAsset({ ...newAsset, energy_rating: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewAssetForm(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign User Modal */}
      {showAssignUserForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Assign User to Asset</h3>
            <form onSubmit={handleAssignUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                >
                  {userRoles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              {newUser.role === 'tenant' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Floor Number
                    </label>
                    <input
                      type="text"
                      value={newUser.floor_number}
                      onChange={(e) => setNewUser({ ...newUser, floor_number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area Occupied (sq ft)
                    </label>
                    <input
                      type="number"
                      value={newUser.area_occupied || ''}
                      onChange={(e) => setNewUser({ ...newUser, area_occupied: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lease Start Date
                    </label>
                    <input
                      type="date"
                      value={newUser.lease_start_date}
                      onChange={(e) => setNewUser({ ...newUser, lease_start_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lease End Date
                    </label>
                    <input
                      type="date"
                      value={newUser.lease_end_date}
                      onChange={(e) => setNewUser({ ...newUser, lease_end_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </>
              )}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAssignUserForm(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Assigning...' : 'Assign User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};