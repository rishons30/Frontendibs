import React from 'react';

const SummaryCard = ({ title, value, color, icon, footer, isDarkMode }) => {
  const colorStyles = {
    blue: isDarkMode ? 'bg-blue-800 text-blue-100' : 'bg-blue-100 text-blue-800',
    green: isDarkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800',
    amber: isDarkMode ? 'bg-amber-800 text-amber-100' : 'bg-amber-100 text-amber-800',
    red: isDarkMode ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800',
  };

  return (
    <div className={`rounded-lg shadow p-4 ${colorStyles[color]} transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-white'} transition-all duration-300`}>
          {icon}
        </div>
      </div>
      <p className="mt-2 text-xs">{footer}</p>
    </div>
  );
};

export default SummaryCard;