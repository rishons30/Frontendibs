import React from 'react';
import { X } from 'lucide-react';

const MapModal = ({ flight, onClose }) => {
  if (!flight) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-[400px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1"
        >
          <X size={16} />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Flight {flight.id}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>From:</strong> {flight.from} <br />
          <strong>To:</strong> {flight.to} <br />
          <strong>Status:</strong> {flight.status} <br />
          <strong>Alert:</strong> {flight.alert}
        </p>
      </div>
    </div>
  );
};

export default MapModal;
