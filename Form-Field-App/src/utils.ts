import type { FormField, FieldType, Form } from './types';

export const createNewField = (type: FieldType): FormField => {
  const baseField = {
    id: `field-${Date.now()}`,
    type,
    label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
    required: false,
    disabled: false,
    readonly: false
  };

  const typeSpecifics: Partial<FormField> = {};

  switch (type) {
    case 'select':
    case 'radio':
      typeSpecifics.options = [{ value: 'option1', label: 'Option 1' }];
      break;
    case 'number':
    case 'range':
      typeSpecifics.validation = { min: 0, max: 100 };
      break;
    case 'textarea':
      typeSpecifics.style = { rows: 3 };
      break;
    case 'file':
      typeSpecifics.validation = { multiple: false };
      break;
  }

  return { ...baseField, ...typeSpecifics };
};

export const saveFormsToLocal = (forms: Form[]) => {
  localStorage.setItem('forms', JSON.stringify(forms));
};

export const loadFormsFromLocal = (): Form[] => {
  const saved = localStorage.getItem('forms');
  return saved ? JSON.parse(saved) : [];
};

export const validateField = (field: FormField, value: any): string | null => {
  if (field.required && !value) {
    return field.validation?.customMessage || 'This field is required';
  }

  if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Please enter a valid email address';
  }

  if (field.validation) {
    if (field.validation.min !== undefined && Number(value) < field.validation.min) {
      return `Minimum value is ${field.validation.min}`;
    }
    if (field.validation.max !== undefined && Number(value) > field.validation.max) {
      return `Maximum value is ${field.validation.max}`;
    }
    if (field.validation.minLength && String(value).length < field.validation.minLength) {
      return `Minimum length is ${field.validation.minLength}`;
    }
    if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
      return field.validation.customMessage || 'Invalid format';
    }
  }

  return null;
};