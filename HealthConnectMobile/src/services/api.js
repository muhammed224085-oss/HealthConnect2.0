import axios from 'axios';

// API Configuration
// For development, use your computer's IP address
// For Android emulator: use 10.0.2.2
// For iOS simulator: use localhost
// For physical device: use your computer's IP address (find with ipconfig)

// Auto-detect the best API URL for current environment
const getApiBaseUrl = () => {
  // Try to detect if running on physical device vs emulator
  const { Platform } = require('react-native');
  
  // For physical devices, use the computer's network IP
  // Update this IP to match your computer's IP address
  const COMPUTER_IP = '192.168.0.101'; // Update this with your actual IP
  
  // For Expo Go on physical device
  return `http://${COMPUTER_IP}:8080/api`;
  
  // Uncomment the appropriate line below if auto-detection doesn't work:
  // return 'http://10.0.2.2:8080/api'; // Android Emulator
  // return 'http://localhost:8080/api'; // iOS Simulator
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Network connectivity test function
export const testConnection = async () => {
  try {
    console.log('Testing connection to:', API_BASE_URL);
    const response = await api.get('/doctors', { timeout: 5000 });
    console.log('Connection test successful:', response.status);
    return true;
  } catch (error) {
    console.error('Connection test failed:', error.message);
    return false;
  }
};

// Request interceptor to add auth token if available
api.interceptors.request.use(
  async (config) => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access - redirecting to login');
    }
    return Promise.reject(error);
  }
);

// Doctor APIs
export const doctorAPI = {
  login: (credentials) => api.post('/doctors/login', credentials),
  register: (data) => api.post('/doctors/register', data),
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  updateProfile: (id, data) => api.put(`/doctors/${id}`, data),
};

// Patient APIs
export const patientAPI = {
  login: (credentials) => api.post('/patients/login', credentials),
  register: (data) => api.post('/patients/register', data),
  getById: (id) => api.get(`/patients/${id}`),
  updateProfile: (id, data) => api.put(`/patients/${id}`, data),
};

// Appointment APIs
export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  getByPatient: (patientId) => api.get(`/appointments/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
  getAll: () => api.get('/appointments'),
};

// Medicine APIs
export const medicineAPI = {
  getAll: () => api.get('/medicines'),
  getById: (id) => api.get(`/medicines/${id}`),
  create: (data) => api.post('/medicines', data),
  update: (id, data) => api.put(`/medicines/${id}`, data),
  delete: (id) => api.delete(`/medicines/${id}`),
  search: (query) => api.get(`/medicines/search?q=${query}`),
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getByPatient: (patientId) => api.get(`/orders/patient/${patientId}`),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  getAll: () => api.get('/orders'),
};

// Message APIs
export const messageAPI = {
  send: (data) => api.post('/messages', data),
  getConversation: (senderId, receiverId) => 
    api.get(`/messages/conversation/${senderId}/${receiverId}`),
  getByUser: (userId) => api.get(`/messages/user/${userId}`),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
};

// Prescription APIs
export const prescriptionAPI = {
  create: (data) => api.post('/prescriptions', data),
  getByPatient: (patientId) => api.get(`/prescriptions/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/prescriptions/doctor/${doctorId}`),
  getById: (id) => api.get(`/prescriptions/${id}`),
  update: (id, data) => api.put(`/prescriptions/${id}`, data),
};

// Payment APIs
export const paymentAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getPatientPayments: (patientId) => api.get(`/payments/patient/${patientId}`),
  getPaymentById: (paymentId) => api.get(`/payments/${paymentId}`),
  getInvoice: (paymentId) => api.get(`/payments/${paymentId}/invoice`),
  getPaymentMethods: () => api.get('/payments/demo-methods'),
  createConsultationPayment: (data) => api.post('/payments/consultation', data),
  createMedicinePayment: (data) => api.post('/payments/medicine', data),
  getPaymentStatistics: () => api.get('/payments/statistics'),
};

// Wallet APIs
export const walletAPI = {
  getWallet: (ownerType, ownerId) => api.get(`/wallets/${ownerType}/${ownerId}`),
  getWalletBalance: (ownerType, ownerId) => api.get(`/wallets/${ownerType}/${ownerId}/balance`),
  getDoctorEarnings: (doctorId) => api.get(`/wallets/doctor/${doctorId}/earnings`),
  getPharmacyEarnings: (pharmacyId) => api.get(`/wallets/pharmacy/${pharmacyId}/earnings`),
  processWithdrawal: (ownerType, ownerId, data) => api.post(`/wallets/${ownerType}/${ownerId}/withdraw`, data),
  getWalletStatistics: () => api.get('/wallets/statistics'),
  getAllDoctorWallets: () => api.get('/wallets/doctors'),
  getAllPharmacyWallets: () => api.get('/wallets/pharmacies'),
  createDemoWallets: () => api.post('/wallets/demo/create'),
};

// Utility functions
export const apiUtils = {
  // Set API base URL (useful for switching between development and production)
  setBaseURL: (url) => {
    api.defaults.baseURL = url;
  },
  
  // Get current base URL
  getBaseURL: () => api.defaults.baseURL,
  
  // Test API connection
  testConnection: async () => {
    try {
      const response = await api.get('/health');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

export default api;