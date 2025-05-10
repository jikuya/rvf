import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Login from './pages/Login';
import Applications from './pages/Applications';
import ApplicationDetail from './pages/ApplicationDetail';
import JobDetail from './pages/JobDetail';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

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
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button>
            count is {0}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </Router>
    </AuthProvider>
  )
}

export default App
