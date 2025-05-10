import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Login from './pages/Login';
import Applications from './pages/Applications';
import ApplicationDetail from './pages/ApplicationDetail';
import JobDetail from './pages/JobDetail';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, padding: '2rem' }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/applications"
                    element={
                      <PrivateRoute>
                        <Applications />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/applications/:applicationId"
                    element={
                      <PrivateRoute>
                        <ApplicationDetail />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/applications" replace />} />
                  <Route path="/jobs/:jobId" element={<JobDetail />} />
                </Routes>
              </div>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
