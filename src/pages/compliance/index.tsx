import React from 'react';
import { useRouter } from 'next/router';
import { FileText } from 'lucide-react';

export default function Compliance() {
  const router = useRouter();

  const frameworks = {
    gri: {
      name: 'Global Reporting Initiative (GRI)',
      description: 'Energy and emissions reporting under GRI Standards',
    },
    leed: {
      name: 'Leadership in Energy and Environmental Design (LEED)',
      description: 'LEED certification documentation',
    },
    tcfd: {
      name: 'Task Force on Climate-related Financial Disclosures (TCFD)',
      description: 'Climate-related financial risk disclosures',
    },
    ifrs: {
      name: 'International Financial Reporting Standards (IFRS)',
      description: 'Sustainability-related financial information',
    },
    sbti: {
      name: 'Science Based Targets initiative (SBTi)',
      description: 'Science-based emissions reduction targets',
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Compliance Frameworks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(frameworks).map(([key, value]) => (
          <div
            key={key}
            onClick={() => router.push(`/compliance/${key}`)}
            className="bg-white rounded-lg shadow-modernize p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <FileText className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{value.description}</p>
            <button className="text-primary text-sm font-medium hover:text-primary-dark">
              View Documents →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}