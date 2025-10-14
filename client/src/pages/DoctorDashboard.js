import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { appointmentAPI, prescriptionAPI } from '../services/api';

function DoctorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments');
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: '',
    medicines: '',
    instructions: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const userType = localStorage.getItem('userType');
    
    if (!userData || userType !== 'doctor') {
      navigate('/doctor/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    loadData(parsedUser.id);
  }, [navigate]);

  const loadData = async (doctorId) => {
    try {
      const [appointmentsRes, prescriptionsRes] = await Promise.all([
        appointmentAPI.getByDoctor(doctorId),
        prescriptionAPI.getByDoctor(doctorId)
      ]);
      setAppointments(appointmentsRes.data);
      setPrescriptions(prescriptionsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    navigate('/');
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await appointmentAPI.updateStatus(appointmentId, newStatus);
      loadData(user.id);
      alert('Appointment status updated!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleCreatePrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionForm(true);
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    
    const prescriptionData = {
      appointmentId: selectedAppointment.id,
      doctorId: user.id,
      patientId: selectedAppointment.patientId,
      doctorName: user.name,
      patientName: selectedAppointment.patientName,
      diagnosis: prescriptionForm.diagnosis,
      medicines: prescriptionForm.medicines,
      instructions: prescriptionForm.instructions,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      await prescriptionAPI.create(prescriptionData);
      alert('Prescription created successfully!');
      setShowPrescriptionForm(false);
      setPrescriptionForm({ diagnosis: '', medicines: '', instructions: '' });
      loadData(user.id);
    } catch (error) {
      console.error('Error creating prescription:', error);
      alert('Failed to create prescription');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div className="navbar">
        <h2>🏥 HealthConnect - Doctor Dashboard</h2>
        <div className="navbar-links">
          <Link to="/chat">Chat</Link>
          <button onClick={handleLogout} className="btn" style={{ background: 'white', color: '#007bff' }}>
            Logout
          </button>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <h3>Welcome, {user.name}!</h3>
          <p><strong>Specialization:</strong> {user.specialization}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              className={`btn ${activeTab === 'appointments' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('appointments')}
            >
              Appointments ({appointments.length})
            </button>
            <button 
              className={`btn ${activeTab === 'prescriptions' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('prescriptions')}
            >
              Prescriptions ({prescriptions.length})
            </button>
          </div>

          {activeTab === 'appointments' && (
            <div>
              <h3>My Appointments</h3>
              {appointments.length === 0 ? (
                <p>No appointments yet.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Symptoms</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(appointment => (
                      <tr key={appointment.id}>
                        <td>{appointment.patientName}</td>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.symptoms}</td>
                        <td>
                          <span className={`badge badge-${appointment.status.toLowerCase()}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td>
                          <select 
                            value={appointment.status}
                            onChange={(e) => handleStatusUpdate(appointment.id, e.target.value)}
                            style={{ padding: '5px', marginRight: '10px' }}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                          {appointment.status === 'CONFIRMED' && (
                            <button 
                              className="btn btn-success"
                              onClick={() => handleCreatePrescription(appointment)}
                            >
                              Create Prescription
                            </button>
                          )}
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
              <h3>Prescriptions</h3>
              {prescriptions.length === 0 ? (
                <p>No prescriptions created yet.</p>
              ) : (
                <div>
                  {prescriptions.map(prescription => (
                    <div key={prescription.id} className="card">
                      <h4>Patient: {prescription.patientName}</h4>
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

        {showPrescriptionForm && (
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
              <h3>Create Prescription for {selectedAppointment?.patientName}</h3>
              <form onSubmit={handlePrescriptionSubmit}>
                <div className="form-group">
                  <label>Diagnosis *</label>
                  <textarea
                    value={prescriptionForm.diagnosis}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, diagnosis: e.target.value})}
                    required
                    rows="3"
                    placeholder="Enter diagnosis"
                  />
                </div>
                <div className="form-group">
                  <label>Medicines *</label>
                  <textarea
                    value={prescriptionForm.medicines}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, medicines: e.target.value})}
                    required
                    rows="3"
                    placeholder="List medicines with dosage"
                  />
                </div>
                <div className="form-group">
                  <label>Instructions *</label>
                  <textarea
                    value={prescriptionForm.instructions}
                    onChange={(e) => setPrescriptionForm({...prescriptionForm, instructions: e.target.value})}
                    required
                    rows="3"
                    placeholder="Additional instructions"
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-success">Create Prescription</button>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={() => setShowPrescriptionForm(false)}
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

export default DoctorDashboard;
