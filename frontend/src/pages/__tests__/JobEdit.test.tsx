import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { JobEdit } from '../JobEdit';
import type { FormField } from '../../types/form';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
}); 