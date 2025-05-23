import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';
import Login from './pages/Login';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import JobForm from './pages/JobForm';
import JobApplications from './pages/JobApplications';
import JobApplicationDetail from './pages/JobApplicationDetail';
import JobApplicationForm from './pages/JobApplicationForm';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import { JobEdit } from './pages/JobEdit';

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
              <Route path="jobs/:jobId/edit" element={<PrivateRoute><JobEdit /></PrivateRoute>} />
              <Route path="jobs/:jobId/apply" element={<JobApplicationForm />} />
              <Route path="job_applications" element={<PrivateRoute><JobApplications /></PrivateRoute>} />
              <Route path="job_applications/:applicationId" element={<PrivateRoute><JobApplicationDetail /></PrivateRoute>} />
              <Route path="companies" element={<PrivateRoute><Companies /></PrivateRoute>} />
              <Route path="companies/:companyId" element={<PrivateRoute><CompanyDetail /></PrivateRoute>} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
