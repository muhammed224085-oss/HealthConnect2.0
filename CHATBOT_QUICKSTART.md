# 🚀 Quick Start: AI Chatbot Integration

## ⚡ Fast Setup (5 Minutes)

### Step 1: Get Your Gemini API Key (2 minutes)
1. Open: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key (starts with `AIzaSy...`)

### Step 2: Add API Key (30 seconds)
Open: `server/src/main/resources/application.properties`

Find this line:
```properties
gemini.api.key=AIzaSyDummyKeyPleaseReplaceWithYourActualKey
```

Replace with your actual key:
```properties
gemini.api.key=AIzaSyAbc123YourRealApiKeyHere
```

### Step 3: Rebuild & Start Backend (2 minutes)
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect\server"
mvn clean install -DskipTests
mvn spring-boot:run
```

Wait for: `Started HealthConnectApplication`

### Step 4: Start Frontend (30 seconds)
In a NEW terminal:
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect\client"
npm start
```

### Step 5: Test It! (30 seconds)
1. Open: http://localhost:3001
2. Look for the 🤖 button (bottom-right corner)
3. Click it and type: "I have a headache"
4. See the AI respond with doctor suggestions!

---

## 🎯 What You Get

### 1. Floating Chatbot (All Pages)
- Click 🤖 button on any page
- Ask health questions
- Get instant AI responses
- See doctor recommendations

### 2. Full AI Assistant Page
- Visit: http://localhost:3001/ai-assistant
- Larger chat interface
- Quick question buttons
- Complete conversation history

---

## 💬 Try These Questions

Copy-paste into the chatbot:

1. **Symptom Analysis**
   ```
   I have chest pain and shortness of breath
   ```
   → Suggests Cardiologist with "Book Appointment" button

2. **Medicine Info**
   ```
   What is Paracetamol used for?
   ```
   → Provides usage, dosage, precautions

3. **Disease Info**
   ```
   Tell me about diabetes
   ```
   → Gives explanation and doctor recommendation

4. **General Health**
   ```
   I feel dizzy and tired
   ```
   → Analyzes symptoms and suggests specialist

---

## 🔍 Quick Test

Run this in PowerShell to verify everything:
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect"
.\test-chatbot.ps1
```

This script tests:
- ✅ Backend running
- ✅ Chatbot endpoint working
- ✅ Gemini API connected
- ✅ Frontend accessible

---

## 📂 What Was Added

### Backend (4 new files)
- `ChatMessage.java` - Chat history model
- `ChatMessageRepository.java` - Database access
- `GeminiAIService.java` - AI integration
- `ChatBotController.java` - API endpoints

### Frontend (3 new files)
- `AIHealthAssistant.js` - Full page chatbot
- `FloatingChatbot.js` - Floating widget
- `FloatingChatbot.css` - Styling

### Modified Files
- `application.properties` - Added Gemini config
- `App.js` - Added routes and floating bot

---

## 🆘 Troubleshooting

### "API Key Error"
- Make sure you replaced the dummy key with your real key
- Restart backend after changing application.properties

### "Connection Failed"
- Check if backend is running on port 8080
- Check if MongoDB is running on port 27017
- Run: `.\test-chatbot.ps1` to diagnose

### "Chatbot Not Showing"
- Check if frontend is on port 3001
- Clear browser cache (Ctrl+Shift+R)
- Check browser console for errors

---

## 📚 Full Documentation

For complete details, see: **AI_CHATBOT_INTEGRATION.md**

Includes:
- Complete API documentation
- Database schema
- Security considerations
- Advanced features
- Deployment guide

---

## ✨ Features

✅ Real-time AI responses using Google Gemini  
✅ Smart symptom analysis  
✅ Automatic doctor suggestions  
✅ Medicine information  
✅ Disease explanations  
✅ Direct appointment booking  
✅ Chat history storage  
✅ Available on all pages  
✅ Beautiful UI with animations  
✅ Mobile responsive  

---

## 🎉 You're Ready!

Your AI Health Assistant is now integrated and ready to help patients!

**Questions?** Check the full documentation: `AI_CHATBOT_INTEGRATION.md`

---

**Important:** Don't commit your API key to GitHub! Add it to `.gitignore`:
```
# API Keys
application.properties
```
