# Dr. AI Chatbot - Quick Start Script
# This script sets up and runs the Dr. AI Virtual Doctor chatbot

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "🩺 Dr. AI Virtual Doctor Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $null -ne $connection
}

# Step 1: Check Gemini API Key
Write-Host "📋 Step 1: Checking Gemini API Configuration..." -ForegroundColor Yellow
$propsFile = ".\server\src\main\resources\application.properties"
$apiKeyPlaceholder = "YOUR_ACTUAL_GEMINI_API_KEY_HERE"

if (Test-Path $propsFile) {
    $content = Get-Content $propsFile -Raw
    if ($content -match $apiKeyPlaceholder) {
        Write-Host "⚠️  WARNING: Gemini API key not configured!" -ForegroundColor Red
        Write-Host "   Dr. AI will run in FALLBACK MODE (keyword-based responses)" -ForegroundColor Yellow
        Write-Host "   To enable AI responses, get your free key from:" -ForegroundColor Yellow
        Write-Host "   https://makersuite.google.com/app/apikey" -ForegroundColor Cyan
        Write-Host ""
        $response = Read-Host "Do you want to continue anyway? (Y/N)"
        if ($response -ne "Y" -and $response -ne "y") {
            Write-Host "Setup cancelled. Please add your API key and run again." -ForegroundColor Red
            exit
        }
    } else {
        Write-Host "✅ Gemini API key configured!" -ForegroundColor Green
    }
} else {
    Write-Host "❌ application.properties not found!" -ForegroundColor Red
    exit
}

Write-Host ""

# Step 2: Stop existing servers
Write-Host "📋 Step 2: Stopping existing servers..." -ForegroundColor Yellow

if (Test-Port 8080) {
    Write-Host "   Stopping processes on port 8080..." -ForegroundColor Gray
    $processes = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    foreach($p in $processes) {
        if($p -ne 0) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }
    }
}

if (Test-Port 3000) {
    Write-Host "   Stopping processes on port 3000..." -ForegroundColor Gray
    $processes = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    foreach($p in $processes) {
        if($p -ne 0) { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }
    }
}

Start-Sleep -Seconds 2
Write-Host "✅ Ports cleared!" -ForegroundColor Green
Write-Host ""

# Step 3: Build Backend
Write-Host "📋 Step 3: Building Backend (Dr. AI ChatBot)..." -ForegroundColor Yellow
Set-Location ".\server"
$buildResult = mvn clean package -DskipTests 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend built successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Backend build failed!" -ForegroundColor Red
    Write-Host $buildResult
    Set-Location ".."
    exit
}
Set-Location ".."
Write-Host ""

# Step 4: Start Backend
Write-Host "📋 Step 4: Starting Backend Server..." -ForegroundColor Yellow
Write-Host "   Dr. AI ChatBot Controller loading..." -ForegroundColor Gray

# Create backend start script
$backendScript = @"
cd '.\server'
Write-Host '🚀 Starting Dr. AI Backend on http://localhost:8080' -ForegroundColor Green
Write-Host '📡 ChatBot API: http://localhost:8080/api/chatbot/query' -ForegroundColor Cyan
Write-Host ''
mvn spring-boot:run
"@

$backendScript | Out-File -FilePath ".\start-dr-ai-backend.ps1" -Encoding UTF8
Start-Process powershell -ArgumentList "-NoExit", "-File", ".\start-dr-ai-backend.ps1"

Write-Host "✅ Backend starting in new window..." -ForegroundColor Green
Write-Host "   Waiting for backend to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 10

# Step 5: Start Frontend
Write-Host ""
Write-Host "📋 Step 5: Starting Frontend..." -ForegroundColor Yellow
Write-Host "   React app with Dr. AI ChatWidget loading..." -ForegroundColor Gray

# Create frontend start script
$frontendScript = @"
cd '.\client'
Write-Host '🚀 Starting Dr. AI Frontend on http://localhost:3000' -ForegroundColor Green
Write-Host '💬 ChatBot Widget: Look for the floating button!' -ForegroundColor Cyan
Write-Host ''
npm start
"@

$frontendScript | Out-File -FilePath ".\start-dr-ai-frontend.ps1" -Encoding UTF8
Start-Process powershell -ArgumentList "-NoExit", "-File", ".\start-dr-ai-frontend.ps1"

Write-Host "✅ Frontend starting in new window..." -ForegroundColor Green
Start-Sleep -Seconds 5

# Step 6: Success message
Write-Host ""
Write-Host "=================================" -ForegroundColor Green
Write-Host "✅ Dr. AI Setup Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access Points:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:8080" -ForegroundColor White
Write-Host "   ChatBot:  http://localhost:8080/api/chatbot/query" -ForegroundColor White
Write-Host ""
Write-Host "💬 Dr. AI Features:" -ForegroundColor Cyan
Write-Host "   ✓ Professional virtual doctor persona" -ForegroundColor White
Write-Host "   ✓ Empathetic medical guidance" -ForegroundColor White
Write-Host "   ✓ Specialist recommendations (7 types)" -ForegroundColor White
Write-Host "   ✓ Intelligent symptom analysis" -ForegroundColor White
Write-Host "   ✓ Follow-up question system" -ForegroundColor White
Write-Host "   ✓ Home care advice" -ForegroundColor White
Write-Host "   ✓ Emergency guidance" -ForegroundColor White
Write-Host ""
Write-Host "🩺 Available Specialists:" -ForegroundColor Cyan
Write-Host "   • Cardiologist (Dr. Aarav Nair)" -ForegroundColor White
Write-Host "   • Dermatologist (Dr. Sneha Menon)" -ForegroundColor White
Write-Host "   • Neurologist (Dr. Aditya Varma)" -ForegroundColor White
Write-Host "   • Pediatrician (Dr. Rohan Pillai)" -ForegroundColor White
Write-Host "   • Orthopedist (Dr. Arjun Dev)" -ForegroundColor White
Write-Host "   • Dentist (Dr. Neha Ramesh)" -ForegroundColor White
Write-Host "   • General Physician (Dr. Kavya Raj)" -ForegroundColor White
Write-Host ""
Write-Host "📋 Test Commands:" -ForegroundColor Cyan
Write-Host '   Test 1: "I have chest pain and breathlessness"' -ForegroundColor Gray
Write-Host '   Test 2: "My skin has itchy red rashes"' -ForegroundColor Gray
Write-Host '   Test 3: "I have a severe headache"' -ForegroundColor Gray
Write-Host '   Test 4: "My baby has fever"' -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Documentation: DR_AI_CHATBOT_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in the server windows to stop" -ForegroundColor Yellow
Write-Host ""

# Open browser
Write-Host "🌐 Opening browser..." -ForegroundColor Cyan
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "🎉 Dr. AI is ready to assist! Look for the purple chat button!" -ForegroundColor Green
Write-Host ""
