import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api';
import { Send, UserPlus, Trash2 } from 'lucide-react';

const SubmitProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectTitle: '',
    studentName: '',
    description: '',
    status: 'pending',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newProject = await createProject(formData);
      navigate(`/project/${newProject._id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to submit project.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container fade-in" style={{ maxWidth: '600px' }}>
      <h1>Submit Your Project</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Enter your project details for evaluation.</p>

      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Project Title</label>
            <input 
              type="text" 
              className="form-input" 
              name="projectTitle" 
              value={formData.projectTitle} 
              onChange={handleTextChange}
              placeholder="e.g. Smart Hack"
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Student Name</label>
              <input 
                type="text" 
                className="form-input" 
                name="studentName" 
                value={formData.studentName} 
                onChange={handleTextChange}
                placeholder="e.g. John Doe"
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Status</label>
              <select 
                className="form-input" 
                name="status" 
                value={formData.status} 
                onChange={handleTextChange}
                style={{ background: 'var(--bg-glass)', color: 'var(--text-primary)' }}
              >
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Project Description</label>
            <textarea 
              className="form-input" 
              name="description" 
              value={formData.description} 
              onChange={handleTextChange}
              placeholder="Briefly describe what your project does..."
              style={{ minHeight: '120px', resize: 'vertical' }}
              required 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : <><Send size={18} /> Submit Project</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitProject;
