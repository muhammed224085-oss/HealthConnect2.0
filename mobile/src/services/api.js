import axios from 'axios';

// Replace with your server's IP address
// For Android emulator: use 10.0.2.2
// For iOS simulator: use localhost
// For physical device: use your computer's IP address
const API_BASE_URL = 'http://10.0.2.2:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Doctor APIs
export const doctorAPI = {
  login: (credentials) => api.post('/doctors/login', credentials),
  register: (data) => api.post('/doctors/register', data),
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
};

// Patient APIs
export const patientAPI = {
  login: (credentials) => api.post('/patients/login', credentials),
  register: (data) => api.post('/patients/register', data),
  getById: (id) => api.get(`/patients/${id}`),
};

// Appointment APIs
export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  getByPatient: (patientId) => api.get(`/appointments/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
  update: (id, data) => api.put(`/appointments/${id}`, data),
};

// Medicine APIs
export const medicineAPI = {
  getAll: () => api.get('/medicines'),
  getById: (id) => api.get(`/medicines/${id}`),
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getByPatient: (patientId) => api.get(`/orders/patient/${patientId}`),
  getById: (id) => api.get(`/orders/${id}`),
};

// Message APIs
export const messageAPI = {
  send: (data) => api.post('/messages', data),
  getConversation: (senderId, receiverId) => 
    api.get(`/messages/conversation/${senderId}/${receiverId}`),
};

export default api;