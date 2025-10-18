package com.healthconnect.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatBotController {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final ObjectMapper mapper = new ObjectMapper();
    private final RestTemplate rest = new RestTemplate();
    private final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

    @PostMapping("/query")
    public ResponseEntity<Map<String, Object>> queryChatbot(@RequestBody Map<String, String> body) {
        String userMessage = body.getOrDefault("message", "").trim();
        if (userMessage.isEmpty()) {
            Map<String, Object> resp = Map.of(
                "reply", "Hello! I'm Dr. AI, your virtual health assistant. How can I help you today? Please describe your symptoms or health concerns, and I'll do my best to guide you.", 
                "timestamp", now()
            );
            return ResponseEntity.badRequest().body(resp);
        }

        // System prompt for Gemini - Dr. AI persona
        String systemPrompt = "You are Dr. AI, a professional and friendly virtual doctor. Your role is to provide medical guidance, health tips, and answer patient queries accurately, clearly, and politely. "
                + "\n\nGuidelines:\n"
                + "1. Always ask follow-up questions if the patient's description is unclear (e.g., 'How long have you had these symptoms?' or 'Do you have any other symptoms?').\n"
                + "2. Provide general advice; do not prescribe real medications or replace professional medical consultation.\n"
                + "3. Use a friendly, empathetic, and professional tone. Start responses with empathy like 'I'm sorry to hear that' or 'I understand your concern'.\n"
                + "4. Give clear steps for home care, symptom monitoring, and when to consult a real doctor.\n"
                + "5. If asked about medication or treatment, suggest consulting a licensed physician or pharmacist.\n"
                + "6. When recommending specialists, suggest types like Cardiologist, Dermatologist, Neurologist, Pediatrician, Orthopedist, Dentist, or General Physician.\n"
                + "7. Provide simple explanations for medical terms.\n"
                + "8. Prioritize patient safety in all responses.\n"
                + "9. Keep responses concise (3-5 sentences) but informative and caring.\n"
                + "10. Always end with encouragement or reassurance when appropriate.";

        Map<String, Object> requestJson = Map.of(
                "contents", new Object[]{
                        Map.of("role", "system", "parts", new Object[]{Map.of("text", systemPrompt)}),
                        Map.of("role", "user", "parts", new Object[]{Map.of("text", userMessage)})
                }
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(geminiApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestJson, headers);

        String aiReply = null;
        try {
            aiReply = callGemini(entity);
        } catch (Exception e1) {
            try {
                Thread.sleep(1000);
                aiReply = callGemini(entity);
            } catch (Exception e2) {
                // fallback
            }
        }

        if (aiReply == null || aiReply.isBlank()) {
            Map<String, String> fallback = fallbackResponse(userMessage);
            Map<String, Object> resp = new HashMap<>();
            resp.put("reply", fallback.get("reply"));
            resp.put("recommendedDoctor", fallback.get("doctor"));
            resp.put("specialization", fallback.get("specialization"));
            resp.put("timestamp", now());
            return ResponseEntity.ok(resp);
        }

        String suggestedSpec = detectSpecialization(aiReply);
        String sampleDoctor = sampleDoctorForSpec(suggestedSpec);

        Map<String, Object> resp = new HashMap<>();
        resp.put("reply", aiReply);
        resp.put("recommendedDoctor", sampleDoctor);
        resp.put("specialization", suggestedSpec);
        resp.put("timestamp", now());
        return ResponseEntity.ok(resp);
    }

    private String callGemini(HttpEntity<Map<String, Object>> entity) throws Exception {
        ResponseEntity<String> response = rest.postForEntity(GEMINI_URL + "?key=" + geminiApiKey, entity, String.class);
        if (response.getStatusCode() != HttpStatus.OK) throw new RuntimeException("API error " + response.getStatusCode());
        JsonNode root = mapper.readTree(response.getBody());
        JsonNode candidates = root.path("candidates");
        if (candidates.isArray() && candidates.size() > 0) {
            JsonNode parts = candidates.get(0).path("content").path("parts");
            if (parts.isArray() && parts.size() > 0) {
                return parts.get(0).path("text").asText("").trim();
            }
        }
        return null;
    }

    private Map<String, String> fallbackResponse(String msg) {
        String lower = msg.toLowerCase();
        Map<String, String> map = new HashMap<>();
        
        if (lower.contains("chest") || lower.contains("breath") || lower.contains("heart")) {
            map.put("specialization", "Cardiologist");
            map.put("doctor", "Dr. Aarav Nair");
            map.put("reply", "I'm sorry to hear you're experiencing these symptoms. Chest pain or breathing difficulties can be concerning. "
                    + "Can you tell me how long you've had these symptoms and if they worsen with activity? "
                    + "For safety, I recommend consulting a Cardiologist soon, especially if symptoms persist or worsen. "
                    + "In the meantime, try to rest and avoid strenuous activities.");
            return map;
        }
        if (lower.contains("skin") || lower.contains("rash") || lower.contains("itch")) {
            map.put("specialization", "Dermatologist");
            map.put("doctor", "Dr. Sneha Menon");
            map.put("reply", "I understand skin issues can be quite uncomfortable. "
                    + "Have you noticed any triggers like new products, foods, or environmental factors? "
                    + "For proper diagnosis and treatment, I recommend visiting a Dermatologist. "
                    + "Meanwhile, avoid scratching the area and keep it clean and moisturized.");
            return map;
        }
        if (lower.contains("child") || lower.contains("baby") || lower.contains("kid")) {
            map.put("specialization", "Pediatrician");
            map.put("doctor", "Dr. Rohan Pillai");
            map.put("reply", "I understand your concern about your child's health. "
                    + "Could you provide more details about the symptoms and how long they've been present? "
                    + "For children's health concerns, it's best to consult a Pediatrician who specializes in child care. "
                    + "They can provide age-appropriate guidance and treatment.");
            return map;
        }
        if (lower.contains("headache") || lower.contains("dizzy") || lower.contains("migraine")) {
            map.put("specialization", "Neurologist");
            map.put("doctor", "Dr. Aditya Varma");
            map.put("reply", "I'm sorry you're dealing with head pain or dizziness. "
                    + "How long have you had these symptoms? Do you experience nausea, sensitivity to light, or vision changes? "
                    + "For persistent or severe headaches, consulting a Neurologist is advisable. "
                    + "In the meantime, ensure you're well-hydrated and resting in a quiet, dark room.");
            return map;
        }
        if (lower.contains("joint") || lower.contains("bone") || lower.contains("injury") || lower.contains("fracture")) {
            map.put("specialization", "Orthopedist");
            map.put("doctor", "Dr. Arjun Dev");
            map.put("reply", "I understand joint or bone issues can be quite painful and limiting. "
                    + "Was there a specific injury or has this developed gradually? "
                    + "I recommend seeing an Orthopedic specialist for proper evaluation and treatment. "
                    + "Until then, try to rest the affected area and apply ice if there's swelling.");
            return map;
        }
        if (lower.contains("fever") || lower.contains("temperature")) {
            map.put("specialization", "General Physician");
            map.put("doctor", "Dr. Kavya Raj");
            map.put("reply", "I'm sorry to hear you have a fever. "
                    + "How high is your temperature and do you have other symptoms like cough, body aches, or chills? "
                    + "Please consult a General Physician for proper assessment. "
                    + "Stay hydrated, get plenty of rest, and monitor your temperature regularly.");
            return map;
        }
        if (lower.contains("tooth") || lower.contains("dental") || lower.contains("gum")) {
            map.put("specialization", "Dentist");
            map.put("doctor", "Dr. Neha Ramesh");
            map.put("reply", "I understand dental issues can be quite painful. "
                    + "Is the pain constant or does it come and go? Do you notice any swelling? "
                    + "I recommend seeing a Dentist as soon as possible for proper dental care. "
                    + "Meanwhile, rinse with warm salt water and avoid very hot or cold foods.");
            return map;
        }
        
        map.put("specialization", "General Physician");
        map.put("doctor", "Dr. Kavya Raj");
        map.put("reply", "Thank you for reaching out. I'd like to help you better. "
                + "Could you please describe your symptoms in more detail? For example, when did they start and how severe are they? "
                + "Based on your symptoms, I recommend consulting a General Physician for a comprehensive evaluation. "
                + "They can provide personalized care and guidance for your specific situation.");
        return map;
    }

    private String detectSpecialization(String aiText) {
        String t = aiText.toLowerCase();
        if (t.contains("cardio") || t.contains("heart")) return "Cardiologist";
        if (t.contains("derma") || t.contains("skin")) return "Dermatologist";
        if (t.contains("neuro") || t.contains("headache") || t.contains("migraine")) return "Neurologist";
        if (t.contains("pediatric") || t.contains("child")) return "Pediatrician";
        if (t.contains("ortho") || t.contains("joint") || t.contains("bone")) return "Orthopedist";
        if (t.contains("dent") || t.contains("tooth")) return "Dentist";
        return "General Physician";
    }

    private String sampleDoctorForSpec(String spec) {
        return switch (spec) {
            case "Cardiologist" -> "Dr. Aarav Nair";
            case "Dermatologist" -> "Dr. Sneha Menon";
            case "Neurologist" -> "Dr. Aditya Varma";
            case "Pediatrician" -> "Dr. Rohan Pillai";
            case "Orthopedist" -> "Dr. Arjun Dev";
            case "Dentist" -> "Dr. Neha Ramesh";
            default -> "Dr. Kavya Raj";
        };
    }

    private String now() {
        return LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm:ss a"));
    }
}
