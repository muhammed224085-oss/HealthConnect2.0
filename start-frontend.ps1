# HealthConnect Frontend Startup Script
# This script starts the React development server

Write-Host "========================================" -ForegroundColor Green
Write-Host "  HealthConnect Frontend Server" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Navigate to client directory
$clientPath = "C:\Users\shame\Desktop\Project App\HealthConnect\client"
Set-Location $clientPath

Write-Host "📍 Location: $clientPath" -ForegroundColor Yellow
Write-Host ""

# Check if Node.js is installed
Write-Host "🔍 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node -version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
        Write-Host ""
    }
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js 16+." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit
}

# Check if npm is installed
Write-Host "🔍 Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm -version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
        Write-Host ""
    }
} catch {
    Write-Host "❌ npm not found! npm should come with Node.js." -ForegroundColor Red
    pause
    exit
}

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    Write-Host "   This will take a few minutes on first run..." -ForegroundColor Yellow
    Write-Host ""
    npm install
    Write-Host ""
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install failed!" -ForegroundColor Red
        pause
        exit
    }
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
}

# Start the development server
Write-Host "🚀 Starting React development server..." -ForegroundColor Cyan
Write-Host "   Browser will open automatically at http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""

npm start

# If the server stops
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "❌ Server stopped" -ForegroundColor Red
Write-Host ""
pause
