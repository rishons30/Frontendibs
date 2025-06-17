import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, User, ChevronDown, Moon, Sun, Plane } from 'lucide-react';
import { ThemeContext } from '../.././ThemeContext'; // Adjust path as needed

const Navbar = ({ onMenuClick, onNotificationClick, notificationCount = 0 }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 fixed w-full z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            >
              <Menu size={24} />
            </button>

            <Link to="/" className="flex items-center ml-2">
              <span className="text-blue-600 mr-2">
                <Plane size={28} className="transform -rotate-45" />
              </span>
              <span className="font-semibold text-xl text-gray-900 dark:text-white">AirOps</span>
            </Link>

            <div className="hidden lg:ml-10 lg:flex lg:items-center lg:space-x-4">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600">
                Dashboard
              </Link>
              <Link to="/schedule" className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-blue-600">
                Schedule
              </Link>
              <Link to="/aircraft" className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-blue-600">
                Aircraft
              </Link>
              <Link to="/crew" className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-blue-600">
                Crew
              </Link>
              <Link to="/optimization" className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-blue-600">
                Optimization
              </Link>
              <Link to="/reports" className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-blue-600">
                Reports
              </Link>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none transition duration-300"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification Button */}
            <button
              onClick={onNotificationClick}
              className="p-2 text-gray-400 hover:text-gray-500 relative"
              title="Notifications"
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 inline-block w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* User dropdown */}
            <div className="relative flex items-center">
              <button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pl-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300">
                  <User size={18} />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                  Admin User
                </span>
                <ChevronDown size={16} className="ml-1 text-gray-400 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
