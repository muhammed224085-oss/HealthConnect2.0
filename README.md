# HealthConnect - Doctor-Patient Communication and Medicine Delivery System

A full-stack web application built for college mini project that enables doctor-patient communication, appointment booking, prescription management, and medicine ordering - all without a database (in-memory storage).

## 🎯 Project Overview

**Project Type:** College Mini Project  
**Frontend:** React.js  
**Backend:** Java Spring Boot  
**Storage:** In-memory (Lists/Maps) - No Database  

## ✨ Features

### For Doctors
- ✅ Registration and Login
- ✅ View and manage appointments
- ✅ Update appointment status (Pending, Confirmed, Completed, Cancelled)
- ✅ Create and manage prescriptions
- ✅ Chat with patients

### For Patients
- ✅ Registration and Login
- ✅ Browse available doctors
- ✅ Book appointments with doctors
- ✅ View appointment history
- ✅ View prescriptions
- ✅ Chat with doctors
- ✅ Order medicines online
- ✅ Track medicine delivery

## 📁 Project Structure

```
HealthConnect/
├── client/                    # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/            # React Pages
│   │   │   ├── Home.js
│   │   │   ├── DoctorLogin.js
│   │   │   ├── DoctorRegister.js
│   │   │   ├── DoctorDashboard.js
│   │   │   ├── PatientLogin.js
│   │   │   ├── PatientRegister.js
│   │   │   ├── PatientDashboard.js
│   │   │   ├── Chat.js
│   │   │   ├── MedicineShop.js
│   │   │   └── Orders.js
│   │   ├── services/
│   │   │   └── api.js        # Axios API configuration
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
└── server/                    # Spring Boot Backend
    ├── src/main/java/com/healthconnect/
    │   ├── HealthConnectApplication.java
    │   ├── config/
    │   │   └── CorsConfig.java
    │   ├── controller/
    │   │   ├── DoctorController.java
    │   │   ├── PatientController.java
    │   │   ├── AppointmentController.java
    │   │   ├── PrescriptionController.java
    │   │   ├── MedicineController.java
    │   │   ├── OrderController.java
    │   │   └── MessageController.java
    │   ├── model/
    │   │   ├── Doctor.java
    │   │   ├── Patient.java
    │   │   ├── Appointment.java
    │   │   ├── Prescription.java
    │   │   ├── Medicine.java
    │   │   ├── MedicineOrder.java
    │   │   ├── OrderItem.java
    │   │   └── Message.java
    │   └── service/
    │       └── DataStorageService.java
    ├── src/main/resources/
    │   └── application.properties
    └── pom.xml
```

## 🚀 Setup and Installation

### Prerequisites

- **Java JDK 17 or higher** - [Download](https://www.oracle.com/java/technologies/downloads/)
- **Maven 3.6 or higher** - [Download](https://maven.apache.org/download.cgi)
- **Node.js 16 or higher** - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

### Backend Setup (Spring Boot)

1. **Navigate to server directory:**
   ```powershell
   cd "C:\Users\shame\Desktop\Project App\HealthConnect\server"
   ```

2. **Build the project:**
   ```powershell
   mvn clean install
   ```

3. **Run the Spring Boot application:**
   ```powershell
   mvn spring-boot:run
   ```

   The backend will start on **http://localhost:8080**

### Frontend Setup (React)

1. **Navigate to client directory:**
   ```powershell
   cd "C:\Users\shame\Desktop\Project App\HealthConnect\client"
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Start the React development server:**
   ```powershell
   npm start
   ```

   The frontend will start on **http://localhost:3000**

## 🧪 Testing the Application

### Sample Test Credentials

#### Doctor Login
- **Email:** sarah.johnson@health.com
- **Password:** doctor123

Other doctors:
- michael.chen@health.com / doctor123
- emily.rodriguez@health.com / doctor123

#### Patient Login
- **Email:** john.smith@email.com
- **Password:** patient123

Other patients:
- emma.davis@email.com / patient123
- robert.wilson@email.com / patient123

### Pre-populated Data

The application comes with sample data:

**Doctors:**
- Dr. Sarah Johnson (Cardiology)
- Dr. Michael Chen (Pediatrics)
- Dr. Emily Rodriguez (Dermatology)

**Patients:**
- John Smith
- Emma Davis
- Robert Wilson

**Medicines:**
- Paracetamol 500mg
- Amoxicillin 250mg
- Vitamin D3 1000IU
- Cetirizine 10mg
- Omeprazole 20mg

## 📋 API Endpoints

### Doctor APIs
```
POST   /api/doctors/register     - Register new doctor
POST   /api/doctors/login        - Doctor login
GET    /api/doctors              - Get all doctors
GET    /api/doctors/{id}         - Get doctor by ID
PUT    /api/doctors/{id}         - Update doctor
DELETE /api/doctors/{id}         - Delete doctor
```

### Patient APIs
```
POST   /api/patients/register    - Register new patient
POST   /api/patients/login       - Patient login
GET    /api/patients             - Get all patients
GET    /api/patients/{id}        - Get patient by ID
PUT    /api/patients/{id}        - Update patient
DELETE /api/patients/{id}        - Delete patient
```

### Appointment APIs
```
POST   /api/appointments                    - Create appointment
GET    /api/appointments                    - Get all appointments
GET    /api/appointments/{id}               - Get appointment by ID
GET    /api/appointments/doctor/{doctorId}  - Get doctor's appointments
GET    /api/appointments/patient/{patientId} - Get patient's appointments
PUT    /api/appointments/{id}               - Update appointment
PATCH  /api/appointments/{id}/status        - Update appointment status
DELETE /api/appointments/{id}               - Delete appointment
```

### Prescription APIs
```
POST   /api/prescriptions                    - Create prescription
GET    /api/prescriptions                    - Get all prescriptions
GET    /api/prescriptions/{id}               - Get prescription by ID
GET    /api/prescriptions/patient/{patientId} - Get patient's prescriptions
GET    /api/prescriptions/doctor/{doctorId}   - Get doctor's prescriptions
PUT    /api/prescriptions/{id}               - Update prescription
DELETE /api/prescriptions/{id}               - Delete prescription
```

### Medicine APIs
```
POST   /api/medicines         - Create medicine
GET    /api/medicines         - Get all medicines
GET    /api/medicines/{id}    - Get medicine by ID
PUT    /api/medicines/{id}    - Update medicine
DELETE /api/medicines/{id}    - Delete medicine
```

### Order APIs
```
POST   /api/orders                    - Create order
GET    /api/orders                    - Get all orders
GET    /api/orders/{id}               - Get order by ID
GET    /api/orders/patient/{patientId} - Get patient's orders
PUT    /api/orders/{id}               - Update order
PATCH  /api/orders/{id}/status        - Update order status
DELETE /api/orders/{id}               - Delete order
```

### Message APIs
```
POST   /api/messages                              - Send message
GET    /api/messages                              - Get all messages
GET    /api/messages/conversation?userId1=&userId2= - Get conversation
```

## 🎨 Features Walkthrough

### 1. Doctor Workflow
1. Register/Login as a doctor
2. View dashboard with appointments
3. Update appointment status (Confirm/Complete/Cancel)
4. Create prescriptions for confirmed appointments
5. Chat with patients

### 2. Patient Workflow
1. Register/Login as a patient
2. Browse available doctors
3. Book an appointment with a doctor
4. View appointment status
5. View prescriptions from doctors
6. Browse and order medicines
7. Track medicine delivery
8. Chat with doctors

## 🔧 Configuration

### CORS Configuration
The backend is configured to accept requests from `http://localhost:3000`. This is set in:
- `CorsConfig.java`
- `application.properties`

### Port Configuration
- **Backend:** 8080 (Spring Boot)
- **Frontend:** 3000 (React)

## 💾 Data Storage

All data is stored **in-memory** using:
- `ConcurrentHashMap` for thread-safe storage
- `AtomicLong` for ID generation
- Sample data is initialized on application startup

**Note:** Data will be lost when the server restarts.

## 🛠️ Technologies Used

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Web
- Lombok
- Maven

### Frontend
- React 18.2.0
- React Router DOM 6.20.0
- Axios 1.6.2
- CSS3

## 📝 Notes

- This is a **college mini project** designed for learning purposes
- No database is used - all data is stored in memory
- Data persists only during the application runtime
- CORS is enabled for local development
- Passwords are stored in plain text (not recommended for production)

## 🎓 Educational Value

This project demonstrates:
- Full-stack development with React and Spring Boot
- RESTful API design
- In-memory data management
- CORS configuration
- Component-based UI development
- State management in React
- HTTP communication with Axios

## 🚨 Important

- This project is for **educational purposes only**
- Not suitable for production use
- No data persistence
- No security features (authentication/authorization)
- No input validation
- No error handling in production-level quality

## 📞 Support

For questions or issues, please refer to the code comments or reach out to your instructor.

---

**Happy Coding! 🚀**
