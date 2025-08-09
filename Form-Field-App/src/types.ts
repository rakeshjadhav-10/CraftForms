export type FieldType = 
  | 'text' | 'email' | 'password' | 'url' | 'tel'
  | 'number' | 'range' | 'date' | 'time' | 'datetime-local'
  | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';

export interface Option {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  disabled?: boolean;
  readonly?: boolean;
  defaultValue?: string | number | boolean | string[];
  helpText?: string;
  options?: Option[];
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customMessage?: string;
    multiple?: boolean;
  };
  style?: {
    width?: string;
    cols?: number;
    rows?: number;
  };
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  createdAt: number;
  updatedAt: number;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: number;
}