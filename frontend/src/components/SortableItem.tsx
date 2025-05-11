import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FormField } from '../types/form';

interface SortableItemProps {
  field: FormField;
  onEdit: () => void;
  onDelete: () => void;
}

export const SortableItem: React.FC<SortableItemProps> = ({ field, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-4 rounded-lg shadow mb-2 flex items-center justify-between"
      {...attributes}
      {...listeners}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 cursor-move">⋮⋮</span>
          <span className="font-medium">{field.label}</span>
          <span className="text-sm text-gray-500">({field.type})</span>
          {field.required && (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">必須</span>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onEdit}
          className="text-blue-500 hover:text-blue-700"
        >
          編集
        </button>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
        >
          削除
        </button>
      </div>
    </div>
  );
}; 