import { useState, useEffect } from 'react';
import FormBuilder from './components/FormBuilder';
import FormPreview from './components/FormPreview';
import FormList from './components/FormList';
import type { Form, FormSubmission } from './types';
import { loadFormsFromLocal, saveFormsToLocal } from './utils';

function App() {
  const [forms, setForms] = useState<Form[]>(loadFormsFromLocal());
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [currentForm, setCurrentForm] = useState<Form | null>(null);

  useEffect(() => {
    saveFormsToLocal(forms);
  }, [forms]);

  const handleSave = (form: Form) => {
    const existingIndex = forms.findIndex(f => f.id === form.id);
    const updatedForms = existingIndex >= 0
      ? forms.map(f => f.id === form.id ? form : f)
      : [...forms, form];
    
    setForms(updatedForms);
    setCurrentForm(form);
  };

  const handleDelete = (id: string) => {
    const updatedForms = forms.filter(f => f.id !== id);
    setForms(updatedForms);
    if (currentForm?.id === id) {
      setCurrentForm(null);
    }
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    if (!currentForm) return;
    
    const newSubmission: FormSubmission = {
      id: `sub-${Date.now()}`,
      formId: currentForm.id,
      data: formData,
      submittedAt: Date.now()
    };
    
    setSubmissions(prev => [...prev, newSubmission]);
    setCurrentForm(null);
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <FormList 
          forms={forms} 
          submissions={submissions}
          onSelect={setCurrentForm} 
          onDelete={handleDelete} 
        />
      </div>
      <div className="main-content">
        <FormBuilder 
          form={currentForm} 
          onSave={handleSave} 
        />
        <FormPreview 
          form={currentForm} 
          onSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
}

export default App;