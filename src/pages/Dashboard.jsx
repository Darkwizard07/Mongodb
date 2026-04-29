import React, { useEffect, useState } from 'react';
import { getProjects } from '../api';
import { Link } from 'react-router-dom';
import { Users, Code, Trophy, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const calculateScorePercentage = (evaluation) => {
    if (!evaluation || !evaluation.scores || evaluation.scores.length === 0) return 'Unrated';
    
    // In the current backend, Evaluation has a totalScore. 
    // We can show the total score or calculate a percentage if we know the max.
    // Since maxScore was removed from the backend model, let's just show the total score.
    return `Score: ${evaluation.totalScore}`;
  };

  if (loading) {
    return (
      <div className="container">
        <h2 style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
          Loading submissions...
        </h2>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Project Submissions</h1>
          <p>Review and evaluate hackathon submissions</p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <h3>No projects submitted yet</h3>
          <p>Be the first to submit a project to the hackathon.</p>
          <Link to="/submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Submit a Project
          </Link>
        </div>
      ) : (
        <div className="grid-cards">
          {projects.map((project) => (
            <Link to={`/project/${project._id}`} key={project._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-card interactive" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: 'var(--accent-primary)' }}>{project.projectTitle}</h3>
                  <span className="badge">
                    <Trophy size={12} style={{ marginRight: '4px' }} />
                    {calculateScorePercentage(project.evaluation)}
                  </span>
                </div>
                
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <Users size={16} /> Student: <strong style={{ color: 'var(--text-primary)' }}>{project.studentName}</strong>
                </p>
                
                <p style={{ fontSize: '0.9rem', flex: 1, marginTop: '0.5rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  {project.description}
                </p>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Status: <span style={{ color: project.status === 'evaluated' ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 600 }}>{project.status.toUpperCase()}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 500 }}>
                    View Details <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
