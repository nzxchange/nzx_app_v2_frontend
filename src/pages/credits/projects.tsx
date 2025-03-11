import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type Project = {
  id: string;
  name: string;
  description: string;
  location: string;
  project_type: string;
  price_per_credit: number;
  available_credits: number;
  total_emissions_reduction: number;
  status: string;
  image_url: string | null;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'active');
        
        if (error) throw error;
        
        setProjects(data || []);
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center p-4 space-x-4">
        <Link
          href="/credits/projects"
          className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white"
        >
          Browse Projects
        </Link>
        <Link
          href="/credits"
          className="px-4 py-2 text-sm font-medium rounded-lg bg-white text-gray-700 border border-gray-300"
        >
          My Credits
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Carbon Offset Projects</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  {project.image_url ? (
                    <img 
                      src={project.image_url} 
                      alt={project.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      No image available
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {project.project_type}
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">{project.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{project.location}</p>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{project.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Price per credit:</span>
                      <span className="font-medium">${project.price_per_credit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500">Available:</span>
                      <span className="font-medium">{project.available_credits} credits</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500">CO₂ reduction:</span>
                      <span className="font-medium">{project.total_emissions_reduction} tonnes</span>
                    </div>
                  </div>
                  
                  <Link href={`/credits/projects/${project.id}`}>
                    <button className="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No projects available at the moment.
            </div>
          )}
        </div>
      )}
    </div>
  );
}