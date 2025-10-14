# HealthConnect - Visual Project Summary

## 🎯 Project at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│                    HEALTHCONNECT                            │
│    Doctor-Patient Communication & Medicine Delivery         │
└─────────────────────────────────────────────────────────────┘

📱 Frontend: React.js        🖥️ Backend: Spring Boot
🌐 Port: 3000                🔌 Port: 8080
💾 Storage: In-Memory        📦 Build: Maven + npm
```

---

## 🏛️ System Components

```
┌──────────────────────┐
│   USER INTERFACE     │
│      (React)         │
├──────────────────────┤
│  • Home Page         │
│  • Login/Register    │
│  • Doctor Dashboard  │
│  • Patient Dashboard │
│  • Chat              │
│  • Medicine Shop     │
│  • Orders            │
└──────────┬───────────┘
           │ REST API
           ↓
┌──────────────────────┐
│   REST CONTROLLERS   │
│   (Spring Boot)      │
├──────────────────────┤
│  • DoctorController  │
│  • PatientController │
│  • AppointmentCtrl   │
│  • PrescriptionCtrl  │
│  • MedicineCtrl      │
│  • OrderController   │
│  • MessageCtrl       │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  DATA STORAGE        │
│  (In-Memory)         │
├──────────────────────┤
│  • Doctors Map       │
│  • Patients Map      │
│  • Appointments Map  │
│  • Prescriptions Map │
│  • Medicines Map     │
│  • Orders Map        │
│  • Messages List     │
└──────────────────────┘
```
`
---
`
## 👥 User Roles & Features

### 👨‍⚕️ DOCTOR
```
┌─────────────────────────────────┐
│  Doctor Features                │
├─────────────────────────────────┤
│  ✓ Register/Login               │
│  ✓ View Profile                 │
│  ✓ Manage Appointments          │
│    - View all appointments      │
│    - Update status              │
│    - Confirm/Complete/Cancel    │
│  ✓ Create Prescriptions         │
│    - Diagnosis                  │
│    - Medicines                  │
│    - Instructions               │
│  ✓ Chat with Patients           │
│  ✓ View All Prescriptions       │
└─────────────────────────────────┘
```

### 🧑‍💼 PATIENT
```
┌─────────────────────────────────┐
│  Patient Features               │
├─────────────────────────────────┤
│  ✓ Register/Login               │
│  ✓ View Profile                 │
│  ✓ Browse Doctors               │
│  ✓ Book Appointments            │
│    - Select doctor              │
│    - Choose date/time           │
│    - Describe symptoms          │
│  ✓ View Appointments            │
│  ✓ View Prescriptions           │
│  ✓ Chat with Doctors            │
│  ✓ Browse Medicines             │
│  ✓ Order Medicines              │
│  ✓ Track Orders                 │
└─────────────────────────────────┘
```

---

## 🔄 Key Workflows

### Workflow 1: Appointment Booking
```
Patient                          System                      Doctor
  │                                │                           │
  │──Book Appointment──────────────>│                          │
  │  (Doctor, Date, Time, Symptoms) │                          │
  │                                │                           │
  │<──Confirmation─────────────────│                           │
  │  (Status: PENDING)             │                           │
  │                                │                           │
  │                                │<──View Appointment────────│
  │                                │                           │
  │                                │<──Update Status───────────│
  │                                │   (CONFIRMED)             │
  │                                │                           │
  │<──Status Update────────────────│                           │
  │  (Status: CONFIRMED)           │                           │
```

### Workflow 2: Prescription Creation
```
Doctor                          System                     Patient
  │                                │                           │
  │──Create Prescription───────────>│                          │
  │  (Diagnosis, Medicines, etc.)  │                           │
  │                                │                           │
  │<──Confirmation─────────────────│                           │
  │                                │                           │
  │                                │──Notification──────────>  │
  │                                │                           │
  │                                │<──View Prescription───────│
  │                                │                           │
```

### Workflow 3: Medicine Ordering
```
Patient                          System
  │                                │
  │──Browse Medicines──────────────>│
  │                                │
  │<──Medicine List────────────────│
  │                                │
  │──Add to Cart───────────────────>│
  │                                │
  │──Checkout──────────────────────>│
  │  (Confirm Order)               │
  │                                │
  │<──Order Confirmation───────────│
  │  (Order ID, Delivery Date)     │
  │                                │
  │──Track Order───────────────────>│
  │                                │
  │<──Order Status─────────────────│
  │  (PLACED→PROCESSING→SHIPPED    │
  │   →DELIVERED)                  │
```

---

## 📊 Data Models

### Doctor
```
┌─────────────────────┐
│   Doctor            │
├─────────────────────┤
│ • id: Long          │
│ • name: String      │
│ • email: String     │
│ • password: String  │
│ • specialization    │
│ • phone: String     │
│ • experience        │
│ • qualification     │
└─────────────────────┘
```

### Patient
```
┌─────────────────────┐
│   Patient           │
├─────────────────────┤
│ • id: Long          │
│ • name: String      │
│ • email: String     │
│ • password: String  │
│ • phone: String     │
│ • age: String       │
│ • address: String   │
│ • medicalHistory    │
└─────────────────────┘
```

### Appointment
```
┌─────────────────────┐
│   Appointment       │
├─────────────────────┤
│ • id: Long          │
│ • patientId: Long   │
│ • doctorId: Long    │
│ • patientName       │
│ • doctorName        │
│ • date: String      │
│ • time: String      │
│ • status: String    │
│ • symptoms: String  │
└─────────────────────┘
```

### Medicine Order
```
┌─────────────────────┐
│   MedicineOrder     │
├─────────────────────┤
│ • id: Long          │
│ • patientId: Long   │
│ • patientName       │
│ • patientAddress    │
│ • patientPhone      │
│ • items: List       │
│ • totalAmount       │
│ • status: String    │
│ • orderDate         │
│ • deliveryDate      │
└─────────────────────┘
```

---

## 🌐 API Endpoints Summary

```
┌────────────────────────────────────────────────────────┐
│                  REST API ENDPOINTS                    │
├────────────────────────────────────────────────────────┤
│                                                        │
│  DOCTORS                                               │
│  POST   /api/doctors/register    Register doctor      │
│  POST   /api/doctors/login       Doctor login         │
│  GET    /api/doctors             Get all doctors      │
│                                                        │
│  PATIENTS                                              │
│  POST   /api/patients/register   Register patient     │
│  POST   /api/patients/login      Patient login        │
│  GET    /api/patients            Get all patients     │
│                                                        │
│  APPOINTMENTS                                          │
│  POST   /api/appointments        Create appointment   │
│  GET    /api/appointments/patient/:id                 │
│  GET    /api/appointments/doctor/:id                  │
│  PATCH  /api/appointments/:id/status                  │
│                                                        │
│  PRESCRIPTIONS                                         │
│  POST   /api/prescriptions       Create prescription  │
│  GET    /api/prescriptions/patient/:id                │
│  GET    /api/prescriptions/doctor/:id                 │
│                                                        │
│  MEDICINES                                             │
│  GET    /api/medicines           Get all medicines    │
│                                                        │
│  ORDERS                                                │
│  POST   /api/orders              Create order         │
│  GET    /api/orders/patient/:id  Get patient orders   │
│                                                        │
│  MESSAGES                                              │
│  POST   /api/messages            Send message         │
│  GET    /api/messages/conversation?userId1=&userId2=  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🎨 UI Pages

```
HOME PAGE
├── For Doctors Section
│   ├── Login Button → Doctor Login Page
│   └── Register Button → Doctor Register Page
│
└── For Patients Section
    ├── Login Button → Patient Login Page
    └── Register Button → Patient Register Page

DOCTOR DASHBOARD
├── Profile Card
├── Appointments Tab
│   ├── View all appointments
│   ├── Update status dropdown
│   └── Create Prescription button
│
├── Prescriptions Tab
│   └── List of created prescriptions
│
└── Navigation
    ├── Chat
    └── Logout

PATIENT DASHBOARD
├── Profile Card
├── Book Appointment Tab
│   └── List of available doctors
│
├── My Appointments Tab
│   └── Appointment history
│
├── Prescriptions Tab
│   └── Doctor prescriptions
│
└── Navigation
    ├── Chat
    ├── Medicines
    ├── My Orders
    └── Logout

CHAT PAGE
├── Contacts List (Left)
│   └── List of doctors/patients
│
└── Chat Area (Right)
    ├── Message history
    └── Send message form

MEDICINE SHOP
├── Medicine Grid
│   └── Medicine cards with Add to Cart
│
└── Shopping Cart Modal
    ├── Cart items
    ├── Total amount
    └── Checkout button

ORDERS PAGE
└── Order Cards
    ├── Order details
    ├── Items list
    ├── Status timeline
    └── Delivery information
```

---

## 📈 Statistics

```
┌─────────────────────────────────┐
│      PROJECT STATISTICS         │
├─────────────────────────────────┤
│                                 │
│  Backend Files:                 │
│  • Java Classes: 16             │
│  • Controllers: 7               │
│  • Models: 8                    │
│  • Services: 1                  │
│                                 │
│  Frontend Files:                │
│  • React Components: 10         │
│  • Pages: 10                    │
│  • Services: 1                  │
│                                 │
│  API Endpoints: 30+             │
│                                 │
│  Pre-loaded Data:               │
│  • Doctors: 3                   │
│  • Patients: 3                  │
│  • Medicines: 5                 │
│  • Appointments: 2              │
│                                 │
└─────────────────────────────────┘
```

---

## 🎓 Learning Outcomes

```
✓ Full-Stack Development
✓ REST API Design
✓ React Component Architecture
✓ State Management
✓ HTTP Communication
✓ CORS Configuration
✓ In-Memory Data Storage
✓ Multi-User Systems
✓ Healthcare Domain Knowledge
✓ UI/UX Design Principles
```

---

**This visual summary provides a comprehensive overview of the HealthConnect project!**
