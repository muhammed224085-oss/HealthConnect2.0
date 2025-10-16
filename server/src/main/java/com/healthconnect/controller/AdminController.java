package com.healthconnect.controller;

import com.healthconnect.model.*;
import com.healthconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private MedicineRepository medicineRepository;
    
    @Autowired
    private PrescriptionRepository prescriptionRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private MessageRepository messageRepository;

    // Admin Authentication
    @GetMapping("/test-admins")
    public ResponseEntity<?> testAdmins() {
        List<Admin> allAdmins = adminRepository.findAll();
        System.out.println("Total admins in database: " + allAdmins.size());
        for (Admin a : allAdmins) {
            System.out.println("Admin: " + a.getEmail() + " | Password: " + a.getPassword() + " | Active: " + a.getIsActive());
        }
        return ResponseEntity.ok(allAdmins);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Admin admin) {
        System.out.println("Login attempt - Email: " + admin.getEmail());
        Optional<Admin> foundAdmin = adminRepository.findByEmail(admin.getEmail());
        
        if (foundAdmin.isPresent()) {
            System.out.println("Admin found - Email: " + foundAdmin.get().getEmail());
            System.out.println("Stored password: " + foundAdmin.get().getPassword());
            System.out.println("Provided password: " + admin.getPassword());
            System.out.println("Passwords match: " + foundAdmin.get().getPassword().equals(admin.getPassword()));
            System.out.println("Is Active: " + foundAdmin.get().getIsActive());
            
            if (foundAdmin.get().getPassword().equals(admin.getPassword())) {
                if (foundAdmin.get().getIsActive()) {
                    return ResponseEntity.ok(foundAdmin.get());
                } else {
                    return ResponseEntity.status(403).body("Admin account is deactivated");
                }
            }
        } else {
            System.out.println("Admin not found with email: " + admin.getEmail());
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Admin admin) {
        if (adminRepository.findByEmail(admin.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Admin email already exists");
        }
        admin.setIsActive(true);
        admin.setRole("ADMIN"); // Default role
        Admin savedAdmin = adminRepository.save(admin);
        return ResponseEntity.ok(savedAdmin);
    }

    // Dashboard Statistics
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        Map<String, Long> stats = Map.of(
            "totalDoctors", doctorRepository.count(),
            "totalPatients", patientRepository.count(),
            "totalAppointments", appointmentRepository.count(),
            "totalMedicines", medicineRepository.count(),
            "totalOrders", orderRepository.count(),
            "totalPrescriptions", prescriptionRepository.count()
        );
        return ResponseEntity.ok(stats);
    }

    // Doctor Management
    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @PostMapping("/doctors")
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        return ResponseEntity.ok(doctorRepository.save(doctor));
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable String id, @RequestBody Doctor doctor) {
        doctor.setId(id);
        return ResponseEntity.ok(doctorRepository.save(doctor));
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable String id) {
        doctorRepository.deleteById(id);
        return ResponseEntity.ok("Doctor deleted successfully");
    }

    // Patient Management
    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientRepository.findAll());
    }

    @PutMapping("/patients/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable String id, @RequestBody Patient patient) {
        patient.setId(id);
        return ResponseEntity.ok(patientRepository.save(patient));
    }

    @DeleteMapping("/patients/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable String id) {
        patientRepository.deleteById(id);
        return ResponseEntity.ok("Patient deleted successfully");
    }

    // Appointment Management
    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @PutMapping("/appointments/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable String id, @RequestBody Appointment appointment) {
        appointment.setId(id);
        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable String id) {
        appointmentRepository.deleteById(id);
        return ResponseEntity.ok("Appointment deleted successfully");
    }

    // Medicine Management
    @GetMapping("/medicines")
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        return ResponseEntity.ok(medicineRepository.findAll());
    }

    @PostMapping("/medicines")
    public ResponseEntity<Medicine> createMedicine(@RequestBody Medicine medicine) {
        return ResponseEntity.ok(medicineRepository.save(medicine));
    }

    @PutMapping("/medicines/{id}")
    public ResponseEntity<Medicine> updateMedicine(@PathVariable String id, @RequestBody Medicine medicine) {
        medicine.setId(id);
        return ResponseEntity.ok(medicineRepository.save(medicine));
    }

    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable String id) {
        medicineRepository.deleteById(id);
        return ResponseEntity.ok("Medicine deleted successfully");
    }

    // Order Management
    @GetMapping("/orders")
    public ResponseEntity<List<MedicineOrder>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<MedicineOrder> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<MedicineOrder> order = orderRepository.findById(id);
        if (order.isPresent()) {
            MedicineOrder updatedOrder = order.get();
            updatedOrder.setStatus(body.get("status"));
            return ResponseEntity.ok(orderRepository.save(updatedOrder));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable String id) {
        orderRepository.deleteById(id);
        return ResponseEntity.ok("Order deleted successfully");
    }

    // Prescription Management
    @GetMapping("/prescriptions")
    public ResponseEntity<List<Prescription>> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionRepository.findAll());
    }

    @DeleteMapping("/prescriptions/{id}")
    public ResponseEntity<?> deletePrescription(@PathVariable String id) {
        prescriptionRepository.deleteById(id);
        return ResponseEntity.ok("Prescription deleted successfully");
    }

    // Message Management
    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getAllMessages() {
        return ResponseEntity.ok(messageRepository.findAll());
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable String id) {
        messageRepository.deleteById(id);
        return ResponseEntity.ok("Message deleted successfully");
    }

    // Admin Management (Super Admin only features)
    @GetMapping("/admins")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminRepository.findAll());
    }

    @PutMapping("/admins/{id}/activate")
    public ResponseEntity<Admin> activateAdmin(@PathVariable String id) {
        Optional<Admin> admin = adminRepository.findById(id);
        if (admin.isPresent()) {
            Admin updatedAdmin = admin.get();
            updatedAdmin.setIsActive(true);
            return ResponseEntity.ok(adminRepository.save(updatedAdmin));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/admins/{id}/deactivate")
    public ResponseEntity<Admin> deactivateAdmin(@PathVariable String id) {
        Optional<Admin> admin = adminRepository.findById(id);
        if (admin.isPresent()) {
            Admin updatedAdmin = admin.get();
            updatedAdmin.setIsActive(false);
            return ResponseEntity.ok(adminRepository.save(updatedAdmin));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/admins/{id}/role")
    public ResponseEntity<Admin> updateAdminRole(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<Admin> admin = adminRepository.findById(id);
        if (admin.isPresent()) {
            Admin updatedAdmin = admin.get();
            updatedAdmin.setRole(body.get("role"));
            return ResponseEntity.ok(adminRepository.save(updatedAdmin));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/admins/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable String id) {
        adminRepository.deleteById(id);
        return ResponseEntity.ok("Admin deleted successfully");
    }
}
