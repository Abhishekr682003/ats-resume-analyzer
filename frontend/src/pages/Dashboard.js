import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get('/api/resumes/my-resumes');
      setResumes(response.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Welcome, {user?.firstName}!</h1>
        <p>Manage your resumes and analyze them against job descriptions.</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>My Resumes</h2>
          <Link to="/upload" className="btn btn-primary">
            Upload New Resume
          </Link>
        </div>

        {resumes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>No resumes uploaded yet.</p>
            <Link to="/upload" className="btn btn-primary" style={{ marginTop: '20px' }}>
              Upload Your First Resume
            </Link>
          </div>
        ) : (
          <div className="grid">
            {resumes.map((resume) => (
              <div key={resume.id} className="card">
                <h3>{resume.fileName}</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                </p>
                <Link
                  to={`/jobs?resumeId=${resume.id}`}
                  className="btn btn-success"
                  style={{ marginTop: '10px', display: 'inline-block' }}
                >
                  Analyze with Jobs
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/upload" className="btn btn-primary">
            Upload Resume
          </Link>
          <Link to="/jobs" className="btn btn-secondary">
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
