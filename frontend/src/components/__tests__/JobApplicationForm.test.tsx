import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import JobApplicationForm from '../JobApplicationForm';
import axios from 'axios';
import type { FormField } from '../../types/form';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// axios.createのモックを追加
const mockInterceptors = {
  request: { use: jest.fn(), eject: jest.fn() },
  response: { use: jest.fn(), eject: jest.fn() },
};
mockedAxios.create.mockReturnValue({
  interceptors: mockInterceptors,
  post: jest.fn(),
} as unknown as typeof axios);

describe('JobApplicationForm', () => {
  const mockFields: FormField[] = [
    {
      id: '1',
      label: '氏名',
      type: 'text',
      required: true,
    },
    {
      id: '2',
      label: 'メールアドレス',
      type: 'email',
      required: true,
    },
  ];

  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(
      <JobApplicationForm
        formDefinition={mockFields}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByLabelText(/氏名/)).toBeInTheDocument();
    expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument();
  });

  it('submits form data correctly', async () => {
    render(
      <JobApplicationForm
        formDefinition={mockFields}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText(/氏名/), {
      target: { value: 'テスト太郎' },
    });
    fireEvent.change(screen.getByLabelText(/メールアドレス/), {
      target: { value: 'test@example.com' },
    });

    await userEvent.click(screen.getByText('応募する'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        '1': 'テスト太郎',
        '2': 'test@example.com',
      });
    });
  });

  it('shows error message when submission fails', async () => {
    const mockOnSubmitWithError = jest.fn().mockRejectedValueOnce(() => {
      throw new Error('送信に失敗しました');
    });

    render(
      <BrowserRouter>
        <JobApplicationForm onSubmit={mockOnSubmitWithError} formDefinition={mockFields} />
      </BrowserRouter>
    );

    await userEvent.click(screen.getByText('応募する'));

    await waitFor(() => {
      const errorMessage = screen.getByText('送信に失敗しました');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('renders all form fields', () => {
    render(
      <BrowserRouter>
        <JobApplicationForm onSubmit={mockOnSubmit} formDefinition={mockFields} />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/氏名/)).toBeInTheDocument();
    expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument();
  });

  it('submits form data successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} as any });

    render(
      <MemoryRouter initialEntries={['/jobs/1']}>
        <Routes>
          <Route path="/jobs/:jobId" element={<JobApplicationForm onSubmit={mockOnSubmit} formDefinition={mockFields} />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/氏名/), {
      target: { value: 'テスト太郎' },
    });
    fireEvent.change(screen.getByLabelText(/メールアドレス/), {
      target: { value: 'test@example.com' },
    });

    await userEvent.click(screen.getByRole('button', { name: /応募する/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('handles submission error', async () => {
    const mockOnSubmitWithError = jest.fn().mockRejectedValueOnce(() => {
      throw new Error('送信に失敗しました');
    });

    render(
      <BrowserRouter>
        <JobApplicationForm onSubmit={mockOnSubmitWithError} formDefinition={mockFields} />
      </BrowserRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: /応募する/i }));

    await waitFor(() => {
      const errorMessage = screen.getByText('送信に失敗しました');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(
      <BrowserRouter>
        <JobApplicationForm onSubmit={mockOnSubmit} formDefinition={mockFields} />
      </BrowserRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: /応募する/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/氏名/)).toBeInvalid();
      expect(screen.getByLabelText(/メールアドレス/)).toBeInvalid();
    });
  });
}); 