# HealthConnect Backend Startup Script
# This script starts the Spring Boot server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  HealthConnect Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to server directory
$serverPath = "C:\Users\shame\Desktop\Project App\HealthConnect\server"
Set-Location $serverPath

Write-Host "📍 Location: $serverPath" -ForegroundColor Yellow
Write-Host ""

# Check if Maven is installed
Write-Host "🔍 Checking Maven installation..." -ForegroundColor Yellow
try {
    $mavenVersion = mvn -version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Maven is installed" -ForegroundColor Green
        Write-Host ""
    }
} catch {
    Write-Host "❌ Maven not found! Please install Maven first." -ForegroundColor Red
    Write-Host "   Download from: https://maven.apache.org/download.cgi" -ForegroundColor Yellow
    pause
    exit
}

# Check if Java is installed
Write-Host "🔍 Checking Java installation..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Java is installed" -ForegroundColor Green
        Write-Host ""
    }
} catch {
    Write-Host "❌ Java not found! Please install Java JDK 17+." -ForegroundColor Red
    Write-Host "   Download from: https://www.oracle.com/java/technologies/downloads/" -ForegroundColor Yellow
    pause
    exit
}

# Start the server
Write-Host "🚀 Starting Spring Boot server..." -ForegroundColor Cyan
Write-Host "   This may take a minute..." -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

mvn spring-boot:run

# If the server stops
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "❌ Server stopped" -ForegroundColor Red
Write-Host ""
pause
