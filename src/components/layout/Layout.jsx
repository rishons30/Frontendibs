import React, { useState } from 'react';
import Navbar from './Navbar';
import { Bell, X } from 'lucide-react';

const Layout = ({ children }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // <-- Track dark mode

  const notifications = [
    { id: 1, message: 'Flight AA123 has been reassigned', time: '5 minutes ago', read: false },
    { id: 2, message: 'Crew member Smith on rest period', time: '30 minutes ago', read: false },
    { id: 3, message: 'Aircraft B737-800 scheduled for maintenance', time: '2 hours ago', read: true },
  ];

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar
          onMenuClick={() => {}}
          onNotificationClick={() => setNotificationsOpen(true)}
          notificationCount={notifications.filter(n => !n.read).length}
          toggleDark={() => setDarkMode(!darkMode)} // pass toggle
        />

        <main className="p-6 text-gray-900 dark:text-gray-100">
          {children}
        </main>

        {/* Notifications Panel */}
        <div className={`fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 shadow-lg transform ${notificationsOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-30`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Notifications</h2>
            <button onClick={() => setNotificationsOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto h-full pb-20">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No new notifications
              </div>
            ) : (
              <ul>
                {notifications.map(notification => (
                  <li key={notification.id} className={`p-4 border-b ${notification.read ? 'bg-white dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900'} border-gray-100 dark:border-gray-700`}>
                    <div className="flex items-start">
                      <div className={`mt-0.5 mr-3 ${notification.read ? 'text-gray-400 dark:text-gray-500' : 'text-blue-500 dark:text-blue-300'}`}>
                        <Bell size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-800 dark:text-gray-100">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Overlay */}
        {notificationsOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setNotificationsOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;
