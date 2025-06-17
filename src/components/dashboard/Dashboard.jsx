// File: src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { ThemeContext } from '../../ThemeContext';
import SummaryCard from './SummaryCard';
import AlertsList from './AlertsList';
import FlightStatusChart from './FlightStatusChart';
import AircraftStatusChart from './AircraftStatusChart';
import FlightSchedule from '../flights/Flightupd';
import MapView from './Flightmap';
import { Plane, Users, AlertTriangle, Plus, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Widget from './Widget';

const Dashboard = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const containerRef = useRef(null);

  const [widgets, setWidgets] = useState(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    try {
      return savedWidgets ? JSON.parse(savedWidgets) : [];
    } catch (e) {
      console.error('Error parsing dashboardWidgets:', e);
      return [];
    }
  });

  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
  }, [widgets]);

  const GAP = 24;
  const sizeConfigs = {
    small: { width: 300, height: 200, className: '300px' },
    medium: { width: 600, height: 400, className: '600px' },
    large: { width: 1200, height: 600, className: '1200px' },
  };

  const getContainerDimensions = () => {
    let maxX = 0;
    let maxY = 0;
    widgets.forEach((widget) => {
      const x = widget.x || 0;
      const y = widget.y || 0;
      const widgetWidth = sizeConfigs[widget.size || 'medium'].width;
      const widgetHeight = widget.height || sizeConfigs[widget.size || 'medium'].height;
      maxX = Math.max(maxX, x + widgetWidth);
      maxY = Math.max(maxY, y + widgetHeight);
    });
    return { minWidth: maxX + GAP, minHeight: maxY + GAP };
  };

  const { minWidth, minHeight } = getContainerDimensions();

  const calculateNextPosition = () => {
    if (widgets.length === 0) return { x: 0, y: 0 };
    let currentX = 0;
    let currentY = 0;
    let maxY = 0;
    let widgetsInRow = 0;

    widgets.forEach((widget) => {
      const x = widget.x || 0;
      const y = widget.y || 0;
      const widgetHeight = widget.height || sizeConfigs[widget.size || 'medium'].height;
      maxY = Math.max(maxY, y + widgetHeight);

      if (y === currentY) {
        widgetsInRow++;
        currentX = x + (sizeConfigs[widget.size || 'medium'].width + GAP);
      } else if (y > currentY) {
        currentY = y;
        currentX = x + (sizeConfigs[widget.size || 'medium'].width + GAP);
        widgetsInRow = 1;
      }
    });

    if (widgetsInRow >= 3) {
      currentX = 0;
      currentY = maxY + GAP;
    }

    return { x: currentX, y: currentY };
  };

  const handleResize = (id, newHeight) => {
    setWidgets((prev) => {
      const updatedWidgets = prev.map((widget) =>
        widget.id === id ? { ...widget, height: newHeight } : widget
      );

      const rows = [];
      updatedWidgets.forEach((widget) => {
        const y = widget.y || 0;
        if (!rows.find((row) => row.y === y)) {
          rows.push({ y, widgets: [] });
        }
        rows.find((row) => row.y === y).widgets.push(widget);
      });

      rows.sort((a, b) => a.y - b.y);
      rows.forEach((row) => {
        row.maxHeight = Math.max(
          ...row.widgets.map((w) => w.height || sizeConfigs[w.size || 'medium'].height)
        );
      });

      let currentY = 0;
      rows.forEach((row) => {
        row.newY = currentY;
        currentY += row.maxHeight + GAP;
      });

      return updatedWidgets.map((widget) => {
        const row = rows.find((r) => r.y === (widget.y || 0));
        return { ...widget, y: row.newY };
      });
    });
  };

  const addWidget = (type) => {
    const { x, y } = calculateNextPosition();
    const newWidget = {
      id: uuidv4(),
      type,
      size: 'medium',
      x,
      y,
      height: sizeConfigs.medium.height,
    };
    setWidgets((prev) => [...prev, newWidget]);
    setIsAddWidgetOpen(false);
  };

  const removeWidget = (id) => {
    setWidgets((prev) => {
      const updated = prev.filter((widget) => widget.id !== id);
      const sorted = updated.sort((a, b) => a.y - b.y || a.x - b.x);

      let currentX = 0;
      let currentY = 0;
      let widgetsInRow = 0;
      let maxY = 0;

      return sorted.map((widget) => {
        if (widgetsInRow >= 3) {
          currentX = 0;
          currentY = maxY + GAP;
          widgetsInRow = 0;
        }
        const widgetHeight = widget.height || sizeConfigs[widget.size || 'medium'].height;
        const newWidget = {
          ...widget,
          x: currentX,
          y: currentY,
        };
        currentX += sizeConfigs[widget.size || 'medium'].width + GAP;
        widgetsInRow++;
        maxY = Math.max(maxY, currentY + widgetHeight);
        return newWidget;
      });
    });
  };

  const summaryData = {
    totalFlights: 128,
    assignedFlights: 112,
    unassignedFlights: 16,
    aircraftTotal: 42,
    aircraftAvailable: 28,
    aircraftMaintenance: 6,
    aircraftInFlight: 8,
    crewTotal: 156,
    crewAvailable: 132,
    crewResting: 24,
  };

  const alerts = [
    { id: 1, type: 'warning', message: 'Flight AA123 has no aircraft assigned', time: '10 minutes ago' },
    { id: 2, type: 'error', message: 'Crew shortage for 3 upcoming flights', time: '25 minutes ago' },
    { id: 3, type: 'info', message: 'Aircraft B737-800 scheduled for maintenance', time: '2 hours ago' },
    { id: 4, type: 'success', message: 'Optimization complete: 98% efficiency achieved', time: '3 hours ago' },
    { id: 5, type: 'warning', message: 'Aircraft N12345 approaching maintenance limit', time: '4 hours ago' },
  ];

  const widgetOptions = [
    { type: 'summaryCards', title: 'Summary Cards' },
    { type: 'flightStatusChart', title: 'Flight Status Chart' },
    { type: 'aircraftStatusChart', title: 'Aircraft Status Chart' },
    { type: 'alerts', title: 'Recent Alerts' },
    { type: 'flightSchedule', title: 'Flight Schedule' },
    { type: 'mapView', title: 'Live Map View' },
  ];

  const renderWidget = ({ id, type, size, x = 0, y = 0, height }) => {
    const { className: width } = sizeConfigs[size] || sizeConfigs.medium;
    const commonProps = {
      key: id,
      onRemove: () => removeWidget(id),
      onResizeStop: (newHeight) => handleResize(id, newHeight),
      height: `${height || sizeConfigs[size || 'medium'].height}px`,
      width,
      x,
      y,
    };

    switch (type) {
      case 'summaryCards':
        return (
          <Widget title="Summary Overview" {...commonProps}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full overflow-auto">
              <SummaryCard title="Total Flights" value={summaryData.totalFlights} color="blue" icon={<Plane size={24} />} footer={`${summaryData.assignedFlights} assigned · ${summaryData.unassignedFlights} unassigned`} isDarkMode={isDarkMode} />
              <SummaryCard title="Aircraft Status" value={summaryData.aircraftTotal} color="green" icon={<Plane size={24} />} footer={`${summaryData.aircraftAvailable} available · ${summaryData.aircraftMaintenance} maintenance`} isDarkMode={isDarkMode} />
              <SummaryCard title="Crew Status" value={summaryData.crewTotal} color="amber" icon={<Users size={24} />} footer={`${summaryData.crewAvailable} available · ${summaryData.crewResting} resting`} isDarkMode={isDarkMode} />
              <SummaryCard title="Alerts" value={alerts.length} color="red" icon={<AlertTriangle size={24} />} footer={`${alerts.filter((a) => ['warning', 'error'].includes(a.type)).length} require attention`} isDarkMode={isDarkMode} />
            </div>
          </Widget>
        );
      case 'flightStatusChart':
        return <Widget title="Flight Status" {...commonProps}><FlightStatusChart isDarkMode={isDarkMode} /></Widget>;
      case 'aircraftStatusChart':
        return <Widget title="Aircraft Status" {...commonProps}><AircraftStatusChart isDarkMode={isDarkMode} /></Widget>;
      case 'alerts':
        return <Widget title="Recent Alerts" {...commonProps}><AlertsList alerts={alerts} isDarkMode={isDarkMode} /></Widget>;
      case 'flightSchedule':
        return <Widget title="Flight Schedule" {...commonProps}><FlightSchedule isDarkMode={isDarkMode} /></Widget>;
      case 'mapView':
        return <Widget title="Live Flight Map" {...commonProps}><MapView isDarkMode={isDarkMode} /></Widget>;
      default:
        return <Widget title="Unknown Widget" {...commonProps}><div className="text-red-500">Invalid widget type: {type}</div></Widget>;
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 transition-all duration-300 flex flex-col min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 pt-16">
        <header className="py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Operational overview for today's flights and resources</p>
          </div>
        </header>
      </div>

      <div className="relative flex-1 p-4 overflow-x-auto">
        <div ref={containerRef} className="relative w-full" style={{ minWidth: `${minWidth}px`, minHeight: `${minHeight}px` }}>
          {widgets.length === 0 ? (
            <div className="w-full min-h-[300px] flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">No widgets added. Click the + button to add a widget.</p>
            </div>
          ) : (
            widgets.map(renderWidget)
          )}
        </div>
      </div>

      <button
        onClick={() => setIsAddWidgetOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-500 transition-all transform hover:scale-110 z-50"
        title="Add Widget"
      >
        <Plus size={24} />
      </button>

      {isAddWidgetOpen && (
        <div className="fixed bottom-20 right-6 z-50 animate-in slide-in-from-bottom fade-in duration-300">
          <div className="max-w-sm w-full rounded-lg shadow-lg p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Add Widget</h3>
              <button onClick={() => setIsAddWidgetOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {widgetOptions.map((option) => (
                <button key={option.type} onClick={() => addWidget(option.type)} className="w-full text-left px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300">
                  {option.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
