import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import { Plane, ZoomIn, AlertTriangle, CheckCircle, Cloud, Sun, CloudRain } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Generate random weather
const generateRandomWeather = () => ({
  temp: Math.round(Math.random() * 35), // 0-35°C
  wind: Math.round(Math.random() * 50), // 0-50 km/h
  condition: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
});

// Mock flight data with random weather
const initialFlights = [
  {
    id: 'FL001',
    flightNumber: 'AA123',
    origin: { name: 'JFK', lat: 40.6413, lng: -73.7781, weather: generateRandomWeather() },
    destination: { name: 'LHR', lat: 51.4700, lng: -0.4543, weather: generateRandomWeather() },
    status: 'on-time',
    progress: 0,
    speed: 0.001,
    distance: 5540,
    eta: '2025-06-17 08:30',
    departureTime: '2025-06-17 01:00',
    aircraftType: 'Boeing 787',
    speedKmh: 900,
    altitudeFt: 35000,
    crewStatus: 'Ready',
    gate: 'B32',
    fuelStatus: 'Full',
    alerts: [{ type: 'info', message: 'Flight on schedule', time: '5 minutes ago' }],
  },
  {
    id: 'FL002',
    flightNumber: 'DL456',
    origin: { name: 'LAX', lat: 33.9416, lng: -118.4085, weather: generateRandomWeather() },
    destination: { name: 'NRT', lat: 35.7647, lng: 140.3863, weather: generateRandomWeather() },
    status: 'delayed',
    progress: 0,
    speed: 0.0008,
    distance: 8750,
    eta: '2025-06-17 12:45',
    departureTime: '2025-06-16 23:30',
    aircraftType: 'Airbus A350',
    speedKmh: 850,
    altitudeFt: 38000,
    crewStatus: 'Delayed',
    gate: 'T4-42',
    fuelStatus: 'Sufficient',
    alerts: [{ type: 'warning', message: 'Delayed by 30 min', time: '10 minutes ago' }],
  },
  {
    id: 'FL003',
    flightNumber: 'QF789',
    origin: { name: 'SYD', lat: -33.9461, lng: 151.1772, weather: generateRandomWeather() },
    destination: { name: 'SIN', lat: 1.3644, lng: 103.9915, weather: generateRandomWeather() },
    status: 'issue',
    progress: 0,
    speed: 0.0012,
    distance: 6300,
    eta: '2025-06-17 10:15',
    departureTime: '2025-06-17 02:15',
    aircraftType: 'Boeing 737',
    speedKmh: 800,
    altitudeFt: 32000,
    crewStatus: 'Maintenance',
    gate: 'T1-15',
    fuelStatus: 'Low',
    alerts: [{ type: 'warning', message: 'Maintenance check required', time: '15 minutes ago' }],
  },
];

// Status to color mapping
const statusColors = {
  'on-time': { text: 'text-green-600 dark:text-green-400', line: 'green', bg: 'bg-green-100 dark:bg-green-800' },
  delayed: { text: 'text-red-600 dark:text-red-400', line: 'red', bg: 'bg-red-100 dark:bg-red-800' },
  issue: { text: 'text-yellow-600 dark:text-yellow-400', line: 'yellow', bg: 'bg-yellow-100 dark:bg-yellow-800' },
};

// Aircraft SVGs
const aircraftSvgs = {
  'Boeing 787': (status) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="${
      status === 'on-time' ? '#16a34a' : status === 'delayed' ? '#dc2626' : '#ca8a04'
    }" stroke="${
      status === 'on-time' ? '#14532d' : status === 'delayed' ? '#7f1d1d' : '#713f12'
    }" stroke-width="1">
      <path d="M30 16l-6-3.5-2-8a1 1 0 00-1-1h-5a1 1 0 00-1 1v5l-8 4.5a1 1 0 00-.5 1l2 4a1 1 0 001 .5l8-4.5v5a1 1 0 001 1h5a1 1 0 001-1l2-8 6-3.5a1 1 0 000-1z"/>
      <path d="M14 16h4v1h-4v-1z"/>
      <path d="M10 12l-2-1 2-1"/>
      <path d="M22 20l2 1-2 1"/>
    </svg>
  `,
  'Airbus A350': (status) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="${
      status === 'on-time' ? '#16a34a' : status === 'delayed' ? '#dc2626' : '#ca8a04'
    }" stroke="${
      status === 'on-time' ? '#14532d' : status === 'delayed' ? '#7f1d1d' : '#713f12'
    }" stroke-width="1">
      <path d="M29.5 16l-5.5-3-1.5-7.5a1 1 0 00-1-1h-4a1 1 0 00-1 1v4.5l-7.5 4.5a1 1 0 00-.5 1l2.5 4.5a1 1 0 001 .5l7.5-4.5v4.5a1 1 0 001 1h4a1 1 0 001-1l1.5-7.5 5.5-3a1 1 0 000-1z"/>
      <circle cx="16" cy="16" r="1.5"/>
      <path d="M9 11l-1.5-1 1.5-1"/>
      <path d="M23 21l1.5 1-1.5 1"/>
    </svg>
  `,
  'Boeing 737': (status) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="${
      status === 'on-time' ? '#16a34a' : status === 'delayed' ? '#dc2626' : '#ca8a04'
    }" stroke="${
      status === 'on-time' ? '#14532d' : status === 'delayed' ? '#7f1d1d' : '#713f12'
    }" stroke-width="1">
      <path d="M30 16l-6-3.5-2-8a1 1 0 00-1-1h-5a1 1 0 00-1 1v5l-8 4.5a1 1 0 00-.5 1l2 4a1 1 0 001 .5l8-4.5v5a1 1 0 001 1h5a1 1 0 001-1l2-8 6-3.5a1 1 0 000-1z"/>
      <rect x="13" y="15" width="6" height="2"/>
      <path d="M10 12l-2-1 2-1"/>
      <path d="M22 20l2 1-2 1"/>
    </svg>
  `,
};

// Weather icons
const weatherIcons = {
  Clear: <Sun size={16} className="text-yellow-500" />,
  Clouds: <Cloud size={16} className="text-gray-500" />,
  Rain: <CloudRain size={16} className="text-blue-500" />,
  default: <Cloud size={16} className="text-gray-500" />,
};

// Calculate great-circle points and heading
const getGreatCirclePoints = (start, end, steps = 50) => {
  const points = [];
  const startLat = (start.lat * Math.PI) / 180;
  const startLng = (start.lng * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const endLng = (end.lng * Math.PI) / 180;

  const d = 2 * Math.asin(
    Math.sqrt(
      Math.sin((startLat - endLat) / 2) ** 2 +
        Math.cos(startLat) * Math.cos(endLat) * Math.sin((startLng - endLng) / 2) ** 2
    )
  );

  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(startLat) * Math.cos(startLng) + B * Math.cos(endLat) * Math.cos(endLng);
    const y = A * Math.cos(startLat) * Math.sin(startLng) + B * Math.cos(endLat) * Math.sin(endLng);
    const z = A * Math.sin(startLat) + B * Math.sin(endLat);
    const lat = (Math.atan2(z, Math.sqrt(x ** 2 + y ** 2)) * 180) / Math.PI;
    const lng = (Math.atan2(y, x) * 180) / Math.PI;
    points.push([lat, lng]);
  }

  const deltaLng = ((endLng - startLng) * 180) / Math.PI;
  const heading = (Math.atan2(
    Math.sin(deltaLng * Math.PI / 180) * Math.cos(endLat),
    Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(deltaLng * Math.PI / 180)
  ) * 180) / Math.PI;
  return { points, heading: (heading + 360) % 360 };
};

// Component to handle map resizing
const MapResizeHandler = () => {
  const map = useMap();
  useEffect(() => {
    console.log('MapResizeHandler: Initializing map resize');
    // Invalidate size after mount to ensure correct dimensions
    setTimeout(() => {
      map.invalidateSize();
      console.log('MapResizeHandler: invalidateSize called on mount');
    }, 100);

    // Handle window resize
    const handleResize = () => {
      map.invalidateSize();
      console.log('MapResizeHandler: invalidateSize called on window resize');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [map]);
  return null;
};

// Zoom to flight
const ZoomToFlight = ({ flight }) => {
  const map = useMap();
  if (flight) {
    const bounds = L.latLngBounds(
      [flight.origin.lat, flight.origin.lng],
      [flight.destination.lat, flight.destination.lng]
    );
    map.fitBounds(bounds, { padding: [50, 50] });
    console.log('ZoomToFlight: Zoomed to flight', flight.id);
  }
  return null;
};

// Map controls
const MapControls = ({ onReset, toggleLayers }) => {
  const map = useMap();
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => {
          map.setView([0, 0], 2);
          onReset();
          console.log('MapControls: Reset view');
        }}
        className="p-2 bg-white dark:bg-gray-800 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Reset View"
      >
        <ZoomIn size={16} />
      </button>
      <button
        onClick={() => toggleLayers('paths')}
        className="p-2 bg-white dark:bg-gray-800 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Toggle Flight Paths"
      >
        <span className="text-xs">Paths</span>
      </button>
      <button
        onClick={() => toggleLayers('markers')}
        className="p-2 bg-white dark:bg-gray-800 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Toggle Markers"
      >
        <span className="text-xs">Markers</span>
      </button>
      <button
        onClick={() => toggleLayers('weather')}
        className="p-2 bg-white dark:bg-gray-800 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Toggle Weather"
      >
        <span className="text-xs">Weather</span>
      </button>
    </div>
  );
};

const FlightMapWidget = ({ isDarkMode }) => {
  const [flightData, setFlightData] = useState(initialFlights);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [highlightedRoute, setHighlightedRoute] = useState(null);
  const [showPaths, setShowPaths] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const containerRef = useRef(null);

  // Log container dimensions
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      console.log('FlightMapWidget: Container dimensions', {
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  console.log('FlightMapWidget rendering', { flightData, selectedFlight, showWeather });

  // Update random weather every 10 min
  useEffect(() => {
    const updateWeather = () => {
      setFlightData((prev) =>
        prev.map((flight) => ({
          ...flight,
          origin: { ...flight.origin, weather: generateRandomWeather() },
          destination: { ...flight.destination, weather: generateRandomWeather() },
        }))
      );
      console.log('Weather updated:', flightData);
    };
    const interval = setInterval(updateWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  // Simulate alerts
  useEffect(() => {
    const interval = setInterval(() => {
      setFlightData((prev) =>
        prev.map((flight) => {
          if (Math.random() < 0.2) {
            const newAlert = {
              type: ['info', 'warning', 'error'][Math.floor(Math.random() * 3)],
              message: `Update for ${flight.id}: ${
                [
                  'On track',
                  'Minor delay',
                  `Turbulence reported near ${flight.destination.name}`,
                  `Weather alert: ${flight.destination.weather.condition} at ${flight.destination.name}`,
                ][Math.floor(Math.random() * 4)]
              }`,
              time: 'Just now',
            };
            return { ...flight, alerts: [newAlert, ...flight.alerts.slice(0, 2)] };
          }
          return flight;
        })
      );
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Animate flights
  useEffect(() => {
    const interval = setInterval(() => {
      setFlightData((prev) =>
        prev.map((flight) => {
          const newProgress = flight.progress + flight.speed;
          return {
            ...flight,
            progress: newProgress >= 1 ? 0 : newProgress,
          };
        })
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Filter flights
  const filteredFlights = flightData.filter(
    (flight) => filterStatus === 'all' || flight.status === filterStatus
  );

  // Status counts
  const statusCounts = flightData.reduce(
    (acc, flight) => ({
      ...acc,
      [flight.status]: (acc[flight.status] || 0) + 1,
      all: acc.all + 1,
    }),
    { all: 0, 'on-time': 0, delayed: 0, issue: 0 }
  );

  // Airplane icon
  const getAirplaneIcon = (flight, heading) => {
    const hasAlert = flight.alerts.some((a) => ['warning', 'error'].includes(a.type));
    return L.divIcon({
      html: `
        <div class="relative" style="transform: rotate(${heading}deg)">
          ${aircraftSvgs[flight.aircraftType](flight.status)}
          ${
            hasAlert
              ? `<div class="absolute -top-2 -right-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#dc2626">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </div>`
              : flight.status === 'on-time'
              ? `<div class="absolute -top-2 -right-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#16a34a">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>`
              : ''
          }
        </div>
      `,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  // Toggle layers
  const toggleLayers = (type) => {
    if (type === 'paths') setShowPaths((prev) => !prev);
    if (type === 'markers') setShowMarkers((prev) => !prev);
    if (type === 'weather') setShowWeather((prev) => !prev);
  };

  return (
    <div className="flex h-full w-full" ref={containerRef}>
      <div className="flex-1 h-full relative">
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%', minHeight: '400px' }}
          className={isDarkMode ? 'dark' : ''}
        >
          {console.log('MapContainer initialized')}
          <TileLayer
            url={
              isDarkMode
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            }
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapResizeHandler />
          {showPaths &&
            filteredFlights.map((flight) => {
              const { points } = getGreatCirclePoints(flight.origin, flight.destination);
              const isHighlighted = highlightedRoute === flight.id;
              return (
                <Polyline
                  key={`${flight.id}-path`}
                  positions={points}
                  color={statusColors[flight.status].line}
                  weight={isHighlighted ? 4 : 2}
                  dashArray={flight.status === 'delayed' ? '5, 5' : null}
                  eventHandlers={{
                    mouseover: () => setHighlightedRoute(flight.id),
                    mouseout: () => setHighlightedRoute(null),
                    click: () => setSelectedFlight(flight),
                  }}
                />
              );
            })}
          {showMarkers &&
            filteredFlights.map((flight) => {
              const { points, heading } = getGreatCirclePoints(flight.origin, flight.destination);
              const progressIndex = Math.floor(flight.progress * (points.length - 1));
              const currentPos = points[progressIndex] || [flight.origin.lat, flight.origin.lng];
              return (
                <React.Fragment key={flight.id}>
                  <Marker
                    position={currentPos}
                    icon={getAirplaneIcon(flight, heading)}
                    eventHandlers={{
                      click: () =>
                        { setSelectedFlight(flight),
                          console.log('Clicked:', flight.flightNumber); // <-- Add this
                        }
                    }}
                  >
                    <Popup className="w-64">
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Flight {flight.flightNumber} ({flight.id})
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {flight.origin.name} → {flight.destination.name}
                        </p>
                        <p className={statusColors[flight.status].text}>
                          Status: {flight.status}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Aircraft: {flight.aircraftType}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Speed: {flight.speedKmh} km/h
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Altitude: {flight.altitudeFt} ft
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Distance: {flight.distance} km
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Departure: {flight.departureTime}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          ETA: {flight.eta}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Gate: {flight.gate}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Fuel: {flight.fuelStatus}
                        </p>
                        {showWeather && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Weather:
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                              {weatherIcons[flight.origin.weather.condition] || weatherIcons.default} {flight.origin.name}: {flight.origin.weather.temp}°C, Wind {flight.origin.weather.wind} km/h
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                              {weatherIcons[flight.destination.weather.condition] || weatherIcons.default} {flight.destination.name}: {flight.destination.weather.temp}°C, Wind {flight.destination.weather.wind} km/h
                            </p>
                          </div>
                        )}
                        {flight.alerts.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Alerts:
                            </p>
                            {flight.alerts.map((alert, index) => (
                              <p
                                key={index}
                                className="text-sm text-gray-600 dark:text-gray-300"
                              >
                                {alert.message} ({alert.time})
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                  <Marker position={[flight.origin.lat, flight.origin.lng]}>
                    <Popup>{flight.origin.name}</Popup>
                  </Marker>
                  <Marker position={[flight.destination.lat, flight.destination.lng]}>
                    <Popup>{flight.destination.name}</Popup>
                  </Marker>
                </React.Fragment>
              );
            })}
          <MapControls onReset={() => setSelectedFlight(null)} toggleLayers={toggleLayers} />
          {selectedFlight && <ZoomToFlight flight={selectedFlight} />}
        </MapContainer>
      </div>
      <div className="w-64 p-4 bg-gray-100 dark:bg-gray-800 overflow-auto">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Flight Dashboard
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="mt-1 block w-full p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
          >
            <option value="all">All ({statusCounts.all})</option>
            <option value="on-time">On-Time ({statusCounts['on-time']})</option>
            <option value="delayed">Delayed ({statusCounts.delayed})</option>
            <option value="issue">Issue ({statusCounts.issue})</option>
          </select>
        </div>
        {selectedFlight && (
          <div className="mb-4 p-3 rounded bg-white dark:bg-gray-700 shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plane size={16} className={statusColors[selectedFlight.status].text} />
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedFlight.flightNumber} ({selectedFlight.id})
                </span>
                {selectedFlight.status === 'on-time' && (
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                )}
              </div>
              <button
                onClick={() => setSelectedFlight(selectedFlight)}
                className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                title="Zoom to Flight"
              >
                <ZoomIn size={16} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {selectedFlight.origin.name} → {selectedFlight.destination.name}
            </p>
            <p className={`text-sm ${statusColors[selectedFlight.status].text}`}>
              Status: {selectedFlight.status}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Aircraft: {selectedFlight.aircraftType}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Speed: {selectedFlight.speedKmh} km/h
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Altitude: {selectedFlight.altitudeFt} ft
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Distance: {selectedFlight.distance} km
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Departure: {selectedFlight.departureTime}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              ETA: {selectedFlight.eta}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Crew: {selectedFlight.crewStatus}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Gate: {selectedFlight.gate}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Fuel: {selectedFlight.fuelStatus}
            </p>
            {showWeather && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Weather:
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  {weatherIcons[selectedFlight.origin.weather.condition] || weatherIcons.default} {selectedFlight.origin.name}: {selectedFlight.origin.weather.temp}°C, Wind {selectedFlight.origin.weather.wind} km/h
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  {weatherIcons[selectedFlight.destination.weather.condition] || weatherIcons.default} {selectedFlight.destination.name}: {selectedFlight.destination.weather.temp}°C, Wind {selectedFlight.destination.weather.wind} km/h
                </p>
              </div>
            )}
          </div>
        )}
        <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">
          Active Alerts
        </h4>
        {filteredFlights.map((flight) =>
          flight.alerts.map((alert, index) => (
            <div
              key={`${flight.id}-${index}`}
              className={`mb-2 p-2 rounded shadow ${statusColors[flight.status].bg}`}
            >
              <div className="flex items-center gap-2">
                <Plane size={16} className={statusColors[flight.status].text} />
                <span className="font-medium text-gray-900 dark:text-white">{flight.flightNumber}</span>
                {alert.type === 'warning' || alert.type === 'error' ? (
                  <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />
                ) : (
                  flight.status === 'on-time' && (
                    <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                  )
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{alert.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FlightMapWidget;