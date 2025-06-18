import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { X } from 'lucide-react';

const Widget = ({ title, children, onRemove, onResizeStop, height = 400, width = 600, x = 0, y = 0 }) => {
  const [editableTitle, setEditableTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [size, setSize] = useState({
    width: typeof width === 'string' ? parseInt(width) || 600 : width,
    height: typeof height === 'string' ? parseInt(height) || 400 : height,
  });

  const handleTitleChange = (e) => setEditableTitle(e.target.value);
  const handleBlur = () => setIsEditing(false);

  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={{ x, y }}
      default={{ x, y, width: size.width, height: size.height }}
      onResizeStop={(e, direction, ref) => {
        const newSize = {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        };
        setSize(newSize);
        if (onResizeStop) onResizeStop(newSize.height, newSize.width);
      }}
      minWidth={300}
      minHeight={300}
      className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col"
      disableDragging={true}
      enableResizing={{
        bottom: true,
        right: true,
        bottomRight: true,
      }}
      resizeGrid={[1, 1]} // 👈 Allow pixel-level resizing

    >
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 rounded-full z-10 dark:bg-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 text-gray-600"
        >
          <X size={16} />
        </button>
      )}

      {title && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          {isEditing ? (
            <input
              className="text-lg font-medium bg-transparent outline-none border-b border-gray-400 dark:border-gray-600 w-full"
              value={editableTitle}
              onChange={handleTitleChange}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            <h2
              className="text-lg font-medium cursor-pointer"
              onClick={() => setIsEditing(true)}
              title="Click to edit"
            >
              {editableTitle}
            </h2>
          )}
        </div>
      )}

      {/* ✅ Scrollable child container takes remaining height */}
    <div className="p-4 h-[calc(100%-3rem)] overflow-y-auto overflow-x-hidden">{children}</div>

    </Rnd>
  );
};

export default Widget;
