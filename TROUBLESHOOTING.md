# HealthConnect - Troubleshooting Guide

## 🔧 Common Issues and Solutions

### Issue 1: Backend Won't Start - PostConstruct Error

**Error:** `package javax.annotation does not exist`

**Solution:** This was fixed! The annotation was changed from `javax.annotation.PostConstruct` to `jakarta.annotation.PostConstruct` for Spring Boot 3.x compatibility.

**Status:** ✅ FIXED

---

### Issue 2: Lombok Warnings in IDE

**Symptom:** You see Lombok-related warnings in VS Code

**Solution:** These are IDE warnings only and won't affect compilation. To ignore them:
1. The project will compile and run fine with Maven
2. Lombok generates getters/setters/constructors at compile time
3. IDE warnings can be ignored

---

### Issue 3: Port Already in Use

**Error:** Port 8080 or 3000 already in use

**Solution for Port 8080 (Backend):**
```powershell
# Find the process
netstat -ano | findstr :8080

# Kill it (replace PID with actual number)
taskkill /PID <PID> /F
```

**Solution for Port 3000 (Frontend):**
```powershell
# Find the process
netstat -ano | findstr :3000

# Kill it (replace PID with actual number)
taskkill /PID <PID> /F
```

---

### Issue 4: Maven Build Fails

**Solution:**
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect\server"

# Clean and rebuild
mvn clean install

# If still failing, skip tests
mvn clean install -DskipTests
```

---

### Issue 5: npm Install Fails

**Solution:**
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect\client"

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Reinstall
npm install
```

---

### Issue 6: CORS Errors in Browser

**Symptom:** "Access to XMLHttpRequest blocked by CORS policy"

**Solution:**
1. Make sure backend is running on port 8080
2. Make sure frontend is running on port 3000
3. Check `CorsConfig.java` allows `http://localhost:3000`
4. Clear browser cache and try again

---

### Issue 7: Blank Page or React Errors

**Solution:**
```powershell
# Clear cache and rebuild
cd "C:\Users\shame\Desktop\Project App\HealthConnect\client"
Remove-Item -Recurse -Force build
Remove-Item -Recurse -Force node_modules/.cache
npm start
```

---

### Issue 8: Data Not Persisting

**Expected Behavior:** This is normal! The application uses in-memory storage.

**What This Means:**
- Data is lost when you restart the backend
- Sample data is reloaded on each start
- This is by design for this college project

---

### Issue 9: Can't Login with Test Credentials

**Solution:**
1. Make sure backend server is running
2. Check browser console (F12) for errors
3. Try these exact credentials:

**Doctor:**
- Email: `sarah.johnson@health.com`
- Password: `doctor123`

**Patient:**
- Email: `john.smith@email.com`
- Password: `patient123`

---

### Issue 10: API Returns 404

**Checklist:**
- [ ] Backend server is running (check terminal)
- [ ] URL is correct: `http://localhost:8080/api/...`
- [ ] Check for typos in endpoint path
- [ ] Review browser Network tab (F12)

---

## 🚀 Fresh Start Instructions

If everything is broken, start fresh:

### Step 1: Stop Everything
```powershell
# Close all terminals running the app
# Use Ctrl+C in each terminal
```

### Step 2: Clean Backend
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect\server"
mvn clean
```

### Step 3: Clean Frontend
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect\client"
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force build
```

### Step 4: Rebuild Backend
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect\server"
mvn clean install -DskipTests
```

### Step 5: Rebuild Frontend
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect\client"
npm install
```

### Step 6: Start Backend
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect\server"
mvn spring-boot:run
```

Wait for "Started HealthConnectApplication" message

### Step 7: Start Frontend (New Terminal)
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect\client"
npm start
```

---

## 🔍 Verification Steps

### Check Backend is Running:
1. Open browser
2. Go to: `http://localhost:8080/api/doctors`
3. Should see JSON with doctor list

### Check Frontend is Running:
1. Open browser
2. Go to: `http://localhost:3000`
3. Should see HealthConnect home page

### Test Full Flow:
1. Click "For Patients" → "Login"
2. Use: `john.smith@email.com` / `patient123`
3. Should see Patient Dashboard

---

## 📞 Still Having Issues?

### Check System Requirements:
```powershell
# Java version (need 17+)
java -version

# Maven version (need 3.6+)
mvn -version

# Node version (need 16+)
node -version

# npm version
npm -version
```

### View Logs:

**Backend Logs:**
- Look at terminal where `mvn spring-boot:run` is running
- Errors will show in red

**Frontend Logs:**
- Look at terminal where `npm start` is running
- Also check browser console (F12 → Console tab)

---

## ✅ Success Checklist

When everything is working correctly:

- [ ] Backend terminal shows "Started HealthConnectApplication"
- [ ] Frontend terminal shows "Compiled successfully!"
- [ ] Browser opens to `http://localhost:3000`
- [ ] Home page displays with "For Doctors" and "For Patients" sections
- [ ] Can login with test credentials
- [ ] Dashboard loads after login
- [ ] Can view and interact with features

---

**If you've followed these steps and still have issues, check the specific error message in the terminal and search for it in this guide.**
