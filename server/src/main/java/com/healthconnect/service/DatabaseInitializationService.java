package com.healthconnect.service;

import com.healthconnect.model.*;
import com.healthconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

@Service
public class DatabaseInitializationService implements CommandLineRunner {

    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private MedicineRepository medicineRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public void run(String... args) {
        // Check if data already exists
        if (doctorRepository.count() > 0) {
            System.out.println("Database already initialized. Skipping sample data creation.");
            return;
        }

        System.out.println("Initializing MongoDB with sample data...");
        initializeSampleData();
        System.out.println("Sample data initialized successfully!");
    }

    private void initializeSampleData() {
        // Create sample doctors
        Doctor doctor1 = new Doctor();
        doctor1.setName("Dr. Sarah Johnson");
        doctor1.setEmail("sarah.johnson@health.com");
        doctor1.setPassword("doctor123");
        doctor1.setSpecialization("Cardiologist");
        doctor1.setPhone("+1-555-0101");
        doctor1.setExperience("15 years");
        doctor1.setQualification("MD, FACC");
        
        Doctor doctor2 = new Doctor();
        doctor2.setName("Dr. Michael Chen");
        doctor2.setEmail("michael.chen@health.com");
        doctor2.setPassword("doctor123");
        doctor2.setSpecialization("Pediatrician");
        doctor2.setPhone("+1-555-0102");
        doctor2.setExperience("10 years");
        doctor2.setQualification("MD, FAAP");
        
        Doctor doctor3 = new Doctor();
        doctor3.setName("Dr. Emily Williams");
        doctor3.setEmail("emily.williams@health.com");
        doctor3.setPassword("doctor123");
        doctor3.setSpecialization("Dermatologist");
        doctor3.setPhone("+1-555-0103");
        doctor3.setExperience("8 years");
        doctor3.setQualification("MD, Dermatology Board Certified");
        
        doctorRepository.saveAll(Arrays.asList(doctor1, doctor2, doctor3));

        // Create sample patients
        Patient patient1 = new Patient();
        patient1.setName("John Smith");
        patient1.setEmail("john.smith@email.com");
        patient1.setPassword("patient123");
        patient1.setPhone("+1-555-0201");
        patient1.setAge("35");
        patient1.setAddress("123 Main St, New York, NY 10001");
        patient1.setMedicalHistory("Hypertension");
        
        Patient patient2 = new Patient();
        patient2.setName("Emma Davis");
        patient2.setEmail("emma.davis@email.com");
        patient2.setPassword("patient123");
        patient2.setPhone("+1-555-0202");
        patient2.setAge("28");
        patient2.setAddress("456 Oak Ave, Los Angeles, CA 90001");
        patient2.setMedicalHistory("No significant history");
        
        Patient patient3 = new Patient();
        patient3.setName("Robert Brown");
        patient3.setEmail("robert.brown@email.com");
        patient3.setPassword("patient123");
        patient3.setPhone("+1-555-0203");
        patient3.setAge("52");
        patient3.setAddress("789 Pine Rd, Chicago, IL 60601");
        patient3.setMedicalHistory("Diabetes Type 2");
        
        patientRepository.saveAll(Arrays.asList(patient1, patient2, patient3));

        // Create sample medicines
        Medicine med1 = new Medicine();
        med1.setName("Aspirin");
        med1.setDescription("Pain reliever and fever reducer");
        med1.setPrice(9.99);
        med1.setCategory("Pain Relief");
        med1.setStock(500);
        
        Medicine med2 = new Medicine();
        med2.setName("Amoxicillin");
        med2.setDescription("Antibiotic for bacterial infections");
        med2.setPrice(15.99);
        med2.setCategory("Antibiotics");
        med2.setStock(300);
        
        Medicine med3 = new Medicine();
        med3.setName("Lisinopril");
        med3.setDescription("Blood pressure medication");
        med3.setPrice(12.50);
        med3.setCategory("Cardiovascular");
        med3.setStock(200);
        
        Medicine med4 = new Medicine();
        med4.setName("Metformin");
        med4.setDescription("Type 2 diabetes medication");
        med4.setPrice(18.75);
        med4.setCategory("Diabetes");
        med4.setStock(250);
        
        Medicine med5 = new Medicine();
        med5.setName("Vitamin D3");
        med5.setDescription("Vitamin supplement");
        med5.setPrice(14.99);
        med5.setCategory("Vitamins");
        med5.setStock(400);
        
        medicineRepository.saveAll(Arrays.asList(med1, med2, med3, med4, med5));

        // Create sample appointments
        String currentDate = LocalDateTime.now().format(formatter);
        
        Appointment apt1 = new Appointment();
        apt1.setPatientId(patient1.getId());
        apt1.setDoctorId(doctor1.getId());
        apt1.setPatientName(patient1.getName());
        apt1.setDoctorName(doctor1.getName());
        apt1.setDate("2024-11-20");
        apt1.setTime("10:00 AM");
        apt1.setStatus("CONFIRMED");
        apt1.setSymptoms("Chest pain, shortness of breath");
        
        Appointment apt2 = new Appointment();
        apt2.setPatientId(patient2.getId());
        apt2.setDoctorId(doctor2.getId());
        apt2.setPatientName(patient2.getName());
        apt2.setDoctorName(doctor2.getName());
        apt2.setDate("2024-11-21");
        apt2.setTime("2:00 PM");
        apt2.setStatus("PENDING");
        apt2.setSymptoms("Child fever and cough");
        
        appointmentRepository.saveAll(Arrays.asList(apt1, apt2));
    }
}
