import { useState } from 'react';
import type { Form, FormField } from '../types';
import { validateField } from '../utils';

interface FormPreviewProps {
  form: Form | null;
  onSubmit: (formData: Record<string, any>) => void;
}

const FormPreview = ({ form, onSubmit }: FormPreviewProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    setErrors(prev => ({ ...prev, [fieldId]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const newErrors: Record<string, string> = {};
    form.fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      setFormData({});
      setErrors({});
    }
  };

  if (!form) {
    return <div className="preview-empty">No form selected</div>;
  }

  return (
    <div className="preview-panel">
      <h2>{form.title}</h2>
      {form.description && <p className="form-description">{form.description}</p>}
      
      <form onSubmit={handleSubmit}>
        {form.fields.map(field => (
          <div 
            key={field.id} 
            className={`form-field ${field.type} ${errors[field.id] ? 'has-error' : ''}`}
          >
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            
            {renderFieldInput(field, formData[field.id], (value) => handleChange(field.id, value))}
            
            {field.helpText && <div className="help-text">{field.helpText}</div>}
            {errors[field.id] && <div className="error-message">{errors[field.id]}</div>}
          </div>
        ))}
        
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

function renderFieldInput(
  field: FormField,
  value: any,
  onChange: (value: any) => void
) {
  const commonProps = {
    id: field.id,
    name: field.id,
    disabled: field.disabled,
    required: field.required,
    placeholder: field.placeholder,
    value: value || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
      onChange(e.target.value),
    className: 'form-input'
  };

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'url':
    case 'tel':
      return (
        <input
          type={field.type}
          {...commonProps}
          minLength={field.validation?.minLength}
          maxLength={field.validation?.maxLength}
          pattern={field.validation?.pattern}
        />
      );

    case 'number':
    case 'range':
      return (
        <>
          <input
            type={field.type}
            {...commonProps}
            min={field.validation?.min}
            max={field.validation?.max}
            onChange={(e) => onChange(e.target.valueAsNumber)}
          />
          {field.type === 'range' && <output>{value || 0}</output>}
        </>
      );

    case 'date':
    case 'time':
    case 'datetime-local':
      return (
        <input
          type={field.type}
          {...commonProps}
          min={field.validation?.min?.toString()}
          max={field.validation?.max?.toString()}
        />
      );

    case 'textarea':
      return (
        <textarea
          {...commonProps}
          rows={field.style?.rows || 3}
          cols={field.style?.cols}
        />
      );

    case 'select':
      return (
        <select
          {...commonProps}
          multiple={field.validation?.multiple}
          value={value || []}
          onChange={(e) => {
            const options = e.target.options;
            const selected = [];
            for (let i = 0; i < options.length; i++) {
              if (options[i].selected) {
                selected.push(options[i].value);
              }
            }
            onChange(field.validation?.multiple ? selected : selected[0]);
          }}
        >
          {field.options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case 'checkbox':
      return (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          disabled={field.disabled}
          required={field.required}
          className="form-input"
        />
      );

    case 'radio':
      return (
        <div className="radio-group">
          {field.options?.map(option => (
            <label key={option.value}>
              <input
                type="radio"
                name={field.id}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                disabled={field.disabled}
                required={field.required}
                className="form-input"
              />
              {option.label}
            </label>
          ))}
        </div>
      );

    case 'file':
      return (
        <input
          type="file"
          multiple={field.validation?.multiple}
          onChange={(e) => onChange(e.target.files)}
          disabled={field.disabled}
          required={field.required}
          className="form-input"
        />
      );

    default:
      return <input type="text" {...commonProps} />;
  }
}

export default FormPreview;