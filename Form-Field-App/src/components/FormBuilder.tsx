import { useState } from 'react';
import type { Form, FormField, FieldType } from '../types';
import { createNewField } from '../utils';
import FieldEditor from './FieldEditor';

interface FormBuilderProps {
  form: Form | null;
  onSave: (form: Form) => void;
}

const FormBuilder = ({ form, onSave }: FormBuilderProps) => {
  const [title, setTitle] = useState(form?.title || '');
  const [description, setDescription] = useState(form?.description || '');
  const [fields, setFields] = useState<FormField[]>(form?.fields || []);
  const [editingField, setEditingField] = useState<FormField | null>(null);

  const addField = (type: FieldType) => {
    const newField = createNewField(type);
    setFields([newField, ...fields]); 
    setEditingField(newField);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => 
      f.id === id ? { ...f, ...updates } : f
    ));
    if (editingField?.id === id) {
      setEditingField({ ...editingField, ...updates });
    }
  };

  const handleSave = () => {
    onSave({
      id: form?.id || `form-${Date.now()}`,
      title,
      description,
      fields,
      createdAt: form?.createdAt || Date.now(),
      updatedAt: Date.now()
    });
  };

  return (
    <div className="builder-panel">
      <h2>Form Builder</h2>
      
      <div className="form-meta">
        <div className="form-group">
          <label>Form Title:</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter form title"
          />
        </div>
        
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter form description"
            rows={2}
          />
        </div>
      </div>

      <div className="field-types">
        {([
          'text', 'email', 'password', 'url', 'tel',
          'number', 'date', 'textarea', 'select', 'checkbox', 'file'
        ] as FieldType[]).map(type => (
          <button
            key={type}
            className={`field-type-btn ${type}`}
            onClick={() => addField(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="fields-container">
        <div className="fields-list">
          {fields.length === 0 ? (
            <div className="empty-list">No fields added yet</div>
          ) : (
            fields.map(field => (
              <div
                key={field.id}
                className={`field-item ${field.type} ${editingField?.id === field.id ? 'active' : ''}`}
                onClick={() => setEditingField(field)}
              >
                <div className="field-header">
                  <span className="field-type">{field.type}</span>
                  <span className="field-label">{field.label}</span>
                  {field.required && <span className="required-marker">*</span>}
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFields(fields.filter(f => f.id !== field.id));
                    if (editingField?.id === field.id) {
                      setEditingField(null);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {editingField && (
          <div className={`field-editor ${editingField.type}`}>
            <FieldEditor
              field={editingField}
              onChange={(updatedField) => updateField(editingField.id, updatedField)}
            />
          </div>
        )}
      </div>

      <div className="form-actions">
        <button className="save-btn" onClick={handleSave}>
          {form ? 'Update Form' : 'Create Form'}
        </button>
      </div>
    </div>
  );
};

export default FormBuilder;