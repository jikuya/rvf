import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance as api } from '../utils/axios';

interface Admin {
  id: number;
  email: string;
  name: string;
}

interface LoginResponse {
  token: string;
  admin: Admin;
}

interface AuthContextType {
  isAuthenticated: boolean;
  admin: Admin | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // 管理者情報を取得
      api.get('/api/v1/me')
        .then(response => {
          const data = response.data as { admin: any };
          setAdmin(data.admin);
        })
        .catch(() => {
          logout();
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/v1/login', { email, password });
      const { token, admin } = response.data as LoginResponse;
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setAdmin(admin);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 