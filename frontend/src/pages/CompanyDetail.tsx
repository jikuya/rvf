import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';

interface Company {
  id: number;
  name: string;
  description: string;
  website: string;
  industry: string;
  size: string;
  founded_year: string;
  location: string;
}

const CompanyDetail: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Partial<Company>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await api.get<Company>(`/companies/${companyId}`);
        setCompany(response.data);
        setForm(response.data);
      } catch (err) {
        setError('企業情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [companyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await api.put<Company>(`/companies/${companyId}`, form);
      setCompany(response.data);
      setEditMode(false);
    } catch (err) {
      setError('企業情報の更新に失敗しました');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !company) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || '企業情報が見つかりません'}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          企業詳細
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/companies')}>
          一覧に戻る
        </Button>
      </Box>
      <Paper sx={{ p: 3 }}>
        {editMode ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="企業名" name="name" value={form.name || ''} onChange={handleChange} fullWidth required />
            <TextField label="業種" name="industry" value={form.industry || ''} onChange={handleChange} fullWidth />
            <TextField label="所在地" name="location" value={form.location || ''} onChange={handleChange} fullWidth />
            <TextField label="設立年" name="founded_year" value={form.founded_year || ''} onChange={handleChange} fullWidth />
            <TextField label="従業員数" name="size" value={form.size || ''} onChange={handleChange} fullWidth />
            <TextField label="Webサイト" name="website" value={form.website || ''} onChange={handleChange} fullWidth />
            <TextField label="説明" name="description" value={form.description || ''} onChange={handleChange} fullWidth multiline rows={3} />
            <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>保存</Button>
              <Button variant="outlined" onClick={() => setEditMode(false)}>キャンセル</Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography><b>企業名:</b> {company.name}</Typography>
            <Typography><b>業種:</b> {company.industry}</Typography>
            <Typography><b>所在地:</b> {company.location}</Typography>
            <Typography><b>設立年:</b> {company.founded_year}</Typography>
            <Typography><b>従業員数:</b> {company.size}</Typography>
            <Typography><b>Webサイト:</b> {company.website}</Typography>
            <Typography><b>説明:</b> {company.description}</Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={() => setEditMode(true)}>編集</Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CompanyDetail; 