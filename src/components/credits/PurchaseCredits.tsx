import React, { useState } from 'react';
import { CreditCard, ShoppingCart } from 'lucide-react';

const purchaseOptions = [
  { id: 'project-1', type: 'project', name: 'Solar Water Heaters', price: 1254.94 },
  { id: 'project-2', type: 'project', name: 'Woodland Creation', price: 2957.88 },
  { id: 'portfolio-1', type: 'portfolio', name: 'Innovative Energy Solutions', price: 1192.19 },
  { id: 'portfolio-2', type: 'portfolio', name: 'Global Impact Portfolio', price: 1123.64 }
];

export const PurchaseCredits = () => {
  const [formData, setFormData] = useState({
    selectedOption: '',
    quantity: 1,
    totalAmount: 0
  });

  const handleOptionChange = (optionId: string) => {
    const option = purchaseOptions.find(opt => opt.id === optionId);
    setFormData({
      ...formData,
      selectedOption: optionId,
      totalAmount: option ? option.price * formData.quantity : 0
    });
  };

  const handleQuantityChange = (quantity: number) => {
    const option = purchaseOptions.find(opt => opt.id === formData.selectedOption);
    setFormData({
      ...formData,
      quantity,
      totalAmount: option ? option.price * quantity : 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle purchase logic
    console.log('Purchase submitted:', formData);
  };

  return (
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
              className="input-field"
              value={formData.selectedOption}
              onChange={(e) => handleOptionChange(e.target.value)}
              required
            >
              <option value="">Choose an option</option>
              <optgroup label="Projects">
                {purchaseOptions.filter(opt => opt.type === 'project').map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name} - ₹{opt.price}/credit
                  </option>
                ))}
              </optgroup>
              <optgroup label="Portfolios">
                {purchaseOptions.filter(opt => opt.type === 'portfolio').map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name} - ₹{opt.price}/credit
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
              className="input-field"
              value={formData.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
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
            className="btn-primary w-full"
          >
            <ShoppingCart className="w-5 h-5" />
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};