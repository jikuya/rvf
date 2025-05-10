import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Login from './pages/Login';
import Applications from './pages/Applications';
import ApplicationDetail from './pages/ApplicationDetail';
import JobDetail from './pages/JobDetail';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="py-10">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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
  );
};

export default App;
