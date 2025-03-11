import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/lib/supabase';

interface DocumentUploadProps {
  assetId: string;
  onUploadComplete?: () => void;
}

export default function DocumentUpload({ assetId, onUploadComplete }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState('general');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    onDrop: handleFileDrop
  });

  async function handleFileDrop(acceptedFiles: File[]) {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setUploading(true);
    setError(null);
    
    try {
      // 1. Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `documents/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // 2. Create document record directly with asset_id
      const { data: document, error: documentError } = await supabase
        .from('documents')
        .insert({
          filename: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: filePath,
          asset_id: assetId  // Direct association with asset
        })
        .select()
        .single();
      
      if (documentError) throw documentError;
      
      if (onUploadComplete) onUploadComplete();
      
    } catch (error: any) {
      console.error('Error uploading document:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mt-4">
      <div className="mb-3">
        <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
          Document Type
        </label>
        <select
          id="documentType"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
        >
          <option value="general">General</option>
          <option value="lease">Lease Agreement</option>
          <option value="energy">Energy Certificate</option>
          <option value="floor_plan">Floor Plan</option>
          <option value="photo">Photo</option>
        </select>
      </div>
      
      <div 
        {...getRootProps()} 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-gray-500">Uploading...</p>
        ) : (
          <>
            <p className="text-gray-500">Drag & drop a file here, or click to select a file</p>
            <p className="text-xs text-gray-400 mt-1">Supported formats: PDF, DOC, DOCX, JPG, PNG</p>
          </>
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
} 