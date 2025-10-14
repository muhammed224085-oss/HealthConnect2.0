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
    private final Map<Long, Doctor> doctors = new ConcurrentHashMap<>();
    private final Map<Long, Patient> patients = new ConcurrentHashMap<>();
    private final Map<Long, Appointment> appointments = new ConcurrentHashMap<>();
    private final Map<Long, Prescription> prescriptions = new ConcurrentHashMap<>();
    private final Map<Long, Medicine> medicines = new ConcurrentHashMap<>();
    private final Map<Long, MedicineOrder> orders = new ConcurrentHashMap<>();
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
        doctors.put(1L, new Doctor(1L, "Dr. Sarah Johnson", "sarah.johnson@health.com", "doctor123", 
            "Cardiology", "+1-555-0101", "10 years", "MD, Cardiology"));
        doctors.put(2L, new Doctor(2L, "Dr. Michael Chen", "michael.chen@health.com", "doctor123", 
            "Pediatrics", "+1-555-0102", "8 years", "MD, Pediatrics"));
        doctors.put(3L, new Doctor(3L, "Dr. Emily Rodriguez", "emily.rodriguez@health.com", "doctor123", 
            "Dermatology", "+1-555-0103", "12 years", "MD, Dermatology"));
        doctorIdGenerator.set(4);
        
        // Sample Patients
        patients.put(1L, new Patient(1L, "John Smith", "john.smith@email.com", "patient123", 
            "+1-555-0201", "35", "123 Main St, Springfield", "No known allergies"));
        patients.put(2L, new Patient(2L, "Emma Davis", "emma.davis@email.com", "patient123", 
            "+1-555-0202", "28", "456 Oak Ave, Springfield", "Allergic to penicillin"));
        patients.put(3L, new Patient(3L, "Robert Wilson", "robert.wilson@email.com", "patient123", 
            "+1-555-0203", "42", "789 Pine Rd, Springfield", "Diabetic"));
        patientIdGenerator.set(4);
        
        // Sample Medicines
        medicines.put(1L, new Medicine(1L, "Paracetamol 500mg", "Pain relief and fever reducer", 
            5.99, "Pain Relief", 500));
        medicines.put(2L, new Medicine(2L, "Amoxicillin 250mg", "Antibiotic for bacterial infections", 
            12.99, "Antibiotics", 300));
        medicines.put(3L, new Medicine(3L, "Vitamin D3 1000IU", "Vitamin D supplement", 
            8.99, "Vitamins", 400));
        medicines.put(4L, new Medicine(4L, "Cetirizine 10mg", "Antihistamine for allergies", 
            6.99, "Allergy", 350));
        medicines.put(5L, new Medicine(5L, "Omeprazole 20mg", "Acid reflux medication", 
            14.99, "Digestive", 250));
        medicineIdGenerator.set(6);
        
        // Sample Appointments
        appointments.put(1L, new Appointment(1L, 1L, 1L, "John Smith", "Dr. Sarah Johnson", 
            "2025-10-20", "10:00 AM", "CONFIRMED", "Chest pain and shortness of breath"));
        appointments.put(2L, new Appointment(2L, 2L, 2L, "Emma Davis", "Dr. Michael Chen", 
            "2025-10-21", "02:00 PM", "PENDING", "Child fever and cough"));
        appointmentIdGenerator.set(3);
    }
    
    // Doctor CRUD operations
    public Doctor saveDoctor(Doctor doctor) {
        if (doctor.getId() == null) {
            doctor.setId(doctorIdGenerator.getAndIncrement());
        }
        doctors.put(doctor.getId(), doctor);
        return doctor;
    }
    
    public Optional<Doctor> getDoctorById(Long id) {
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
    
    public void deleteDoctor(Long id) {
        doctors.remove(id);
    }
    
    // Patient CRUD operations
    public Patient savePatient(Patient patient) {
        if (patient.getId() == null) {
            patient.setId(patientIdGenerator.getAndIncrement());
        }
        patients.put(patient.getId(), patient);
        return patient;
    }
    
    public Optional<Patient> getPatientById(Long id) {
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
    
    public void deletePatient(Long id) {
        patients.remove(id);
    }
    
    // Appointment CRUD operations
    public Appointment saveAppointment(Appointment appointment) {
        if (appointment.getId() == null) {
            appointment.setId(appointmentIdGenerator.getAndIncrement());
        }
        appointments.put(appointment.getId(), appointment);
        return appointment;
    }
    
    public Optional<Appointment> getAppointmentById(Long id) {
        return Optional.ofNullable(appointments.get(id));
    }
    
    public List<Appointment> getAllAppointments() {
        return new ArrayList<>(appointments.values());
    }
    
    public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {
        return appointments.values().stream()
            .filter(a -> a.getDoctorId().equals(doctorId))
            .collect(Collectors.toList());
    }
    
    public List<Appointment> getAppointmentsByPatientId(Long patientId) {
        return appointments.values().stream()
            .filter(a -> a.getPatientId().equals(patientId))
            .collect(Collectors.toList());
    }
    
    public void deleteAppointment(Long id) {
        appointments.remove(id);
    }
    
    // Prescription CRUD operations
    public Prescription savePrescription(Prescription prescription) {
        if (prescription.getId() == null) {
            prescription.setId(prescriptionIdGenerator.getAndIncrement());
        }
        prescriptions.put(prescription.getId(), prescription);
        return prescription;
    }
    
    public Optional<Prescription> getPrescriptionById(Long id) {
        return Optional.ofNullable(prescriptions.get(id));
    }
    
    public List<Prescription> getAllPrescriptions() {
        return new ArrayList<>(prescriptions.values());
    }
    
    public List<Prescription> getPrescriptionsByPatientId(Long patientId) {
        return prescriptions.values().stream()
            .filter(p -> p.getPatientId().equals(patientId))
            .collect(Collectors.toList());
    }
    
    public List<Prescription> getPrescriptionsByDoctorId(Long doctorId) {
        return prescriptions.values().stream()
            .filter(p -> p.getDoctorId().equals(doctorId))
            .collect(Collectors.toList());
    }
    
    public void deletePrescription(Long id) {
        prescriptions.remove(id);
    }
    
    // Medicine CRUD operations
    public Medicine saveMedicine(Medicine medicine) {
        if (medicine.getId() == null) {
            medicine.setId(medicineIdGenerator.getAndIncrement());
        }
        medicines.put(medicine.getId(), medicine);
        return medicine;
    }
    
    public Optional<Medicine> getMedicineById(Long id) {
        return Optional.ofNullable(medicines.get(id));
    }
    
    public List<Medicine> getAllMedicines() {
        return new ArrayList<>(medicines.values());
    }
    
    public void deleteMedicine(Long id) {
        medicines.remove(id);
    }
    
    // Medicine Order CRUD operations
    public MedicineOrder saveOrder(MedicineOrder order) {
        if (order.getId() == null) {
            order.setId(orderIdGenerator.getAndIncrement());
        }
        orders.put(order.getId(), order);
        return order;
    }
    
    public Optional<MedicineOrder> getOrderById(Long id) {
        return Optional.ofNullable(orders.get(id));
    }
    
    public List<MedicineOrder> getAllOrders() {
        return new ArrayList<>(orders.values());
    }
    
    public List<MedicineOrder> getOrdersByPatientId(Long patientId) {
        return orders.values().stream()
            .filter(o -> o.getPatientId().equals(patientId))
            .collect(Collectors.toList());
    }
    
    public void deleteOrder(Long id) {
        orders.remove(id);
    }
    
    // Message operations
    public Message saveMessage(Message message) {
        if (message.getId() == null) {
            message.setId(messageIdGenerator.getAndIncrement());
        }
        messages.add(message);
        return message;
    }
    
    public List<Message> getMessagesBetween(Long userId1, Long userId2) {
        return messages.stream()
            .filter(m -> (m.getSenderId().equals(userId1) && m.getReceiverId().equals(userId2)) ||
                        (m.getSenderId().equals(userId2) && m.getReceiverId().equals(userId1)))
            .collect(Collectors.toList());
    }
    
    public List<Message> getAllMessages() {
        return new ArrayList<>(messages);
    }
}
