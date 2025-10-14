# HealthConnect - Commands Cheat Sheet

## 🖥️ Backend Commands (Spring Boot)

### Navigate to Server Directory
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect\server"
```

### Build the Project
```powershell
mvn clean install
```

### Run the Application
```powershell
mvn spring-boot:run
```

### Run Tests
```powershell
mvn test
```

### Package as JAR
```powershell
mvn clean package
```

### Run the JAR file
```powershell
java -jar target/healthconnect-server-1.0.0.jar
```

### Clean Build Files
```powershell
mvn clean
```

---

## 🌐 Frontend Commands (React)

### Navigate to Client Directory
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect\client"
```

### Install Dependencies
```powershell
npm install
```

### Start Development Server
```powershell
npm start
```

### Build for Production
```powershell
npm run build
```

### Run Tests
```powershell
npm test
```

### Clear Cache
```powershell
npm cache clean --force
```

### Reinstall Dependencies
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 🔧 Useful Commands

### Check Java Version
```powershell
java -version
```

### Check Maven Version
```powershell
mvn -version
```

### Check Node Version
```powershell
node -version
```

### Check npm Version
```powershell
npm -version
```

### Kill Process on Port 8080 (Backend)
```powershell
# Find process
netstat -ano | findstr :8080

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Kill Process on Port 3000 (Frontend)
```powershell
# Find process
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

## 🚀 Quick Start (All in One)

### Option 1: Run Both Servers Simultaneously

**Terminal 1 (Backend):**
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect\server" ; mvn spring-boot:run
```

**Terminal 2 (Frontend):**
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect\client" ; npm start
```

---

## 🧪 API Testing Commands (using curl)

### Test Doctor Login
```powershell
curl -X POST http://localhost:8080/api/doctors/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"sarah.johnson@health.com\",\"password\":\"doctor123\"}'
```

### Test Get All Doctors
```powershell
curl http://localhost:8080/api/doctors
```

### Test Get All Medicines
```powershell
curl http://localhost:8080/api/medicines
```

### Test Create Appointment
```powershell
curl -X POST http://localhost:8080/api/appointments `
  -H "Content-Type: application/json" `
  -d '{\"patientId\":1,\"doctorId\":1,\"patientName\":\"John Smith\",\"doctorName\":\"Dr. Sarah Johnson\",\"date\":\"2025-10-20\",\"time\":\"10:00\",\"symptoms\":\"Fever\",\"status\":\"PENDING\"}'
```

---

## 📦 Dependency Management

### Add New Maven Dependency
1. Open `pom.xml`
2. Add dependency in `<dependencies>` section
3. Run `mvn clean install`

### Add New npm Package
```powershell
npm install <package-name>
```

### Update All npm Packages
```powershell
npm update
```

---

## 🐛 Troubleshooting Commands

### Clear Maven Cache
```powershell
mvn dependency:purge-local-repository
```

### Rebuild React App
```powershell
Remove-Item -Recurse -Force build
npm run build
```

### Check Backend Logs
Look for output in terminal where `mvn spring-boot:run` is running

### Check Frontend Logs
Look for output in terminal where `npm start` is running
Check browser console (F12) for errors

---

## 📊 Project Structure Commands

### Count Lines of Code (Backend)
```powershell
cd server/src
Get-ChildItem -Recurse -Include *.java | Get-Content | Measure-Object -Line
```

### Count Lines of Code (Frontend)
```powershell
cd client/src
Get-ChildItem -Recurse -Include *.js,*.jsx | Get-Content | Measure-Object -Line
```

### List All Java Files
```powershell
cd server/src
Get-ChildItem -Recurse -Filter *.java | Select-Object FullName
```

### List All React Components
```powershell
cd client/src
Get-ChildItem -Recurse -Filter *.js | Select-Object Name
```

---

## 🔍 Monitoring

### Check if Backend is Running
```powershell
curl http://localhost:8080/api/doctors
```

### Check if Frontend is Running
Open browser: http://localhost:3000

### View All Running Java Processes
```powershell
Get-Process java
```

### View All Node Processes
```powershell
Get-Process node
```

---

## 💾 Backup Commands

### Backup Entire Project
```powershell
cd "C:\Users\shame\Desktop\Project App"
Compress-Archive -Path HealthConnect -DestinationPath "HealthConnect_Backup_$(Get-Date -Format 'yyyyMMdd').zip"
```

### Backup Only Source Code
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect"
Compress-Archive -Path server/src,client/src -DestinationPath "HealthConnect_Source_$(Get-Date -Format 'yyyyMMdd').zip"
```

---

## 📝 Git Commands (Optional)

### Initialize Git Repository
```powershell
cd "C:\Users\shame\Desktop\Project App\HealthConnect"
git init
```

### Add All Files
```powershell
git add .
```

### Commit Changes
```powershell
git commit -m "Initial commit - HealthConnect project"
```

### Create GitHub Repository (after creating on GitHub)
```powershell
git remote add origin <your-repo-url>
git push -u origin main
```

---

**Quick Reference - Save this file for easy access to all commands!**
