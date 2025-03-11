import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CreditCard, ShoppingCart } from 'lucide-react';
import { creditApi } from '@/lib/api/credits';
import { Project } from '@/types/credit';

export default function PurchaseCredits() {
  const router = useRouter();
  const { project: projectId, portfolio: portfolioId } = router.query;
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    selectedOption: '',
    quantity: 1,
    totalAmount: 0
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await creditApi.getProjects();
        setProjects(data);
        
        // If a project or portfolio was specified in the URL, select it
        if (projectId && typeof projectId === 'string') {
          const project = data.find(p => p.id === projectId);
          if (project) {
            handleOptionChange(project.id);
          }
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        
        // Set demo data if API fails
        const demoProjects = [
          {
            id: '1',
            name: 'Solar Water Heaters',
            project_type: 'Renewable Energy',
            price_per_credit: 1254.94,
            available_credits: 500,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Woodland Creation',
            project_type: 'Afforestation',
            price_per_credit: 2957.88,
            available_credits: 300,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        
        setProjects(demoProjects as Project[]);
        
        if (projectId && typeof projectId === 'string') {
          const project = demoProjects.find(p => p.id === projectId);
          if (project) {
            handleOptionChange(project.id);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [projectId, portfolioId]);

  const handleOptionChange = (optionId: string) => {
    const option = projects.find(opt => opt.id === optionId);
    setFormData({
      ...formData,
      selectedOption: optionId,
      totalAmount: option ? option.price_per_credit * formData.quantity : 0
    });
  };

  const handleQuantityChange = (quantity: number) => {
    const option = projects.find(opt => opt.id === formData.selectedOption);
    setFormData({
      ...formData,
      quantity,
      totalAmount: option ? option.price_per_credit * quantity : 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.selectedOption) {
      setError('Please select a project or portfolio');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const project = projects.find(p => p.id === formData.selectedOption);
      if (!project) {
        throw new Error('Selected project not found');
      }
      
      await creditApi.purchaseCredits({
        project_id: formData.selectedOption,
        quantity: formData.quantity,
        price_per_credit: project.price_per_credit
      });
      
      setSuccess(`Successfully purchased ${formData.quantity} credits for ${project.name}`);
      
      // Reset form
      setFormData({
        selectedOption: '',
        quantity: 1,
        totalAmount: 0
      });
      
      // Redirect to credits page after a delay
      setTimeout(() => {
        router.push('/credits');
      }, 3000);
    } catch (err) {
      console.error('Error purchasing credits:', err);
      setError('Failed to purchase credits. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Carbon Credits</h1>
        <p className="text-gray-600">Offset your carbon emissions by purchasing credits</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

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
              className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Portfolios
            </Link>
            <Link
              href="/credits/purchase"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white"
            >
              Purchase Credits
            </Link>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Credit Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum Purchase:</span>
                  <span className="font-semibold">1 Credit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Validity:</span>
                  <span className="font-semibold">12 Months</span>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">
                    Each credit represents 1 tonne of CO2 equivalent emissions reduction
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Project/Portfolio
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  value={formData.selectedOption}
                  onChange={(e) => handleOptionChange(e.target.value)}
                  required
                  disabled={isLoading}
                >
                  <option value="">Choose an option</option>
                  <optgroup label="Projects">
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name} - ₹{project.price_per_credit.toFixed(2)}/credit
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Credits
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  value={formData.quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  disabled={isLoading}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-xl font-bold text-primary">
                    ₹{formData.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center gap-2 justify-center"
                disabled={isLoading || !formData.selectedOption}
              >
                {isLoading ? (
                  'Processing...'
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}