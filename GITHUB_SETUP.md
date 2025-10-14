# Push HealthConnect to GitHub - Step by Step Guide

## 📋 Prerequisites

1. **Git installed** - Check with: `git --version`
2. **GitHub account** - Sign up at https://github.com if you don't have one
3. **GitHub repository created** - Create a new repository on GitHub

---

## 🚀 Step-by-Step Instructions

### Step 1: Install Git (if not already installed)

Download and install from: https://git-scm.com/download/win

Verify installation:
```powershell
git --version
```

---

### Step 2: Configure Git (First Time Only)

```powershell
# Set your name
git config --global user.name "Your Name"

# Set your email (use your GitHub email)
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

---

### Step 3: Create a New Repository on GitHub

1. Go to https://github.com
2. Click the **"+"** button (top right) → **"New repository"**
3. Fill in:
   - **Repository name:** `HealthConnect` (or your preferred name)
   - **Description:** "Doctor-Patient Communication and Medicine Delivery System"
   - **Visibility:** Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**
5. Copy the repository URL (will look like: `https://github.com/yourusername/HealthConnect.git`)

---

### Step 4: Initialize Git in Your Project

Open PowerShell and navigate to your project:

```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect"
```

Initialize Git:
```powershell
git init
```

---

### Step 5: Add All Files to Git

```powershell
# Add all files to staging
git add .

# Check what will be committed
git status
```

---

### Step 6: Create Your First Commit

```powershell
git commit -m "Initial commit: HealthConnect full-stack application"
```

---

### Step 7: Connect to GitHub Repository

Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` with your actual values:

```powershell
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
```

Example:
```powershell
git remote add origin https://github.com/johndoe/HealthConnect.git
```

Verify remote:
```powershell
git remote -v
```

---

### Step 8: Push to GitHub

For the first push:
```powershell
# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note:** You may be prompted to login to GitHub. Use your GitHub credentials.

---

### Step 9: Verify on GitHub

1. Go to your GitHub repository page
2. Refresh the page
3. You should see all your files!

---

## 🔐 Authentication Options

### Option 1: HTTPS with Personal Access Token (Recommended)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "HealthConnect Project"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)
7. When pushing, use the token as your password

### Option 2: GitHub CLI

Install GitHub CLI and authenticate:
```powershell
# Install via winget
winget install --id GitHub.cli

# Authenticate
gh auth login
```

### Option 3: SSH Key (Advanced)

Follow GitHub's SSH setup guide: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## 📝 All Commands in One Place

```powershell
# Navigate to project
cd "C:\Users\shame\Desktop\Project App\HealthConnect"

# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: HealthConnect full-stack application"

# Add remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/HealthConnect.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## 🔄 Future Updates

After the initial push, to update your repository:

```powershell
# Check status
git status

# Add changed files
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push
```

---

## 📦 What Will Be Pushed

✅ All source code (frontend & backend)  
✅ Documentation files (README.md, QUICKSTART.md, etc.)  
✅ Configuration files (pom.xml, package.json)  
✅ .gitignore file  

❌ node_modules/ (excluded by .gitignore)  
❌ target/ (excluded by .gitignore)  
❌ Build artifacts (excluded by .gitignore)  

---

## ⚠️ Important Notes

1. **Never commit sensitive data** (passwords, API keys, tokens)
2. **Check .gitignore** is working properly
3. **Don't commit node_modules/** or **target/** folders
4. **Use meaningful commit messages**

---

## 🆘 Troubleshooting

### Error: "fatal: not a git repository"
```powershell
git init
```

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin YOUR_GITHUB_URL
```

### Error: "failed to push some refs"
```powershell
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error: Authentication failed
- Make sure you're using the correct GitHub username
- Use a Personal Access Token instead of password
- Or use GitHub CLI: `gh auth login`

---

## 📊 Repository Structure on GitHub

```
HealthConnect/
├── .gitignore
├── README.md
├── QUICKSTART.md
├── PROJECT_DOCUMENTATION.md
├── COMMANDS.md
├── TROUBLESHOOTING.md
├── VISUAL_SUMMARY.md
├── start-backend.ps1
├── start-frontend.ps1
├── client/
│   ├── public/
│   ├── src/
│   └── package.json
└── server/
    ├── src/
    └── pom.xml
```

---

## ✅ Success Checklist

- [ ] Git is installed
- [ ] Git is configured (name and email)
- [ ] GitHub repository created
- [ ] Project initialized with git init
- [ ] Files added with git add
- [ ] First commit created
- [ ] Remote origin added
- [ ] Successfully pushed to GitHub
- [ ] Files visible on GitHub website

---

**Happy Coding! Your project is now on GitHub! 🎉**
