# HealthConnect Mobile App - Quick Start Script
# Run this script to set up the mobile app

Write-Host "🏥 HealthConnect Mobile App Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js installation
Write-Host "Checking Node.js..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Choose your mobile app approach:" -ForegroundColor Cyan
Write-Host "1. PWA (Progressive Web App) - Already configured! ✅" -ForegroundColor Green
Write-Host "2. React Native - Native mobile app for App Stores" -ForegroundColor Yellow
Write-Host "3. Capacitor - Hybrid approach (convert React app)" -ForegroundColor Yellow
Write-Host ""

$choice = Read-Host "Enter your choice (1, 2, or 3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "✅ PWA is already configured!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Create app icons (logo192.png, logo512.png)" -ForegroundColor White
        Write-Host "2. Place them in client/public/ folder" -ForegroundColor White
        Write-Host "3. Deploy your website" -ForegroundColor White
        Write-Host "4. Users can install it from browser!" -ForegroundColor White
        Write-Host ""
        Write-Host "Want to start the development server? (Y/N)" -ForegroundColor Yellow
        $startServer = Read-Host
        if ($startServer -eq "Y" -or $startServer -eq "y") {
            Set-Location "client"
            npm start
        }
    }
    "2" {
        Write-Host ""
        Write-Host "Setting up React Native..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Installing React Native CLI..." -ForegroundColor Cyan
        npm install -g react-native-cli
        
        Write-Host "Creating React Native project..." -ForegroundColor Cyan
        npx react-native init HealthConnectMobile
        
        Write-Host ""
        Write-Host "✅ React Native project created!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. cd HealthConnectMobile" -ForegroundColor White
        Write-Host "2. Copy mobile files from /mobile directory" -ForegroundColor White
        Write-Host "3. npm install" -ForegroundColor White
        Write-Host "4. npx react-native run-android (or run-ios for Mac)" -ForegroundColor White
    }
    "3" {
        Write-Host ""
        Write-Host "Setting up Capacitor..." -ForegroundColor Yellow
        Set-Location "client"
        
        Write-Host "Installing Capacitor..." -ForegroundColor Cyan
        npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
        
        Write-Host "Initializing Capacitor..." -ForegroundColor Cyan
        npx cap init HealthConnect com.healthconnect.app
        
        Write-Host "Adding Android platform..." -ForegroundColor Cyan
        npx cap add android
        
        Write-Host ""
        Write-Host "✅ Capacitor configured!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. npm run build" -ForegroundColor White
        Write-Host "2. npx cap sync" -ForegroundColor White
        Write-Host "3. npx cap open android" -ForegroundColor White
    }
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "For detailed instructions, see MOBILE_CONVERSION_GUIDE.md" -ForegroundColor Cyan