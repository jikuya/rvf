import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';
import Login from './pages/Login';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import JobForm from './pages/JobForm';
import Applications from './pages/Applications';
import ApplicationDetail from './pages/ApplicationDetail';
import JobApplicationForm from './pages/JobApplicationForm';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/jobs" replace />} />
              <Route path="jobs" element={<PrivateRoute><Jobs /></PrivateRoute>} />
              <Route path="jobs/:jobId" element={<PrivateRoute><JobDetail /></PrivateRoute>} />
              <Route path="jobs/new" element={<PrivateRoute><JobForm /></PrivateRoute>} />
              <Route path="jobs/:jobId/edit" element={<PrivateRoute><JobForm /></PrivateRoute>} />
              <Route path="jobs/:jobId/apply" element={<JobApplicationForm />} />
              <Route path="applications" element={<PrivateRoute><Applications /></PrivateRoute>} />
              <Route path="applications/:applicationId" element={<PrivateRoute><ApplicationDetail /></PrivateRoute>} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
