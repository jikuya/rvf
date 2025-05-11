export type FormFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'file'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  required: boolean;
  options?: string[];
} 