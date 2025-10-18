# 🏗️ AI Chatbot Architecture - Visual Overview

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE LAYER                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────┐    ┌──────────────────────────────┐  │
│  │  AIHealthAssistant.js    │    │  FloatingChatbot.js          │  │
│  │  (/ai-assistant)         │    │  (All pages)                 │  │
│  ├──────────────────────────┤    ├──────────────────────────────┤  │
│  │ • Full page chat UI      │    │ • Bottom-right widget        │  │
│  │ • Quick questions        │    │ • Click to open/close        │  │
│  │ • Message history        │    │ • Mini chat window           │  │
│  │ • Doctor cards           │    │ • Same functionality         │  │
│  │ • Book appointment       │    │ • Compact design             │  │
│  └──────────────────────────┘    └──────────────────────────────┘  │
│                                                                       │
│                            ↓ axios.post()                            │
└─────────────────────────────────────────────────────────────────────┘

                                     ↓

┌─────────────────────────────────────────────────────────────────────┐
│                          REST API LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│                  ┌────────────────────────────────┐                  │
│                  │   ChatBotController.java       │                  │
│                  │   (@RestController)            │                  │
│                  ├────────────────────────────────┤                  │
│                  │  POST /api/chatbot/query       │                  │
│                  │  GET  /api/chatbot/history/:id │                  │
│                  │  DEL  /api/chatbot/history/:id │                  │
│                  │  GET  /api/chatbot/test        │                  │
│                  └────────────────────────────────┘                  │
│                                                                       │
│                            ↓ Service Layer                           │
└─────────────────────────────────────────────────────────────────────┘

                                     ↓

┌─────────────────────────────────────────────────────────────────────┐
│                         BUSINESS LOGIC LAYER                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│         ┌────────────────────────────────────────────┐              │
│         │      GeminiAIService.java                  │              │
│         │      (@Service)                            │              │
│         ├────────────────────────────────────────────┤              │
│         │  • getAIResponse()                         │              │
│         │    - Build healthcare prompt               │              │
│         │    - Call Gemini API                       │              │
│         │    - Parse JSON response                   │              │
│         │                                            │              │
│         │  • suggestDoctorSpecialization()          │              │
│         │    - Analyze symptoms                      │              │
│         │    - Map to specializations                │              │
│         │    - Return doctor type                    │              │
│         │                                            │              │
│         │  • determineMessageType()                 │              │
│         │    - Classify as SYMPTOM/DISEASE/etc      │              │
│         │                                            │              │
│         └────────────────────────────────────────────┘              │
│                                                                       │
│                      ↓                    ↓                          │
└─────────────────────────────────────────────────────────────────────┘

            ↓ HTTP POST                      ↓ MongoDB

┌───────────────────────┐          ┌────────────────────────┐
│   EXTERNAL API        │          │  DATA ACCESS LAYER     │
├───────────────────────┤          ├────────────────────────┤
│                       │          │                        │
│  Google Gemini API    │          │  ChatMessageRepository │
│  (AI Model)           │          │  (@Repository)         │
│                       │          │                        │
│  • gemini-pro model   │          │  DoctorRepository      │
│  • JSON request       │          │  (@Repository)         │
│  • JSON response      │          │                        │
│  • Natural language   │          │                        │
│                       │          └────────────────────────┘
└───────────────────────┘                    ↓

                                   ┌────────────────────────┐
                                   │   DATABASE LAYER       │
                                   ├────────────────────────┤
                                   │                        │
                                   │  MongoDB (port 27017)  │
                                   │  Database: healthconnect│
                                   │                        │
                                   │  Collections:          │
                                   │  • chat_history        │
                                   │  • doctors             │
                                   │  • patients            │
                                   │  • medicines           │
                                   │  • appointments        │
                                   │  • prescriptions       │
                                   │  • orders              │
                                   │  • messages            │
                                   │  • admins              │
                                   │                        │
                                   └────────────────────────┘
```

---

## 🔄 Request-Response Flow

### Scenario: User asks "I have chest pain"

```
Step 1: User Input
┌──────────────────────────────────┐
│ FloatingChatbot.js               │
│ User types: "I have chest pain"  │
│ Click Send button                │
└──────────────────────────────────┘
              ↓
              
Step 2: HTTP Request
┌──────────────────────────────────────────────────┐
│ axios.post('http://localhost:8080/api/chatbot/query') │
│ Body: {                                          │
│   message: "I have chest pain",                  │
│   patientId: "patient123",                       │
│   patientName: "John Doe"                        │
│ }                                                │
└──────────────────────────────────────────────────┘
              ↓
              
Step 3: Controller Receives Request
┌───────────────────────────────────┐
│ ChatBotController.handleChatQuery()│
│ • Extract message                 │
│ • Validate input                  │
│ • Call GeminiAIService            │
└───────────────────────────────────┘
              ↓
              
Step 4: AI Service Processing
┌────────────────────────────────────────────────┐
│ GeminiAIService                                │
├────────────────────────────────────────────────┤
│                                                │
│ 4a. Build Prompt:                              │
│     "You are a medical AI assistant..."        │
│     + "User Query: I have chest pain"          │
│                                                │
│ 4b. Call Gemini API:                           │
│     POST https://generativelanguage.googleapis.com/...│
│     with API key                               │
│                                                │
│ 4c. Parse Response:                            │
│     Extract text from JSON                     │
│                                                │
│ 4d. Analyze Symptoms:                          │
│     "chest pain" → Cardiologist               │
│                                                │
│ 4e. Classify Message:                          │
│     Type: SYMPTOM                             │
└────────────────────────────────────────────────┘
              ↓
              
Step 5: Find Doctor
┌───────────────────────────────────┐
│ DoctorRepository                  │
│ findAll() → filter by specialization│
│ Find: Dr. Aarav Nair (Cardiologist)│
└───────────────────────────────────┘
              ↓
              
Step 6: Save Chat History
┌────────────────────────────────────────────────┐
│ ChatMessageRepository.save()                   │
│ {                                              │
│   patientId: "patient123",                     │
│   userMessage: "I have chest pain",            │
│   botResponse: "Based on your symptoms...",    │
│   suggestedSpecialization: "Cardiologist",     │
│   suggestedDoctor: "Dr. Aarav Nair",          │
│   messageType: "SYMPTOM",                      │
│   timestamp: "2025-10-17T23:03:45"            │
│ }                                              │
└────────────────────────────────────────────────┘
              ↓
              
Step 7: Build Response
┌────────────────────────────────────────────────┐
│ ChatBotController                              │
│ Return ResponseEntity with:                    │
│ {                                              │
│   message: "AI response text",                 │
│   messageType: "SYMPTOM",                      │
│   suggestedSpecialization: "Cardiologist",     │
│   suggestedDoctor: {                           │
│     id: "doc1",                                │
│     name: "Dr. Aarav Nair",                    │
│     specialization: "Cardiologist",            │
│     qualification: "MD Cardiology",            │
│     experience: "15 years"                     │
│   },                                           │
│   timestamp: "..."                             │
│ }                                              │
└────────────────────────────────────────────────┘
              ↓
              
Step 8: Display Response
┌────────────────────────────────────────────────┐
│ FloatingChatbot.js                             │
│ • Add bot message to chat                      │
│ • Show AI response text                        │
│ • Display doctor recommendation card:          │
│   ┌──────────────────────────────┐            │
│   │ 👨‍⚕️ Recommended Doctor         │            │
│   │ Name: Dr. Aarav Nair         │            │
│   │ Specialization: Cardiologist │            │
│   │ [📅 Book Appointment]        │            │
│   └──────────────────────────────┘            │
│ • Stop typing animation                        │
└────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### chat_history Collection

```
Document Structure:
{
  _id: ObjectId("67123abc..."),           // MongoDB auto-generated
  patientId: "patient123",                 // Who asked
  patientName: "John Doe",                 // Patient name
  userMessage: "I have chest pain",        // User's question
  botResponse: "Based on your symptoms...", // AI's answer
  suggestedDoctor: "Dr. Aarav Nair",      // Recommended doctor
  suggestedSpecialization: "Cardiologist", // Doctor type
  timestamp: ISODate("2025-10-17T17:33:45Z"), // When
  messageType: "SYMPTOM"                   // Classification
}

Indexes:
- patientId (for fast retrieval)
- timestamp (for sorting)
```

---

## 🧠 AI Decision Logic

### Symptom → Doctor Mapping

```
User Message Analysis:
├─ Contains "chest pain" OR "heart" OR "shortness of breath"
│  └─> Suggest: Cardiologist
│
├─ Contains "skin" OR "rash" OR "acne" OR "eczema"
│  └─> Suggest: Dermatologist
│
├─ Contains "child" OR "baby" OR "infant"
│  └─> Suggest: Pediatrician
│
├─ Contains "headache" OR "migraine" OR "seizure" OR "dizzy"
│  └─> Suggest: Neurologist
│
├─ Contains "bone" OR "joint" OR "fracture" OR "back pain"
│  └─> Suggest: Orthopedic
│
├─ Contains "ear" OR "nose" OR "throat" OR "sinus"
│  └─> Suggest: ENT Specialist
│
├─ Contains "stomach" OR "abdomen" OR "nausea" OR "vomiting"
│  └─> Suggest: Gastroenterologist
│
├─ Contains "eye" OR "vision" OR "blurry"
│  └─> Suggest: Ophthalmologist
│
└─ No specific keywords
   └─> Default: General Physician
```

### Message Type Classification

```
Message Content Check:
├─ Contains "medicine" OR "tablet" OR "drug" OR medicine names
│  └─> Type: MEDICINE
│
├─ Contains "what is" OR "disease" OR disease names
│  └─> Type: DISEASE
│
├─ Contains "pain" OR "fever" OR "cough" OR "feel" OR symptom words
│  └─> Type: SYMPTOM
│
└─ Everything else
   └─> Type: GENERAL
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  • No API keys stored               │
│  • HTTPS in production              │
│  • Input sanitization               │
└─────────────────────────────────────┘
              ↓ HTTPS
┌─────────────────────────────────────┐
│    CORS Configuration               │
│  • Allow: localhost:3000            │
│  • Allow: localhost:3001            │
│  • Production: specific domain      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Backend (Spring Boot)             │
│  • API key in application.properties│
│  • Not exposed to frontend          │
│  • Input validation (@Valid)        │
│  • Rate limiting (TODO)             │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│     Google Gemini API               │
│  • API key authentication           │
│  • HTTPS only                       │
│  • Rate limits apply                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│     MongoDB Database                │
│  • Local connection (dev)           │
│  • Authentication (production)      │
│  • Patient data privacy             │
│  • Chat history per patient         │
└─────────────────────────────────────┘
```

---

## 📱 Component Interaction Map

### FloatingChatbot Component Tree

```
FloatingChatbot.js
├─ State Management
│  ├─ isOpen: boolean
│  ├─ messages: Array<Message>
│  ├─ inputMessage: string
│  └─ isLoading: boolean
│
├─ UI Components
│  ├─ Floating Button (🤖)
│  │  └─ onClick: toggleChat()
│  │
│  └─ Chat Window (conditional)
│     ├─ Header
│     │  ├─ Title: "AI Health Assistant"
│     │  └─ Close Button
│     │
│     ├─ Messages Area
│     │  ├─ Message Bubbles
│     │  │  ├─ User messages (blue)
│     │  │  └─ Bot messages (gray)
│     │  │
│     │  └─ Doctor Cards (conditional)
│     │     ├─ Doctor name
│     │     ├─ Specialization
│     │     └─ Book button
│     │
│     └─ Input Area
│        ├─ Text input
│        └─ Send button
│
└─ API Integration
   └─ handleSendMessage()
      ├─ axios.post('/api/chatbot/query')
      ├─ Update messages state
      └─ Show/hide loading
```

### AIHealthAssistant Component Tree

```
AIHealthAssistant.js
├─ State Management
│  ├─ messages: Array<Message>
│  ├─ inputMessage: string
│  ├─ isLoading: boolean
│  └─ patient: Object
│
├─ UI Layout
│  ├─ Header Section
│  │  ├─ 🤖 Avatar
│  │  ├─ Title
│  │  └─ Subtitle
│  │
│  ├─ Chat Container (600px height)
│  │  ├─ Messages Area (scrollable)
│  │  │  ├─ Welcome message
│  │  │  ├─ User/Bot messages
│  │  │  └─ Loading indicator
│  │  │
│  │  ├─ Quick Questions (first time)
│  │  │  └─ 4 preset questions
│  │  │
│  │  └─ Input Form
│  │     ├─ Text input (full width)
│  │     └─ Send button
│  │
│  └─ Disclaimer
│     └─ Medical advice warning
│
└─ Features
   ├─ Auto-scroll to bottom
   ├─ Timestamp display
   ├─ Doctor recommendation cards
   └─ Book appointment integration
```

---

## 🚀 Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT DEVICES                         │
│  Desktop Browsers  |  Mobile Browsers  |  Tablets            │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                        CDN / Load Balancer                   │
│  • SSL/TLS Termination                                       │
│  • Static file caching                                       │
│  • DDoS protection                                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
         ┌──────────────────┴──────────────────┐
         ↓                                      ↓
┌──────────────────────┐            ┌──────────────────────┐
│   Frontend Server    │            │   Backend Server     │
│   (React App)        │            │   (Spring Boot)      │
│   • Nginx/Apache     │            │   • Port 8080        │
│   • Static files     │            │   • REST API         │
│   • Service Worker   │            │   • Business Logic   │
└──────────────────────┘            └──────────────────────┘
                                                ↓
                              ┌─────────────────┼─────────────────┐
                              ↓                 ↓                 ↓
                    ┌─────────────────┐ ┌────────────┐ ┌────────────────┐
                    │  Gemini API     │ │  MongoDB   │ │  File Storage  │
                    │  (Google Cloud) │ │  (Atlas)   │ │  (Optional)    │
                    └─────────────────┘ └────────────┘ └────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   Patient   │
│   (User)    │
└──────┬──────┘
       │ 1. Types health question
       ↓
┌─────────────┐
│  Frontend   │ ───── 2. POST /api/chatbot/query ────→ ┌──────────────┐
│   (React)   │                                          │   Backend    │
└──────┬──────┘ ←──── 10. Display response + doctor ─── │ (Spring Boot)│
       │                                                 └──────┬───────┘
       │                                                        │
       │ 11. Show doctor card                                  │ 3. Validate input
       │                                                        ↓
       ↓                                                 ┌──────────────┐
┌─────────────┐                                         │ GeminiAI     │
│ Book        │                                         │ Service      │
│ Appointment │                                         └──────┬───────┘
│ Button      │                                                │
└─────────────┘                                                │ 4. Build prompt
                                                               ↓
                                                        ┌──────────────┐
                                                        │  Gemini API  │
                                                        │  (Google)    │
                                                        └──────┬───────┘
                                                               │ 5. AI generates
                                                               │    response
                                                               ↓
                                                        ┌──────────────┐
                                                        │ Parse JSON   │
                                                        │ Response     │
                                                        └──────┬───────┘
                                                               │
                                                ┌──────────────┼──────────────┐
                                                ↓              ↓              ↓
                                         6. Analyze    7. Find        8. Save
                                         symptoms      doctor         history
                                                ↓              ↓              ↓
                                         ┌──────────┐ ┌──────────┐ ┌──────────┐
                                         │ Suggest  │ │ Doctor   │ │ Chat     │
                                         │ Special. │ │ Repo     │ │ Message  │
                                         └──────────┘ └──────────┘ │ Repo     │
                                                                    └──────────┘
                                                                         │
                                                                         ↓
                                                                    ┌──────────┐
                                                                    │ MongoDB  │
                                                                    │ chat_    │
                                                                    │ history  │
                                                                    └──────────┘
```

---

## 🎨 UI Component Hierarchy

```
App.js
│
├─ Router
│  │
│  ├─ Route: /ai-assistant
│  │  └─ AIHealthAssistant
│  │     ├─ Header (AI branding)
│  │     ├─ ChatContainer
│  │     │  ├─ MessageList
│  │     │  │  ├─ WelcomeMessage
│  │     │  │  ├─ UserMessage[]
│  │     │  │  ├─ BotMessage[]
│  │     │  │  │  └─ DoctorCard (conditional)
│  │     │  │  └─ LoadingIndicator
│  │     │  │
│  │     │  ├─ QuickQuestions (initial)
│  │     │  └─ InputForm
│  │     │
│  │     └─ Disclaimer
│  │
│  ├─ Route: /patient/dashboard
│  ├─ Route: /doctor/dashboard
│  └─ ... (other routes)
│
└─ FloatingChatbot (global)
   ├─ FloatingButton
   └─ ChatWindow (conditional)
      ├─ ChatHeader
      ├─ MessageList
      │  ├─ Message[]
      │  └─ TypingIndicator
      └─ InputForm
```

---

**Architecture Documentation Complete! 🎉**

This visual overview provides a comprehensive understanding of how all components interact in the AI Chatbot system.
