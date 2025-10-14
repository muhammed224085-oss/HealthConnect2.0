import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { patientAPI } from '../services/api';

function PatientRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    address: '',
    medicalHistory: ''
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
      await patientAPI.register(formData);
      alert('Registration successful! Please login.');
      navigate('/patient/login');
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
          <h2 style={{ textAlign: 'center', color: '#28a745', marginBottom: '30px' }}>
            Patient Registration
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
                placeholder="John Doe"
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
              <label>Age *</label>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                placeholder="25"
              />
            </div>
            
            <div className="form-group">
              <label>Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="2"
                placeholder="123 Main St, City"
              />
            </div>
            
            <div className="form-group">
              <label>Medical History</label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                rows="3"
                placeholder="Any allergies, previous conditions, etc."
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
            <Link to="/patient/login" style={{ color: '#28a745' }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PatientRegister;
