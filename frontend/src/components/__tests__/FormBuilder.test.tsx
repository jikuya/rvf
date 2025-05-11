import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormBuilder } from '../FormBuilder';
import type { FormField } from '../../types/form';

describe('FormBuilder', () => {
  const initialFields: FormField[] = [
    { id: 'field-1', type: 'text', label: '氏名', required: true },
  ];

  it('初期項目が表示される', async () => {
    render(<FormBuilder initialFields={initialFields} onSave={jest.fn()} />);
    await waitFor(() => expect(screen.getByText('氏名')).toBeInTheDocument());
  });

  it('項目を追加できる', async () => {
    render(<FormBuilder initialFields={[]} onSave={jest.fn()} />);
    fireEvent.click(screen.getByText('項目を追加'));
    await waitFor(() => expect(screen.getByDisplayValue('新しい項目')).toBeInTheDocument());
  });

  it('項目を編集できる', async () => {
    render(<FormBuilder initialFields={initialFields} onSave={jest.fn()} />);
    fireEvent.click(screen.getByText('編集'));
    const input = screen.getByDisplayValue(initialFields[0].label);
    fireEvent.change(input, { target: { value: '名前' } });
    fireEvent.click(screen.getByText('保存'));
    await waitFor(() => expect(screen.getByText('名前')).toBeInTheDocument());
  });

  it('項目を削除できる', async () => {
    render(<FormBuilder initialFields={initialFields} onSave={jest.fn()} />);
    fireEvent.click(screen.getByText('編集'));
    fireEvent.click(screen.getByText('削除'));
    await waitFor(() => expect(screen.queryByText('氏名')).not.toBeInTheDocument());
  });

  it('保存ボタンでonSaveが呼ばれる', async () => {
    const onSave = jest.fn();
    render(<FormBuilder initialFields={initialFields} onSave={onSave} />);
    fireEvent.click(screen.getByText('フォームを保存'));
    await waitFor(() => expect(onSave).toHaveBeenCalled());
  });
}); 