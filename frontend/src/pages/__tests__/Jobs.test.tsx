import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Jobs from '../Jobs';
import Companies from '../Companies';
import Applications from '../Applications';
import ApplicationDetail from '../ApplicationDetail';
import JobApplications from '../JobApplications';
import JobApplicationDetail from '../JobApplicationDetail';
import JobDetail from '../JobDetail';
import JobForm from '../JobForm';
import api from '../../utils/axios';

jest.mock('../../utils/axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [
    { id: 1, title: '求人A', description: 'desc', requirements: '', location: '', salary: '', employment_type: '', status: 'active' }
  ] }))
}));

describe('Jobs', () => {
  it('編集ボタンで編集画面に遷移する', async () => {
    render(
      <MemoryRouter initialEntries={['/jobs']}>
        <Routes>
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:jobId/edit" element={<div>編集画面</div>} />
        </Routes>
      </MemoryRouter>
    );
    // 編集ボタンをクリック
    const editButtons = await screen.findAllByRole('button', { name: '編集' });
    fireEvent.click(editButtons[0]);
    // 編集画面に遷移したか
    expect(await screen.findByText('編集画面')).toBeInTheDocument();
  });
});

describe('Jobs APIリクエスト', () => {
  it('正しいエンドポイントにGETリクエストを送信する', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Jobs />} />
        </Routes>
      </MemoryRouter>
    );
    // api.getが呼ばれたか確認
    expect(api.get).toHaveBeenCalledWith('/api/v1/jobs');
  });
});

describe('Companies APIリクエスト', () => {
  it('正しいエンドポイントにGETリクエストを送信する', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Companies />} />
        </Routes>
      </MemoryRouter>
    );
    expect(api.get).toHaveBeenCalledWith('/api/v1/companies');
  });
});

describe('Applications APIリクエスト', () => {
  it('正しいエンドポイントにGETリクエストを送信する', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Applications />} />
        </Routes>
      </MemoryRouter>
    );
    expect(api.get).toHaveBeenCalledWith('/api/v1/applications');
  });
});

describe('ApplicationDetail APIリクエスト', () => {
  it('正しいエンドポイントにGETリクエストを送信する', async () => {
    render(
      <MemoryRouter initialEntries={["/applications/1"]}>
        <Routes>
          <Route path="/applications/:applicationId" element={<ApplicationDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(api.get).toHaveBeenCalledWith('/api/v1/applications/1');
  });
});

describe('JobApplications APIリクエスト', () => {
  it('正しいエンドポイントにGETリクエストを送信する', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<JobApplications />} />
        </Routes>
      </MemoryRouter>
    );
    expect(api.get).toHaveBeenCalledWith('/api/v1/job_applications');
  });
});

describe('JobApplicationDetail APIリクエスト', () => {
  it('正しいエンドポイントにGETリクエストを送信する', async () => {
    render(
      <MemoryRouter initialEntries={["/job_applications/1"]}>
        <Routes>
          <Route path="/job_applications/:applicationId" element={<JobApplicationDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(api.get).toHaveBeenCalledWith('/api/v1/job_applications/1');
  });
});

describe('JobDetail APIリクエスト', () => {
  it('正しいエンドポイントにGETリクエストを送信する', async () => {
    render(
      <MemoryRouter initialEntries={["/jobs/1"]}>
        <Routes>
          <Route path="/jobs/:jobId" element={<JobDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(api.get).toHaveBeenCalledWith('/api/v1/jobs/1');
  });
});

describe('JobForm APIリクエスト', () => {
  it('新規作成時は会社一覧APIのみ呼ばれる', async () => {
    render(
      <MemoryRouter initialEntries={["/jobs/new"]}>
        <Routes>
          <Route path="/jobs/new" element={<JobForm />} />
        </Routes>
      </MemoryRouter>
    );
    expect(api.get).toHaveBeenCalledWith('/api/v1/companies');
  });
  it('編集時は求人詳細APIと会社一覧APIが呼ばれる', async () => {
    render(
      <MemoryRouter initialEntries={["/jobs/1/edit"]}>
        <Routes>
          <Route path="/jobs/:jobId/edit" element={<JobForm />} />
        </Routes>
      </MemoryRouter>
    );
    expect(api.get).toHaveBeenCalledWith('/api/v1/companies');
    expect(api.get).toHaveBeenCalledWith('/api/v1/jobs/1');
  });
}); 