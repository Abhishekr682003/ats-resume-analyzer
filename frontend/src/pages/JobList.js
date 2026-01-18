import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('resumeId');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = (jobId) => {
    if (resumeId) {
      navigate(`/analysis/${resumeId}/${jobId}`);
    } else {
      alert('Please select a resume from the dashboard first');
    }
  };

  if (loading) {
    return <div className="loading">Loading jobs...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Available Jobs</h1>
        {resumeId && (
          <p style={{ color: '#28a745' }}>
            Resume selected. Click "Analyze" on any job to see match results.
          </p>
        )}
        {!resumeId && (
          <p style={{ color: '#ffc107' }}>
            Go to Dashboard and select a resume to analyze it against jobs.
          </p>
        )}
      </div>

      {jobs.length === 0 ? (
        <div className="card">
          <p>No jobs available at the moment.</p>
        </div>
      ) : (
        <div className="grid">
          {jobs.map((job) => (
            <div key={job.id} className="card">
              <h3>{job.title}</h3>
              <p style={{ color: '#666', fontWeight: 'bold' }}>{job.company}</p>
              <p style={{ color: '#666' }}>{job.location}</p>
              {job.minExperience && (
                <p style={{ color: '#666', fontSize: '14px' }}>
                  Experience: {job.minExperience}+ years
                </p>
              )}
              <p style={{ marginTop: '10px', fontSize: '14px' }}>
                {job.description.substring(0, 150)}...
              </p>
              <button
                onClick={() => handleAnalyze(job.id)}
                className="btn btn-primary"
                style={{ marginTop: '15px' }}
                disabled={!resumeId}
              >
                {resumeId ? 'Analyze Match' : 'Select Resume First'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
