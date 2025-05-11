import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import type { FormField } from '../types/form';

interface JobApplicationFormProps {
  formDefinition: FormField[];
  onSubmit: (data: any) => void;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  formDefinition,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch {
      setError('応募の送信に失敗しました');
    }
  };

  const handleChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          応募フォーム
        </Typography>

        {error && (
          <Alert severity="error" role="alert" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {formDefinition.map((field) => (
            <TextField
              key={field.id}
              label={field.label}
              required={field.required}
              type={field.type === 'email' ? 'email' : 'text'}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              multiline={field.type === 'textarea'}
              rows={field.type === 'textarea' ? 4 : 1}
              fullWidth
            />
          ))}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            応募する
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default JobApplicationForm; 