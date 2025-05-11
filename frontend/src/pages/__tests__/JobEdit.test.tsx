import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
// @ts-ignore
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import JobEdit from '../JobEdit';
import type { FormField } from '../../types/form';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ jobId: '1' }),
}));

const mockJob = {
  id: 1,
  title: 'テスト求人',
  form_definition: [
    { id: 'field-1', type: 'text', label: '氏名', required: true }
  ] as FormField[],
};

const mockAxiosResponse = (data: any) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: { url: '/mock' },
});

describe('JobEdit', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue(mockAxiosResponse(mockJob));
    mockedAxios.patch.mockResolvedValue(mockAxiosResponse({}));
  });

  it('ジョブ情報を取得しフォームビルダーに渡す', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/jobs/1/edit']}>
          <Routes>
            <Route path="/jobs/:id/edit" element={<JobEdit />} />
          </Routes>
        </MemoryRouter>
      );
    });
    await waitFor(() => expect(screen.getByText('テスト求人 のフォーム定義編集')).toBeInTheDocument());
    expect(screen.getByText('氏名')).toBeInTheDocument();
  });

  it('フォームを保存ボタンでAPIが呼ばれ、成功メッセージが出る', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/jobs/1/edit']}>
          <Routes>
            <Route path="/jobs/:id/edit" element={<JobEdit />} />
          </Routes>
        </MemoryRouter>
      );
    });
    await waitFor(() => expect(screen.getByText('テスト求人 のフォーム定義編集')).toBeInTheDocument());
    fireEvent.click(screen.getByText('フォームを保存'));
    await waitFor(() => expect(mockedAxios.patch).toHaveBeenCalled());
    expect(screen.getByText('保存しました！')).toBeInTheDocument();
  });

  it('APIエラー時にエラーメッセージが表示される', async () => {
    mockedAxios.patch.mockRejectedValueOnce(new Error('error'));
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/jobs/1/edit']}>
          <Routes>
            <Route path="/jobs/:id/edit" element={<JobEdit />} />
          </Routes>
        </MemoryRouter>
      );
    });
    await waitFor(() => expect(screen.getByText('テスト求人 のフォーム定義編集')).toBeInTheDocument());
    fireEvent.click(screen.getByText('フォームを保存'));
    await waitFor(() => expect(screen.getByText('フォーム定義の保存に失敗しました')).toBeInTheDocument());
  });

  it('renders job edit form correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockJob, status: 200, statusText: 'OK', headers: {}, config: { url: '/api/v1/jobs/1' } });

    render(
      <MemoryRouter>
        <JobEdit />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('タイトル')).toBeInTheDocument();
      expect(screen.getByLabelText('会社名')).toBeInTheDocument();
      expect(screen.getByLabelText('勤務地')).toBeInTheDocument();
      expect(screen.getByLabelText('仕事内容')).toBeInTheDocument();
      expect(screen.getByLabelText('給与')).toBeInTheDocument();
      expect(screen.getByLabelText('応募要件')).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('求人情報の取得に失敗しました'));

    render(
      <MemoryRouter>
        <JobEdit />
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
        <JobEdit />
      </MemoryRouter>
    );

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });
}); 