import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

// Define types for your data structures
type Organization = {
  id: string;
  portfolios: Portfolio[];
};

type Portfolio = {
  id: string;
  name: string;
  description: string;
  organization_id: string;
};

const NewAssetPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    portfolio_id: '',
    asset_type: '',
    address: '',
    total_area: '',
    year_built: '',
    energy_rating: ''
  });

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [assetTypes, setAssetTypes] = useState(['commercial', 'residential', 'industrial']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { portfolio: defaultPortfolioId } = router.query;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session found');
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          organizations:organization_id (
            id,
            portfolios (
              id,
              name,
              description,
              organization_id
            )
          )
        `)
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;

      const organizations: Organization[] = profile?.organizations || [];
      const portfoliosList = organizations.flatMap(org => org.portfolios || []);
      setPortfolios(portfoliosList);

      const assetTypeResponse = await fetch('/api/assets/types', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      const assetTypesData = await assetTypeResponse.json();
      setAssetTypes(assetTypesData);

      setLoading(false);
    } catch (error) {
      const err = error as Error;
      console.error('Error in fetchData:', err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {/* Render form and other UI elements */}
    </div>
  );
};

export default NewAssetPage;