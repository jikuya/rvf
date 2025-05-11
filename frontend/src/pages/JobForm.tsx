import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';

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

const JobForm: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Partial<Job>>({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    employment_type: 'full_time',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (jobId) {
      const fetchJob = async () => {
        try {
          const response = await api.get<Job>(`/jobs/${jobId}`);
          setJob(response.data);
        } catch (err) {
          setError('求人情報の取得に失敗しました');
        }
      };
      fetchJob();
    }
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (jobId) {
        await api.patch(`/jobs/${jobId}`, job);
      } else {
        await api.post('/jobs', job);
      }
      navigate('/jobs');
    } catch (err) {
      setError('求人情報の保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container>
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {jobId ? '求人情報編集' : '新規求人作成'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="求人タイトル"
              name="title"
              value={job.title}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="勤務地"
              name="location"
              value={job.location}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="給与"
              name="salary"
              value={job.salary}
              onChange={handleChange}
              required
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>雇用形態</InputLabel>
              <Select
                name="employment_type"
                value={job.employment_type}
                onChange={handleSelectChange}
                label="雇用形態"
              >
                <MenuItem value="full_time">正社員</MenuItem>
                <MenuItem value="part_time">パートタイム</MenuItem>
                <MenuItem value="contract">契約社員</MenuItem>
                <MenuItem value="intern">インターン</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="仕事内容"
              name="description"
              value={job.description}
              onChange={handleChange}
              required
              multiline
              rows={4}
              fullWidth
            />

            <TextField
              label="応募要件"
              name="requirements"
              value={job.requirements}
              onChange={handleChange}
              required
              multiline
              rows={4}
              fullWidth
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/jobs')}
                disabled={loading}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : '保存'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default JobForm; 