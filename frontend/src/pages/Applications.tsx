import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { format } from 'date-fns';

interface Application {
  id: number;
  name: string;
  email: string;
  status: string;
  job: {
    id: number;
    title: string;
  };
  created_at: string;
  resume_url: string;
}

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get<Application[]>('/applications');
        setApplications(response.data);
      } catch (err) {
        setError('応募情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return '審査中';
      case 'accepted':
        return '採用';
      case 'rejected':
        return '不採用';
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
      <Typography variant="h4" component="h1" gutterBottom>
        応募一覧
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>応募日</TableCell>
              <TableCell>名前</TableCell>
              <TableCell>メールアドレス</TableCell>
              <TableCell>求人</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  {format(new Date(application.created_at), 'yyyy年MM月dd日')}
                </TableCell>
                <TableCell>{application.name}</TableCell>
                <TableCell>{application.email}</TableCell>
                <TableCell>{application.job.title}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(application.status)}
                    color={getStatusColor(application.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/applications/${application.id}`)}
                  >
                    詳細
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Applications; 