import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, evaluateProject } from '../api';
import { ExternalLink, Users, Calendar, Award, Star, CheckCircle } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Evaluation Form State
  const [evaluator, setEvaluator] = useState({ name: '', email: '' });
  const [scores, setScores] = useState([
    { criteria: 'Technical Complexity', score: 5 },
    { criteria: 'Design & UX', score: 5 },
    { criteria: 'Pitch & Demo', score: 5 }
  ]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showEvalForm, setShowEvalForm] = useState(false);

  useEffect(() => {
    getProjectById(id)
      .then(data => {
        setProject(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        navigate('/');
      });
  }, [id, navigate]);

  const handleScoreChange = (index, newValue) => {
    const newScores = [...scores];
    newScores[index].score = Number(newValue);
    setScores(newScores);
  };

  const submitEvaluation = async (e) => {
    e.preventDefault();
    setIsEvaluating(true);
    
    // Calculate total score for the backend
    const totalScore = scores.reduce((acc, curr) => acc + curr.score, 0);

    const evaluationPayload = {
      evaluatorId: evaluator.email,
      evaluatorName: evaluator.name,
      scores: scores.map(s => ({ 
        criteria: s.criteria, 
        score: s.score,
        comments: "" // Defaulting to empty as per schema
      })),
      totalScore: totalScore
    };
    
    try {
      const updatedProject = await evaluateProject(project._id, evaluationPayload);
      setProject(updatedProject);
      setShowEvalForm(false);
      // Reset form
      setEvaluator({ name: '', email: '' });
      setScores(scores.map(s => ({ ...s, score: 5 })));
    } catch (error) {
      console.error("Evaluation error:", error);
      alert("Failed to submit evaluation");
    } finally {
      setIsEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h2 style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
          Loading project details...
        </h2>
      </div>
    );
  }

  const ev = project.evaluation;

  return (
    <div className="container fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Project Details */}
        <div>
          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ textAlign: 'left', margin: 0, fontSize: '2rem' }}>{project.projectTitle}</h1>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  <Users size={18} color="var(--accent-primary)" /> Student: <strong>{project.studentName}</strong>
                </p>
              </div>
              
              {ev && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Score</span>
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {ev.totalScore}
                  </span>
                </div>
              )}
            </div>

            <div style={{ margin: '1.5rem 0', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.6' }}>{project.description}</p>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', fontWeight: 600, color: project.status === 'evaluated' ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                  {project.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Current Evaluation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Award size={24} /> Evaluation</h2>
            {!showEvalForm && (
              <button className="btn btn-primary" onClick={() => setShowEvalForm(true)}>
                <Star size={16} /> {ev ? 'Update Evaluation' : 'Evaluate Project'}
              </button>
            )}
          </div>

          {!ev ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <p>No evaluation yet. Be the first to evaluate this project!</p>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, color: 'var(--accent-primary)' }}>{ev.evaluatorName}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ev.evaluatorId}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                {ev.scores.map((s, sIdx) => (
                  <div key={sIdx} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>{s.criteria}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.score}</div>
                    {s.comments && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>{s.comments}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Evaluation Form */}
        <div>
          {showEvalForm && (
            <div className="glass-card fade-in" style={{ position: 'sticky', top: '100px' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={20} color="var(--accent-primary)" /> {ev ? 'Update' : 'Submit'} Evaluation
              </h3>
              
              <form onSubmit={submitEvaluation}>
                <div className="form-group">
                  <label className="form-label">Evaluator Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={evaluator.name} 
                    onChange={e => setEvaluator({...evaluator, name: e.target.value})} 
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Evaluator Email (ID)</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    required 
                    value={evaluator.email} 
                    onChange={e => setEvaluator({...evaluator, email: e.target.value})} 
                  />
                </div>

                <div style={{ margin: '2rem 0' }}>
                  <h4 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>Scoring Criteria</h4>
                  {scores.map((scoreObj, index) => (
                    <div key={index} className="form-group" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <label className="form-label" style={{ margin: 0 }}>{scoreObj.criteria}</label>
                        <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{scoreObj.score}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={scoreObj.score} 
                        onChange={(e) => handleScoreChange(index, e.target.value)} 
                      />
                    </div>
                  ))}
                  <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                    <strong>Total Score: {scores.reduce((a, b) => a + b.score, 0)}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowEvalForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isEvaluating}>
                    {isEvaluating ? 'Saving...' : <><CheckCircle size={18} /> Submit</>}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
