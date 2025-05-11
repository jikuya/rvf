import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Jobs from '../Jobs';

jest.mock('../utils/axios', () => ({
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
    const editButton = await screen.findByText('編集');
    fireEvent.click(editButton);
    // 編集画面に遷移したか
    expect(await screen.findByText('編集画面')).toBeInTheDocument();
  });
}); 