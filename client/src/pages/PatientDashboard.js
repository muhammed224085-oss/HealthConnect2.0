import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doctorAPI, appointmentAPI, prescriptionAPI } from '../services/api';

function PatientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('book');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    doctorId: '',
    date: '',
    time: '',
    symptoms: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const userType = localStorage.getItem('userType');
    
    if (!userData || userType !== 'patient') {
      navigate('/patient/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    loadData(parsedUser.id);
    loadDoctors();
  }, [navigate]);

  const loadData = async (patientId) => {
    try {
      const [appointmentsRes, prescriptionsRes] = await Promise.all([
        appointmentAPI.getByPatient(patientId),
        prescriptionAPI.getByPatient(patientId)
      ]);
      setAppointments(appointmentsRes.data);
      setPrescriptions(prescriptionsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadDoctors = async () => {
    try {
      const response = await doctorAPI.getAll();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    navigate('/');
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    
    const selectedDoctor = doctors.find(d => d.id === parseInt(appointmentForm.doctorId));
    
    const appointmentData = {
      patientId: user.id,
      doctorId: selectedDoctor.id,
      patientName: user.name,
      doctorName: selectedDoctor.name,
      date: appointmentForm.date,
      time: appointmentForm.time,
      symptoms: appointmentForm.symptoms,
      status: 'PENDING'
    };

    try {
      await appointmentAPI.create(appointmentData);
      alert('Appointment booked successfully!');
      setShowAppointmentForm(false);
      setAppointmentForm({ doctorId: '', date: '', time: '', symptoms: '' });
      loadData(user.id);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div className="navbar">
        <h2>🏥 HealthConnect - Patient Dashboard</h2>
        <div className="navbar-links">
          <Link to="/chat">Chat</Link>
          <Link to="/medicines">Medicines</Link>
          <Link to="/orders">My Orders</Link>
          <button onClick={handleLogout} className="btn" style={{ background: 'white', color: '#007bff' }}>
            Logout
          </button>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <h3>Welcome, {user.name}!</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Age:</strong> {user.age}</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              className={`btn ${activeTab === 'book' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('book')}
            >
              Book Appointment
            </button>
            <button 
              className={`btn ${activeTab === 'appointments' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('appointments')}
            >
              My Appointments ({appointments.length})
            </button>
            <button 
              className={`btn ${activeTab === 'prescriptions' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('prescriptions')}
            >
              Prescriptions ({prescriptions.length})
            </button>
          </div>

          {activeTab === 'book' && (
            <div>
              <h3>Available Doctors</h3>
              {doctors.length === 0 ? (
                <p>No doctors available.</p>
              ) : (
                <div>
                  {doctors.map(doctor => (
                    <div key={doctor.id} className="card" style={{ marginBottom: '15px' }}>
                      <h4>{doctor.name}</h4>
                      <p><strong>Specialization:</strong> {doctor.specialization}</p>
                      <p><strong>Experience:</strong> {doctor.experience}</p>
                      <p><strong>Qualification:</strong> {doctor.qualification}</p>
                      <button 
                        className="btn btn-success"
                        onClick={() => {
                          setAppointmentForm({...appointmentForm, doctorId: doctor.id});
                          setShowAppointmentForm(true);
                        }}
                      >
                        Book Appointment
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <h3>My Appointments</h3>
              {appointments.length === 0 ? (
                <p>No appointments booked yet.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Symptoms</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(appointment => (
                      <tr key={appointment.id}>
                        <td>{appointment.doctorName}</td>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.symptoms}</td>
                        <td>
                          <span className={`badge badge-${appointment.status.toLowerCase()}`}>
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div>
              <h3>My Prescriptions</h3>
              {prescriptions.length === 0 ? (
                <p>No prescriptions yet.</p>
              ) : (
                <div>
                  {prescriptions.map(prescription => (
                    <div key={prescription.id} className="card">
                      <h4>Dr. {prescription.doctorName}</h4>
                      <p><strong>Date:</strong> {prescription.date}</p>
                      <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                      <p><strong>Medicines:</strong> {prescription.medicines}</p>
                      <p><strong>Instructions:</strong> {prescription.instructions}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {showAppointmentForm && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{ maxWidth: '600px', width: '90%' }}>
              <h3>Book Appointment</h3>
              <form onSubmit={handleAppointmentSubmit}>
                <div className="form-group">
                  <label>Doctor *</label>
                  <select
                    value={appointmentForm.doctorId}
                    onChange={(e) => setAppointmentForm({...appointmentForm, doctorId: e.target.value})}
                    required
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <input
                    type="time"
                    value={appointmentForm.time}
                    onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Symptoms *</label>
                  <textarea
                    value={appointmentForm.symptoms}
                    onChange={(e) => setAppointmentForm({...appointmentForm, symptoms: e.target.value})}
                    required
                    rows="4"
                    placeholder="Describe your symptoms"
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-success">Book Appointment</button>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={() => setShowAppointmentForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;
