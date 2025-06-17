// AlertsList.jsx
import React from 'react';

const AlertsList = ({ alerts, isDarkMode }) => {
  return (
    <div className="overflow-y-auto max-h-full px-4 py-2 space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-3 rounded-md shadow-md ${
            alert.type === 'error'
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
              : alert.type === 'warning'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
              : alert.type === 'info'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
          }`}
        >
          <div className="font-semibold">{alert.message}</div>
          <div className="text-xs mt-1 opacity-75">{alert.time}</div>
        </div>
      ))}
    </div>
  );
};

export default AlertsList;
