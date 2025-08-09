import type { Form, FormSubmission } from '../types';

interface FormListProps {
  forms: Form[];
  submissions: FormSubmission[];
  onSelect: (form: Form) => void;
  onDelete: (id: string) => void;
}

const FormList = ({ forms, submissions, onSelect, onDelete }: FormListProps) => {
  const getSubmissionCount = (formId: string) => {
    return submissions.filter(s => s.formId === formId).length;
  };

  return (
    <div className="list-panel">
      <h2>Your Forms</h2>
      <div className="forms-container">
        {forms.length === 0 ? (
          <div className="empty-list">No forms created yet</div>
        ) : (
          forms.map(form => (
            <div 
              key={form.id} 
              className="form-card"
              onClick={() => onSelect(form)}
            >
              <div className="card-header">
                <h3 className="form-title">{form.title}</h3>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(form.id);
                  }}
                >
                  Delete
                </button>
              </div>
              
              <div className="form-meta">
                <div className="meta-item">
                  <span className="meta-label">Fields:</span>
                  <span className="meta-value">{form.fields.length}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Submissions:</span>
                  <span className="meta-value">{getSubmissionCount(form.id)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Last Updated:</span>
                  <span className="meta-value">
                    {new Date(form.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FormList;