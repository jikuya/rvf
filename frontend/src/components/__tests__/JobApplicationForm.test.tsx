import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

  it('renders the form correctly', () => {
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

  it('submits the form with valid data', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {} });

    render(
      <BrowserRouter>
        <JobApplicationForm onSubmit={mockOnSubmit} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/お名前/i), {
      target: { value: 'テスト太郎' }
    });
    fireEvent.change(screen.getByLabelText(/メールアドレス/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/電話番号/i), {
      target: { value: '090-1234-5678' }
    });
    fireEvent.change(screen.getByLabelText(/カバーレター/i), {
      target: { value: 'テストのカバーレターです。' }
    });

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText(/履歴書/i), {
      target: { files: [file] }
    });

    fireEvent.click(screen.getByRole('button', { name: /応募する/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/jobs/'),
        expect.any(FormData),
        expect.any(Object)
      );
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('shows error message when submission fails', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Submission failed'));

    render(
      <BrowserRouter>
        <JobApplicationForm onSubmit={mockOnSubmit} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/お名前/i), {
      target: { value: 'テスト太郎' }
    });
    fireEvent.change(screen.getByLabelText(/メールアドレス/i), {
      target: { value: 'test@example.com' }
    });

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText(/履歴書/i), {
      target: { files: [file] }
    });

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

    expect(screen.getByLabelText(/お名前/i)).toBeInvalid();
    expect(screen.getByLabelText(/メールアドレス/i)).toBeInvalid();
    expect(screen.getByLabelText(/履歴書/i)).toBeInvalid();
  });
}); 