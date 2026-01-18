import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    company: '',
    location: '',
    minExperience: '',
    qualifications: '',
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        minExperience: formData.minExperience ? parseInt(formData.minExperience) : null,
        qualifications: formData.qualifications.split(',').map(s => s.trim()).filter(s => s),
      };

      if (editingJob) {
        await axios.put(`/api/jobs/${editingJob.id}`, jobData);
      } else {
        await axios.post('/api/jobs', jobData);
      }

      setShowForm(false);
      setEditingJob(null);
      setFormData({
        title: '',
        description: '',
        requiredSkills: '',
        company: '',
        location: '',
        minExperience: '',
        qualifications: '',
      });
      fetchJobs();
    } catch (error) {
      alert('Error saving job: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      requiredSkills: parseSkills(job.requiredSkills).join(', '),
      company: job.company,
      location: job.location,
      minExperience: job.minExperience || '',
      qualifications: job.qualifications ? parseSkills(job.qualifications).join(', ') : '',
    });
    setShowForm(true);
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`/api/jobs/${jobId}`);
        fetchJobs();
      } catch (error) {
        alert('Error deleting job: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const parseSkills = (skillsJson) => {
    try {
      return JSON.parse(skillsJson || '[]');
    } catch {
      return [];
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Admin Panel - Job Management</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingJob(null);
              setFormData({
                title: '',
                description: '',
                requiredSkills: '',
                company: '',
                location: '',
                minExperience: '',
                qualifications: '',
              });
            }}
            className="btn btn-primary"
          >
            {showForm ? 'Cancel' : 'Add New Job'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h2>{editingJob ? 'Edit Job' : 'Create New Job'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Required Skills (comma-separated)</label>
              <input
                type="text"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                placeholder="Java, Python, React, etc."
                required
              />
            </div>
            <div className="form-group">
              <label>Minimum Experience (years)</label>
              <input
                type="number"
                name="minExperience"
                value={formData.minExperience}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Qualifications (comma-separated)</label>
              <input
                type="text"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="Bachelor's degree, etc."
              />
            </div>
            <button type="submit" className="btn btn-success">
              {editingJob ? 'Update Job' : 'Create Job'}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <h2>All Jobs ({jobs.length})</h2>
        {jobs.length === 0 ? (
          <p>No jobs available. Create your first job posting above.</p>
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
                  {job.description.substring(0, 100)}...
                </p>
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleEdit(job)}
                    className="btn btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
