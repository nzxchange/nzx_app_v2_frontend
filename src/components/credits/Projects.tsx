import React from 'react';
import { ArrowRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const projects = [
  {
    id: 1,
    name: 'Solar Water Heaters',
    location: 'Bangalore, India',
    type: 'Renewable Energy',
    price: '1,254.94 INR',
    emissions: '12,786,235 kg',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1595437193398-f24279553f4f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    name: 'Woodland Creation',
    location: 'Lake District, UK',
    type: 'Afforestation',
    price: '2,957.88 INR',
    emissions: '800,823 kg',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800'
  }
];

export const Projects = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <input
            type="text"
            placeholder="Search projects..."
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.location}</p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium">{project.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price per Credit</p>
                      <p className="font-medium">{project.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Emissions Reduction</p>
                      <p className="font-medium">{project.emissions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium">{project.status}</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/credits/purchase')}
                  className="btn-primary"
                >
                  Purchase Credits
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};