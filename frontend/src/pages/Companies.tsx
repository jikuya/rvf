import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance as api } from '../utils/axios';
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
  CircularProgress,
  Alert,
  Box,
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

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get<Company[]>('/api/v1/companies');
        setCompanies(response.data);
      } catch (err) {
        setError('企業情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          企業一覧
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/companies/new')}>
          新規企業作成
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>企業名</TableCell>
              <TableCell>業種</TableCell>
              <TableCell>所在地</TableCell>
              <TableCell>設立年</TableCell>
              <TableCell>従業員数</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.industry}</TableCell>
                <TableCell>{company.location}</TableCell>
                <TableCell>{company.founded_year}</TableCell>
                <TableCell>{company.size}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/companies/${company.id}`)}
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

export default Companies; 