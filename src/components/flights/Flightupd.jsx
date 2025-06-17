import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, Moon, Sun, X } from 'lucide-react';

const airports = [
  { code: 'JFK', name: 'John F. Kennedy International' },
  { code: 'LAX', name: 'Los Angeles International' },
  { code: 'ORD', name: 'Chicago O\'Hare International' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta' },
  { code: 'DFW', name: 'Dallas/Fort Worth International' }
];

const aircraftTypes = [
  { id: 'B737', name: 'Boeing 737' },
  { id: 'A320', name: 'Airbus A320' },
  { id: 'B787', name: 'Boeing 787' }
];

const flightData = [
  { id: 1, flight: 'BA1001', registration: 'N123AA', origin: 'JFK', destination: 'LAX', eventTime: new Date(2025, 0, 1, 8, 0), crew: 'Crew 1', status: 'On Time', event: 'Takeoff' },
  { id: 2, flight: 'BA1002', registration: 'N124AA', origin: 'LAX', destination: 'ORD', eventTime: new Date(2025, 0, 1, 9, 30), crew: 'Crew 2', status: 'Boarding', event: 'Landing' },
  { id: 3, flight: 'BA1003', registration: 'N125AA', origin: 'ORD', destination: 'ATL', eventTime: new Date(2025, 0, 1, 11, 0), crew: 'Unassigned', status: 'Delayed', event: 'Takeoff' },
  { id: 4, flight: 'BA1004', registration: 'N126AA', origin: 'ATL', destination: 'DFW', eventTime: new Date(2025, 0, 1, 12, 15), crew: 'Crew 3', status: 'On Time', event: 'Takeoff' },
  { id: 5, flight: 'BA1005', registration: 'N127AA', origin: 'DFW', destination: 'JFK', eventTime: new Date(2025, 0, 1, 14, 45), crew: 'Crew 4', status: 'Boarding', event: 'Landing' },
  { id: 6, flight: 'BA1006', registration: 'N128AA', origin: 'JFK', destination: 'ORD', eventTime: new Date(2025, 0, 1, 16, 20), crew: 'Crew 5', status: 'On Time', event: 'Takeoff' },
  { id: 7, flight: 'BA1007', registration: 'N129AA', origin: 'LAX', destination: 'ATL', eventTime: new Date(2025, 0, 1, 17, 50), crew: 'Unassigned', status: 'Delayed', event: 'Landing' },
  { id: 8, flight: 'AI1008', registration: 'N130AA', origin: 'ORD', destination: 'DFW', eventTime: new Date(2025, 0, 1, 19, 10), crew: 'Crew 6', status: 'On Time', event: 'Landing' },
  { id: 9, flight: 'AI1009', registration: 'N131AA', origin: 'ATL', destination: 'JFK', eventTime: new Date(2025, 0, 1, 20, 30), crew: 'Crew 7', status: 'Boarding', event: 'Takeoff' },
  { id: 10, flight: 'QA1010', registration: 'N132AA', origin: 'DFW', destination: 'LAX', eventTime: new Date(2025, 0, 1, 22, 0), crew: 'Crew 8', status: 'On Time', event: 'Landing' }
];

function FlightSchedule() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedAircraftTypes, setSelectedAircraftTypes] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState(flightData);
  const [selectedFlight, setSelectedFlight] = useState(null);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle filtering
  useEffect(() => {
    let filtered = flightData.filter(flight =>
      (flight.flight.toLowerCase().includes(searchQuery.toLowerCase()) ||
       flight.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
       flight.destination.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedOrigins.length === 0 || selectedOrigins.includes(flight.origin)) &&
      (selectedDestinations.length === 0 || selectedDestinations.includes(flight.destination)) &&
      (selectedAircraftTypes.length === 0 || selectedAircraftTypes.includes(flight.registration.slice(0, 4)))
    );
    setFilteredFlights(filtered);
  }, [searchQuery, selectedOrigins, selectedDestinations, selectedAircraftTypes]);

  const handleOriginChange = (code) => {
    setSelectedOrigins(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleDestinationChange = (code) => {
    setSelectedDestinations(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleAircraftTypeChange = (id) => {
    setSelectedAircraftTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedOrigins([]);
    setSelectedDestinations([]);
    setSelectedAircraftTypes([]);
  };

  const handleFlightClick = (e, flight) => {
    e.preventDefault();
    setSelectedFlight(flight);
  };

  const closeModal = () => {
    setSelectedFlight(null);
  };

  return (
    <div className={`rounded-lg shadow ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} transition-all duration-300`}>
      <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          {/* Search and Filters */}
          <div className="flex items-center min-w-0 w-full sm:w-auto">
            <div className="relative rounded-md w-full sm:w-64">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={16} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-all duration-300`} />
              </div>
              <input
                type="text"
                className={`block w-full rounded-md border-0 py-1.5 pl-10 ring-1 ring-inset sm:text-sm sm:leading-6 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white ring-gray-600 placeholder:text-gray-400 focus:ring-blue-500' 
                    : 'bg-white text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600'
                } transition-all duration-300`}
                placeholder="Search flights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="ml-3 relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md shadow-sm ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300`}
              >
                <Filter size={16} className="mr-1.5" />
                Filters
                <ChevronDown size={14} className="ml-1.5" />
              </button>
              
              {filterOpen && (
                <div className={`origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10 ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                } transition-all duration-300`}>
                  <div className="py-1 p-3" role="menu" aria-orientation="vertical">
                    <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    } transition-all duration-300`}>Origin Airport</h4>
                    <div className="space-y-2 mb-4">
                      {airports.map(airport => (
                        <label key={airport.code} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedOrigins.includes(airport.code)}
                            onChange={() => handleOriginChange(airport.code)}
                            className={`rounded focus:ring-blue-500 ${
                              isDarkMode ? 'text-blue-400 bg-gray-700' : 'text-blue-600'
                            } transition-all duration-300`}
                          />
                          <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-all duration-300`}>
                            {airport.code} - {airport.name}
                          </span>
                        </label>
                      ))}
                    </div>
                    
                    <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    } transition-all duration-300`}>Destination Airport</h4>
                    <div className="space-y-2 mb-4">
                      {airports.map(airport => (
                        <label key={airport.code} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedDestinations.includes(airport.code)}
                            onChange={() => handleDestinationChange(airport.code)}
                            className={`rounded focus:ring-blue-500 ${
                              isDarkMode ? 'text-blue-400 bg-gray-700' : 'text-blue-600'
                            } transition-all duration-300`}
                          />
                          <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-all duration-300`}>
                            {airport.code} - {airport.name}
                          </span>
                        </label>
                      ))}
                    </div>
                    
                    <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    } transition-all duration-300`}>Aircraft Type</h4>
                    <div className="space-y-2">
                      {aircraftTypes.map(type => (
                        <label key={type.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedAircraftTypes.includes(type.id)}
                            onChange={() => handleAircraftTypeChange(type.id)}
                            className={`rounded focus:ring-blue-500 ${
                              isDarkMode ? 'text-blue-400 bg-gray-700' : 'text-blue-600'
                            } transition-all duration-300`}
                          />
                          <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-all duration-300`}>
                            {type.name}
                          </span>
                        </label>
                      ))}
                    </div>
                    
                    <div className={`pt-4 flex justify-between border-t mt-4 ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-100'
                    } transition-all duration-300`}>
                      <button
                        onClick={clearFilters}
                        className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} transition-all duration-300`}
                      >
                        Clear All
                      </button>
                      <button
                        onClick={() => setFilterOpen(false)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-all duration-300"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Date range control and dark mode toggle */}
          <div className="flex items-center space-x-4 w-full sm:w-auto">
         
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className={`block rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset sm:text-sm sm:leading-6 ${
                isDarkMode 
                  ? 'bg-gray-700 text-white ring-gray-600 focus:ring-blue-500' 
                  : 'bg-white text-gray-900 ring-gray-300 focus:ring-blue-600'
              } transition-all duration-300`}
            >
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="week">This Week</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-all duration-300`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} transition-all duration-300`}>Flight</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} transition-all duration-300`}>Aircraft Registration</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} transition-all duration-300`}>Event Time</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} transition-all duration-300`}>Crew</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} transition-all duration-300`}>Status</th>
              </tr>
            </thead>
            <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} transition-all duration-300`}>
              {filteredFlights.map((flight) => (
                <tr key={flight.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-all duration-300`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center">
                    <i
                      className={`fas ${flight.event === 'Landing' ? 'fa-plane-arrival' : 'fa-plane-departure'} mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} transition-all duration-300`}
                      aria-hidden="true"
                    ></i>
                    <a
                      href="#"
                      onClick={(e) => handleFlightClick(e, flight)}
                      className="text-blue-600 underline hover:text-blue-800 transition-all duration-300"
                    >
                      {flight.flight} {flight.origin} → {flight.destination}
                    </a>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} transition-all duration-300`}>
                    {flight.registration}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} transition-all duration-300`}>
                    {flight.eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} transition-all duration-300`}>
                    {flight.crew === 'Unassigned' ? (
                      <span className="text-red-500">{flight.crew}</span>
                    ) : (
                      flight.crew
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition-all duration-300 ${
                      flight.status === 'Delayed' ? 
                        isDarkMode ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800' :
                      flight.status === 'Boarding' ? 
                        isDarkMode ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-800' :
                        isDarkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'
                    }`}>
                      {flight.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flight Modal */}
      {selectedFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} transition-all duration-300`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Flight Details</h3>
              <button onClick={closeModal} className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-all duration-300`}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <p><strong>Flight Number:</strong> {selectedFlight.flight}</p>
              <p><strong>Route:</strong> {selectedFlight.origin} → {selectedFlight.destination}</p>
              <p><strong>Event:</strong> {selectedFlight.event}</p>
              <p><strong>Time:</strong> {selectedFlight.eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p><strong>Aircraft Registration:</strong> {selectedFlight.registration}</p>
              <p><strong>Crew:</strong> {selectedFlight.crew}</p>
              <p><strong>Status:</strong> {selectedFlight.status}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlightSchedule;