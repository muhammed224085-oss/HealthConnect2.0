# 🤖 AI Chatbot Integration - Complete Guide

## ✅ Implementation Summary

Successfully integrated Google Gemini AI chatbot into HealthConnect with the following features:

### 🎯 Key Features Implemented

1. **AI-Powered Health Assistant**
   - Real-time health query responses
   - Symptom analysis and doctor suggestions
   - Disease information and explanations
   - Medicine clarification and usage guidance

2. **Smart Doctor Recommendation**
   - Automatic doctor specialization suggestion based on symptoms
   - Direct booking from chatbot recommendations
   - Comprehensive doctor information display

3. **User-Friendly Interface**
   - Full-page AI Assistant at `/ai-assistant`
   - Floating chat widget available on all pages
   - Smooth animations and typing indicators
   - Quick question shortcuts

4. **Chat History Management**
   - MongoDB storage of all conversations
   - Patient-specific chat history
   - History retrieval and clearing options

---

## 📂 Files Created/Modified

### Backend (Java Spring Boot)

#### New Files:
1. **ChatMessage.java** - Model for chat history
   - Location: `server/src/main/java/com/healthconnect/model/`
   - MongoDB document with patient info, messages, and doctor suggestions

2. **ChatMessageRepository.java** - Database access layer
   - Location: `server/src/main/java/com/healthconnect/repository/`
   - Methods for chat history retrieval and management

3. **GeminiAIService.java** - Core AI integration
   - Location: `server/src/main/java/com/healthconnect/service/`
   - Handles Gemini API calls, response parsing, symptom analysis

4. **ChatBotController.java** - REST API endpoints
   - Location: `server/src/main/java/com/healthconnect/controller/`
   - Endpoints: `/query`, `/history/{patientId}`, `/test`

#### Modified Files:
- **application.properties** - Added Gemini API configuration
  ```properties
  gemini.api.key=YOUR_API_KEY_HERE
  gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
  ```

### Frontend (React)

#### New Files:
1. **AIHealthAssistant.js** - Full-page chat interface
   - Location: `client/src/pages/`
   - Complete chatbot UI with doctor recommendations

2. **FloatingChatbot.js** - Floating widget component
   - Location: `client/src/components/`
   - Always-available mini chatbot

3. **FloatingChatbot.css** - Styling for floating widget
   - Location: `client/src/components/`
   - Responsive design with animations

#### Modified Files:
- **App.js** - Added routes and floating chatbot
  - New route: `/ai-assistant`
  - Integrated FloatingChatbot component globally

---

## 🔧 Setup Instructions

### Step 1: Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Configure API Key

Edit `server/src/main/resources/application.properties`:

```properties
gemini.api.key=YOUR_ACTUAL_API_KEY_HERE
```

**⚠️ IMPORTANT:** Replace `YOUR_ACTUAL_API_KEY_HERE` with your real Gemini API key!

### Step 3: Rebuild Backend

```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect\server"
mvn clean install -DskipTests
```

### Step 4: Start Servers

#### Backend (in one terminal):
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect\server"
mvn spring-boot:run
```

#### Frontend (in another terminal):
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect\client"
npm start
```

### Step 5: Verify MongoDB is Running

Make sure MongoDB is running on `localhost:27017`

---

## 🎨 User Interface

### 1. Full-Page AI Assistant
- **URL:** http://localhost:3001/ai-assistant
- **Features:**
  - Large chat interface
  - Quick question buttons
  - Doctor recommendation cards
  - Book appointment directly from chat

### 2. Floating Chatbot Widget
- **Location:** Bottom-right corner on all pages
- **Features:**
  - Click 🤖 button to open/close
  - Mini chat window
  - Same AI functionality as full page
  - Doesn't disrupt current page

---

## 🔌 API Endpoints

### 1. Send Chat Query
```
POST /api/chatbot/query
```

**Request Body:**
```json
{
  "message": "I have chest pain and shortness of breath",
  "patientId": "patient123",
  "patientName": "John Doe"
}
```

**Response:**
```json
{
  "message": "AI response text...",
  "messageType": "SYMPTOM",
  "suggestedSpecialization": "Cardiologist",
  "suggestedDoctor": {
    "id": "doc123",
    "name": "Dr. Aarav Nair",
    "specialization": "Cardiologist",
    "qualification": "MD Cardiology",
    "experience": "15 years"
  },
  "timestamp": "2025-10-17T12:34:56"
}
```

### 2. Get Chat History
```
GET /api/chatbot/history/{patientId}
```

**Response:** Array of last 10 chat messages

### 3. Clear Chat History
```
DELETE /api/chatbot/history/{patientId}
```

### 4. Test Gemini Connection
```
GET /api/chatbot/test
```

**Response:**
```json
{
  "status": "success",
  "message": "Gemini API is working",
  "response": "Hello! Yes, I'm working perfectly."
}
```

---

## 🧠 AI Features

### Smart Symptom Analysis

The chatbot can identify symptoms and suggest appropriate doctors:

| Symptoms | Suggested Doctor |
|----------|------------------|
| Chest pain, heart issues, shortness of breath | Cardiologist |
| Skin rash, acne, eczema, itching | Dermatologist |
| Child health, baby issues | Pediatrician |
| Headache, migraine, seizure, dizziness | Neurologist |
| Bone, joint, fracture, back pain | Orthopedic |
| Ear, nose, throat, sinus | ENT Specialist |
| Stomach, abdomen, digestive issues | Gastroenterologist |
| Eye, vision problems | Ophthalmologist |
| General fever, cough | General Physician |

### Message Type Detection

The AI automatically categorizes messages:
- **SYMPTOM** - Patient describes symptoms
- **DISEASE** - Questions about specific diseases
- **MEDICINE** - Questions about medications
- **GENERAL** - General health queries

---

## 💬 Example Conversations

### Example 1: Symptom Query
**User:** "I have chest pain and shortness of breath"

**AI Response:**
> Based on your symptoms of chest pain and shortness of breath, I recommend consulting a Cardiologist immediately. These symptoms could indicate a cardiac issue that requires professional evaluation. Please seek medical attention as soon as possible.

**Action:** Shows recommendation card for Dr. Aarav Nair (Cardiologist) with "Book Appointment" button

### Example 2: Medicine Query
**User:** "What is Paracetamol used for?"

**AI Response:**
> Paracetamol is commonly used to reduce fever and relieve mild to moderate pain such as headaches, toothaches, and muscle aches. The typical adult dosage is 500-1000mg every 4-6 hours. Important: Avoid exceeding the maximum daily dose and don't mix with alcohol.

### Example 3: Disease Information
**User:** "Tell me about diabetes"

**AI Response:**
> Diabetes is a chronic condition where blood sugar levels are too high due to insufficient insulin production or insulin resistance. It can lead to serious complications if not managed properly. I recommend consulting a General Physician or Endocrinologist for proper diagnosis and treatment.

---

## 🗄️ Database Schema

### chat_history Collection (MongoDB)

```javascript
{
  "_id": "ObjectId",
  "patientId": "string",
  "patientName": "string",
  "userMessage": "string",
  "botResponse": "string",
  "suggestedDoctor": "string",
  "suggestedSpecialization": "string",
  "timestamp": "ISODate",
  "messageType": "string" // SYMPTOM, DISEASE, MEDICINE, GENERAL
}
```

---

## 🧪 Testing the Chatbot

### Test 1: Backend API Connection
```powershell
# Test if Gemini API is working
curl http://localhost:8080/api/chatbot/test
```

### Test 2: Send a Query via Postman/Thunder Client
```
POST http://localhost:8080/api/chatbot/query
Content-Type: application/json

{
  "message": "I have a headache",
  "patientId": "test123",
  "patientName": "Test User"
}
```

### Test 3: Frontend Testing
1. Open http://localhost:3001
2. Click the floating 🤖 button (bottom-right)
3. Type: "I have chest pain"
4. Check if AI responds with doctor suggestion

### Test 4: Full Page Assistant
1. Navigate to http://localhost:3001/ai-assistant
2. Click quick question buttons
3. Verify doctor recommendation cards appear
4. Test "Book Appointment" button

---

## ⚠️ Troubleshooting

### Issue 1: "Gemini API connection failed"
**Solution:**
- Check if you've added your API key in `application.properties`
- Verify API key is valid at Google AI Studio
- Check internet connection

### Issue 2: "ChatBotController not found" error
**Solution:**
```powershell
cd server
mvn clean install -DskipTests
mvn spring-boot:run
```

### Issue 3: Floating chatbot not showing
**Solution:**
- Check if FloatingChatbot is imported in App.js
- Clear browser cache (Ctrl+Shift+R)
- Check browser console for errors

### Issue 4: CORS error in browser
**Solution:**
- Verify CorsConfig.java allows localhost:3001
- Restart backend after CORS changes

### Issue 5: Doctor suggestion not working
**Solution:**
- Ensure MongoDB has sample doctors data
- Check DoctorRepository is properly injected
- Verify doctor specializations match keywords

---

## 🚀 Next Steps & Enhancements

### Optional Improvements:

1. **Add Voice Input** - Use Web Speech API for voice queries
2. **Multi-language Support** - Translate responses to different languages
3. **Image Analysis** - Upload symptom photos for AI analysis
4. **Appointment Scheduling** - Direct booking from chat with date/time picker
5. **Prescription Refills** - Request medicine refills via chat
6. **Health Tips** - Daily health tips and reminders
7. **Emergency Detection** - Detect critical symptoms and show emergency contact

---

## 📊 Analytics & Monitoring

### Chat Analytics Dashboard (Future Feature)
- Total queries per day
- Most common symptoms
- Most recommended doctors
- Peak usage times
- Patient satisfaction ratings

### Current Tracking:
All chat messages are stored in MongoDB with:
- Patient ID
- Message type
- Timestamp
- Suggested doctor

Query these using ChatMessageRepository methods.

---

## 🔐 Security Considerations

1. **API Key Security**
   - Never commit API key to GitHub
   - Use environment variables in production
   - Rotate keys regularly

2. **User Privacy**
   - Chat history is patient-specific
   - No sensitive medical data in logs
   - CORS properly configured

3. **Input Validation**
   - Backend validates all inputs
   - Prevents injection attacks
   - Rate limiting recommended for production

---

## 📝 Code Structure

### Backend Flow:
```
User Input → ChatBotController → GeminiAIService → Gemini API
                ↓
        DoctorRepository (for suggestions)
                ↓
        ChatMessageRepository (save history)
                ↓
        Response to Frontend
```

### Frontend Flow:
```
User types message → FloatingChatbot/AIHealthAssistant
        ↓
    axios.post('/api/chatbot/query')
        ↓
    Display AI response
        ↓
    Show doctor recommendation card
        ↓
    "Book Appointment" button → Patient Dashboard
```

---

## 🎉 Success Checklist

- ✅ Backend files created (4 new files)
- ✅ Frontend components created (3 new files)
- ✅ API endpoints implemented (/query, /history, /test)
- ✅ Gemini API integration complete
- ✅ Doctor suggestion logic implemented
- ✅ Floating chatbot on all pages
- ✅ Full-page AI assistant at /ai-assistant
- ✅ Chat history storage in MongoDB
- ✅ Message type detection
- ✅ Symptom-to-doctor mapping
- ✅ Medicine information queries
- ✅ Disease explanations
- ✅ Book appointment integration
- ✅ Responsive UI design
- ✅ CORS configured properly

---

## 📞 Support

If you encounter any issues:

1. Check backend logs in terminal
2. Check browser console for frontend errors
3. Verify MongoDB connection
4. Test Gemini API with `/api/chatbot/test` endpoint
5. Ensure all dependencies are installed

---

## 🎊 Integration Complete!

Your AI Health Assistant is now ready to help patients with:
- ✅ Symptom analysis
- ✅ Doctor recommendations
- ✅ Disease information
- ✅ Medicine queries
- ✅ Direct appointment booking

**Next Step:** Add your Gemini API key and start the servers!

---

**Created:** October 17, 2025  
**Developer:** HealthConnect Team  
**Technology:** Google Gemini AI + Spring Boot + React
