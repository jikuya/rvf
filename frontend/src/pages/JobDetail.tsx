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
        const response = await axios.get<Job>(`/jobs/${jobId}`);
        setJob(response.data);
      } catch (err) {
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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          求人詳細
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/jobs')}>
            一覧に戻る
          </Button>
          <Button variant="contained" onClick={() => navigate(`/jobs/${jobId}/edit`)}>
            編集
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              {job.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={job.employment_type === 'full_time' ? '正社員' : '契約社員'}
                color="primary"
                size="small"
              />
              <Chip
                label={job.status === 'active' ? '募集中' : '募集終了'}
                color={job.status === 'active' ? 'success' : 'default'}
                size="small"
              />
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              基本情報
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  勤務地
                </Typography>
                <Typography variant="body1">{job.location}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  給与
                </Typography>
                <Typography variant="body1">{job.salary}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  作成日
                </Typography>
                <Typography variant="body1">
                  {format(new Date(job.created_at), 'yyyy年MM月dd日')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  更新日
                </Typography>
                <Typography variant="body1">
                  {format(new Date(job.updated_at), 'yyyy年MM月dd日')}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              仕事内容
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                {job.description}
              </Typography>
            </Paper>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              応募要件
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                {job.requirements}
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default JobDetail; 