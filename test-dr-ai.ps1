# 🧪 Dr. AI Chatbot - Testing Guide

## Quick Test Script

Run this PowerShell script to test the Dr. AI chatbot API:

```powershell
# Test Dr. AI ChatBot API
$apiUrl = "http://localhost:8080/api/chatbot/query"

# Test 1: Heart Symptoms
Write-Host "Test 1: Heart Symptoms" -ForegroundColor Cyan
$body = @{ message = "I have chest pain and difficulty breathing" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json"
Write-Host "Reply: $($response.reply)" -ForegroundColor Green
Write-Host "Doctor: $($response.recommendedDoctor)" -ForegroundColor Yellow
Write-Host "Specialization: $($response.specialization)" -ForegroundColor Yellow
Write-Host ""

# Test 2: Skin Issue
Write-Host "Test 2: Skin Issue" -ForegroundColor Cyan
$body = @{ message = "My skin is itchy with red rashes" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json"
Write-Host "Reply: $($response.reply)" -ForegroundColor Green
Write-Host "Doctor: $($response.recommendedDoctor)" -ForegroundColor Yellow
Write-Host "Specialization: $($response.specialization)" -ForegroundColor Yellow
Write-Host ""

# Test 3: Headache
Write-Host "Test 3: Headache" -ForegroundColor Cyan
$body = @{ message = "I have a severe headache and feel dizzy" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json"
Write-Host "Reply: $($response.reply)" -ForegroundColor Green
Write-Host "Doctor: $($response.recommendedDoctor)" -ForegroundColor Yellow
Write-Host "Specialization: $($response.specialization)" -ForegroundColor Yellow
Write-Host ""

# Test 4: Child Health
Write-Host "Test 4: Child Health" -ForegroundColor Cyan
$body = @{ message = "My baby has fever" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json"
Write-Host "Reply: $($response.reply)" -ForegroundColor Green
Write-Host "Doctor: $($response.recommendedDoctor)" -ForegroundColor Yellow
Write-Host "Specialization: $($response.specialization)" -ForegroundColor Yellow
Write-Host ""

# Test 5: Joint Pain
Write-Host "Test 5: Joint Pain" -ForegroundColor Cyan
$body = @{ message = "I have joint pain and swelling" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json"
Write-Host "Reply: $($response.reply)" -ForegroundColor Green
Write-Host "Doctor: $($response.recommendedDoctor)" -ForegroundColor Yellow
Write-Host "Specialization: $($response.specialization)" -ForegroundColor Yellow
Write-Host ""

Write-Host "✅ All tests completed!" -ForegroundColor Green
```

---

## Manual Testing Checklist

### ✅ Backend API Tests

#### Test 1: Empty Message
**Input:** (empty message)
```json
{ "message": "" }
```
**Expected Response:**
```json
{
  "reply": "Hello! I'm Dr. AI, your virtual health assistant...",
  "timestamp": "12:30:45 PM"
}
```

#### Test 2: Cardiologist Recommendation
**Input:**
```json
{ "message": "I have chest pain and breathlessness" }
```
**Expected Response:**
```json
{
  "reply": "I'm sorry to hear you're experiencing these symptoms...",
  "recommendedDoctor": "Dr. Aarav Nair",
  "specialization": "Cardiologist",
  "timestamp": "12:30:45 PM"
}
```

#### Test 3: Dermatologist Recommendation
**Input:**
```json
{ "message": "itchy red rash on my arm" }
```
**Expected Response:**
- Specialization: "Dermatologist"
- Doctor: "Dr. Sneha Menon"
- Empathetic response with care advice

#### Test 4: Neurologist Recommendation
**Input:**
```json
{ "message": "severe headache and dizziness" }
```
**Expected Response:**
- Specialization: "Neurologist"
- Doctor: "Dr. Aditya Varma"
- Follow-up questions about symptoms

#### Test 5: Pediatrician Recommendation
**Input:**
```json
{ "message": "my child has fever" }
```
**Expected Response:**
- Specialization: "Pediatrician"
- Doctor: "Dr. Rohan Pillai"
- Concern about child's health

#### Test 6: Orthopedist Recommendation
**Input:**
```json
{ "message": "joint pain and swelling in knee" }
```
**Expected Response:**
- Specialization: "Orthopedist"
- Doctor: "Dr. Arjun Dev"
- Advice on rest and ice application

#### Test 7: Dentist Recommendation
**Input:**
```json
{ "message": "toothache and gum pain" }
```
**Expected Response:**
- Specialization: "Dentist"
- Doctor: "Dr. Neha Ramesh"
- Salt water rinse advice

#### Test 8: General Physician (Default)
**Input:**
```json
{ "message": "I feel unwell" }
```
**Expected Response:**
- Specialization: "General Physician"
- Doctor: "Dr. Kavya Raj"
- Request for more symptom details

---

### ✅ Frontend UI Tests

#### Test 9: Chat Widget Appearance
- [ ] Purple gradient button appears (bottom-right)
- [ ] Button text: "🩺 Dr. AI - Virtual Doctor"
- [ ] Button has shadow effect
- [ ] Smooth hover animation

#### Test 10: Chat Window Opening
- [ ] Click button opens chat window
- [ ] Window size: 320px × 420px
- [ ] Header shows "Dr. AI - Virtual Doctor"
- [ ] Welcome message displays
- [ ] Input field placeholder: "Describe your symptoms..."

#### Test 11: Message Sending
- [ ] Type message in input field
- [ ] Press Enter or click Send
- [ ] User message appears (purple bubble, right-aligned)
- [ ] Loading indicator appears (if implemented)
- [ ] Bot response appears (white bubble, left-aligned)
- [ ] Timestamp shows on both messages

#### Test 12: Doctor Recommendation Display
- [ ] Doctor recommendation card appears
- [ ] Shows doctor icon (👨‍⚕️)
- [ ] Shows doctor name in bold
- [ ] Shows specialization
- [ ] Light blue background (#f0f4ff)
- [ ] Purple left border

#### Test 13: Error Handling
- [ ] Turn off backend server
- [ ] Send a message
- [ ] Fallback error message displays
- [ ] Message is professional and helpful
- [ ] No console errors

#### Test 14: Chat Window Closing
- [ ] Click "✕ Close" button
- [ ] Chat window closes smoothly
- [ ] Messages are preserved
- [ ] Reopen shows previous conversation

---

### ✅ Dr. AI Persona Tests

#### Test 15: Empathy Check
**Input:** "I'm in pain"
**Expected:** Response starts with empathy like:
- "I'm sorry to hear that..."
- "I understand your concern..."
- "That must be uncomfortable..."

#### Test 16: Follow-up Questions
**Input:** "I have a headache"
**Expected:** Response asks follow-up:
- "How long have you had these symptoms?"
- "Do you experience nausea?"
- "Any sensitivity to light?"

#### Test 17: Safety Priority
**Input:** "severe chest pain"
**Expected:** Response includes:
- Urgent recommendation to see doctor
- Safety advice (rest, avoid activity)
- Mention of emergency services if needed

#### Test 18: No Medication Prescription
**Input:** "what medicine should I take for fever?"
**Expected:** Response:
- Does NOT prescribe specific drugs
- Suggests consulting physician/pharmacist
- May give general advice (rest, hydration)

#### Test 19: Simple Explanations
**Input:** "what is hypertension?"
**Expected:** Response:
- Simple, clear explanation
- Avoids complex medical jargon
- Provides context and importance

#### Test 20: Professional Tone
**Input:** Any medical query
**Expected:** Response is:
- Professional yet friendly
- Clear and concise
- Respectful and caring

---

### ✅ Integration Tests

#### Test 21: MongoDB Connection
- [ ] Backend starts successfully
- [ ] No MongoDB connection errors
- [ ] Patient data loads correctly
- [ ] Chat history saves (if implemented)

#### Test 22: CORS Configuration
- [ ] Frontend at localhost:3000 works
- [ ] No CORS errors in console
- [ ] API calls succeed
- [ ] Cross-origin requests allowed

#### Test 23: API Endpoint Validation
- [ ] POST /api/chatbot/query accepts requests
- [ ] Returns proper JSON response
- [ ] HTTP status codes correct (200/400)
- [ ] Response structure matches schema

#### Test 24: Gemini API Integration
**With Valid API Key:**
- [ ] AI-powered responses work
- [ ] Contextual understanding shown
- [ ] Retry mechanism works on failure

**Without API Key:**
- [ ] Fallback mode activates
- [ ] Keyword-based responses work
- [ ] No crashes or errors

#### Test 25: Concurrent Users
- [ ] Open multiple browser tabs
- [ ] Send messages from each
- [ ] All receive proper responses
- [ ] No message mixing

---

### ✅ Performance Tests

#### Test 26: Response Time
- [ ] API responds within 2 seconds (fallback)
- [ ] API responds within 5 seconds (with Gemini)
- [ ] UI updates immediately
- [ ] No noticeable lag

#### Test 27: Load Testing
- [ ] Send 10 messages rapidly
- [ ] All messages processed
- [ ] Responses in correct order
- [ ] No memory leaks

#### Test 28: Long Messages
- [ ] Send message with 500+ characters
- [ ] Message displays correctly
- [ ] Response handles long input
- [ ] Text wraps properly in UI

---

### ✅ Mobile Responsiveness Tests

#### Test 29: Mobile View
- [ ] Chat button visible on mobile
- [ ] Chat window fits mobile screen
- [ ] Text is readable (13px+)
- [ ] Buttons are tappable
- [ ] Input field works on mobile keyboard

#### Test 30: Tablet View
- [ ] Layout adapts to tablet size
- [ ] Chat window positioned correctly
- [ ] Touch interactions work
- [ ] Landscape mode supported

---

## Automated Test Script

Save as `test-dr-ai.ps1`:

```powershell
# Dr. AI Automated Test Suite

Write-Host "🧪 Starting Dr. AI Test Suite..." -ForegroundColor Cyan
Write-Host ""

$apiUrl = "http://localhost:8080/api/chatbot/query"
$testsPassed = 0
$testsFailed = 0

function Test-ChatBot {
    param(
        [string]$TestName,
        [string]$Message,
        [string]$ExpectedSpecialization,
        [string]$ExpectedDoctor
    )
    
    Write-Host "Running: $TestName" -ForegroundColor Yellow
    
    try {
        $body = @{ message = $Message } | ConvertTo-Json
        $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
        
        $passed = $true
        
        if ($ExpectedSpecialization -and $response.specialization -ne $ExpectedSpecialization) {
            Write-Host "  ❌ Specialization mismatch: Expected '$ExpectedSpecialization', got '$($response.specialization)'" -ForegroundColor Red
            $passed = $false
        }
        
        if ($ExpectedDoctor -and $response.recommendedDoctor -ne $ExpectedDoctor) {
            Write-Host "  ❌ Doctor mismatch: Expected '$ExpectedDoctor', got '$($response.recommendedDoctor)'" -ForegroundColor Red
            $passed = $false
        }
        
        if ($passed) {
            Write-Host "  ✅ PASSED" -ForegroundColor Green
            $script:testsPassed++
        } else {
            $script:testsFailed++
        }
        
        Write-Host "  Response: $($response.reply.Substring(0, [Math]::Min(80, $response.reply.Length)))..." -ForegroundColor Gray
        
    } catch {
        Write-Host "  ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
    }
    
    Write-Host ""
}

# Run Tests
Test-ChatBot -TestName "Test 1: Cardiologist" -Message "chest pain and breathlessness" -ExpectedSpecialization "Cardiologist" -ExpectedDoctor "Dr. Aarav Nair"

Test-ChatBot -TestName "Test 2: Dermatologist" -Message "itchy red rash" -ExpectedSpecialization "Dermatologist" -ExpectedDoctor "Dr. Sneha Menon"

Test-ChatBot -TestName "Test 3: Neurologist" -Message "severe headache" -ExpectedSpecialization "Neurologist" -ExpectedDoctor "Dr. Aditya Varma"

Test-ChatBot -TestName "Test 4: Pediatrician" -Message "my baby has fever" -ExpectedSpecialization "Pediatrician" -ExpectedDoctor "Dr. Rohan Pillai"

Test-ChatBot -TestName "Test 5: Orthopedist" -Message "joint pain and swelling" -ExpectedSpecialization "Orthopedist" -ExpectedDoctor "Dr. Arjun Dev"

Test-ChatBot -TestName "Test 6: Dentist" -Message "toothache" -ExpectedSpecialization "Dentist" -ExpectedDoctor "Dr. Neha Ramesh"

Test-ChatBot -TestName "Test 7: General Physician" -Message "fever" -ExpectedSpecialization "General Physician" -ExpectedDoctor "Dr. Kavya Raj"

# Summary
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✅ Passed: $testsPassed" -ForegroundColor Green
Write-Host "❌ Failed: $testsFailed" -ForegroundColor Red
Write-Host "Total: $($testsPassed + $testsFailed)" -ForegroundColor White
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "🎉 All tests passed!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Some tests failed. Please review." -ForegroundColor Yellow
}
```

---

## Test Data Examples

### Positive Test Cases

| Symptom Description | Expected Specialist | Expected Doctor |
|-------------------|-------------------|----------------|
| "chest pain and difficulty breathing" | Cardiologist | Dr. Aarav Nair |
| "itchy red rash on skin" | Dermatologist | Dr. Sneha Menon |
| "severe headache and dizziness" | Neurologist | Dr. Aditya Varma |
| "my child has fever" | Pediatrician | Dr. Rohan Pillai |
| "joint pain and swelling" | Orthopedist | Dr. Arjun Dev |
| "toothache and gum bleeding" | Dentist | Dr. Neha Ramesh |
| "general fever and weakness" | General Physician | Dr. Kavya Raj |

### Edge Cases

| Test Case | Input | Expected Behavior |
|----------|-------|-------------------|
| Empty message | "" | Error message with guidance |
| Very long message | 1000+ chars | Handles gracefully |
| Special characters | "I have @#$% pain" | Parses correctly |
| Multiple symptoms | "headache, fever, cough" | Prioritizes correctly |
| Medication query | "paracetamol uses?" | Advises to consult pharmacist |
| Emergency case | "severe chest pain can't breathe" | Urgent guidance |

---

## Browser Console Checks

Open Developer Tools (F12) and verify:

1. **No Console Errors**
   - No red error messages
   - No CORS errors
   - No 404 or 500 errors

2. **Network Tab**
   - POST requests to /api/chatbot/query succeed
   - Response status: 200 OK
   - Response time < 5 seconds

3. **Application Tab**
   - localStorage working (if used)
   - Session storage working (if used)

---

## Success Criteria

Dr. AI chatbot is considered fully functional when:

- ✅ All 30 manual tests pass
- ✅ Automated test suite passes
- ✅ No console errors
- ✅ Response time < 5 seconds
- ✅ All 7 specialists detected correctly
- ✅ Empathetic responses confirmed
- ✅ Follow-up questions present
- ✅ Safety guidance included
- ✅ No medication prescriptions
- ✅ UI responsive on all devices

---

## Regression Testing

After any code changes, re-run:

1. Automated test script (`test-dr-ai.ps1`)
2. Manual UI interaction tests
3. API endpoint validation
4. Cross-browser compatibility (Chrome, Firefox, Edge, Safari)
5. Mobile responsiveness

---

**Happy Testing! 🧪**

*Last Updated: October 18, 2025*
