import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { supabase } from '@/lib/supabase';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    // Check auth status
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        if (!data.session && !router.pathname.startsWith('/auth/')) {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (!router.pathname.startsWith('/auth/')) {
          router.push('/auth/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize();
      checkAuth();
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [router]);

  // Don't show layout on auth pages
  if (router.pathname.startsWith('/auth/')) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Loading...</h1>
          <p className="mt-2 text-gray-600">Please wait while we set up your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-layout-bg">
      <aside 
        className={`
          fixed top-0 bottom-0 left-0 z-20
          ${sidebarCollapsed ? 'w-20' : 'w-[260px]'}
          transition-all duration-300 ease-in-out
          ${isMobile ? 'transform -translate-x-full' : ''}
          ${isMobile && !sidebarCollapsed ? 'transform translate-x-0' : ''}
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
        ${isMobile ? 'ml-0' : ''}
        transition-all duration-300 ease-in-out
      `}>
        <Header 
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}