import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          ATS Resume Analyzer
        </Link>
        {isAuthenticated && (
          <div className="navbar-menu">
            <Link to="/dashboard" className="navbar-link">
              Dashboard
            </Link>
            <Link to="/upload" className="navbar-link">
              Upload Resume
            </Link>
            <Link to="/jobs" className="navbar-link">
              Jobs
            </Link>
            {(user?.role === 'ADMIN' || user?.role === 'RECRUITER') && (
              <Link to="/admin" className="navbar-link">
                Admin Panel
              </Link>
            )}
            <span className="navbar-user">
              {user?.firstName} {user?.lastName}
            </span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
