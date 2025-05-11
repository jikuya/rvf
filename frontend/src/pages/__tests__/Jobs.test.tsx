import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Jobs from '../Jobs';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Jobs', () => {
  const mockJobs = [
    {
      id: 1,
      title: 'フロントエンドエンジニア',
      company: '株式会社テスト',
      location: '東京都',
      description: 'ReactとTypeScriptを使用した開発',
      salary: '400,000円〜600,000円',
      requirements: ['React', 'TypeScript', '3年以上の経験'],
      createdAt: '2024-03-20T00:00:00.000Z',
      updatedAt: '2024-03-20T00:00:00.000Z',
    },
    {
      id: 2,
      title: 'バックエンドエンジニア',
      company: '株式会社テスト2',
      location: '大阪府',
      description: 'Ruby on Railsを使用した開発',
      salary: '450,000円〜650,000円',
      requirements: ['Ruby', 'Ruby on Rails', '3年以上の経験'],
      createdAt: '2024-03-19T00:00:00.000Z',
      updatedAt: '2024-03-19T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders job list correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockJobs, status: 200, statusText: 'OK', headers: {}, config: { url: '/api/v1/jobs' } });

    render(
      <MemoryRouter>
        <Jobs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('フロントエンドエンジニア')).toBeInTheDocument();
      expect(screen.getByText('バックエンドエンジニア')).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('求人情報の取得に失敗しました'));

    render(
      <MemoryRouter>
        <Jobs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('求人情報の取得に失敗しました')).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    // @ts-ignore
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <Jobs />
      </MemoryRouter>
    );

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });
}); 