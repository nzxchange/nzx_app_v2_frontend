import React, { useState, useEffect } from 'react';
import { File, Download, Trash2, Upload, Building2, Plus } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { assetApi } from '../lib/api/assets';
import type { Asset, AssetDocument } from '../types/asset';

export const FileManager = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('energy_bill');
  const [files, setFiles] = useState<AssetDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showNewAssetForm, setShowNewAssetForm] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '',
    asset_type: 'office' as const,
    address: '',
    total_area: 0,
    portfolio_id: '', // This should be set based on user's context
    year_built: undefined as number | undefined,
    energy_rating: undefined as string | undefined
  });

  const documentTypes = [
    { value: 'energy_bill', label: 'Energy Bill' },
    { value: 'water_bill', label: 'Water Bill' },
    { value: 'waste_bill', label: 'Waste Management Bill' },
    { value: 'certification', label: 'Building Certification' },
    { value: 'audit_report', label: 'Energy Audit Report' }
  ];

  const assetTypes = [
    { value: 'office', label: 'Office' },
    { value: 'retail', label: 'Retail' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'residential', label: 'Residential' },
    { value: 'mixed_use', label: 'Mixed Use' }
  ];

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const portfolioId = 'default'; // This would come from user context
        const fetchedAssets = await assetApi.getAssets(portfolioId);
        setAssets(fetchedAssets);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
  }, []);

  useEffect(() => {
    if (selectedAsset) {
      const fetchDocuments = async () => {
        try {
          const documents = await assetApi.getDocuments(selectedAsset);
          setFiles(documents);
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
      };

      fetchDocuments();
    }
  }, [selectedAsset]);

  const handleCreateAsset = async () => {
    try {
      const createdAsset = await assetApi.createAsset(newAsset);
      setAssets([...assets, createdAsset]);
      setSelectedAsset(createdAsset.id);
      setShowNewAssetForm(false);
      setNewAsset({
        name: '',
        asset_type: 'office',
        address: '',
        total_area: 0,
        portfolio_id: '',
        year_built: undefined,
        energy_rating: undefined
      });
    } catch (error) {
      console.error('Error creating asset:', error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (!selectedAsset) {
        alert('Please select or create an asset first');
        return;
      }

      setIsUploading(true);
      try {
        for (const file of acceptedFiles) {
          await assetApi.uploadDocument({
            asset_id: selectedAsset,
            document_type: documentType,
            file
          });
        }
        
        // Refresh documents list
        const documents = await assetApi.getDocuments(selectedAsset);
        setFiles(documents);
      } catch (error) {
        console.error('Error uploading files:', error);
        alert('Error uploading files. Please try again.');
      } finally {
        setIsUploading(false);
      }
    },
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">File Manager</h1>
        <p className="text-gray-600">Manage your uploaded energy bills and documents</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Asset
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Select an asset...</option>
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowNewAssetForm(true)}
                  className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                  title="Add New Asset"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {showNewAssetForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Asset</h3>
              <button
                onClick={() => setShowNewAssetForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
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
                >
                  {assetTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={newAsset.address}
                  onChange={(e) => setNewAsset({ ...newAsset, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Area (sq ft)
                </label>
                <input
                  type="number"
                  value={newAsset.total_area}
                  onChange={(e) => setNewAsset({ ...newAsset, total_area: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year Built
                </label>
                <input
                  type="number"
                  value={newAsset.year_built || ''}
                  onChange={(e) => setNewAsset({ ...newAsset, year_built: Number(e.target.value) })}
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
                  onChange={(e) => setNewAsset({ ...newAsset, energy_rating: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCreateAsset}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Create Asset
              </button>
            </div>
          </div>
        )}

        <div className="p-6 border-b border-gray-200">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200'}
              ${!selectedAsset ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <input {...getInputProps()} disabled={!selectedAsset} />
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            {!selectedAsset ? (
              <p className="text-gray-500">Please select or create an asset first</p>
            ) : isDragActive ? (
              <p className="text-primary font-medium">Drop your files here</p>
            ) : (
              <div>
                <p className="text-gray-700 font-medium mb-2">
                  Drag & drop your files here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, PNG, and JPEG files
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Uploaded Documents</h3>
            {selectedAsset && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{assets.find(a => a.id === selectedAsset)?.name}</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <File className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {file.document.filename}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {documentTypes.find(t => t.value === file.document_type)?.label || file.document_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {Math.round(file.document.file_size / 1024)} KB
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {new Date(file.upload_date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};