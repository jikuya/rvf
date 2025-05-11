import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import FormBuilder from '../components/FormBuilder';
import type { FormField } from '../types/form';

interface Job {
  id: number;
  title: string;
  form_definition: FormField[];
  // 必要に応じて他の属性も追加
}

export const JobEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get<Job>(`/api/v1/jobs/${id}`);
        setJob(res.data);
      } catch {
        setError('ジョブ情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSave = async (fields: FormField[]) => {
    if (!job) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await axios.patch(`/api/v1/jobs/${job.id}/update_form_definition`, {
        form_definition: fields,
      });
      setSuccess(true);
      setJob({ ...job, form_definition: fields });
    } catch {
      setError('フォーム定義の保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!job) return <CircularProgress />;

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {job.title} のフォーム定義編集
      </Typography>
      <FormBuilder
        formDefinition={job.form_definition || []}
        onSave={handleSave}
        onCancel={() => navigate(`/jobs/${id}`)}
      />
      {saving && <Alert severity="info" sx={{ mt: 2 }}>保存中...</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>保存しました！</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Container>
  );
};

export default JobEdit; 