// File: src/components/dashboard/MapModal.jsx
import React from 'react';
import { X } from 'lucide-react';
import FlightMap from './Flightmap';

const MapModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50">
    <div className="relative w-[95vw] h-[95vh] bg-gradient-to-br from-gray-900/80 via-black/70 to-gray-900/80 rounded-xl border border-white/10 shadow-2xl overflow-hidden">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition"
      >
        <X size={20} />
      </button>
      <FlightMap />
    </div>
  </div>
);

export default MapModal;
