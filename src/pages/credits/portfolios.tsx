import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Portfolio } from '@/types/credit';

export default function Portfolios() {
  const router = useRouter();
  
  const portfolios: Portfolio[] = [
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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Credit Portfolios</h1>
        <p className="text-gray-600">Explore curated collections of carbon reduction projects</p>
      </div>

      <div className="bg-card-bg rounded-lg shadow-modernize">
        <div className="border-b border-gray-200">
          <div className="flex items-center p-4 space-x-4">
            <Link
              href="/credits/projects"
              className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Projects
            </Link>
            <Link
              href="/credits/portfolios"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white"
            >
              Portfolios
            </Link>
            <Link
              href="/credits/purchase"
              className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Purchase Credits
            </Link>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolios.map((portfolio) => (
              <div key={portfolio.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 overflow-hidden relative">
                  <div className="relative w-full h-full">
                    <img 
                      src={portfolio.image} 
                      alt={portfolio.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
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
                    onClick={() => router.push({
                      pathname: '/credits/purchase',
                      query: { portfolio: portfolio.id }
                    })}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center gap-2 w-full mt-4 justify-center"
                  >
                    Purchase Portfolio
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}