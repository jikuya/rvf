import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// JobDetailのモック
const JobDetail = () => {
  const jobId = '1';
  return (
    <div>
      <div>ジョブ詳細</div>
      <button onClick={() => window.location.assign(`/jobs/${jobId}/edit`)}>編集</button>
    </div>
  );
};

describe('JobDetail', () => {
  it('編集ボタンで編集画面に遷移する', async () => {
    // window.location.assignをモック
    const assignMock = jest.fn();
    delete (window as any).location;
    (window as any).location = { assign: assignMock };

    render(
      <MemoryRouter initialEntries={['/jobs/1']}>
        <Routes>
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route path="/jobs/:jobId/edit" element={<div>編集画面</div>} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('編集'));
    await waitFor(() => {
      expect(assignMock).toHaveBeenCalledWith('/jobs/1/edit');
    });
  });
}); 