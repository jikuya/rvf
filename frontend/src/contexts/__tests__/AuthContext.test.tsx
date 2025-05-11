import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import axios from 'axios';
import { axiosInstance } from '../../utils/axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// axiosInstanceのモックを修正
jest.mock('../../utils/axios', () => ({
  axiosInstance: {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    },
    defaults: {
      headers: {
        common: {}
      }
    }
  }
}));

const TestComponent = () => {
  const { admin, login, logout } = useAuth();

  return (
    <div>
      {admin ? (
        <>
          <div data-testid="user-email">{admin.email}</div>
          <button onClick={logout}>ログアウト</button>
        </>
      ) : (
        <button onClick={() => login('test@example.com', 'password')}>
          ログイン
        </button>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (axiosInstance.post as jest.Mock).mockReset();
    localStorage.clear();
  });

  it('provides authentication context', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('ログイン')).toBeInTheDocument();
  });

  it('handles login successfully', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockResponse = {
      data: { token: 'dummy-token', admin: mockUser },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: '/api/v1/login' }
    };
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('ログイン'));

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/api/v1/login', {
      email: 'test@example.com',
      password: 'password'
    });
  });

  it('handles login failure', async () => {
    const errorMessage = 'ログインに失敗しました';
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      response: {
        data: { message: errorMessage },
        status: 401,
        statusText: 'Unauthorized'
      }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('ログイン'));

    await waitFor(() => {
      expect(screen.getByText('ログイン')).toBeInTheDocument();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/api/v1/login', {
      email: 'test@example.com',
      password: 'password'
    });
  });

  it('handles logout', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({ data: { token: 'dummy-token', admin: mockUser }, status: 200, statusText: 'OK', headers: {}, config: { url: '/api/v1/login' } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('ログイン'));

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('ログアウト'));

    await waitFor(() => {
      expect(screen.getByText('ログイン')).toBeInTheDocument();
    });
  });
}); 