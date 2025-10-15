# MongoDB Integration Guide for HealthConnect

## 📋 Overview

This guide will help you set up MongoDB for the HealthConnect project. The application has been configured to use MongoDB instead of in-memory storage.

---

## 🔧 Installation Options

### Option 1: MongoDB Community Edition (Local)

#### Windows Installation

1. **Download MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows
   - Download the MSI installer

2. **Install MongoDB:**
   ```powershell
   # Run the downloaded MSI file
   # Choose "Complete" installation
   # Install MongoDB as a Service
   # Install MongoDB Compass (GUI tool)
   ```

3. **Verify Installation:**
   ```powershell
   # Check if MongoDB service is running
   Get-Service MongoDB

   # Check MongoDB version
   mongod --version
   ```

4. **Start MongoDB:**
   ```powershell
   # MongoDB should auto-start as a service
   # If not, start it manually:
   net start MongoDB
   ```

5. **Default Connection:**
   - MongoDB runs on: `mongodb://localhost:27017`
   - Database: `healthconnect` (auto-created)

---

### Option 2: MongoDB Atlas (Cloud - Free Tier)

1. **Create Atlas Account:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create a Cluster:**
   - Choose FREE tier (M0)
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Set up Database Access:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Select "Read and write to any database"

4. **Set up Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP

5. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update application.properties:**
   ```properties
   # Comment out the local MongoDB URI
   # spring.data.mongodb.uri=mongodb://localhost:27017/healthconnect
   
   # Add your Atlas connection string
   spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/healthconnect?retryWrites=true&w=majority
   ```

---

### Option 3: Docker (Recommended for Development)

```powershell
# Pull MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d `
  --name healthconnect-mongodb `
  -p 27017:27017 `
  -e MONGO_INITDB_DATABASE=healthconnect `
  -v mongodb_data:/data/db `
  mongo:latest

# Verify container is running
docker ps

# View logs
docker logs healthconnect-mongodb

# Stop MongoDB
docker stop healthconnect-mongodb

# Start MongoDB
docker start healthconnect-mongodb

# Remove MongoDB container
docker rm -f healthconnect-mongodb
```

---

## 🔍 Verifying MongoDB Connection

### Using MongoDB Compass (GUI)

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. You should see the `healthconnect` database
4. Check collections: doctors, patients, appointments, medicines, prescriptions, orders, messages

### Using MongoDB Shell

```powershell
# Connect to MongoDB
mongosh

# Switch to healthconnect database
use healthconnect

# Show all collections
show collections

# View sample data
db.doctors.find().pretty()
db.patients.find().pretty()
db.medicines.find().pretty()

# Count documents
db.doctors.countDocuments()
db.patients.countDocuments()
```

---

## 📊 Database Schema

### Collections

1. **doctors**
   ```json
   {
     "_id": "ObjectId",
     "name": "String",
     "email": "String" (unique),
     "password": "String",
     "specialization": "String",
     "phone": "String",
     "experience": "String",
     "qualification": "String"
   }
   ```

2. **patients**
   ```json
   {
     "_id": "ObjectId",
     "name": "String",
     "email": "String" (unique),
     "password": "String",
     "phone": "String",
     "age": "String",
     "address": "String",
     "medicalHistory": "String"
   }
   ```

3. **appointments**
   ```json
   {
     "_id": "ObjectId",
     "patientId": "String",
     "doctorId": "String",
     "patientName": "String",
     "doctorName": "String",
     "date": "String",
     "time": "String",
     "status": "String",
     "symptoms": "String"
   }
   ```

4. **medicines**
   ```json
   {
     "_id": "ObjectId",
     "name": "String",
     "description": "String",
     "price": "Double",
     "category": "String",
     "stock": "Integer"
   }
   ```

5. **prescriptions**
   ```json
   {
     "_id": "ObjectId",
     "appointmentId": "String",
     "doctorId": "String",
     "patientId": "String",
     "doctorName": "String",
     "patientName": "String",
     "diagnosis": "String",
     "medicines": "String",
     "instructions": "String",
     "date": "String"
   }
   ```

6. **orders**
   ```json
   {
     "_id": "ObjectId",
     "patientId": "String",
     "patientName": "String",
     "patientAddress": "String",
     "patientPhone": "String",
     "items": "Array",
     "totalAmount": "Double",
     "status": "String",
     "orderDate": "String",
     "deliveryDate": "String"
   }
   ```

7. **messages**
   ```json
   {
     "_id": "ObjectId",
     "senderId": "String",
     "receiverId": "String",
     "senderName": "String",
     "senderType": "String",
     "message": "String",
     "timestamp": "String"
   }
   ```

---

## 🚀 Running the Application

1. **Start MongoDB** (if using local installation):
   ```powershell
   net start MongoDB
   ```

2. **Start Backend Server**:
   ```powershell
   cd "C:\Users\shame\Desktop\Project App\HealthConnect\server"
   mvn clean install
   mvn spring-boot:run
   ```

3. **Check Logs**:
   - Look for: "Started HealthConnectApplication"
   - Check: "Initializing MongoDB with sample data..."
   - Verify: "Sample data initialized successfully!"

4. **Start Frontend**:
   ```powershell
   cd "C:\Users\shame\Desktop\Project App\HealthConnect\client"
   npm start
   ```

---

## 🔧 Troubleshooting

### Error: "Connection refused to MongoDB"

```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Start MongoDB service
net start MongoDB

# Or using Docker
docker start healthconnect-mongodb
```

### Error: "Authentication failed"

- Check username/password in connection string
- Verify database user has correct permissions

### Error: "Network timeout"

- Check network access settings in Atlas
- Add your IP address to whitelist
- Or allow access from anywhere (0.0.0.0/0)

### Clear All Data and Reset

```powershell
# Connect to MongoDB
mongosh

# Switch to healthconnect database
use healthconnect

# Drop all collections
db.doctors.drop()
db.patients.drop()
db.appointments.drop()
db.medicines.drop()
db.prescriptions.drop()
db.orders.drop()
db.messages.drop()

# Restart the backend server to reinitialize sample data
```

---

## 📝 Sample Data

The application automatically creates sample data on first run:

### Doctors (3)
- sarah.johnson@health.com / doctor123
- michael.chen@health.com / doctor123
- emily.williams@health.com / doctor123

### Patients (3)
- john.smith@email.com / patient123
- emma.davis@email.com / patient123
- robert.brown@email.com / patient123

### Medicines (5)
- Aspirin, Amoxicillin, Lisinopril, Metformin, Vitamin D3

### Appointments (2)
- Pre-configured sample appointments

---

## 🔐 Security Notes

⚠️ **Important for Production:**

1. **Never commit connection strings with passwords to Git**
2. **Use environment variables for sensitive data**
3. **Enable authentication on MongoDB**
4. **Use strong passwords**
5. **Restrict network access**
6. **Use HTTPS/TLS for connections**
7. **Encrypt passwords before storing** (currently plain text for demo)

---

## 📚 Additional Resources

- MongoDB Documentation: https://docs.mongodb.com/
- MongoDB Compass: https://www.mongodb.com/products/compass
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Spring Data MongoDB: https://spring.io/projects/spring-data-mongodb

---

## ✅ Quick Checklist

- [ ] MongoDB installed and running
- [ ] Connection string configured in application.properties
- [ ] Backend server starts without errors
- [ ] Sample data initialized
- [ ] Can view data in MongoDB Compass
- [ ] Frontend can register/login users
- [ ] All CRUD operations working

---

**Your HealthConnect application is now powered by MongoDB! 🎉**
