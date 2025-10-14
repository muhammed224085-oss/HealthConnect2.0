# HealthConnect - Push to GitHub Script
# This script helps you push your project to GitHub

Write-Host "🚀 HealthConnect - GitHub Push Helper" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
Write-Host "Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host ""

# Check if Git is configured
Write-Host "Checking Git configuration..." -ForegroundColor Yellow
$userName = git config --global user.name
$userEmail = git config --global user.email

if ([string]::IsNullOrWhiteSpace($userName) -or [string]::IsNullOrWhiteSpace($userEmail)) {
    Write-Host "❌ Git is not configured!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please configure Git first:" -ForegroundColor Yellow
    Write-Host '  git config --global user.name "Your Name"' -ForegroundColor White
    Write-Host '  git config --global user.email "your.email@example.com"' -ForegroundColor White
    Write-Host ""
    
    $configure = Read-Host "Would you like to configure Git now? (Y/N)"
    if ($configure -eq "Y" -or $configure -eq "y") {
        $name = Read-Host "Enter your name"
        $email = Read-Host "Enter your email"
        git config --global user.name "$name"
        git config --global user.email "$email"
        Write-Host "✅ Git configured successfully!" -ForegroundColor Green
    } else {
        Write-Host "Please configure Git manually before continuing."
        Write-Host "Press any key to exit..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit
    }
} else {
    Write-Host "✅ Git is configured:" -ForegroundColor Green
    Write-Host "   Name: $userName" -ForegroundColor White
    Write-Host "   Email: $userEmail" -ForegroundColor White
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Initialize Git (if not already done)
Write-Host "Step 1: Initializing Git repository..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
} else {
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
}

Write-Host ""

# Step 2: Add all files
Write-Host "Step 2: Adding all files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files added to staging area" -ForegroundColor Green

Write-Host ""

# Step 3: Create first commit
Write-Host "Step 3: Creating first commit..." -ForegroundColor Yellow
git commit -m "Initial commit: HealthConnect full-stack application"
Write-Host "✅ First commit created" -ForegroundColor Green

Write-Host ""

# Step 4: Get GitHub repository URL
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Step 4: GitHub Repository Setup" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Before continuing, please:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com" -ForegroundColor White
Write-Host "2. Click '+' → 'New repository'" -ForegroundColor White
Write-Host "3. Name: HealthConnect (or your choice)" -ForegroundColor White
Write-Host "4. DO NOT initialize with README" -ForegroundColor White
Write-Host "5. Click 'Create repository'" -ForegroundColor White
Write-Host "6. Copy the repository URL" -ForegroundColor White
Write-Host ""
Write-Host "Example URL: https://github.com/yourusername/HealthConnect.git" -ForegroundColor Cyan
Write-Host ""

$repoUrl = Read-Host "Enter your GitHub repository URL"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ Repository URL is required!" -ForegroundColor Red
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host ""

# Step 5: Add remote
Write-Host "Step 5: Adding GitHub remote..." -ForegroundColor Yellow
try {
    git remote remove origin 2>$null
} catch {
    # Remote doesn't exist, that's fine
}

git remote add origin $repoUrl
Write-Host "✅ GitHub remote added" -ForegroundColor Green

Write-Host ""

# Step 6: Rename branch to main
Write-Host "Step 6: Renaming branch to 'main'..." -ForegroundColor Yellow
git branch -M main
Write-Host "✅ Branch renamed to 'main'" -ForegroundColor Green

Write-Host ""

# Step 7: Push to GitHub
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Step 7: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  You may be prompted to login to GitHub" -ForegroundColor Yellow
Write-Host "   Use your GitHub username and password" -ForegroundColor Yellow
Write-Host "   Or use a Personal Access Token (recommended)" -ForegroundColor Yellow
Write-Host ""

$push = Read-Host "Ready to push? (Y/N)"
if ($push -eq "Y" -or $push -eq "y") {
    git push -u origin main
    
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "🎉 SUCCESS!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Your HealthConnect project is now on GitHub!" -ForegroundColor Green
    Write-Host "Repository URL: $repoUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Visit your repository on GitHub" -ForegroundColor White
    Write-Host "2. Verify all files are there" -ForegroundColor White
    Write-Host "3. Add a description and topics to your repo" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Push cancelled. You can push manually later with:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor White
    Write-Host ""
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
