import React, { useState } from 'react';
// @ts-ignore
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
// @ts-ignore
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import type { FormField, FormFieldType } from '../types/form';

interface FormBuilderProps {
  initialFields: FormField[];
  onSave: (fields: FormField[]) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ initialFields, onSave }) => {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [editingField, setEditingField] = useState<FormField | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: 'text',
      label: '新しい項目',
      required: false,
      options: [],
    };
    setFields([...fields, newField]);
    setEditingField(newField);
  };

  const updateField = (updatedField: FormField) => {
    setFields(fields.map((field) => (field.id === updatedField.id ? updatedField : field)));
    setEditingField(null);
  };

  const deleteField = (fieldId: string) => {
    setFields(fields.filter((field) => field.id !== fieldId));
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          onClick={addField}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          項目を追加
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          {fields.map((field) => (
            <SortableItem
              key={field.id}
              field={field}
              onEdit={() => setEditingField(field)}
              onDelete={() => deleteField(field.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {editingField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">項目の編集</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ラベル</label>
                <input
                  type="text"
                  value={editingField.label}
                  onChange={(e) =>
                    setEditingField({ ...editingField, label: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">タイプ</label>
                <select
                  value={editingField.type}
                  onChange={(e) =>
                    setEditingField({ ...editingField, type: e.target.value as FormFieldType })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="text">テキスト</option>
                  <option value="email">メール</option>
                  <option value="tel">電話番号</option>
                  <option value="number">数値</option>
                  <option value="file">ファイル</option>
                  <option value="textarea">テキストエリア</option>
                  <option value="select">セレクト</option>
                  <option value="checkbox">チェックボックス</option>
                  <option value="radio">ラジオボタン</option>
                </select>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingField.required}
                    onChange={(e) =>
                      setEditingField({ ...editingField, required: e.target.checked })
                    }
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">必須</span>
                </label>
              </div>
              {(editingField.type === 'select' ||
                editingField.type === 'checkbox' ||
                editingField.type === 'radio') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">選択肢</label>
                  <div className="space-y-2">
                    {editingField.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(editingField.options || [])];
                            newOptions[index] = e.target.value;
                            setEditingField({ ...editingField, options: newOptions });
                          }}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => {
                            const newOptions = editingField.options?.filter((_, i) => i !== index);
                            setEditingField({ ...editingField, options: newOptions });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          削除
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newOptions = [...(editingField.options || []), ''];
                        setEditingField({ ...editingField, options: newOptions });
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      選択肢を追加
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setEditingField(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={() => updateField(editingField)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={() => onSave(fields)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          フォームを保存
        </button>
      </div>
    </div>
  );
}; 