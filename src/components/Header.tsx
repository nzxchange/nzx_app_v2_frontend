import React, { useState } from 'react';
import { Bell, User, ChevronDown, Menu } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header = ({ toggleSidebar }: HeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, message: 'New credit purchase completed', time: '5m ago' },
    { id: 2, message: 'March energy report ready', time: '1h ago' },
    { id: 3, message: 'CO2 reduction target achieved', time: '2h ago' },
  ];

  return (
    <header className="bg-card-bg border-b border-gray-200 h-16 flex items-center justify-between px-4">
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>

      <div className="flex items-center space-x-4 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-gray-100 rounded-lg relative"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <h3 className="px-4 py-2 text-sm font-semibold border-b">Notifications</h3>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">Jai</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Profile
              </a>
              <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Settings
              </a>
              <hr className="my-1" />
              <a href="#logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};