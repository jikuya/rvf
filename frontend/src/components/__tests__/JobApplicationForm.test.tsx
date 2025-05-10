import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import JobApplicationForm from '../JobApplicationForm';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('JobApplicationForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(
      <BrowserRouter>
        <JobApplicationForm onSubmit={mockOnSubmit} />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/お名前/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/電話番号/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/カバーレター/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/履歴書/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /応募する/i })).toBeInTheDocument();
  });

  it('submits form data successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} as any });

    render(
      <BrowserRouter>
        <JobApplicationForm onSubmit={mockOnSubmit} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/お名前/i), {
      target: { value: 'テスト太郎' },
    });
    fireEvent.change(screen.getByLabelText(/メールアドレス/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/電話番号/i), {
      target: { value: '090-1234-5678' },
    });
    fireEvent.change(screen.getByLabelText(/カバーレター/i), {
      target: { value: 'テストのカバーレター' },
    });

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/履歴書/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /応募する/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('handles submission error', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

    render(
      <BrowserRouter>
        <JobApplicationForm onSubmit={mockOnSubmit} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/お名前/i), {
      target: { value: 'テスト太郎' },
    });
    fireEvent.change(screen.getByLabelText(/メールアドレス/i), {
      target: { value: 'test@example.com' },
    });

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/履歴書/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /応募する/i }));

    await waitFor(() => {
      expect(screen.getByText(/応募の送信に失敗しました/i)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(
      <BrowserRouter>
        <JobApplicationForm onSubmit={mockOnSubmit} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /応募する/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/お名前/i)).toBeInvalid();
      expect(screen.getByLabelText(/メールアドレス/i)).toBeInvalid();
      expect(screen.getByLabelText(/履歴書/i)).toBeInvalid();
    });
  });
}); 