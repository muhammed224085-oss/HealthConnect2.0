# Test AI Chatbot Integration
# Run this script to verify the chatbot is working

Write-Host "🤖 Testing HealthConnect AI Chatbot Integration..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if backend is running
Write-Host "Test 1: Checking backend server..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/doctors" -Method Get -TimeoutSec 5
    Write-Host "✅ Backend is running on port 8080" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is NOT running. Start it with: mvn spring-boot:run" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Check if chatbot endpoint exists
Write-Host "Test 2: Testing chatbot API endpoint..." -ForegroundColor Yellow
try {
    $testQuery = @{
        message = "Hello, are you working?"
        patientId = "test123"
        patientName = "Test User"
    } | ConvertTo-Json

    $headers = @{
        "Content-Type" = "application/json"
    }

    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/chatbot/query" -Method Post -Body $testQuery -Headers $headers -TimeoutSec 10
    
    Write-Host "✅ Chatbot endpoint is working!" -ForegroundColor Green
    Write-Host "   Response: $($response.message.Substring(0, [Math]::Min(100, $response.message.Length)))..." -ForegroundColor Gray
    
    if ($response.message -like "*API*key*" -or $response.message -like "*error*" -or $response.message -like "*failed*") {
        Write-Host "⚠️  WARNING: Response indicates potential API key issue" -ForegroundColor Yellow
        Write-Host "   Make sure you've added your Gemini API key in application.properties" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Chatbot endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   This might mean:" -ForegroundColor Yellow
    Write-Host "   - Backend needs to be rebuilt (mvn clean install -DskipTests)" -ForegroundColor Yellow
    Write-Host "   - Gemini API key is missing in application.properties" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: Test Gemini API connection
Write-Host "Test 3: Testing Gemini API connection..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/chatbot/test" -Method Get -TimeoutSec 10
    
    if ($response.status -eq "success") {
        Write-Host "✅ Gemini API is connected and working!" -ForegroundColor Green
        Write-Host "   Response: $($response.response)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Gemini API connection failed" -ForegroundColor Red
        Write-Host "   Error: $($response.error)" -ForegroundColor Red
        Write-Host ""
        Write-Host "📝 ACTION REQUIRED:" -ForegroundColor Yellow
        Write-Host "   1. Get API key from: https://makersuite.google.com/app/apikey" -ForegroundColor White
        Write-Host "   2. Add it to: server/src/main/resources/application.properties" -ForegroundColor White
        Write-Host "   3. Set: gemini.api.key=YOUR_API_KEY" -ForegroundColor White
        Write-Host "   4. Restart backend: mvn spring-boot:run" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Could not test Gemini API: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Check if frontend is accessible
Write-Host "Test 4: Checking frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -Method Get -TimeoutSec 5 -UseBasicParsing
    Write-Host "✅ Frontend is running on port 3001" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Frontend is NOT running. Start it with: npm start" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access Points:" -ForegroundColor White
Write-Host "  🌐 Full AI Assistant: http://localhost:3001/ai-assistant" -ForegroundColor Cyan
Write-Host "  🤖 Floating Chatbot: Available on all pages (bottom-right)" -ForegroundColor Cyan
Write-Host "  🔧 API Test: http://localhost:8080/api/chatbot/test" -ForegroundColor Cyan
Write-Host ""
Write-Host "Try These Queries:" -ForegroundColor White
Write-Host "  • I have chest pain and shortness of breath" -ForegroundColor Gray
Write-Host "  • What is Paracetamol used for?" -ForegroundColor Gray
Write-Host "  • I feel dizzy and tired" -ForegroundColor Gray
Write-Host "  • Tell me about diabetes" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Full Documentation: AI_CHATBOT_INTEGRATION.md" -ForegroundColor Green
Write-Host ""
