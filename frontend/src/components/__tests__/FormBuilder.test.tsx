import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormBuilder } from '../FormBuilder';
import type { FormField } from '../../types/form';

describe('FormBuilder', () => {
  const initialFields: FormField[] = [
    { id: 'field-1', type: 'text', label: '氏名', required: true },
  ];

  it('初期項目が表示される', () => {
    render(<FormBuilder initialFields={initialFields} onSave={jest.fn()} />);
    expect(screen.getByDisplayValue('氏名')).toBeInTheDocument();
  });

  it('項目を追加できる', () => {
    render(<FormBuilder initialFields={[]} onSave={jest.fn()} />);
    fireEvent.click(screen.getByText('項目を追加'));
    expect(screen.getByDisplayValue('新しい項目')).toBeInTheDocument();
  });

  it('項目を編集できる', () => {
    render(<FormBuilder initialFields={initialFields} onSave={jest.fn()} />);
    fireEvent.click(screen.getByText('編集'));
    const input = screen.getByLabelText('ラベル');
    fireEvent.change(input, { target: { value: '名前' } });
    fireEvent.click(screen.getByText('保存'));
    expect(screen.getByDisplayValue('名前')).toBeInTheDocument();
  });

  it('項目を削除できる', () => {
    render(<FormBuilder initialFields={initialFields} onSave={jest.fn()} />);
    fireEvent.click(screen.getByText('編集'));
    fireEvent.click(screen.getByText('削除'));
    // モーダルが閉じるので再度編集ボタンを押す必要がある
    expect(screen.queryByDisplayValue('氏名')).not.toBeInTheDocument();
  });

  it('保存ボタンでonSaveが呼ばれる', () => {
    const onSave = jest.fn();
    render(<FormBuilder initialFields={initialFields} onSave={onSave} />);
    fireEvent.click(screen.getByText('フォームを保存'));
    expect(onSave).toHaveBeenCalled();
  });
}); 