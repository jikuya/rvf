import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormBuilder from '../FormBuilder';
import type { FormField } from '../../types/form';

describe('FormBuilder', () => {
  const mockFields: FormField[] = [
    {
      id: '1',
      label: 'テスト項目1',
      type: 'text',
      required: true,
    },
    {
      id: '2',
      label: 'テスト項目2',
      type: 'textarea',
      required: false,
    },
  ];

  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<FormBuilder formDefinition={mockFields} onSave={mockOnSave} onCancel={() => {}} />);
    
    expect(screen.getByText('テスト項目1')).toBeInTheDocument();
    expect(screen.getByText('テスト項目2')).toBeInTheDocument();
  });

  it('calls onSave with updated fields when save button is clicked', () => {
    render(<FormBuilder formDefinition={mockFields} onSave={mockOnSave} onCancel={() => {}} />);
    
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalledWith(mockFields);
  });

  it('adds a new field when add button is clicked', () => {
    render(<FormBuilder formDefinition={mockFields} onSave={mockOnSave} onCancel={() => {}} />);
    
    const addButton = screen.getByText('項目を追加');
    fireEvent.click(addButton);
    
    expect(screen.getByText('項目の編集')).toBeInTheDocument();
  });

  it('初期項目が表示される', async () => {
    render(<FormBuilder formDefinition={mockFields} onSave={mockOnSave} onCancel={() => {}} />);
    await waitFor(() => expect(screen.getByText('テスト項目1')).toBeInTheDocument());
  });

  it('項目を編集できる', async () => {
    render(<FormBuilder formDefinition={mockFields} onSave={mockOnSave} onCancel={() => {}} />);
    fireEvent.click(screen.getByText('編集'));
    const input = screen.getByDisplayValue(mockFields[0].label);
    fireEvent.change(input, { target: { value: '名前' } });
    fireEvent.click(screen.getByText('保存'));
    await waitFor(() => expect(screen.getByText('名前')).toBeInTheDocument());
  });

  it('項目を削除できる', async () => {
    render(<FormBuilder formDefinition={mockFields} onSave={mockOnSave} onCancel={() => {}} />);
    fireEvent.click(screen.getByText('編集'));
    fireEvent.click(screen.getByText('削除'));
    await waitFor(() => expect(screen.queryByText('テスト項目1')).not.toBeInTheDocument());
  });
}); 