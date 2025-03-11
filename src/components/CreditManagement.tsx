import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Projects } from './credits/Projects';
import { Portfolios } from './credits/Portfolios';
import { PurchaseCredits } from './credits/PurchaseCredits';

export const CreditManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'projects';

  const totalCredits = {
    available: 500,
    used: 250,
    pending: 50
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Carbon Credits</h1>
        <p className="text-gray-600">Explore and purchase carbon credits</p>
      </div>

      {/* Credits Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card-bg rounded-lg shadow-modernize p-6">
          <h3 className="text-sm font-medium text-gray-600">Available Credits</h3>
          <p className="text-2xl font-semibold text-primary mt-2">{totalCredits.available}</p>
        </div>
        <div className="bg-card-bg rounded-lg shadow-modernize p-6">
          <h3 className="text-sm font-medium text-gray-600">Used Credits</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{totalCredits.used}</p>
        </div>
        <div className="bg-card-bg rounded-lg shadow-modernize p-6">
          <h3 className="text-sm font-medium text-gray-600">Pending Credits</h3>
          <p className="text-2xl font-semibold text-secondary mt-2">{totalCredits.pending}</p>
        </div>
      </div>

      <div className="bg-card-bg rounded-lg shadow-modernize">
        <div className="border-b border-gray-200">
          <div className="flex items-center p-4 space-x-4">
            <button
              onClick={() => navigate('/credits/projects')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                currentPath === 'projects'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => navigate('/credits/portfolios')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                currentPath === 'portfolios'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Portfolios
            </button>
            <button
              onClick={() => navigate('/credits/purchase')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                currentPath === 'purchase'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Purchase Credits
            </button>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Projects />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/portfolios" element={<Portfolios />} />
          <Route path="/purchase" element={<PurchaseCredits />} />
        </Routes>
      </div>
    </div>
  );
};