import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Trash2 } from '@/components/icons';
import { getOrCreateDefaultPortfolio } from '@/lib/utils/portfolioUtils';
import { PlusIcon as HeroPlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useClickOutside } from '@/hooks/useClickOutside';

// Define types for our assets and portfolios
type Portfolio = {
  id: string;
  name: string;
  description: string | null;
  asset_count: number;
};

type Asset = {
  id: string;
  name: string;
  asset_type: string;
  address: string;
  total_area: number;
  year_built: number | null;
  energy_rating: string | null;
  portfolio_id: string;
  portfolio_name?: string;
};

export default function Assets() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePortfolio, setActivePortfolio] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const router = useRouter();
  const { portfolio: portfolioId } = router.query;
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setShowAddMenu(false));

  // Single useEffect for initial data load
  useEffect(() => {
    let isMounted = true;

    async function initializeData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth/login');
          return;
        }

        // Get profile with organization_id
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, organization_id')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Get portfolios for this organization
        const { data: portfoliosList, error: portfoliosError } = await supabase
          .from('portfolios')
          .select('id, name, description')
          .eq('organization_id', profile.organization_id);
          
        if (portfoliosError) throw portfoliosError;
        
        // Fetch asset counts for each portfolio
        const portfoliosWithCounts = await Promise.all(portfoliosList.map(async (portfolio) => {
          const { data: assetsData, error: assetsError } = await supabase
            .from('assets')
            .select('id')
            .eq('portfolio_id', portfolio.id);
            
          if (assetsError) throw assetsError;

          return {
            ...portfolio,
            asset_count: assetsData.length, // Calculate asset count
          };
        }));

        setPortfolios(portfoliosWithCounts || []);

        // Set active portfolio
        const targetPortfolioId = portfolioId || portfoliosWithCounts[0]?.id;
        if (targetPortfolioId) {
          setActivePortfolio(targetPortfolioId);
          await loadAssets(targetPortfolioId);
        }
      } catch (error: any) {
        console.error('Error initializing data:', error);
        if (isMounted) setError(error.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initializeData();
    return () => { isMounted = false; };
  }, [portfolioId]); // Only depend on portfolioId

  // Separate function to load assets
  const loadAssets = async (portfolioId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('assets')
        .select('*, portfolios:portfolio_id (name)')
        .eq('portfolio_id', portfolioId);

      if (error) throw error;

      setAssets(data?.map((asset: any) => ({
        ...asset,
        portfolio_name: asset.portfolios?.name || 'Unknown Portfolio'
      })) || []);
    } catch (error: any) {
      console.error('Error loading assets:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle portfolio switching
  const handlePortfolioSwitch = (newPortfolioId: string | null) => {
    setActivePortfolio(newPortfolioId);
    if (newPortfolioId) {
      router.push(`/assets?portfolio=${newPortfolioId}`, undefined, { 
        shallow: true, 
        scroll: false 
      });
    } else {
      router.push('/assets', undefined, { 
        shallow: true, 
        scroll: false 
      });
    }
  };

  // Add this component for the dropdown menu
  const AddNewDropdown = () => {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-dark transition-colors"
        >
          <HeroPlusIcon className="w-5 h-5" />
          <span>Add New</span>
          <ChevronDownIcon className="w-4 h-4 ml-1" />
        </button>

        {showAddMenu && (
          <div 
            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
            onBlur={() => setShowAddMenu(false)}
          >
            <div className="py-1" role="menu">
              <Link
                href={`/assets/new${activePortfolio ? `?portfolio=${activePortfolio}` : ''}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setShowAddMenu(false)}
              >
                Add Asset
              </Link>
              <Link
                href="/portfolios/new"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setShowAddMenu(false)}
              >
                Add Portfolio
              </Link>
              <Link
                href="/users/invite"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setShowAddMenu(false)}
              >
                Invite User
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assets</h1>
        <AddNewDropdown />
      </div>
      
      {/* Portfolio Filter */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-700 mb-3">Portfolios</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handlePortfolioSwitch(null)}
            className={`px-3 py-1 rounded-full text-sm ${
              activePortfolio === null
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Assets
          </button>
          
          {portfolios.map((portfolio) => (
            <button
              key={portfolio.id}
              onClick={() => handlePortfolioSwitch(portfolio.id)}
              className={`px-3 py-1 rounded-full text-sm flex items-center ${
                activePortfolio === portfolio.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{portfolio.name}</span>
              <span className="ml-1 bg-white bg-opacity-20 text-xs px-1.5 rounded-full">
                {portfolio.asset_count}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Assets Grid */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.length > 0 ? (
            assets.map((asset) => (
              <Link href={`/assets/${asset.id}`} key={asset.id}>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h2 className="text-lg font-semibold text-gray-800">{asset.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{asset.address}</p>
                  <div className="mt-2 flex justify-between">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {asset.asset_type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {asset.portfolio_name}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Area:</span>
                      <span>{asset.total_area} m²</span>
                    </div>
                    {asset.year_built && (
                      <div className="flex justify-between">
                        <span>Built:</span>
                        <span>{asset.year_built}</span>
                      </div>
                    )}
                    {asset.energy_rating && (
                      <div className="flex justify-between">
                        <span>Energy Rating:</span>
                        <span>{asset.energy_rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full bg-gray-50 rounded-lg p-8 text-center">
              <div className="mb-4">
                <BuildingIcon className="w-12 h-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No assets found</h3>
              <p className="text-gray-500 mb-6">
                {activePortfolio 
                  ? "This portfolio doesn't have any assets yet." 
                  : "You haven't added any assets yet."}
              </p>
              <Link
                href={`/assets/new${activePortfolio ? `?portfolio=${activePortfolio}` : ''}`}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors inline-block"
              >
                Add Your First Asset
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Icon components
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
      />
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
      />
    </svg>
  );
}