import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { format } from 'date-fns';

interface JobApplication {
  id: number;
  job: {
    id: number;
    title: string;
  };
  name: string;
  email: string;
  phone: string;
  cover_letter: string;
  status: string;
  created_at: string;
}

const JobApplicationDetail: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await api.get<JobApplication>(`/job-applications/${applicationId}`);
        setApplication(response.data);
      } catch (err) {
        setError('応募情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await api.patch(`/job-applications/${applicationId}`, { status: newStatus });
      setApplication((prev) => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      setError('ステータスの更新に失敗しました');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !application) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || '応募情報が見つかりません'}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          応募詳細
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/job-applications')}>
          一覧に戻る
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              求人情報
            </Typography>
            <Typography variant="body1" gutterBottom>
              {application.job.title}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              応募者情報
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="subtitle2">お名前</Typography>
                <Typography variant="body1">{application.name}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">メールアドレス</Typography>
                <Typography variant="body1">{application.email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">電話番号</Typography>
                <Typography variant="body1">{application.phone}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">応募日</Typography>
                <Typography variant="body1">
                  {format(new Date(application.created_at), 'yyyy年MM月dd日')}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              カバーレター
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {application.cover_letter}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              ステータス
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Chip
                label="審査中"
                color={application.status === 'pending' ? 'warning' : 'default'}
                onClick={() => handleStatusChange('pending')}
                clickable
              />
              <Chip
                label="採用"
                color={application.status === 'accepted' ? 'success' : 'default'}
                onClick={() => handleStatusChange('accepted')}
                clickable
              />
              <Chip
                label="不採用"
                color={application.status === 'rejected' ? 'error' : 'default'}
                onClick={() => handleStatusChange('rejected')}
                clickable
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default JobApplicationDetail; 