// ColumnSelectorWidget.jsx
import React, { useState } from 'react';
import Widget from './Widget';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const groupedColumns = {
  Timing: ['STD', 'STA', 'DEP', 'ARR'],
  Flight: ['Flight ID', 'Status'],
  Aircraft: ['Aircraft Reg'],
  Airport: ['Dep Stand', 'Gate']
};

const flightData = [
  {
    'Flight ID': 'AA100', STD: '10:00', STA: '14:00', DEP: '10:10', ARR: '14:05',
    Status: 'Delayed', 'Aircraft Reg': 'N123AA', 'Dep Stand': 'B4', Gate: '12A'
  },
  {
    'Flight ID': 'DL202', STD: '11:30', STA: '15:20', DEP: '11:40', ARR: '15:35',
    Status: 'On Time', 'Aircraft Reg': 'N456DL', 'Dep Stand': 'C2', Gate: '7B'
  }
];

const DraggableItem = ({ col, index, moveItem }) => {
  const [, ref] = useDrag({
    type: 'column',
    item: { index }
  });

  const [, drop] = useDrop({
    accept: 'column',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    }
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      className="px-3 py-1 bg-blue-50 dark:bg-blue-900 rounded cursor-move text-xs text-gray-800 dark:text-gray-100 whitespace-nowrap border"
    >
      {col}
    </div>
  );
};

const ColumnSelectorWidget = ({ x = 0, y = 0, width = 800, height = 400, onRemove, onResizeStop }) => {
  const [selectedColumns, setSelectedColumns] = useState(['Flight ID', 'Status']);

  const toggleColumn = (col) => {
    setSelectedColumns((prev) =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const moveItem = (fromIndex, toIndex) => {
    const updated = [...selectedColumns];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setSelectedColumns(updated);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Widget
        
        x={x}
        y={y}
        width={width}
        height={height}
        onRemove={onRemove}
        onResizeStop={onResizeStop}
      >
        <div className="flex flex-col h-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2 border-b overflow-y-auto">
            {Object.entries(groupedColumns).map(([group, cols]) => (
              <div key={group} className="min-w-0">
                <h3 className="font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300 truncate">{group}</h3>
                {cols.map((col) => (
                  <label key={col} className="block text-xs text-gray-700 dark:text-gray-300 truncate">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(col)}
                      onChange={() => toggleColumn(col)}
                      className="mr-1"
                    />
                    {col}
                  </label>
                ))}
              </div>
            ))}
          </div>

          <div className="p-2 border-b overflow-x-auto">
            <div className="flex gap-2">
              {selectedColumns.map((col, idx) => (
                <DraggableItem key={col} col={col} index={idx} moveItem={moveItem} />
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-2">
            <div className="w-full h-full overflow-auto">
              <table className="w-full table-auto border text-xs">
                <thead>
                  <tr>
                    {selectedColumns.map((col) => (
                      <th key={col} className="px-2 py-1 font-bold text-left border-b dark:text-white whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {flightData.map((flight, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      {selectedColumns.map((col) => (
                        <td key={col} className="px-2 py-1 border-b text-gray-800 dark:text-gray-200 whitespace-nowrap">
                          {flight[col] ?? '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Widget>
    </DndProvider>
  );
};

export default ColumnSelectorWidget;