import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, ArrowLeft } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const frameworks = {
  gri: {
    name: 'Global Reporting Initiative (GRI)',
    description: 'Energy and emissions reporting under GRI Standards',
    documents: [
      {
        title: 'GRI 302: Energy Disclosure Report',
        sections: [
          'Disclosure 302-1: Energy consumption within organization',
          'Disclosure 302-2: Energy consumption outside organization',
          'Disclosure 302-3: Energy intensity ratios'
        ]
      },
      {
        title: 'GRI 305: Emissions Disclosure Report',
        sections: [
          'Disclosure 305-2: Energy indirect (Scope 2) GHG emissions',
          'Disclosure 305-3: Other indirect (Scope 3) GHG emissions',
          'Disclosure 305-4: GHG emissions intensity'
        ]
      }
    ]
  },
  leed: {
    name: 'Leadership in Energy and Environmental Design (LEED)',
    description: 'LEED certification documentation',
    documents: [
      {
        title: 'Certificate of Compliance',
        sections: ['Building Information', 'Compliance Statement', 'Certification Level']
      },
      {
        title: 'EAC Verification Document',
        sections: ['Energy Performance', 'System Verification', 'Compliance Metrics']
      },
      {
        title: 'Energy Consumption Summary',
        sections: ['Annual Energy Usage', 'Energy Sources', 'Efficiency Measures']
      }
    ]
  }
};

export const Compliance = () => {
  const { framework } = useParams();
  const navigate = useNavigate();
  const [selectedFramework, setSelectedFramework] = useState(framework || 'gri');
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});

  const handleFrameworkChange = (fw: string) => {
    setSelectedFramework(fw);
    navigate(`/compliance/${fw}`);
  };

  const handleInputChange = (document: string, section: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [document]: {
        ...(prev[document] || {}),
        [section]: value
      }
    }));
  };

  const handleDownloadPDF = async () => {
    const content = document.getElementById('report-content');
    if (content) {
      const opt = {
        margin: 1,
        filename: `${selectedFramework.toUpperCase()}_Report.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      try {
        await html2pdf().set(opt).from(content).save();
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }
  };

  if (!framework && !frameworks[selectedFramework as keyof typeof frameworks]) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Compliance Frameworks</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(frameworks).map(([key, value]) => (
            <div
              key={key}
              onClick={() => navigate(`/compliance/${key}`)}
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

  const currentFramework = frameworks[selectedFramework as keyof typeof frameworks];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/compliance')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{currentFramework.name}</h1>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="btn-primary"
        >
          <Download className="w-5 h-5" />
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-modernize p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Select Framework</h3>
            <div className="space-y-2">
              {Object.entries(frameworks).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleFrameworkChange(key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    selectedFramework === key
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {value.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div id="report-content" className="bg-white rounded-lg shadow-modernize p-6">
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentFramework.name} Documentation
              </h2>
              <p className="text-gray-600 mb-6">{currentFramework.description}</p>

              {currentFramework.documents.map((doc, docIndex) => (
                <div key={docIndex} className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{doc.title}</h3>
                  {doc.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">{section}</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <textarea
                          className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder={`Enter details for ${section}...`}
                          value={formData[doc.title]?.[section] || ''}
                          onChange={(e) => handleInputChange(doc.title, section, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};