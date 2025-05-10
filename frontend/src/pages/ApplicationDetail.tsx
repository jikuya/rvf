import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Application {
  id: number;
  name: string;
  email: string;
  phone: string;
  cover_letter: string;
  status: string;
  job: {
    id: number;
    title: string;
  };
  created_at: string;
  resume_url: string;
}

const ApplicationDetail: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get<Application>(`/applications/${applicationId}`);
        setApplication(response.data);
        setStatus(response.data.status);
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
      const response = await axios.patch<Application>(`/applications/${applicationId}`, {
        status: newStatus,
      });
      setStatus(newStatus);
      setApplication(response.data);
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

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!application) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">応募情報が見つかりません</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          応募詳細
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/applications')}>
          一覧に戻る
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              基本情報
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  名前
                </Typography>
                <Typography variant="body1">{application.name}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  メールアドレス
                </Typography>
                <Typography variant="body1">{application.email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  電話番号
                </Typography>
                <Typography variant="body1">{application.phone || '未設定'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  応募日
                </Typography>
                <Typography variant="body1">
                  {format(new Date(application.created_at), 'yyyy年MM月dd日')}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              求人情報
            </Typography>
            <Typography variant="body1">{application.job.title}</Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              カバーレター
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                {application.cover_letter || 'カバーレターはありません'}
              </Typography>
            </Paper>
          </Box>

          <Divider />

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">ステータス</Typography>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>ステータス</InputLabel>
                <Select
                  value={status}
                  label="ステータス"
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <MenuItem value="pending">審査中</MenuItem>
                  <MenuItem value="accepted">採用</MenuItem>
                  <MenuItem value="rejected">不採用</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {application.resume_url && (
            <Box>
              <Button
                variant="contained"
                href={application.resume_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                履歴書をダウンロード
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ApplicationDetail; 