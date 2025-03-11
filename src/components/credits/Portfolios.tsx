import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const portfolios = [
  {
    id: 1,
    name: 'Innovative Energy Solutions',
    description: 'A global mix of energy efficiency projects',
    price: '1,192.19 INR',
    credits: 250,
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    name: 'Global Impact Portfolio',
    description: 'Diverse projects across renewable energy and conservation',
    price: '1,123.64 INR',
    credits: 500,
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800'
  }
];

export const Portfolios = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portfolios.map((portfolio) => (
          <div key={portfolio.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img 
                src={portfolio.image} 
                alt={portfolio.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">{portfolio.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{portfolio.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Price per Credit</p>
                  <p className="font-medium">{portfolio.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available Credits</p>
                  <p className="font-medium">{portfolio.credits}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/credits/purchase')}
                className="btn-primary w-full mt-4"
              >
                Purchase Portfolio
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};