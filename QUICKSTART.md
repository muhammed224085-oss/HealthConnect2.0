# HealthConnect - Quick Start Guide

## 🚀 Quick Setup (Step-by-Step)

### Step 1: Start the Backend Server

1. Open PowerShell/Command Prompt
2. Navigate to server folder:
   ```powershell
   cd "C:\Users\shame\Desktop\Project App\HealthConnect\server"
   ```
3. Run the server:
   ```powershell
   mvn spring-boot:run
   ```
4. Wait for "Started HealthConnectApplication" message
5. Backend is running at: http://localhost:8080

### Step 2: Start the Frontend

1. Open a NEW PowerShell/Command Prompt window
2. Navigate to client folder:
   ```powershell
   cd "C:\Users\shame\Desktop\Project App\HealthConnect\client"
   ```
3. Install dependencies (first time only):
   ```powershell
   npm install
   ```
4. Start React app:
   ```powershell
   npm start
   ```
5. Frontend opens automatically at: http://localhost:3000

## 🧪 Quick Test

### Test as Doctor:
1. Go to http://localhost:3000
2. Click "For Doctors" → "Login"
3. Use credentials:
   - Email: sarah.johnson@health.com
   - Password: doctor123
4. Explore dashboard, appointments, prescriptions

### Test as Patient:
1. Go to http://localhost:3000
2. Click "For Patients" → "Login"
3. Use credentials:
   - Email: john.smith@email.com
   - Password: patient123
4. Book appointments, view prescriptions, order medicines

## ✅ Test Scenarios

### Scenario 1: Book an Appointment
1. Login as patient (john.smith@email.com / patient123)
2. Click "Book Appointment"
3. Select a doctor (e.g., Dr. Sarah Johnson)
4. Fill appointment details
5. Submit

### Scenario 2: Doctor Creates Prescription
1. Login as doctor (sarah.johnson@health.com / doctor123)
2. Go to Appointments tab
3. Change appointment status to "CONFIRMED"
4. Click "Create Prescription"
5. Fill prescription details
6. Submit

### Scenario 3: Order Medicines
1. Login as patient
2. Click "Medicines" in navbar
3. Browse medicines
4. Add to cart
5. Checkout
6. View order in "My Orders"

### Scenario 4: Chat Communication
1. Login as doctor or patient
2. Click "Chat" in navbar
3. Select a contact
4. Send messages

## 🔍 Troubleshooting

### Backend won't start?
- Check Java is installed: `java -version`
- Check Maven is installed: `mvn -version`
- Make sure port 8080 is not in use

### Frontend won't start?
- Check Node.js is installed: `node -version`
- Delete node_modules and run `npm install` again
- Make sure port 3000 is not in use

### Can't connect backend to frontend?
- Make sure backend is running on port 8080
- Check CORS is enabled in CorsConfig.java
- Clear browser cache

## 📊 Sample Data Available

**Doctors:**
- sarah.johnson@health.com (Cardiology)
- michael.chen@health.com (Pediatrics)
- emily.rodriguez@health.com (Dermatology)

**Patients:**
- john.smith@email.com
- emma.davis@email.com
- robert.wilson@email.com

**All passwords:** doctor123 / patient123

**5 Medicines** pre-loaded in the shop

---

**Need help? Check README.md for detailed documentation!**
