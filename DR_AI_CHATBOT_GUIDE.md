# 🩺 Dr. AI - Virtual Doctor Chatbot Guide

## Overview
Dr. AI is a professional, empathetic virtual doctor integrated into the HealthConnect application. It provides medical guidance, health tips, and specialist recommendations using AI-powered responses.

---

## 🌟 Key Features

### 1. **Professional Medical Persona**
- Acts as a friendly, empathetic virtual doctor
- Uses professional medical terminology with simple explanations
- Always prioritizes patient safety in responses

### 2. **Intelligent Symptom Analysis**
- Asks follow-up questions for unclear symptoms
- Provides home care recommendations
- Suggests when to seek professional medical help

### 3. **Specialist Recommendations**
Dr. AI recommends appropriate specialists based on symptoms:
- 🫀 **Cardiologist** - Heart, chest, breathing issues (Dr. Aarav Nair)
- 🧴 **Dermatologist** - Skin, rash, itching problems (Dr. Sneha Menon)
- 🧠 **Neurologist** - Headaches, dizziness, migraines (Dr. Aditya Varma)
- 👶 **Pediatrician** - Child health concerns (Dr. Rohan Pillai)
- 🦴 **Orthopedist** - Joint, bone, injury issues (Dr. Arjun Dev)
- 🦷 **Dentist** - Dental and gum problems (Dr. Neha Ramesh)
- 👨‍⚕️ **General Physician** - General health concerns (Dr. Kavya Raj)

### 4. **Dual Mode Operation**

#### **AI-Powered Mode (With Gemini API)**
- Uses Google's Gemini Pro AI for intelligent responses
- Understands context and medical queries
- Provides detailed, personalized guidance
- Retry mechanism for reliability

#### **Fallback Mode (Without API Key)**
- Keyword-based intelligent responses
- Still provides useful medical guidance
- Recommends appropriate specialists
- Works offline or when API is unavailable

---

## 🔧 Technical Implementation

### Backend - ChatBotController.java
**Location:** `server/src/main/java/com/healthconnect/controller/ChatBotController.java`

#### Key Components:
```java
@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatBotController {
    @Value("${gemini.api.key}")
    private String geminiApiKey;
    
    @PostMapping("/query")
    public ResponseEntity<Map<String, Object>> queryChatbot(...)
}
```

#### Response Format:
```json
{
  "reply": "Doctor's response with empathy and guidance",
  "recommendedDoctor": "Dr. Name",
  "specialization": "Specialty Type",
  "timestamp": "12:30:45 PM"
}
```

### Frontend Components

#### 1. **ChatWidget.jsx** (New Component)
**Location:** `client/src/components/ChatWidget.jsx`

**Features:**
- Floating chat button with gradient design
- Professional purple gradient theme (#667eea to #764ba2)
- Message history with timestamps
- Doctor recommendations with highlighted cards
- Responsive design

**Usage:**
```jsx
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <div>
      <ChatWidget />
    </div>
  );
}
```

#### 2. **FloatingChatbot.js** (Existing Component)
**Location:** `client/src/components/FloatingChatbot.js`

Already integrated in App.js and appears on all pages.

---

## 🚀 Setup Instructions

### Step 1: Configure Gemini API (Optional but Recommended)

1. **Get Your Free API Key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with Google account
   - Click "Create API Key"
   - Copy your API key

2. **Add to Configuration:**
   - Open: `server/src/main/resources/application.properties`
   - Replace: `YOUR_ACTUAL_GEMINI_API_KEY_HERE` with your actual key

```properties
# Google Gemini API Configuration
gemini.api.key=YOUR_ACTUAL_API_KEY_HERE
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

### Step 2: Build & Run

```powershell
# 1. Build the backend
cd "C:\Users\shame\Desktop\Project App\HealthConnect\server"
mvn clean package -DskipTests

# 2. Start backend server
mvn spring-boot:run

# 3. Start frontend (in new terminal)
cd "C:\Users\shame\Desktop\Project App\HealthConnect\client"
npm start
```

### Step 3: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Chatbot Endpoint:** http://localhost:8080/api/chatbot/query

---

## 💬 Dr. AI Response Examples

### Example 1: Chest Pain Inquiry
**User:** "I have chest pain and difficulty breathing"

**Dr. AI Response:**
```
I'm sorry to hear you're experiencing these symptoms. Chest pain or breathing 
difficulties can be concerning. Can you tell me how long you've had these 
symptoms and if they worsen with activity? For safety, I recommend consulting 
a Cardiologist soon, especially if symptoms persist or worsen. In the meantime, 
try to rest and avoid strenuous activities.

👨‍⚕️ Recommended Specialist
Dr. Aarav Nair
Cardiologist
```

### Example 2: Skin Issue
**User:** "My skin is itchy and has red rashes"

**Dr. AI Response:**
```
I understand skin issues can be quite uncomfortable. Have you noticed any 
triggers like new products, foods, or environmental factors? For proper 
diagnosis and treatment, I recommend visiting a Dermatologist. Meanwhile, 
avoid scratching the area and keep it clean and moisturized.

👨‍⚕️ Recommended Specialist
Dr. Sneha Menon
Dermatologist
```

### Example 3: Headache
**User:** "I have a severe headache"

**Dr. AI Response:**
```
I'm sorry you're dealing with head pain. How long have you had these symptoms? 
Do you experience nausea, sensitivity to light, or vision changes? For 
persistent or severe headaches, consulting a Neurologist is advisable. 
In the meantime, ensure you're well-hydrated and resting in a quiet, dark room.

👨‍⚕️ Recommended Specialist
Dr. Aditya Varma
Neurologist
```

---

## 🎨 UI Design

### Color Scheme
- **Primary Gradient:** #667eea → #764ba2 (Purple gradient)
- **User Messages:** #667eea (Purple)
- **Bot Messages:** #fff (White with shadow)
- **Background:** #f8f9fa (Light gray)
- **Specialist Card:** #f0f4ff (Light blue)

### Visual Elements
- 🩺 Doctor icon in header
- 👨‍⚕️ Specialist recommendation cards
- Rounded corners (border-radius: 12px)
- Subtle shadows for depth
- Smooth animations

---

## 🔒 Safety & Compliance Guidelines

### Dr. AI Follows These Rules:

1. ✅ **Always asks clarifying questions** if symptoms are vague
2. ✅ **Never prescribes real medications** (general advice only)
3. ✅ **Emphasizes seeing real doctors** for actual treatment
4. ✅ **Uses empathetic language** ("I'm sorry to hear that...")
5. ✅ **Provides emergency guidance** (call emergency services when needed)
6. ✅ **Gives simple medical explanations** (no complex jargon)
7. ✅ **Prioritizes patient safety** in all responses
8. ✅ **Recommends appropriate specialists** based on symptoms

### Disclaimer
Dr. AI is a virtual assistant for informational purposes only. It does not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns.

---

## 🧪 Testing the Chatbot

### Test Scenarios:

#### Test 1: Heart Symptoms
```
Input: "chest pain and breathlessness"
Expected: Cardiologist recommendation with safety advice
```

#### Test 2: Skin Issues
```
Input: "itchy red rash on arm"
Expected: Dermatologist recommendation with care tips
```

#### Test 3: Child Health
```
Input: "my baby has fever"
Expected: Pediatrician recommendation with monitoring advice
```

#### Test 4: Medication Query
```
Input: "what is paracetamol used for?"
Expected: General explanation + consult pharmacist advice
```

#### Test 5: Emergency
```
Input: "severe chest pain can't breathe"
Expected: Urgent Cardiologist + emergency services mention
```

---

## 🐛 Troubleshooting

### Issue 1: "Service Not Reachable" Error
**Cause:** Gemini API key missing or invalid
**Solution:** 
- Add valid API key to application.properties
- Or use fallback mode (works without API)

### Issue 2: Backend Not Starting
**Cause:** Port 8080 already in use
**Solution:**
```powershell
# Stop processes on port 8080
$ports = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
foreach($p in $ports) { if($p -ne 0) { Stop-Process -Id $p -Force } }
```

### Issue 3: Frontend Not Compiling
**Cause:** Missing dependencies
**Solution:**
```powershell
cd client
npm install
npm start
```

### Issue 4: CORS Errors
**Cause:** Frontend/backend URL mismatch
**Solution:** Check application.properties:
```properties
cors.allowed.origins=http://localhost:3000,http://localhost:3001
```

---

## 📊 API Endpoint Details

### POST /api/chatbot/query

**Request:**
```json
{
  "message": "I have a headache and fever"
}
```

**Success Response (200):**
```json
{
  "reply": "I'm sorry to hear you have a fever. How high is your temperature...",
  "recommendedDoctor": "Dr. Kavya Raj",
  "specialization": "General Physician",
  "timestamp": "02:30:45 PM"
}
```

**Error Response (400):**
```json
{
  "reply": "Hello! I'm Dr. AI... Please describe your symptoms...",
  "timestamp": "02:30:45 PM"
}
```

---

## 🔄 How It Works

### Flow Diagram:

```
User Types Message
       ↓
Frontend sends to /api/chatbot/query
       ↓
Backend receives message
       ↓
┌──────────────────┐
│ Try Gemini AI    │ → Success → Return AI Response
│ (if API key set) │              + Doctor Recommendation
└──────────────────┘              + Specialization
       ↓ (on failure)
┌──────────────────┐
│ Fallback Mode    │ → Keyword Analysis
│ (keyword-based)  │ → Return Intelligent Response
└──────────────────┘   + Doctor Recommendation
       ↓
Frontend Displays Response
       ↓
User Sees Doctor Recommendation Card
```

---

## 📈 Future Enhancements

### Planned Features:
1. 🗣️ **Voice Input/Output** - Speak to Dr. AI
2. 🌍 **Multi-language Support** - Hindi, Tamil, etc.
3. 📊 **Symptom History Tracking** - Remember past conversations
4. 📅 **Direct Appointment Booking** - Book with recommended doctor
5. 🔔 **Medication Reminders** - Set up pill reminders
6. 📸 **Image Analysis** - Upload photos of symptoms
7. 🧬 **Health Report Analysis** - Explain lab results
8. 💊 **Medicine Interaction Checker** - Check drug interactions

---

## 📝 Code Snippets

### Customizing Welcome Message
```java
// In ChatBotController.java
if (userMessage.isEmpty()) {
    Map<String, Object> resp = Map.of(
        "reply", "Your custom welcome message here!", 
        "timestamp", now()
    );
    return ResponseEntity.badRequest().body(resp);
}
```

### Adding New Specialization
```java
// In detectSpecialization() method
if (t.contains("eye") || t.contains("vision")) return "Ophthalmologist";

// In sampleDoctorForSpec() method
case "Ophthalmologist" -> "Dr. New Doctor Name";

// In fallbackResponse() method
if (lower.contains("eye") || lower.contains("vision")) {
    map.put("specialization", "Ophthalmologist");
    map.put("doctor", "Dr. New Doctor");
    map.put("reply", "Your eye-related response...");
    return map;
}
```

---

## 📞 Support & Contact

For issues or questions:
- Check TROUBLESHOOTING.md
- Review API logs in backend console
- Check browser console for frontend errors
- Ensure MongoDB is running
- Verify ports 8080 and 3000 are free

---

## ✅ Checklist

- [ ] Gemini API key configured (optional)
- [ ] Backend compiles successfully
- [ ] Frontend runs without errors
- [ ] MongoDB is running
- [ ] Chatbot button appears on frontend
- [ ] Messages send and receive properly
- [ ] Doctor recommendations display
- [ ] Specializations detected correctly
- [ ] Fallback mode works (if no API key)
- [ ] Emergency cases handled appropriately

---

**Dr. AI is ready to assist your users with professional, empathetic medical guidance! 🩺**

*Last Updated: October 18, 2025*
