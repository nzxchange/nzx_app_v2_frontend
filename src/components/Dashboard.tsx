import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, BarChart2, TrendingUp, AlertCircle, ClipboardCheck, Calculator, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    onDrop: (acceptedFiles) => {
      console.log('Files uploaded:', acceptedFiles);
    }
  });

  const stats = [
    { label: 'Total Energy (kWh)', value: '245,678', icon: BarChart2, trend: '+12%' },
    { label: 'CO2 Emissions (tCO2)', value: '125.4', icon: TrendingUp, trend: '-8%' },
    { label: 'Carbon Credits', value: '50', icon: AlertCircle, trend: '10 needed' },
  ];

  const quickLinks = [
    { name: 'GRI Report', framework: 'gri' },
    { name: 'TCFD Report', framework: 'tcfd' },
    { name: 'IFRS Report', framework: 'ifrs' },
    { name: 'LEED Report', framework: 'leed' },
    { name: 'SBTi Report', framework: 'sbti' }
  ];

  const handleReportClick = (framework: string) => {
    navigate(`/compliance/${framework}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-1">Monitor and manage your energy consumption</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card-bg p-6 rounded-lg shadow-modernize">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold mt-2 text-gray-900">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 flex items-center">
              <span className={stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                {stat.trend}
              </span>
              <span className="ml-2">vs last month</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card-bg rounded-lg shadow-modernize p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/calculator')}
              className="p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <Calculator className="w-6 h-6 text-primary mb-2" />
              <span className="text-sm font-medium text-gray-800">Calculate Emissions</span>
            </button>
            <button
              onClick={() => navigate('/credits/purchase')}
              className="p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <CreditCard className="w-6 h-6 text-primary mb-2" />
              <span className="text-sm font-medium text-gray-800">Purchase Credits</span>
            </button>
          </div>
        </div>

        <div className="bg-card-bg rounded-lg shadow-modernize p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Reports</h2>
          <div className="space-y-3">
            {quickLinks.map((link) => (
              <button
                key={link.framework}
                onClick={() => handleReportClick(link.framework)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-gray-800">{link.name}</span>
                </div>
                <span className="text-xs text-gray-500">Generate Report</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card-bg rounded-lg shadow-modernize">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Energy Bills</h2>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            {isDragActive ? (
              <p className="text-primary font-medium">Drop your files here</p>
            ) : (
              <div>
                <p className="text-gray-700 font-medium mb-2">
                  Drag & drop your energy bills here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, PNG, and JPEG files
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Uploads</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">March_2024_Bill.pdf</p>
                  <p className="text-xs text-gray-500">Uploaded 2 days ago</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Processed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};