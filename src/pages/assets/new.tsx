import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';

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
  const [assetTypes, setAssetTypes] = useState<string[]>([]);
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
      const assetTypeResponse = await fetch('/api/assets/types', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!assetTypeResponse.ok) {
        throw new Error('Failed to fetch asset types');
      }
      
      const types = await assetTypeResponse.json();
      setAssetTypes(types || []);
      
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Asset</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio *
            </label>
            <select
              name="portfolio_id"
              value={formData.portfolio_id}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">Select a portfolio</option>
              {portfolios.map((portfolio: any) => (
                <option key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Type</label>
            <select
              name="asset_type"
              value={formData.asset_type}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              required
            >
              <option value="">Select an asset type</option>
              {assetTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Area (m²)</label>
            <input
              type="number"
              name="total_area"
              value={formData.total_area}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
              min="0"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Year Built</label>
            <input
              type="number"
              name="year_built"
              value={formData.year_built || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Energy Rating</label>
            <input
              type="text"
              name="energy_rating"
              value={formData.energy_rating}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAssetPage;