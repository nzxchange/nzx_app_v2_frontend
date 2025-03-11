import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Calculator, 
  CreditCard, 
  Building2,
  FolderOpen,
  ClipboardCheck,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export const Sidebar = ({ isCollapsed, toggleCollapse }: SidebarProps) => {
  const router = useRouter();
  
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/assets', icon: Building2, label: 'Assets' },
    { path: '/calculator', icon: Calculator, label: 'CO2 Calculator' },
    { path: '/credits', icon: CreditCard, label: 'Credits' },
    { path: '/files', icon: FolderOpen, label: 'Files' },
    { path: '/compliance', icon: ClipboardCheck, label: 'Compliance' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div 
      className={`${
        isCollapsed ? 'w-20' : 'w-[260px]'
      } bg-card-bg h-full border-r border-gray-200 transition-all duration-300 relative flex flex-col`}
    >
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h1 className={`text-xl font-bold text-primary ${isCollapsed ? 'hidden' : 'block'}`}>
          NZX
        </h1>
        <button
          onClick={toggleCollapse}
          className="p-1.5 hover:bg-gray-100 rounded-lg"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = router.pathname === item.path || router.pathname.startsWith(`${item.path}/`);
            
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center ${!isCollapsed ? 'space-x-3' : 'justify-center'} px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <button 
          onClick={handleLogout}
          className={`flex items-center ${!isCollapsed ? 'space-x-3' : 'justify-center'} text-gray-600 hover:text-gray-900 w-full px-4 py-2.5 rounded-lg hover:bg-gray-50`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};