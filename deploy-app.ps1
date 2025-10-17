# HealthConnect Deployment Script
# This script helps deploy your HealthConnect app to various platforms

Write-Host "🚀 HealthConnect Deployment Assistant" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "client")) {
    Write-Host "❌ Error: Please run this script from the HealthConnect root directory" -ForegroundColor Red
    Write-Host "Expected structure: HealthConnect/client/" -ForegroundColor Yellow
    exit
}

Write-Host "✅ Found client directory" -ForegroundColor Green
Write-Host ""

# Check Node.js
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm not found. Please install npm first." -ForegroundColor Red
    exit
}

Write-Host "✅ Node.js and npm are installed" -ForegroundColor Green
Write-Host ""

# Check for app icons
Write-Host "Checking for app icons..." -ForegroundColor Yellow
$iconsExist = (Test-Path "client/public/logo192.png") -and (Test-Path "client/public/logo512.png")

if (-not $iconsExist) {
    Write-Host "⚠️ App icons not found!" -ForegroundColor Yellow
    Write-Host "Please create icons first:" -ForegroundColor White
    Write-Host "1. Open icon-generator.html in your browser" -ForegroundColor White
    Write-Host "2. Generate and download logo192.png and logo512.png" -ForegroundColor White
    Write-Host "3. Place them in client/public/ folder" -ForegroundColor White
    Write-Host ""
    $continueWithoutIcons = Read-Host "Continue without icons? (Y/N)"
    if ($continueWithoutIcons -ne "Y" -and $continueWithoutIcons -ne "y") {
        exit
    }
} else {
    Write-Host "✅ App icons found" -ForegroundColor Green
}

Write-Host ""
Write-Host "Choose deployment platform:" -ForegroundColor Cyan
Write-Host "1. Vercel (Recommended - Easy and Free)" -ForegroundColor Green
Write-Host "2. Netlify (Free with great features)" -ForegroundColor Green
Write-Host "3. Firebase Hosting (Google's platform)" -ForegroundColor Yellow
Write-Host "4. GitHub Pages (Free for public repos)" -ForegroundColor Yellow
Write-Host "5. Build only (create production files)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

# Change to client directory
Set-Location client

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
        Write-Host ""
        
        # Check if Vercel CLI is installed
        if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
            Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
            npm install -g vercel
        }
        
        Write-Host "Building project..." -ForegroundColor Yellow
        npm run build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Build successful!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Starting Vercel deployment..." -ForegroundColor Cyan
            Write-Host "⚠️ You'll need to:" -ForegroundColor Yellow
            Write-Host "  - Sign in to Vercel (or create account)" -ForegroundColor White
            Write-Host "  - Choose deployment settings" -ForegroundColor White
            Write-Host ""
            vercel --prod
        } else {
            Write-Host "❌ Build failed. Please fix errors and try again." -ForegroundColor Red
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "🚀 Deploying to Netlify..." -ForegroundColor Cyan
        Write-Host ""
        
        # Check if Netlify CLI is installed
        if (-not (Get-Command netlify -ErrorAction SilentlyContinue)) {
            Write-Host "Installing Netlify CLI..." -ForegroundColor Yellow
            npm install -g netlify-cli
        }
        
        Write-Host "Building project..." -ForegroundColor Yellow
        npm run build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Build successful!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Starting Netlify deployment..." -ForegroundColor Cyan
            netlify deploy --prod --dir=build
        } else {
            Write-Host "❌ Build failed. Please fix errors and try again." -ForegroundColor Red
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "🚀 Deploying to Firebase..." -ForegroundColor Cyan
        Write-Host ""
        
        # Check if Firebase CLI is installed
        if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
            Write-Host "Installing Firebase CLI..." -ForegroundColor Yellow
            npm install -g firebase-tools
        }
        
        Write-Host "Building project..." -ForegroundColor Yellow
        npm run build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Build successful!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Initializing Firebase..." -ForegroundColor Cyan
            Write-Host "⚠️ You'll need to:" -ForegroundColor Yellow
            Write-Host "  - Sign in to Firebase" -ForegroundColor White
            Write-Host "  - Create or select project" -ForegroundColor White
            Write-Host "  - Choose 'build' as public directory" -ForegroundColor White
            Write-Host ""
            firebase init hosting
            firebase deploy
        } else {
            Write-Host "❌ Build failed. Please fix errors and try again." -ForegroundColor Red
        }
    }
    
    "4" {
        Write-Host ""
        Write-Host "🚀 Preparing for GitHub Pages..." -ForegroundColor Cyan
        Write-Host ""
        
        # Install gh-pages if not present
        Write-Host "Installing gh-pages..." -ForegroundColor Yellow
        npm install --save-dev gh-pages
        
        # Add deploy script to package.json
        Write-Host "Adding deploy script..." -ForegroundColor Yellow
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        if (-not $packageJson.scripts) {
            $packageJson | Add-Member -Type NoteProperty -Name scripts -Value @{}
        }
        $packageJson.scripts | Add-Member -Type NoteProperty -Name deploy -Value "gh-pages -d build" -Force
        $packageJson.homepage = "https://muhammed224085-oss.github.io/HealthConnect"
        
        $packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"
        
        Write-Host "Building project..." -ForegroundColor Yellow
        npm run build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Build successful!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Deploying to GitHub Pages..." -ForegroundColor Cyan
            npm run deploy
            Write-Host ""
            Write-Host "🎉 Deployed to: https://muhammed224085-oss.github.io/HealthConnect" -ForegroundColor Green
        } else {
            Write-Host "❌ Build failed. Please fix errors and try again." -ForegroundColor Red
        }
    }
    
    "5" {
        Write-Host ""
        Write-Host "🔨 Building production files..." -ForegroundColor Cyan
        Write-Host ""
        
        npm run build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Build successful!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Production files created in 'build' folder" -ForegroundColor White
            Write-Host "You can now upload these files to any web server" -ForegroundColor White
        } else {
            Write-Host "❌ Build failed. Please fix errors and try again." -ForegroundColor Red
        }
    }
    
    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📱 After deployment:" -ForegroundColor Cyan
Write-Host "1. Visit your deployed website" -ForegroundColor White
Write-Host "2. Test PWA installation on mobile" -ForegroundColor White
Write-Host "3. Share the URL or QR code with users" -ForegroundColor White
Write-Host "4. Users can install as mobile app!" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green