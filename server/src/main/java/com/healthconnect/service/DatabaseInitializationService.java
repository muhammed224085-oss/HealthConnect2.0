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
    
    @Autowired
    private AdminRepository adminRepository;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public void run(String... args) {
        // Clear existing data and reinitialize with new prices
        System.out.println("Clearing existing data...");
        doctorRepository.deleteAll();
        patientRepository.deleteAll();
        medicineRepository.deleteAll();
        appointmentRepository.deleteAll();
        adminRepository.deleteAll();
        System.out.println("Existing data cleared.");

        System.out.println("Initializing MongoDB with sample data (Rupee prices)...");
        initializeSampleData();
        System.out.println("Sample data initialized successfully with Rupee prices!");
    }

    private void initializeSampleData() {
        // Create sample doctors
        Doctor doctor1 = new Doctor();
        doctor1.setName("Dr. Sarah Johnson");
        doctor1.setEmail("sarah.johnson@health.com");
        doctor1.setPassword("doctor123");
        doctor1.setSpecialization("Cardiologist");
        doctor1.setPhone("+91 96456 78901");
        doctor1.setExperience("15 years");
        doctor1.setQualification("MD, FACC");
        doctor1.setConsultationFee(1500.00); // INR
        
        Doctor doctor2 = new Doctor();
        doctor2.setName("Dr. Michael Chen");
        doctor2.setEmail("michael.chen@health.com");
        doctor2.setPassword("doctor123");
        doctor2.setSpecialization("Pediatrician");
        doctor2.setPhone("+91 90939 95690");
        doctor2.setExperience("10 years");
        doctor2.setQualification("MD, FAAP");
        doctor2.setConsultationFee(1200.00); // INR
        
        Doctor doctor3 = new Doctor();
        doctor3.setName("Dr. Emily Williams");
        doctor3.setEmail("emily.williams@health.com");
        doctor3.setPassword("doctor123");
        doctor3.setSpecialization("Dermatologist");
        doctor3.setPhone("+91 97869 52876");
        doctor3.setExperience("8 years");
        doctor3.setQualification("MD, Dermatology Board Certified");
        doctor3.setConsultationFee(1000.00); // INR

        Doctor doctor4 = new Doctor();
        doctor4.setName("Dr. John Doe");
        doctor4.setEmail("john.doe@health.com");
        doctor4.setPassword("doctor123");
        doctor4.setSpecialization("General Practitioner");
        doctor4.setPhone("+91 98765 43210");
        doctor4.setExperience("5 years");
        doctor4.setQualification("MBBS");
        doctor4.setConsultationFee(800.00); // INR

        Doctor doctor5 = new Doctor();
        doctor5.setName("Dr. Jane Smith");
        doctor5.setEmail("jane.smith@health.com");
        doctor5.setPassword("doctor123");
        doctor5.setSpecialization("Gynecologist");
        doctor5.setPhone("+91 99876 54321");
        doctor5.setExperience("12 years");
        doctor5.setQualification("MD, OB/GYN");
        doctor5.setConsultationFee(1000.00); // INR

        Doctor doctor6 = new Doctor();
        doctor6.setName("Dr. Alice Brown");
        doctor6.setEmail("alice.brown@health.com");
        doctor6.setPassword("doctor123");
        doctor6.setSpecialization("Oncologist");
        doctor6.setPhone("+91 99887 65432");
        doctor6.setExperience("10 years");
        doctor6.setQualification("MD, Oncology");
        doctor6.setConsultationFee(1200.00); // INR

        Doctor doctor7 = new Doctor();
        doctor7.setName("Dr. David Wilson");
        doctor7.setEmail("david.wilson@health.com");
        doctor7.setPassword("doctor123");
        doctor7.setSpecialization("Neurologist");
        doctor7.setPhone("+91 99888 76543");
        doctor7.setExperience("12 years");
        doctor7.setQualification("MD, Neurology");
        doctor7.setConsultationFee(1400.00); // INR

        Doctor doctor8 = new Doctor();
        doctor8.setName("Dr. Lisa White");
        doctor8.setEmail("lisa.white@health.com");
        doctor8.setPassword("doctor123");
        doctor8.setSpecialization("Psychiatrist");
        doctor8.setPhone("+91 99889 87654");
        doctor8.setExperience("9 years");
        doctor8.setQualification("MD, Psychiatry");
        doctor8.setConsultationFee(1300.00); // INR

        Doctor doctor9 = new Doctor();
        doctor9.setName("Dr. Mark Green");
        doctor9.setEmail("mark.green@health.com");
        doctor9.setPassword("doctor123");
        doctor9.setSpecialization("Cardiologist");
        doctor9.setPhone("+91 99890 98765");
        doctor9.setExperience("15 years");
        doctor9.setQualification("MD, Cardiology");
        doctor9.setConsultationFee(1500.00); // INR

        Doctor doctor10 = new Doctor();
        doctor10.setName("Dr. Nancy Blue");
        doctor10.setEmail("nancy.blue@health.com");
        doctor10.setPassword("doctor123");
        doctor10.setSpecialization("Pediatrician");
        doctor10.setPhone("+91 99891 09876");
        doctor10.setExperience("10 years");
        doctor10.setQualification("MD, Pediatrics");
        doctor10.setConsultationFee(1200.00); // INR

        doctorRepository.saveAll(Arrays.asList(doctor1, doctor2, doctor3, doctor4, doctor5, doctor6, doctor7, doctor8, doctor9, doctor10));

        // Create sample patients
        Patient patient1 = new Patient();
        patient1.setName("John Smith");
        patient1.setEmail("john.smith@email.com");
        patient1.setPassword("patient123");
        patient1.setPhone("+91 78901 23456");
        patient1.setAge("35");
        patient1.setAddress("123 Main St, New York, NY 10001");
        patient1.setMedicalHistory("Hypertension");
        
        Patient patient2 = new Patient();
        patient2.setName("Emma Davis");
        patient2.setEmail("emma.davis@email.com");
        patient2.setPassword("patient123");
        patient2.setPhone("+91 87654 32100");
        patient2.setAge("28");
        patient2.setAddress("456 Oak Ave, Los Angeles, CA 90001");
        patient2.setMedicalHistory("No significant history");
        
        Patient patient3 = new Patient();
        patient3.setName("Robert Brown");
        patient3.setEmail("robert.brown@email.com");
        patient3.setPassword("patient123");
        patient3.setPhone("+91 98765 43210");
        patient3.setAge("52");
        patient3.setAddress("789 Pine Rd, Chicago, IL 60601");
        patient3.setMedicalHistory("Diabetes Type 2");

        Patient patient4 = new Patient();
        patient4.setName("Olivia Martinez");
        patient4.setEmail("olivia.martinez@email.com");
        patient4.setPassword("patient123");
        patient4.setPhone("+91 87654 32101");
        patient4.setAge("30");
        patient4.setAddress("321 Birch St, Houston, TX 77001");
        patient4.setMedicalHistory("Allergies");

        Patient patient5 = new Patient();
        patient5.setName("Sophia Johnson");
        patient5.setEmail("sophia.johnson@email.com");
        patient5.setPassword("patient123");
        patient5.setPhone("+91 76543 21098");
        patient5.setAge("40");
        patient5.setAddress("654 Cedar St, Phoenix, AZ 85001");
        patient5.setMedicalHistory("Asthma");

        patientRepository.saveAll(Arrays.asList(patient1, patient2, patient3, patient4, patient5));

        // Create sample medicines
        Medicine med1 = new Medicine();
        med1.setName("Aspirin 500mg");
        med1.setDescription("Pain reliever and fever reducer");
        med1.setPrice(345.00);
        med1.setCategory("Pain Relief");
        med1.setStock(500);
        
        Medicine med2 = new Medicine();
        med2.setName("Amoxicillin 250mg");
        med2.setDescription("Antibiotic for bacterial infections");
        med2.setPrice(132.00);
        med2.setCategory("Antibiotics");
        med2.setStock(300);
        
        Medicine med3 = new Medicine();
        med3.setName("Lisinopril 10mg");
        med3.setDescription("Blood pressure medication");
        med3.setPrice(103.00);
        med3.setCategory("Cardiovascular");
        med3.setStock(200);
        
        Medicine med4 = new Medicine();
        med4.setName("Metformin 500mg");
        med4.setDescription("Type 2 diabetes medication");
        med4.setPrice(155.00);
        med4.setCategory("Diabetes");
        med4.setStock(250);
        
        Medicine med5 = new Medicine();
        med5.setName("Vitamin D3 (1000 IU)");
        med5.setDescription("Vitamin supplement");
        med5.setPrice(120.00);
        med5.setCategory("Vitamins");
        med5.setStock(400);

        Medicine med6 = new Medicine();
        med6.setName("Ibuprofen 400mg");
        med6.setDescription("Anti-inflammatory pain reliever");
        med6.setPrice(140.00);
        med6.setCategory("Pain Relief");
        med6.setStock(350);
        med6.setCategory("Pain Relief");
        med6.setStock(350);

        Medicine med7 = new Medicine();
        med7.setName("Cetirizine 10mg");
        med7.setDescription("Antihistamine for allergy relief");
        med7.setPrice(90.00);
        med7.setCategory("Allergy");
        med7.setStock(300);

        Medicine med8 = new Medicine();
        med8.setName("Levocetirizine 5mg");
        med8.setDescription("Antihistamine for allergy relief");
        med8.setPrice(85.00);
        med8.setCategory("Allergy");
        med8.setStock(320);

        Medicine med9 = new Medicine();
        med9.setName("Desloratadine 5mg");
        med9.setDescription("Antihistamine for allergy relief");
        med9.setPrice(95.00);
        med9.setCategory("Allergy");
        med9.setStock(310);

        Medicine med10 = new Medicine();
        med10.setName("Bilastine 20mg");
        med10.setDescription("Antihistamine for allergy relief");
        med10.setPrice(100.00);
        med10.setCategory("Allergy");
        med10.setStock(290);


        medicineRepository.saveAll(Arrays.asList(med1, med2, med3, med4, med5, med6, med7, med8, med9, med10));

        // Create sample appointments
        Appointment apt1 = new Appointment();
        apt1.setPatientId(patient1.getId());
        apt1.setDoctorId(doctor1.getId());
        apt1.setPatientName(patient1.getName());
        apt1.setDoctorName(doctor1.getName());
        apt1.setDate("2024-11-20");
        apt1.setTime("10:00 AM");
        apt1.setStatus("CONFIRMED");
        apt1.setSymptoms("Chest pain, shortness of breath");
        apt1.setConsultationType("VIDEO_CALL");
        apt1.setConsultationFee(1500.00);
        apt1.setPaymentStatus("PAID");
        apt1.setPaymentMethod("UPI");
        apt1.setPaymentTime("BEFORE");
        
        Appointment apt2 = new Appointment();
        apt2.setPatientId(patient2.getId());
        apt2.setDoctorId(doctor2.getId());
        apt2.setPatientName(patient2.getName());
        apt2.setDoctorName(doctor2.getName());
        apt2.setDate("2024-11-21");
        apt2.setTime("2:00 PM");
        apt2.setStatus("PENDING");
        apt2.setSymptoms("Child fever and cough");
        apt2.setConsultationType("AUDIO_CALL");
        apt2.setConsultationFee(1200.00);
        apt2.setPaymentStatus("UNPAID");
        apt2.setPaymentMethod(null);
        apt2.setPaymentTime("AFTER");
        
        appointmentRepository.saveAll(Arrays.asList(apt1, apt2));
        
        // Create  admin
        Admin superAdmin = new Admin();
        superAdmin.setName("Healthconnect Admin");
        superAdmin.setEmail("admin@healthconnect.com");
        superAdmin.setPassword("admin123");
        superAdmin.setPhone("+91 99999 99999");
        superAdmin.setRole("ADMIN");
        superAdmin.setIsActive(true);
        
        
        adminRepository.saveAll(Arrays.asList(superAdmin));
    }
}
