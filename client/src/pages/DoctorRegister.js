import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doctorAPI } from '../services/api';

function DoctorRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    phone: '',
    experience: '',
    qualification: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await doctorAPI.register(formData);
      alert('Registration successful! Please login.');
      navigate('/doctor/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="navbar">
        <h2>🏥 HealthConnect</h2>
        <Link to="/">
          <button className="btn" style={{ background: 'white', color: '#007bff' }}>
            Back to Home
          </button>
        </Link>
      </div>
      
      <div className="container" style={{ maxWidth: '600px', marginTop: '30px' }}>
        <div className="card">
          <h2 style={{ textAlign: 'center', color: '#007bff', marginBottom: '30px' }}>
            Doctor Registration
          </h2>
          
          {error && <div className="error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Dr. John Doe"
              />
            </div>
            
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john.doe@email.com"
              />
            </div>
            
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
              />
            </div>
            
            <div className="form-group">
              <label>Specialization *</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                placeholder="e.g., Cardiology, Pediatrics"
              />
            </div>
            
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+1-555-0123"
              />
            </div>
            
            <div className="form-group">
              <label>Experience *</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                placeholder="e.g., 5 years"
              />
            </div>
            
            <div className="form-group">
              <label>Qualification *</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
                placeholder="e.g., MBBS, MD"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-success" 
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Already have an account?{' '}
            <Link to="/doctor/login" style={{ color: '#007bff' }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default DoctorRegister;
