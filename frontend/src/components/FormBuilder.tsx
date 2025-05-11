import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import { DragHandle as DragHandleIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { FormField } from '../types/form';
import SortableItem from './SortableItem';

interface FormBuilderProps {
  formDefinition: FormField[];
  onSave: (fields: FormField[]) => void;
  onCancel: () => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ formDefinition, onSave, onCancel }) => {
  const [fields, setFields] = useState<FormField[]>(formDefinition);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = [...items];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);
        return newItems;
      });
    }
  };

  const handleAddField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      label: '',
      type: 'text',
      required: false,
      options: [],
    };
    setEditingField(newField);
    setIsDialogOpen(true);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setIsDialogOpen(true);
  };

  const handleDeleteField = (fieldId: string) => {
    setFields((items) => items.filter((item) => item.id !== fieldId));
  };

  const handleSaveField = () => {
    if (editingField) {
      setFields((items) => {
        const index = items.findIndex((item) => item.id === editingField.id);
        if (index === -1) {
          return [...items, editingField];
        }
        const newItems = [...items];
        newItems[index] = editingField;
        return newItems;
      });
    }
    setIsDialogOpen(false);
    setEditingField(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddField}
        >
          項目を追加
        </Button>
        <Box>
          <Button variant="outlined" onClick={onCancel} sx={{ mr: 1 }}>
            キャンセル
          </Button>
          <Button variant="contained" color="primary" onClick={() => onSave(fields)}>
            保存
          </Button>
        </Box>
      </Box>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          {fields.map((field) => (
            <SortableItem
              key={field.id}
              field={field}
              onEdit={() => handleEditField(field)}
              onDelete={() => handleDeleteField(field.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>項目の編集</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="ラベル"
              value={editingField?.label || ''}
              onChange={(e) => setEditingField(prev => prev ? { ...prev, label: e.target.value } : null)}
              fullWidth
            />

            <TextField
              select
              label="タイプ"
              value={editingField?.type || 'text'}
              onChange={(e) => setEditingField(prev => prev ? { ...prev, type: e.target.value } : null)}
              fullWidth
              SelectProps={{
                native: true,
              }}
            >
              <option value="text">テキスト</option>
              <option value="textarea">テキストエリア</option>
              <option value="email">メールアドレス</option>
              <option value="select">セレクトボックス</option>
            </TextField>

            <FormControlLabel
              control={
                <Checkbox
                  checked={editingField?.required || false}
                  onChange={(e) => setEditingField(prev => prev ? { ...prev, required: e.target.checked } : null)}
                />
              }
              label="必須"
            />

            {editingField?.type === 'select' && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  選択肢
                </Typography>
                {editingField.options?.map((option, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TextField
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(editingField.options || [])];
                        newOptions[index] = e.target.value;
                        setEditingField(prev => prev ? { ...prev, options: newOptions } : null);
                      }}
                      fullWidth
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        const newOptions = [...(editingField.options || [])];
                        newOptions.splice(index, 1);
                        setEditingField(prev => prev ? { ...prev, options: newOptions } : null);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => {
                    const newOptions = [...(editingField.options || []), ''];
                    setEditingField(prev => prev ? { ...prev, options: newOptions } : null);
                  }}
                >
                  選択肢を追加
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleSaveField} variant="contained" color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormBuilder; 