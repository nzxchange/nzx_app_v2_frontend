import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AssetFormData, AssetType } from '@/types/asset';

interface AssetFormProps {
  onSubmit: (data: AssetFormData) => void;
  portfolioId: string;
  assetTypes: AssetType[];
}

export default function AssetForm({ onSubmit, portfolioId, assetTypes }: AssetFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<AssetFormData>();
  
  const handleFormSubmit = (data: AssetFormData) => {
    onSubmit({
      ...data,
      portfolio_id: portfolioId
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          {...register('name', { required: 'Name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          {...register('address', { required: 'Address is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Asset Type</label>
        <select
          {...register('asset_type', { required: 'Asset type is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="">Select a type</option>
          {assetTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {errors.asset_type && <p className="text-red-500 text-sm">{errors.asset_type.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Floor Area (m²)</label>
        <input
          type="number"
          {...register('floor_area', { min: 0 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Occupancy Rate (%)</label>
        <input
          type="number"
          {...register('occupancy_rate', { min: 0, max: 100 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Asset
      </button>
    </form>
  );
} 