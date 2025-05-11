import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import { DragHandle as DragHandleIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { FormField } from '../types/form';

interface SortableItemProps {
  field: FormField;
  onEdit: () => void;
  onDelete: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ field, onEdit, onDelete }) => {
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
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{
        p: 2,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton {...attributes} {...listeners} size="small">
          <DragHandleIcon />
        </IconButton>
        <Typography variant="body1">{field.label}</Typography>
        <Typography variant="caption" color="text.secondary">
          ({field.type})
        </Typography>
        {field.required && (
          <Chip
            label="必須"
            size="small"
            color="error"
            variant="outlined"
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton onClick={onEdit} size="small">
          <EditIcon />
        </IconButton>
        <IconButton onClick={onDelete} size="small" color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default SortableItem; 