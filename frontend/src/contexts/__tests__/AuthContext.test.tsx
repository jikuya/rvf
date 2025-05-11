import { render, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { axiosInstance } from '../../utils/axios';

jest.mock('../../utils/env', () => ({ getApiBaseUrl: () => 'http://localhost:3000/api/v1' }));

const TestComponent = () => {
  const { isAuthenticated, admin } = useAuth();
  return (
    <div>
      <span data-testid="auth">{isAuthenticated ? 'yes' : 'no'}</span>
      <span data-testid="admin">{admin ? admin.email : ''}</span>
    </div>
  );
};

describe('AuthProvider (認証状態の維持)', () => {
  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('リロード時にトークンがあれば認証状態を維持する', async () => {
    localStorage.setItem('token', 'dummy-token');
    jest.spyOn(axiosInstance, 'get').mockResolvedValueOnce({
      data: { admin: { id: 1, email: 'test@example.com', name: '管理者' } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: '/api/v1/me' },
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('auth').textContent).toBe('yes');
      expect(getByTestId('admin').textContent).toBe('test@example.com');
    });
  });

  it('リロード時に/meが401なら認証解除される', async () => {
    localStorage.setItem('token', 'dummy-token');
    jest.spyOn(axiosInstance, 'get').mockRejectedValueOnce({ response: { status: 401 } });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('auth').textContent).toBe('no');
      expect(getByTestId('admin').textContent).toBe('');
    });
  });
}); 