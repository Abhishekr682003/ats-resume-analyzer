import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a PDF, DOC, or DOCX file');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Resume uploaded successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Error uploading resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Upload Resume</h1>
        <p>Upload your resume in PDF, DOC, or DOCX format for analysis.</p>

        <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
          <div className="form-group">
            <label>Select Resume File</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required
            />
            <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              Supported formats: PDF, DOC, DOCX (Max size: 10MB)
            </p>
          </div>

          {file && (
            <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
              Selected: {file.name}
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !file}
          >
            {loading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeUpload;
