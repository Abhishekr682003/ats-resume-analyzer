import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

const AnalysisResult = () => {
  const { resumeId, jobId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalysis();
  }, [resumeId, jobId]);

  const fetchAnalysis = async () => {
    try {
      const response = await axios.post('/api/analysis/analyze', null, {
        params: { resumeId, jobId },
      });
      setResult(response.data);
    } catch (error) {
      setError('Error analyzing resume: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Analyzing resume...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="error-message">{error}</div>
          <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return <div className="loading">No results found</div>;
  }

  const pieData = [
    { name: 'Match', value: result.matchPercentage },
    { name: 'Missing', value: 100 - result.matchPercentage },
  ];

  const skillData = [
    { name: 'Matched Skills', value: result.matchedSkills.length },
    { name: 'Missing Skills', value: result.missingSkills.length },
  ];

  const COLORS = ['#28a745', '#dc3545'];

  return (
    <div className="container">
      <div className="card">
        <h1>Resume Analysis Results</h1>
        <p><strong>Job:</strong> {result.jobTitle}</p>
      </div>

      <div className="card">
        <h2>Match Percentage</h2>
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#007bff' }}>
            {result.matchPercentage.toFixed(1)}%
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <h3>Matched Skills ({result.matchedSkills.length})</h3>
          {result.matchedSkills.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {result.matchedSkills.map((skill, index) => (
                <li
                  key={index}
                  style={{
                    padding: '8px',
                    margin: '5px 0',
                    background: '#d4edda',
                    borderRadius: '4px',
                    color: '#155724',
                  }}
                >
                  ✓ {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#666' }}>No matched skills found.</p>
          )}
        </div>

        <div className="card">
          <h3>Missing Skills ({result.missingSkills.length})</h3>
          {result.missingSkills.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {result.missingSkills.map((skill, index) => (
                <li
                  key={index}
                  style={{
                    padding: '8px',
                    margin: '5px 0',
                    background: '#f8d7da',
                    borderRadius: '4px',
                    color: '#721c24',
                  }}
                >
                  ✗ {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#666' }}>No missing skills. Great job!</p>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Skill Improvement Suggestions</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {result.skillSuggestions.map((suggestion, index) => (
            <li
              key={index}
              style={{
                padding: '12px',
                margin: '8px 0',
                background: '#fff3cd',
                borderRadius: '4px',
                borderLeft: '4px solid #ffc107',
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/jobs" className="btn btn-secondary">
            Back to Jobs
          </Link>
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
