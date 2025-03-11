import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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
  created_at: string;
  updated_at: string;
};

type Document = {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  status?: string;
  uploaded_at?: string;
  storage_path: string;
};

type AssetUser = {
  id: string;
  email: string;
  role: string;
  name: string | null;
};

export default function AssetDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [asset, setAsset] = useState<Asset | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<AssetUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  const fetchDocuments = async () => {
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
      .eq('asset_id', id);

    if (error) {
      console.error('Error fetching documents:', error);
      return [];
    }

    // Ensure that data is an array and map it correctly
    return data.map(doc => ({
      id: doc.document?.id || '', // Use optional chaining
      filename: doc.document?.filename || '',
      file_type: doc.document?.file_type || '',
      file_size: doc.document?.file_size || 0,
      storage_path: doc.document?.storage_path || '',
    }));
  };

  useEffect(() => {
    if (!id) return;
    
    async function fetchData() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('assets')
          .select(`
            *,
            portfolios:portfolio_id (name)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        
        setAsset(data);
        
        const docs = await fetchDocuments();
        setDocuments(docs);
        
        // Fetch users
        const { data: userData, error: userError } = await supabase
          .from('asset_users')
          .select(`
            *,
            users:user_id (email)
          `)
          .eq('asset_id', id);

        if (!userError && userData) {
          setUsers(userData);
        }

      } catch (error: any) {
        console.error('Error fetching asset details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          Asset not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{asset.name}</h1>
      </div>
      
      {/* Asset Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-1">
            Portfolio
          </label>
          <input
            id="portfolio"
            type="text"
            value={asset.portfolio_name || ''}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            id="address"
            type="text"
            value={asset.address}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="assetType" className="block text-sm font-medium text-gray-700 mb-1">
            Asset Type
          </label>
          <input
            id="assetType"
            type="text"
            value={asset.asset_type}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="totalArea" className="block text-sm font-medium text-gray-700 mb-1">
            Total Area (m²)
          </label>
          <input
            id="totalArea"
            type="number"
            value={asset.total_area}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-1">
            Year Built
          </label>
          <input
            id="yearBuilt"
            type="number"
            value={asset.year_built || ''}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="energyRating" className="block text-sm font-medium text-gray-700 mb-1">
            Energy Rating
          </label>
          <input
            id="energyRating"
            type="text"
            value={asset.energy_rating || ''}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      
      {/* Documents */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-700 mb-3">Documents</h2>
        {documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((document) => (
              <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800">{document.filename}</h3>
                <p className="text-sm text-gray-600 mt-1">{document.file_type}</p>
                {document.storage_path && (
                  <a 
                    href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${document.storage_path}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-primary hover:underline"
                  >
                    View Document
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No documents available for this asset.</p>
        )}
      </div>
      
      {/* Users */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-700 mb-3">Users</h2>
        {users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.map((user) => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800">{user.name || user.email}</h3>
                <p className="text-sm text-gray-600 mt-1">Role: {user.role}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No users assigned to this asset.</p>
        )}
      </div>
    </div>
  );
}






