import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import api from '../utils/axios';

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary: string;
  employment_type: string;
  status: string;
}

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get<Job[]>('/jobs');
        setJobs(response.data);
      } catch (err) {
        setError('求人情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '募集中';
      case 'inactive':
        return '募集終了';
      default:
        return status;
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

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          求人一覧
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/jobs/new')}
        >
          新規求人作成
        </Button>
      </Box>

      {jobs.map((job) => (
        <Paper key={job.id} sx={{ p: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {job.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {job.location} | {job.employment_type} | {job.salary}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {job.description}
              </Typography>
            </Box>
            <Box>
              <Chip
                label={getStatusLabel(job.status)}
                color={getStatusColor(job.status)}
                sx={{ mr: 1 }}
              />
              <Button
                variant="outlined"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                詳細
              </Button>
            </Box>
          </Box>
        </Paper>
      ))}
    </Container>
  );
};

export default Jobs; 