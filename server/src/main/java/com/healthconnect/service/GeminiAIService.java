package com.healthconnect.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@Service
public class GeminiAIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Send query to Gemini API and get AI response with retry and fallback logic
     */
    public String getAIResponse(String userQuery) {
        // First attempt
        String aiResponse = tryGeminiAPICall(userQuery);
        
        if (aiResponse != null && !aiResponse.startsWith("ERROR:")) {
            System.out.println("✅ Gemini API responded successfully");
            return aiResponse;
        }
        
        // Retry once after 1 second
        System.out.println("⚠️ First Gemini API call failed. Retrying in 1 second...");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        aiResponse = tryGeminiAPICall(userQuery);
        
        if (aiResponse != null && !aiResponse.startsWith("ERROR:")) {
            System.out.println("✅ Gemini API responded on retry");
            return aiResponse;
        }
        
        // Both attempts failed - use fallback logic
        System.out.println("⚠️ Both Gemini API attempts failed. Using fallback logic.");
        return getFallbackResponse(userQuery);
    }
    
    /**
     * Try calling Gemini API once
     */
    private String tryGeminiAPICall(String userQuery) {
        try {
            // Check if API key is configured
            if (apiKey == null || apiKey.isEmpty() || apiKey.contains("Dummy") || apiKey.contains("Replace")) {
                System.err.println("❌ Gemini API key not configured properly");
                return "ERROR: API key not configured";
            }
            
            String fullUrl = apiUrl + "?key=" + apiKey;
            
            // Build request body for Gemini API
            Map<String, Object> requestBody = new HashMap<>();
            
            // Create contents array
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();
            
            // Create parts array
            List<Map<String, String>> parts = new ArrayList<>();
            Map<String, String> part = new HashMap<>();
            part.put("text", buildHealthcarePrompt(userQuery));
            parts.add(part);
            
            content.put("parts", parts);
            contents.add(content);
            requestBody.put("contents", contents);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Create HTTP entity
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Call Gemini API with timeout
            ResponseEntity<String> response = restTemplate.exchange(
                fullUrl,
                HttpMethod.POST,
                entity,
                String.class
            );

            // Parse response
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return parseGeminiResponse(response.getBody());
            }

            return "ERROR: Invalid response from API";

        } catch (HttpClientErrorException e) {
            System.err.println("❌ Gemini API Client Error: " + e.getStatusCode() + " - " + e.getMessage());
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED || e.getStatusCode() == HttpStatus.FORBIDDEN) {
                System.err.println("❌ Check your API key configuration!");
            }
            return "ERROR: " + e.getMessage();
        } catch (HttpServerErrorException e) {
            System.err.println("❌ Gemini API Server Error: " + e.getStatusCode() + " - " + e.getMessage());
            return "ERROR: " + e.getMessage();
        } catch (ResourceAccessException e) {
            System.err.println("❌ Gemini API Connection Error: " + e.getMessage());
            return "ERROR: Connection failed";
        } catch (Exception e) {
            System.err.println("❌ Unexpected error calling Gemini API: " + e.getMessage());
            e.printStackTrace();
            return "ERROR: " + e.getMessage();
        }
    }
    
    /**
     * Fallback response using local symptom-based logic
     */
    private String getFallbackResponse(String userQuery) {
        String query = userQuery.toLowerCase();
        
        // Check for medicine-related queries
        if (query.contains("medicine") || query.contains("tablet") || query.contains("drug") || 
            query.contains("paracetamol") || query.contains("aspirin") || query.contains("ibuprofen")) {
            return getFallbackMedicineInfo(query);
        }
        
        // Check for disease information
        if (query.contains("what is") || query.contains("tell me about") || 
            query.contains("diabetes") || query.contains("hypertension") || query.contains("asthma")) {
            return getFallbackDiseaseInfo(query);
        }
        
        // Default to symptom-based doctor suggestion
        return getFallbackSymptomResponse(query);
    }
    
    /**
     * Fallback medicine information
     */
    private String getFallbackMedicineInfo(String query) {
        if (query.contains("paracetamol") || query.contains("acetaminophen")) {
            return "Paracetamol (Acetaminophen) is commonly used to reduce fever and relieve mild to moderate pain such as headaches, toothaches, and muscle aches. " +
                   "Typical adult dosage is 500-1000mg every 4-6 hours. Important: Do not exceed 4000mg in 24 hours and avoid mixing with alcohol. " +
                   "If symptoms persist, please consult a General Physician.";
        }
        
        if (query.contains("aspirin")) {
            return "Aspirin is used to reduce pain, fever, and inflammation. It's also used in low doses to prevent heart attacks and strokes. " +
                   "Typical dosage is 300-900mg for pain relief. Important: May cause stomach irritation. Consult a doctor before use if you have bleeding disorders. " +
                   "For heart-related concerns, please consult a Cardiologist.";
        }
        
        if (query.contains("ibuprofen")) {
            return "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to reduce fever, pain, and inflammation. " +
                   "Typical adult dosage is 200-400mg every 4-6 hours. Important: Take with food to reduce stomach upset. " +
                   "If you have persistent pain, consult a General Physician.";
        }
        
        return "For specific medicine information, I recommend consulting with a pharmacist or your doctor. " +
               "Always follow the prescribed dosage and read the medication guide. If you have concerns about a medication, please consult a General Physician.";
    }
    
    /**
     * Fallback disease information
     */
    private String getFallbackDiseaseInfo(String query) {
        if (query.contains("diabetes")) {
            return "Diabetes is a chronic condition where blood sugar levels are too high due to insufficient insulin production or insulin resistance. " +
                   "Common symptoms include increased thirst, frequent urination, fatigue, and blurred vision. " +
                   "Management includes diet control, exercise, and medication. Please consult a General Physician or Endocrinologist for proper diagnosis and treatment.";
        }
        
        if (query.contains("hypertension") || query.contains("high blood pressure")) {
            return "Hypertension (high blood pressure) is a condition where blood pressure remains consistently elevated. " +
                   "It often has no symptoms but can lead to serious complications like heart disease and stroke. " +
                   "Management includes lifestyle changes and medication. Please consult a Cardiologist for proper evaluation.";
        }
        
        if (query.contains("asthma")) {
            return "Asthma is a chronic respiratory condition causing inflammation and narrowing of airways, leading to breathing difficulties. " +
                   "Common symptoms include wheezing, shortness of breath, chest tightness, and coughing. " +
                   "Treatment involves inhalers and avoiding triggers. Please consult a Pulmonologist or General Physician.";
        }
        
        return "For detailed disease information and proper diagnosis, please consult with a qualified healthcare professional. " +
               "I recommend scheduling an appointment with a General Physician who can guide you further.";
    }
    
    /**
     * Fallback symptom-based doctor suggestion
     */
    private String getFallbackSymptomResponse(String query) {
        String specialization = suggestDoctorSpecialization(query);
        
        StringBuilder response = new StringBuilder();
        response.append("Based on your symptoms, I recommend consulting a ").append(specialization).append(". ");
        
        // Add symptom-specific advice
        if (specialization.equals("Cardiologist")) {
            response.append("Heart-related symptoms should be evaluated immediately. Please seek medical attention as soon as possible.");
        } else if (specialization.equals("Dermatologist")) {
            response.append("Skin conditions can often be treated effectively with proper diagnosis and care.");
        } else if (specialization.equals("Pediatrician")) {
            response.append("Children have unique health needs that require specialized pediatric care.");
        } else if (specialization.equals("Neurologist")) {
            response.append("Neurological symptoms should be properly evaluated to determine the underlying cause.");
        } else if (specialization.equals("Orthopedic")) {
            response.append("Bone and joint issues benefit from specialized orthopedic evaluation and treatment.");
        } else if (specialization.equals("ENT Specialist")) {
            response.append("Ear, nose, and throat issues can significantly affect your quality of life and should be examined.");
        } else if (specialization.equals("Gastroenterologist")) {
            response.append("Digestive issues should be properly diagnosed to ensure appropriate treatment.");
        } else if (specialization.equals("Ophthalmologist")) {
            response.append("Vision problems should be examined promptly to prevent further complications.");
        } else {
            response.append("A general checkup can help identify and address your health concerns.");
        }
        
        response.append(" Please note that this is general guidance and not a medical diagnosis.");
        
        return response.toString();
    }

    /**
     * Build a healthcare-focused prompt for Gemini
     */
    private String buildHealthcarePrompt(String userQuery) {
        return "You are a helpful medical AI assistant for HealthConnect, a healthcare platform. " +
               "Your role is to provide general health information, symptom analysis, and doctor recommendations. " +
               "IMPORTANT: Always remind users that this is general information and they should consult a real doctor for proper diagnosis. " +
               "\n\nUser Query: " + userQuery + 
               "\n\nProvide a helpful, concise response (3-4 sentences maximum). " +
               "If symptoms are mentioned, suggest which type of doctor to consult (Cardiologist, Dermatologist, Pediatrician, General Physician, etc.). " +
               "If a medicine name is mentioned, provide general information about its uses and precautions. " +
               "Keep the response simple and easy to understand.";
    }

    /**
     * Parse Gemini API JSON response
     */
    private String parseGeminiResponse(String jsonResponse) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode candidates = root.path("candidates");
            
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode content = candidates.get(0).path("content");
                JsonNode parts = content.path("parts");
                
                if (parts.isArray() && parts.size() > 0) {
                    String text = parts.get(0).path("text").asText();
                    return text.trim();
                }
            }

            return "Sorry, I couldn't generate a proper response. Please try rephrasing your question.";

        } catch (Exception e) {
            System.err.println("Error parsing Gemini response: " + e.getMessage());
            return "Sorry, I encountered an error processing the response.";
        }
    }

    /**
     * Analyze symptoms and suggest doctor specialization
     */
    public String suggestDoctorSpecialization(String symptoms) {
        symptoms = symptoms.toLowerCase();

        // Cardiology
        if (symptoms.contains("chest pain") || symptoms.contains("heart") || 
            symptoms.contains("shortness of breath") || symptoms.contains("palpitation")) {
            return "Cardiologist";
        }

        // Dermatology
        if (symptoms.contains("skin") || symptoms.contains("rash") || 
            symptoms.contains("acne") || symptoms.contains("eczema") || symptoms.contains("itching")) {
            return "Dermatologist";
        }

        // Pediatrics
        if (symptoms.contains("child") || symptoms.contains("baby") || 
            symptoms.contains("infant") || symptoms.contains("kid")) {
            return "Pediatrician";
        }

        // Neurology
        if (symptoms.contains("headache") || symptoms.contains("migraine") || 
            symptoms.contains("seizure") || symptoms.contains("dizzy") || symptoms.contains("vertigo")) {
            return "Neurologist";
        }

        // Orthopedics
        if (symptoms.contains("bone") || symptoms.contains("joint") || 
            symptoms.contains("fracture") || symptoms.contains("sprain") || symptoms.contains("back pain")) {
            return "Orthopedic";
        }

        // ENT
        if (symptoms.contains("ear") || symptoms.contains("nose") || 
            symptoms.contains("throat") || symptoms.contains("sinus")) {
            return "ENT Specialist";
        }

        // Gastroenterology
        if (symptoms.contains("stomach") || symptoms.contains("abdomen") || 
            symptoms.contains("diarrhea") || symptoms.contains("constipation") || 
            symptoms.contains("nausea") || symptoms.contains("vomiting")) {
            return "Gastroenterologist";
        }

        // Ophthalmology
        if (symptoms.contains("eye") || symptoms.contains("vision") || 
            symptoms.contains("blurry") || symptoms.contains("blind")) {
            return "Ophthalmologist";
        }

        // Default
        return "General Physician";
    }

    /**
     * Determine message type based on content
     */
    public String determineMessageType(String message) {
        message = message.toLowerCase();

        // Check for medicine-related queries
        if (message.contains("medicine") || message.contains("tablet") || 
            message.contains("capsule") || message.contains("drug") ||
            message.contains("paracetamol") || message.contains("aspirin") ||
            message.contains("medication") || message.contains("pill")) {
            return "MEDICINE";
        }

        // Check for disease information
        if (message.contains("what is") || message.contains("disease") || 
            message.contains("diabetes") || message.contains("hypertension") ||
            message.contains("cancer") || message.contains("infection")) {
            return "DISEASE";
        }

        // Check for symptoms
        if (message.contains("pain") || message.contains("fever") || 
            message.contains("cough") || message.contains("headache") ||
            message.contains("feel") || message.contains("symptom")) {
            return "SYMPTOM";
        }

        return "GENERAL";
    }
}
