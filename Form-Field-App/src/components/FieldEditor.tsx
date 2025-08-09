import type { FormField } from '../types';

interface FieldEditorProps {
  field: FormField;
  onChange: (field: FormField) => void;
}

const FieldEditor = ({ field, onChange }: FieldEditorProps) => {
  const updateField = (updates: Partial<FormField>) => {
    onChange({ ...field, ...updates });
  };

  const updateOption = (index: number, value: string) => {
    if (!field.options) return;
    const newOptions = [...field.options];
    newOptions[index] = { ...newOptions[index], label: value };
    updateField({ options: newOptions });
  };

  const addOption = () => {
    const newOption = {
      value: `option${(field.options?.length || 0) + 1}`,
      label: `Option ${(field.options?.length || 0) + 1}`
    };
    updateField({ options: [...(field.options || []), newOption] });
  };

  const removeOption = (index: number) => {
    if (!field.options) return;
    updateField({ options: field.options.filter((_, i) => i !== index) });
  };

  return (
    <>
      <h3>Field Settings: {field.type}</h3>
      
      <div className="form-group">
        <label>Label:</label>
        <input
          value={field.label}
          onChange={(e) => updateField({ label: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Help Text:</label>
        <input
          value={field.helpText || ''}
          onChange={(e) => updateField({ helpText: e.target.value })}
          placeholder="Text to help users complete this field"
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={field.required || false}
            onChange={(e) => updateField({ required: e.target.checked })}
          />
          Required
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={field.disabled || false}
            onChange={(e) => updateField({ disabled: e.target.checked })}
          />
          Disabled
        </label>
      </div>

      {['text', 'email', 'password', 'url', 'tel', 'number'].includes(field.type) && (
        <div className="form-group">
          <label>Placeholder:</label>
          <input
            value={field.placeholder || ''}
            onChange={(e) => updateField({ placeholder: e.target.value })}
          />
        </div>
      )}

      {field.type === 'textarea' && (
        <div className="form-group">
          <label>Rows:</label>
          <input
            type="number"
            min="1"
            value={field.style?.rows || 3}
            onChange={(e) => updateField({ 
              style: { ...field.style, rows: parseInt(e.target.value) || 3 } 
            })}
          />
        </div>
      )}

      {['number', 'range', 'date', 'time', 'datetime-local'].includes(field.type) && (
        <>
          <div className="form-group">
            <label>Minimum Value:</label>
            <input
              type={['date', 'time', 'datetime-local'].includes(field.type) ? field.type : 'number'}
              value={field.validation?.min || ''}
              onChange={(e) => updateField({ 
                validation: { ...field.validation, min: e.target.valueAsNumber } 
              })}
            />
          </div>
          <div className="form-group">
            <label>Maximum Value:</label>
            <input
              type={['date', 'time', 'datetime-local'].includes(field.type) ? field.type : 'number'}
              value={field.validation?.max || ''}
              onChange={(e) => updateField({ 
                validation: { ...field.validation, max: e.target.valueAsNumber } 
              })}
            />
          </div>
        </>
      )}

      {(field.type === 'select' || field.type === 'radio') && (
        <div className="options-editor">
          <h4>Options</h4>
          {field.options?.map((option, index) => (
            <div key={index} className="option-item">
              <input
                value={option.label}
                onChange={(e) => updateOption(index, e.target.value)}
              />
              <button
                className="remove-option"
                onClick={() => removeOption(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button className="add-option" onClick={addOption}>
            Add Option
          </button>
        </div>
      )}

      {field.type === 'file' && (
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={field.validation?.multiple || false}
              onChange={(e) => updateField({ 
                validation: { ...field.validation, multiple: e.target.checked } 
              })}
            />
            Allow multiple files
          </label>
        </div>
      )}
    </>
  );
};

export default FieldEditor;