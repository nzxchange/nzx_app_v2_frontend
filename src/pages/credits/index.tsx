import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { creditApi } from '@/lib/api/credits';
import { CreditSummary } from '@/types/credit';

export default function Credits() {
  const router = useRouter();
  const [totalCredits, setTotalCredits] = useState<CreditSummary>({
    available: 0,
    used: 0,
    pending: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPath = router.asPath.split('/').pop() || 'projects';

  useEffect(() => {
    const fetchCreditSummary = async () => {
      try {
        setIsLoading(true);
        const summary = await creditApi.getCreditSummary();
        setTotalCredits(summary);
      } catch (err) {
        console.error('Error fetching credit summary:', err);
        setError('Failed to load credit data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreditSummary();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Carbon Credits</h1>
        <p className="text-gray-600">Explore and purchase carbon credits</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Credits Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card-bg rounded-lg shadow-modernize p-6">
          <h3 className="text-sm font-medium text-gray-600">Available Credits</h3>
          <p className="text-2xl font-semibold text-primary mt-2">
            {isLoading ? '...' : totalCredits.available}
          </p>
        </div>
        <div className="bg-card-bg rounded-lg shadow-modernize p-6">
          <h3 className="text-sm font-medium text-gray-600">Used Credits</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-2">
            {isLoading ? '...' : totalCredits.used}
          </p>
        </div>
        <div className="bg-card-bg rounded-lg shadow-modernize p-6">
          <h3 className="text-sm font-medium text-gray-600">Pending Credits</h3>
          <p className="text-2xl font-semibold text-secondary mt-2">
            {isLoading ? '...' : totalCredits.pending}
          </p>
        </div>
      </div>

      <div className="bg-card-bg rounded-lg shadow-modernize">
        <div className="border-b border-gray-200">
          <div className="flex items-center p-4 space-x-4">
            <Link
              href="/credits/projects"
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                router.pathname === '/credits/projects' || router.pathname === '/credits'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Projects
            </Link>
            <Link
              href="/credits/portfolios"
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                router.pathname === '/credits/portfolios'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Portfolios
            </Link>
            <Link
              href="/credits/purchase"
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                router.pathname === '/credits/purchase'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Purchase Credits
            </Link>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-600">Please select an option from the tabs above.</p>
          </div>
        </div>
      </div>
    </div>
  );
}