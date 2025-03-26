import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';
import { AssetCreate, AssetType } from '@/types/asset';
import { assetApi } from '@/services/api';
import AssetForm from '@/components/assets/AssetForm';

// Add this debug function at the top of your file
function debugLog(message: string, data?: any) {
  console.log(`[DEBUG] ${message}`, data || '');
}

// Define types for your data structures
type Organization = {
  portfolios: Portfolio[];
};

type Portfolio = {
  id: string;
  name: string;
  description?: string;
};

const NewAssetPage = () => {
  debugLog('NewAssetPage component is rendering');
  
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    portfolio_id: '',
    asset_type: '',
    address: '',
    total_area: '',
    year_built: '',
    energy_rating: ''
  });
  
  // State for API data
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const { portfolio: defaultPortfolioId } = router.query;
  
  // Add this useEffect for component lifecycle debugging
  useEffect(() => {
    debugLog('NewAssetPage component mounted');
    return () => {
      debugLog('NewAssetPage component unmounted');
    };
  }, []);
  
  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);
  
  // Main data loading function
  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Get session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }
      
      // Get profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, organization_id')
        .eq('id', session.user.id)
        .single();
        
      if (profileError) throw profileError;
      if (!profile?.organization_id) {
        setError('User has no organization. Please contact support.');
        return;
      }
      
      // Get portfolios
      const { data: portfolioList, error: portfolioError } = await supabase
        .from('portfolios')
        .select('id, name, description')
        .eq('organization_id', profile.organization_id);
        
      if (portfolioError) throw portfolioError;
      setPortfolios(portfolioList || []);
      
      // Set default portfolio
      if (portfolioList && portfolioList.length > 0) {
        const defaultId = defaultPortfolioId as string || portfolioList[0].id;
        setFormData(prev => ({...prev, portfolio_id: defaultId}));
      }
      
      // Get asset types
      const types = await assetApi.getAssetTypes();
      setAssetTypes(types);
      
    } catch (error) {
      const err = error as Error;
      console.error('Error loading data:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (!formData.portfolio_id) {
        throw new Error('Please select a portfolio');
      }
      
      // Create asset
      const { data, error } = await supabase
        .from('assets')
        .insert({
          name: formData.name,
          portfolio_id: formData.portfolio_id,
          asset_type: formData.asset_type,
          address: formData.address,
          total_area: parseFloat(formData.total_area) || 0,
          year_built: formData.year_built ? parseInt(formData.year_built) : null,
          energy_rating: formData.energy_rating || null
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Navigate back to assets page
      router.push(`/assets?portfolio=${data.portfolio_id}`);
      
    } catch (error) {
      const err = error as Error;
      console.error('Error creating asset:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateAsset = async (data: AssetCreate) => {
    try {
      await assetApi.createAsset(data);
      router.push(`/portfolios/${data.portfolio_id}`);
    } catch (err) {
      setError('Failed to create asset');
    }
  };
  
  if (loading && portfolios.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Add New Asset</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Asset</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <AssetForm
          onSubmit={handleCreateAsset}
          portfolioId={formData.portfolio_id}
          assetTypes={assetTypes}
        />
      </div>
    </div>
  );
};

export default NewAssetPage;