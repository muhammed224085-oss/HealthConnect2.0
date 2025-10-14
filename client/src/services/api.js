import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Doctor APIs
export const doctorAPI = {
  register: (data) => api.post('/doctors/register', data),
  login: (data) => api.post('/doctors/login', data),
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
};

// Patient APIs
export const patientAPI = {
  register: (data) => api.post('/patients/register', data),
  login: (data) => api.post('/patients/login', data),
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

// Appointment APIs
export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  getByDoctor: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
  getByPatient: (patientId) => api.get(`/appointments/patient/${patientId}`),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
  delete: (id) => api.delete(`/appointments/${id}`),
};

// Prescription APIs
export const prescriptionAPI = {
  create: (data) => api.post('/prescriptions', data),
  getAll: () => api.get('/prescriptions'),
  getById: (id) => api.get(`/prescriptions/${id}`),
  getByPatient: (patientId) => api.get(`/prescriptions/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/prescriptions/doctor/${doctorId}`),
  update: (id, data) => api.put(`/prescriptions/${id}`, data),
  delete: (id) => api.delete(`/prescriptions/${id}`),
};

// Medicine APIs
export const medicineAPI = {
  create: (data) => api.post('/medicines', data),
  getAll: () => api.get('/medicines'),
  getById: (id) => api.get(`/medicines/${id}`),
  update: (id, data) => api.put(`/medicines/${id}`, data),
  delete: (id) => api.delete(`/medicines/${id}`),
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getByPatient: (patientId) => api.get(`/orders/patient/${patientId}`),
  update: (id, data) => api.put(`/orders/${id}`, data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/orders/${id}`),
};

// Message APIs
export const messageAPI = {
  send: (data) => api.post('/messages', data),
  getAll: () => api.get('/messages'),
  getConversation: (userId1, userId2) => 
    api.get(`/messages/conversation?userId1=${userId1}&userId2=${userId2}`),
};

export default api;
