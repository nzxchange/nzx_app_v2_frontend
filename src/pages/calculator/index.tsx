import React, { useState } from 'react';
import { Calculator, TrendingDown, AlertCircle, CreditCard } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/router';

export default function CO2Calculator() {
  const router = useRouter();
  const [selectedBill, setSelectedBill] = useState('march_2024');
  const [timeRange, setTimeRange] = useState('3m');
  const [offsetPercentage, setOffsetPercentage] = useState(100);
  
  const bills = {
    march_2024: {
      consumption: 12500,
      emissions: 8.75,
      recommendations: [
        'Switch to renewable energy sources',
        'Implement energy-efficient lighting',
        'Optimize HVAC systems'
      ]
    }
  };

  const emissionsData = {
    '3m': [
      { month: 'Jan 2024', emissions: 9.2 },
      { month: 'Feb 2024', emissions: 8.9 },
      { month: 'Mar 2024', emissions: 8.75 }
    ],
    '6m': [
      { month: 'Oct 2023', emissions: 10.1 },
      { month: 'Nov 2023', emissions: 9.8 },
      { month: 'Dec 2023', emissions: 9.5 },
      { month: 'Jan 2024', emissions: 9.2 },
      { month: 'Feb 2024', emissions: 8.9 },
      { month: 'Mar 2024', emissions: 8.75 }
    ],
    '1y': [
      { month: 'Apr 2023', emissions: 11.2 },
      { month: 'May 2023', emissions: 10.9 },
      { month: 'Jun 2023', emissions: 10.6 },
      { month: 'Jul 2023', emissions: 10.4 },
      { month: 'Aug 2023', emissions: 10.2 },
      { month: 'Sep 2023', emissions: 10.1 },
      { month: 'Oct 2023', emissions: 10.1 },
      { month: 'Nov 2023', emissions: 9.8 },
      { month: 'Dec 2023', emissions: 9.5 },
      { month: 'Jan 2024', emissions: 9.2 },
      { month: 'Feb 2024', emissions: 8.9 },
      { month: 'Mar 2024', emissions: 8.75 }
    ],
    'ytd': [
      { month: 'Jan 2024', emissions: 9.2 },
      { month: 'Feb 2024', emissions: 8.9 },
      { month: 'Mar 2024', emissions: 8.75 }
    ]
  };

  const selectedData = bills[selectedBill as keyof typeof bills];
  const creditsRequired = Math.ceil((selectedData.consumption / 100) * offsetPercentage);

  const handlePurchaseCredits = () => {
    router.push('/credits/purchase');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">CO2 Calculator</h1>
        <p className="text-gray-600">Calculate and analyze your carbon emissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card-bg rounded-lg shadow-modernize p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Emissions Trend</h2>
              <div className="flex space-x-2">
                {['3m', '6m', '1y', 'ytd'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                      timeRange === range
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-[400px]">
              <ResponsiveContainer>
                <LineChart data={emissionsData[timeRange as keyof typeof emissionsData]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="emissions" 
                    stroke="#5e17eb" 
                    name="CO2 Emissions (tCO2)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card-bg rounded-lg shadow-modernize p-6">
            <h3 className="text-lg font-semibold mb-4">Current Period</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Energy Consumption</p>
                <p className="text-2xl font-semibold">{selectedData.consumption} MWh</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">CO2 Emissions</p>
                <p className="text-2xl font-semibold">{selectedData.emissions} tCO2</p>
              </div>
            </div>
          </div>

          <div className="bg-card-bg rounded-lg shadow-modernize p-6">
            <h3 className="text-lg font-semibold mb-4">Credits Required to Offset</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renewable Energy Target
                </label>
                <select
                  value={offsetPercentage}
                  onChange={(e) => setOffsetPercentage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {[10, 25, 50, 75, 100].map((percentage) => (
                    <option key={percentage} value={percentage}>
                      {percentage}% RE Powered
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">Credits Required</p>
                  <p className="text-xl font-semibold text-primary">{creditsRequired}</p>
                </div>
                <p className="text-xs text-gray-500">
                  To achieve {offsetPercentage}% renewable energy target
                </p>
              </div>

              <button
                onClick={handlePurchaseCredits}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center gap-2 justify-center"
              >
                <CreditCard className="w-5 h-5" />
                Purchase Credits
              </button>
            </div>
          </div>

          <div className="bg-card-bg rounded-lg shadow-modernize p-6">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <ul className="space-y-3">
              {selectedData.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <TrendingDown className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm text-gray-600">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}