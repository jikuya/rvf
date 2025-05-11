import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
          const response = await axios.get<Job>(`/jobs/${jobId}`);
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
        await axios.patch(`/jobs/${jobId}`, job);
      } else {
        await axios.post('/jobs', job);
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
      <Typography variant="h4" component="h1" gutterBottom>
        {jobId ? '求人情報の編集' : '新規求人の作成'}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="タイトル"
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
                <MenuItem value="contract">契約社員</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>ステータス</InputLabel>
              <Select
                name="status"
                value={job.status}
                onChange={handleSelectChange}
                label="ステータス"
              >
                <MenuItem value="active">募集中</MenuItem>
                <MenuItem value="inactive">募集終了</MenuItem>
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