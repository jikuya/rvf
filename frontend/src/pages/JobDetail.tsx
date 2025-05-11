import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance as api } from '../utils/axios';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import { format } from 'date-fns';

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary: string;
  employment_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const JobDetail: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get<Job>(`/api/v1/jobs/${jobId}`);
        setJob(response.data);
      } catch {
        setError('求人情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

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

  if (!job) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">求人情報が見つかりません</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            {job.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/jobs/${jobId}/edit`)}
            >
              編集
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate(`/jobs/${jobId}/apply`)}
            >
              応募する
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              勤務地
            </Typography>
            <Typography variant="body1">{job.location}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              給与
            </Typography>
            <Typography variant="body1">{job.salary}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              雇用形態
            </Typography>
            <Typography variant="body1">
              {job.employment_type === 'full_time' && '正社員'}
              {job.employment_type === 'part_time' && 'パートタイム'}
              {job.employment_type === 'contract' && '契約社員'}
              {job.employment_type === 'intern' && 'インターン'}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              仕事内容
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {job.description}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              応募要件
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {job.requirements}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              ステータス
            </Typography>
            <Chip
              label={job.status === 'active' ? '募集中' : '募集終了'}
              color={job.status === 'active' ? 'success' : 'default'}
            />
          </Box>

          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              作成日時
            </Typography>
            <Typography variant="body1">
              {format(new Date(job.created_at), 'yyyy年MM月dd日 HH:mm')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              更新日時
            </Typography>
            <Typography variant="body1">
              {format(new Date(job.updated_at), 'yyyy年MM月dd日 HH:mm')}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default JobDetail; 