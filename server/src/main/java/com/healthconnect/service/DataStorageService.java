package com.healthconnect.service;

import com.healthconnect.model.*;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class DataStorageService {
    
    // In-memory storage using ConcurrentHashMap for thread safety
    private final Map<String, Doctor> doctors = new ConcurrentHashMap<>();
    private final Map<String, Patient> patients = new ConcurrentHashMap<>();
    private final Map<String, Appointment> appointments = new ConcurrentHashMap<>();
    private final Map<String, Prescription> prescriptions = new ConcurrentHashMap<>();
    private final Map<String, Medicine> medicines = new ConcurrentHashMap<>();
    private final Map<String, MedicineOrder> orders = new ConcurrentHashMap<>();
    private final List<Message> messages = Collections.synchronizedList(new ArrayList<>());
    
    // ID generators
    private final AtomicLong doctorIdGenerator = new AtomicLong(1);
    private final AtomicLong patientIdGenerator = new AtomicLong(1);
    private final AtomicLong appointmentIdGenerator = new AtomicLong(1);
    private final AtomicLong prescriptionIdGenerator = new AtomicLong(1);
    private final AtomicLong medicineIdGenerator = new AtomicLong(1);
    private final AtomicLong orderIdGenerator = new AtomicLong(1);
    private final AtomicLong messageIdGenerator = new AtomicLong(1);
    
    @PostConstruct
    public void initializeSampleData() {
        // Sample Doctors
        Doctor doc1 = new Doctor();
        doc1.setId("1");
        doc1.setName("Dr. Sarah Johnson");
        doc1.setEmail("sarah.johnson@health.com");
        doc1.setPassword("doctor123");
        doc1.setSpecialization("Cardiology");
        doc1.setPhone("+1-555-0101");
        doc1.setExperience("10 years");
        doc1.setQualification("MD, Cardiology");
        doctors.put("1", doc1);
        
        Doctor doc2 = new Doctor();
        doc2.setId("2");
        doc2.setName("Dr. Michael Chen");
        doc2.setEmail("michael.chen@health.com");
        doc2.setPassword("doctor123");
        doc2.setSpecialization("Pediatrics");
        doc2.setPhone("+1-555-0102");
        doc2.setExperience("8 years");
        doc2.setQualification("MD, Pediatrics");
        doctors.put("2", doc2);
        
        Doctor doc3 = new Doctor();
        doc3.setId("3");
        doc3.setName("Dr. Emily Rodriguez");
        doc3.setEmail("emily.rodriguez@health.com");
        doc3.setPassword("doctor123");
        doc3.setSpecialization("Dermatology");
        doc3.setPhone("+1-555-0103");
        doc3.setExperience("12 years");
        doc3.setQualification("MD, Dermatology");
        doctors.put("3", doc3);
        doctorIdGenerator.set(4);
        
        // Sample Patients
        Patient pat1 = new Patient();
        pat1.setId("1");
        pat1.setName("John Smith");
        pat1.setEmail("john.smith@email.com");
        pat1.setPassword("patient123");
        pat1.setPhone("+1-555-0201");
        pat1.setAge("35");
        pat1.setAddress("123 Main St, Springfield");
        pat1.setMedicalHistory("No known allergies");
        patients.put("1", pat1);
        
        Patient pat2 = new Patient();
        pat2.setId("2");
        pat2.setName("Emma Davis");
        pat2.setEmail("emma.davis@email.com");
        pat2.setPassword("patient123");
        pat2.setPhone("+1-555-0202");
        pat2.setAge("28");
        pat2.setAddress("456 Oak Ave, Springfield");
        pat2.setMedicalHistory("Allergic to penicillin");
        patients.put("2", pat2);
        
        Patient pat3 = new Patient();
        pat3.setId("3");
        pat3.setName("Robert Wilson");
        pat3.setEmail("robert.wilson@email.com");
        pat3.setPassword("patient123");
        pat3.setPhone("+1-555-0203");
        pat3.setAge("42");
        pat3.setAddress("789 Pine Rd, Springfield");
        pat3.setMedicalHistory("Diabetic");
        patients.put("3", pat3);
        patientIdGenerator.set(4);
        
        // Sample Medicines
        Medicine med1 = new Medicine();
        med1.setId("1");
        med1.setName("Paracetamol 500mg");
        med1.setDescription("Pain relief and fever reducer");
        med1.setPrice(5.99);
        med1.setCategory("Pain Relief");
        med1.setStock(500);
        medicines.put("1", med1);
        
        Medicine med2 = new Medicine();
        med2.setId("2");
        med2.setName("Amoxicillin 250mg");
        med2.setDescription("Antibiotic for bacterial infections");
        med2.setPrice(12.99);
        med2.setCategory("Antibiotics");
        med2.setStock(300);
        medicines.put("2", med2);
        
        Medicine med3 = new Medicine();
        med3.setId("3");
        med3.setName("Vitamin D3 1000IU");
        med3.setDescription("Vitamin D supplement");
        med3.setPrice(8.99);
        med3.setCategory("Vitamins");
        med3.setStock(400);
        medicines.put("3", med3);
        
        Medicine med4 = new Medicine();
        med4.setId("4");
        med4.setName("Cetirizine 10mg");
        med4.setDescription("Antihistamine for allergies");
        med4.setPrice(6.99);
        med4.setCategory("Allergy");
        med4.setStock(350);
        medicines.put("4", med4);
        
        Medicine med5 = new Medicine();
        med5.setId("5");
        med5.setName("Omeprazole 20mg");
        med5.setDescription("Acid reflux medication");
        med5.setPrice(14.99);
        med5.setCategory("Digestive");
        med5.setStock(250);
        medicines.put("5", med5);
        medicineIdGenerator.set(6);
        
        // Sample Appointments
        Appointment app1 = new Appointment();
        app1.setId("1");
        app1.setPatientId("1");
        app1.setDoctorId("1");
        app1.setPatientName("John Smith");
        app1.setDoctorName("Dr. Sarah Johnson");
        app1.setDate("2025-10-20");
        app1.setTime("10:00 AM");
        app1.setStatus("CONFIRMED");
        app1.setSymptoms("Chest pain and shortness of breath");
        appointments.put("1", app1);
        
        Appointment app2 = new Appointment();
        app2.setId("2");
        app2.setPatientId("2");
        app2.setDoctorId("2");
        app2.setPatientName("Emma Davis");
        app2.setDoctorName("Dr. Michael Chen");
        app2.setDate("2025-10-21");
        app2.setTime("02:00 PM");
        app2.setStatus("PENDING");
        app2.setSymptoms("Child fever and cough");
        appointments.put("2", app2);
        appointmentIdGenerator.set(3);
    }
    
    // Doctor CRUD operations
    public Doctor saveDoctor(Doctor doctor) {
        if (doctor.getId() == null || doctor.getId().isEmpty()) {
            doctor.setId(String.valueOf(doctorIdGenerator.getAndIncrement()));
        }
        doctors.put(doctor.getId(), doctor);
        return doctor;
    }
    
    public Optional<Doctor> getDoctorById(String id) {
        return Optional.ofNullable(doctors.get(id));
    }
    
    public List<Doctor> getAllDoctors() {
        return new ArrayList<>(doctors.values());
    }
    
    public Optional<Doctor> getDoctorByEmail(String email) {
        return doctors.values().stream()
            .filter(d -> d.getEmail().equals(email))
            .findFirst();
    }
    
    public void deleteDoctor(String id) {
        doctors.remove(id);
    }
    
    // Patient CRUD operations
    public Patient savePatient(Patient patient) {
        if (patient.getId() == null || patient.getId().isEmpty()) {
            patient.setId(String.valueOf(patientIdGenerator.getAndIncrement()));
        }
        patients.put(patient.getId(), patient);
        return patient;
    }
    
    public Optional<Patient> getPatientById(String id) {
        return Optional.ofNullable(patients.get(id));
    }
    
    public List<Patient> getAllPatients() {
        return new ArrayList<>(patients.values());
    }
    
    public Optional<Patient> getPatientByEmail(String email) {
        return patients.values().stream()
            .filter(p -> p.getEmail().equals(email))
            .findFirst();
    }
    
    public void deletePatient(String id) {
        patients.remove(id);
    }
    
    // Appointment CRUD operations
    public Appointment saveAppointment(Appointment appointment) {
        if (appointment.getId() == null || appointment.getId().isEmpty()) {
            appointment.setId(String.valueOf(appointmentIdGenerator.getAndIncrement()));
        }
        appointments.put(appointment.getId(), appointment);
        return appointment;
    }
    
    public Optional<Appointment> getAppointmentById(String id) {
        return Optional.ofNullable(appointments.get(id));
    }
    
    public List<Appointment> getAllAppointments() {
        return new ArrayList<>(appointments.values());
    }
    
    public List<Appointment> getAppointmentsByDoctorId(String doctorId) {
        return appointments.values().stream()
            .filter(a -> a.getDoctorId().equals(doctorId))
            .collect(Collectors.toList());
    }
    
    public List<Appointment> getAppointmentsByPatientId(String patientId) {
        return appointments.values().stream()
            .filter(a -> a.getPatientId().equals(patientId))
            .collect(Collectors.toList());
    }
    
    public void deleteAppointment(String id) {
        appointments.remove(id);
    }
    
    // Prescription CRUD operations
    public Prescription savePrescription(Prescription prescription) {
        if (prescription.getId() == null || prescription.getId().isEmpty()) {
            prescription.setId(String.valueOf(prescriptionIdGenerator.getAndIncrement()));
        }
        prescriptions.put(prescription.getId(), prescription);
        return prescription;
    }
    
    public Optional<Prescription> getPrescriptionById(String id) {
        return Optional.ofNullable(prescriptions.get(id));
    }
    
    public List<Prescription> getAllPrescriptions() {
        return new ArrayList<>(prescriptions.values());
    }
    
    public List<Prescription> getPrescriptionsByPatientId(String patientId) {
        return prescriptions.values().stream()
            .filter(p -> p.getPatientId().equals(patientId))
            .collect(Collectors.toList());
    }
    
    public List<Prescription> getPrescriptionsByDoctorId(String doctorId) {
        return prescriptions.values().stream()
            .filter(p -> p.getDoctorId().equals(doctorId))
            .collect(Collectors.toList());
    }
    
    public void deletePrescription(String id) {
        prescriptions.remove(id);
    }
    
    // Medicine CRUD operations
    public Medicine saveMedicine(Medicine medicine) {
        if (medicine.getId() == null || medicine.getId().isEmpty()) {
            medicine.setId(String.valueOf(medicineIdGenerator.getAndIncrement()));
        }
        medicines.put(medicine.getId(), medicine);
        return medicine;
    }
    
    public Optional<Medicine> getMedicineById(String id) {
        return Optional.ofNullable(medicines.get(id));
    }
    
    public List<Medicine> getAllMedicines() {
        return new ArrayList<>(medicines.values());
    }
    
    public void deleteMedicine(String id) {
        medicines.remove(id);
    }
    
    // Medicine Order CRUD operations
    public MedicineOrder saveOrder(MedicineOrder order) {
        if (order.getId() == null || order.getId().isEmpty()) {
            order.setId(String.valueOf(orderIdGenerator.getAndIncrement()));
        }
        orders.put(order.getId(), order);
        return order;
    }
    
    public Optional<MedicineOrder> getOrderById(String id) {
        return Optional.ofNullable(orders.get(id));
    }
    
    public List<MedicineOrder> getAllOrders() {
        return new ArrayList<>(orders.values());
    }
    
    public List<MedicineOrder> getOrdersByPatientId(String patientId) {
        return orders.values().stream()
            .filter(o -> o.getPatientId().equals(patientId))
            .collect(Collectors.toList());
    }
    
    public void deleteOrder(String id) {
        orders.remove(id);
    }
    
    // Message operations
    public Message saveMessage(Message message) {
        if (message.getId() == null || message.getId().isEmpty()) {
            message.setId(String.valueOf(messageIdGenerator.getAndIncrement()));
        }
        messages.add(message);
        return message;
    }
    
    public List<Message> getMessagesBetween(String userId1, String userId2) {
        return messages.stream()
            .filter(m -> (m.getSenderId().equals(userId1) && m.getReceiverId().equals(userId2)) ||
                        (m.getSenderId().equals(userId2) && m.getReceiverId().equals(userId1)))
            .collect(Collectors.toList());
    }
    
    public List<Message> getAllMessages() {
        return new ArrayList<>(messages);
    }
}
