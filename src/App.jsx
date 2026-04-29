import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Terminal, Lightbulb, User, LayoutDashboard, PlusCircle } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import SubmitProject from './pages/SubmitProject';
import ProjectDetails from './pages/ProjectDetails';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Terminal size={24} color="#6366f1" />
        <span>HackManager</span>
      </Link>
      <div className="navbar-nav">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={18} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
          Dashboard
        </Link>
        <Link to="/submit" className={`nav-link ${location.pathname === '/submit' ? 'active' : ''}`}>
          <PlusCircle size={18} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
          Submit Project
        </Link>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main className="fade-in" style={{ padding: '2rem 0' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/submit" element={<SubmitProject />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
