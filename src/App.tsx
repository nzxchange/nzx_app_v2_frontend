import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { CO2Calculator } from './components/CO2Calculator';
import { CreditManagement } from './components/CreditManagement';
import { Compliance } from './components/Compliance';
import { Assets } from './components/Assets';
import { FileManager } from './components/FileManager';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen bg-layout-bg">
        <aside 
          className={`
            fixed top-0 bottom-0 left-0
            ${sidebarCollapsed ? 'w-20' : 'w-[260px]'}
            transition-all duration-300 ease-in-out z-20
          `}
        >
          <Sidebar 
            isCollapsed={sidebarCollapsed} 
            toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
        </aside>

        <main className={`
          flex-1 flex flex-col min-w-0
          ${sidebarCollapsed ? 'ml-20' : 'ml-[260px]'}
          transition-all duration-300 ease-in-out
        `}>
          <Header 
            toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
          <div className="flex-1 p-8 overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calculator" element={<CO2Calculator />} />
              <Route path="/credits/*" element={<CreditManagement />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/compliance/:framework" element={<Compliance />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/files" element={<FileManager />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;