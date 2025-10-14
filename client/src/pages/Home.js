import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <div className="navbar">
        <h2>🏥 HealthConnect</h2>
      </div>
      
      <div className="container" style={{ marginTop: '50px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '20px', color: '#007bff' }}>
          Welcome to HealthConnect
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '40px', color: '#666' }}>
          Your trusted platform for doctor-patient communication and medicine delivery
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '50px' }}>
          {/* Doctor Section */}
          <div className="card" style={{ width: '400px', padding: '30px' }}>
            <h2 style={{ color: '#007bff', marginBottom: '20px' }}>👨‍⚕️ For Doctors</h2>
            <p style={{ marginBottom: '30px', color: '#666' }}>
              Manage appointments, communicate with patients, and upload prescriptions
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Link to="/doctor/login">
                <button className="btn btn-primary">Login</button>
              </Link>
              <Link to="/doctor/register">
                <button className="btn btn-success">Register</button>
              </Link>
            </div>
          </div>
          
          {/* Patient Section */}
          <div className="card" style={{ width: '400px', padding: '30px' }}>
            <h2 style={{ color: '#28a745', marginBottom: '20px' }}>🧑‍💼 For Patients</h2>
            <p style={{ marginBottom: '30px', color: '#666' }}>
              Book appointments, chat with doctors, and order medicines online
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Link to="/patient/login">
                <button className="btn btn-primary">Login</button>
              </Link>
              <Link to="/patient/register">
                <button className="btn btn-success">Register</button>
              </Link>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '60px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Features</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
            <div style={{ width: '250px' }}>
              <h4>📅 Appointment Booking</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Easy online appointment scheduling
              </p>
            </div>
            <div style={{ width: '250px' }}>
              <h4>💬 Real-time Chat</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Direct communication with doctors
              </p>
            </div>
            <div style={{ width: '250px' }}>
              <h4>💊 Medicine Delivery</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Order medicines and track delivery
              </p>
            </div>
            <div style={{ width: '250px' }}>
              <h4>📋 Prescriptions</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Digital prescription management
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
