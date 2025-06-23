import React, { useState, useEffect, useContext, useRef } from 'react';
import { ThemeContext } from '../../ThemeContext';
import SummaryCard from './SummaryCard';
import AlertsList from './AlertsList';
import FlightStatusChart from './FlightStatusChart';
import AircraftStatusChart from './AircraftStatusChart';
import FlightSchedule from '../flights/Flightupd';
import MapView from './Flightmap';
import MapModal from './Mapmodal';
import { Plane, Users, AlertTriangle, Plus, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Widget from './Widget';
import ColumnSelectorWidget from './ColumnSelectorWidget';

const allColumns = [
  'Flight ID', 'STD', 'STA', 'DEP', 'ARR',
  'Status', 'Aircraft Reg', 'Dep Stand', 'Gate'
];

const flightData = [
  {
    'Flight ID': 'AA100',
    STD: '10:00',
    STA: '14:00',
    DEP: '10:10',
    ARR: '14:05',
    Status: 'Delayed',
    'Aircraft Reg': 'N123AA',
    'Dep Stand': 'B4',
    Gate: '12A'
  },
  {
    'Flight ID': 'DL202',
    STD: '11:30',
    STA: '15:20',
    DEP: '11:40',
    ARR: '15:35',
    Status: 'On Time',
    'Aircraft Reg': 'N456DL',
    'Dep Stand': 'C2',
    Gate: '7B'
  }
];

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
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState(allColumns);

  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
  }, [widgets]);

  const GAP = 24;
  const sizeConfigs = {
    small: { width: 300, height: 200 },
    medium: { width: 600, height: 400 },
    large: { width: 1200, height: 600 },
  };

  const layoutWidgets = (widgetsToLayout, containerWidth = window.innerWidth) => {
    let layout = [];
    let rows = [[]];
    let currentRowWidth = 0;
    let currentY = 0;

    widgetsToLayout.forEach(widget => {
      const width = widget.width || sizeConfigs[widget.size || 'medium'].width;
      const height = widget.height || sizeConfigs[widget.size || 'medium'].height;
      if (currentRowWidth + width + GAP > containerWidth) {
        currentY += Math.max(...rows[rows.length - 1].map(w => w.height)) + GAP;
        rows.push([]);
        currentRowWidth = 0;
      }
      const x = currentRowWidth;
      layout.push({ ...widget, x, y: currentY, width, height });
      rows[rows.length - 1].push({ ...widget, width, height });
      currentRowWidth += width + GAP;
    });

    return layout;
  };

  const handleResize = (id, newWidth, newHeight) => {
    setWidgets(prev => {
      const updated = prev.map(w => w.id === id ? { ...w, width: newWidth, height: newHeight } : w);
      return layoutWidgets(updated);
    });
  };

  const calculateNextPosition = () => {
    const layout = layoutWidgets(widgets);
    const last = layout[layout.length - 1];
    if (!last) return { x: 0, y: 0 };

    const width = sizeConfigs.medium.width;
    const height = sizeConfigs.medium.height;

    let nextX = last.x + last.width + GAP;
    let nextY = last.y;
    if (nextX + width > window.innerWidth) {
      nextX = 0;
      nextY = last.y + last.height + GAP;
    }
    return { x: nextX, y: nextY };
  };

  const addWidget = (type) => {
    const { x, y } = calculateNextPosition();
    const newWidget = {
      id: uuidv4(),
      type,
      size: 'medium',
      x,
      y,
      width: sizeConfigs.medium.width,
      height: sizeConfigs.medium.height,
    };
    setWidgets(prev => layoutWidgets([...prev, newWidget]));
    setIsAddWidgetOpen(false);
  };

  const removeWidget = (id) => {
    setWidgets(prev => layoutWidgets(prev.filter(w => w.id !== id)));
  };

  const getContainerDimensions = () => {
    let maxX = 0;
    let maxY = 0;
    widgets.forEach(({ x, y, width, height }) => {
      maxX = Math.max(maxX, x + width);
      maxY = Math.max(maxY, y + height);
    });
    return { minWidth: maxX + GAP, minHeight: maxY + GAP };
  };

  useEffect(() => {
    const handleResize = () => {
      setWidgets(prev => layoutWidgets(prev));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { minWidth, minHeight } = getContainerDimensions();

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
    { type: 'columnSelector', title: 'Column Selector' }
  ];

  const renderWidget = ({ id, type, x = 0, y = 0, height, width }) => {
    const commonProps = {
      key: id,
      onRemove: () => removeWidget(id),
      onResizeStop: (newHeight, newWidth) => handleResize(id, newWidth, newHeight),
      height: `${height}px`,
      width: `${width}px`,
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
        return <Widget title="Live Flight Map" {...commonProps}><div style={{ height: '100%', width: '100%', minHeight: '400px', position: 'relative' }}><MapView isDarkMode={isDarkMode} setSelectedFlight={setSelectedFlight} /></div></Widget>;
      case 'columnSelector':
        return <Widget title="Column Selector" {...commonProps}><ColumnSelectorWidget columns={allColumns} selectedColumns={selectedColumns} setSelectedColumns={setSelectedColumns} /></Widget>;
      default:
        return <Widget title="Unknown Widget" {...commonProps}><div className="text-red-500">Invalid widget type: {type}</div></Widget>;
    }
  };

  return (
    <div className={`bg-gray-100 dark:bg-gray-900 transition-all duration-300 flex flex-col min-h-screen`} data-theme={isDarkMode ? 'dark' : 'light'}>
      <div className="px-4 sm:px-6 lg:px-8 pt-16">
        <header className="py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Operational overview for today's flights and resources</p>
          </div>
        </header>
      </div>

      <div className="relative flex-1 p-4 overflow-x-auto overflow-y-auto">
        <div ref={containerRef} className="relative" style={{ minWidth: `${minWidth}px`, minHeight: `${minHeight}px` }}>
          {widgets.length === 0 ? (
            <div className="w-full min-h-[300px] flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">No widgets added. Click the + button to add a widget.</p>
            </div>
          ) : (
            widgets.map(renderWidget)
          )}
        </div>
      </div>

      <button onClick={() => setIsAddWidgetOpen(true)} className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-500 transition-all transform hover:scale-110 z-50" title="Add Widget">
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

      {selectedFlight && (
        <MapModal onClose={() => setSelectedFlight(null)} flight={selectedFlight} />
      )}
    </div>
  );
};

export default Dashboard;
