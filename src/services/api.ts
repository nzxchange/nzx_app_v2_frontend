import { Asset, AssetCreate, AssetType } from '@/types/asset';
import { supabase } from '@/lib/supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const assetApi = {
  getAssetTypes: async (): Promise<AssetType[]> => {
    try {
      console.log('Fetching from:', `${API_BASE_URL}/assets/types`);
      
      // Get the session
      const session = await supabase.auth.getSession();
      const accessToken = session?.data?.session?.access_token;

      const response = await fetch(`${API_BASE_URL}/assets/types`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Asset types response:', data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching asset types:', error);
      // Return default asset types as fallback
      return [
        { id: "commercial", name: "Commercial" },
        { id: "residential", name: "Residential" },
        { id: "industrial", name: "Industrial" },
        { id: "retail", name: "Retail" },
        { id: "office", name: "Office" },
        { id: "mixed_use", name: "Mixed Use" }
      ];
    }
  },

  createAsset: async (asset: AssetCreate): Promise<Asset> => {
    const response = await fetch(`${API_BASE_URL}/assets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asset),
    });
    if (!response.ok) throw new Error('Failed to create asset');
    return response.json();
  },

  getAssets: async (portfolioId?: string): Promise<Asset[]> => {
    const url = portfolioId ? 
      `${API_BASE_URL}/assets?portfolio_id=${portfolioId}` : 
      `${API_BASE_URL}/assets`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch assets');
    return response.json();
  }
}; 