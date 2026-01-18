# Complete Setup and Run Guide

## Step-by-Step Instructions to Run the ATS Resume Analyzer Project

---

## 📋 Prerequisites Check

Before starting, ensure you have the following installed:

### 1. Java Development Kit (JDK)
```bash
java -version
```
- **Required:** JDK 17 or higher
- **Download:** [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://adoptium.net/)

### 2. Maven
```bash
mvn -version
```
- **Required:** Maven 3.6 or higher
- **Download:** [Maven Download](https://maven.apache.org/download.cgi)

### 3. Node.js and npm
```bash
node -v
npm -v
```
- **Required:** Node.js 16+ and npm 8+
- **Download:** [Node.js Download](https://nodejs.org/)

### 4. MySQL Database
```bash
mysql --version
```
- **Required:** MySQL 8.0 or higher
- **Download:** [MySQL Download](https://dev.mysql.com/downloads/mysql/)
- **Alternative:** Use XAMPP/WAMP which includes MySQL

---

## 🗄️ Step 1: Database Setup

### Option A: Create Database Manually

1. **Start MySQL Server**
   ```bash
   # Windows (if MySQL is a service)
   net start MySQL
   
   # Or use MySQL Workbench/Command Line
   mysql -u root -p
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE ats_resume_db;
   SHOW DATABASES;  -- Verify database created
   EXIT;
   ```

### Option B: Auto-Creation (Recommended)
- Skip this step if you want Spring Boot to auto-create the database
- Just ensure MySQL server is running
- Database will be created automatically on first run

---

## ⚙️ Step 2: Backend Configuration

### 2.1 Navigate to Backend Directory
```bash
cd backend
```

### 2.2 Update Database Credentials

Edit `src/main/resources/application.properties`:

```properties
# Update these lines with your MySQL credentials
spring.datasource.username=root          # Your MySQL username
spring.datasource.password=your_password # Your MySQL password
```

**Default values if using standard MySQL installation:**
- Username: `root`
- Password: (your MySQL root password, or leave empty if no password)

### 2.3 Verify Port Availability
- Ensure port **8080** is not in use
- If occupied, change in `application.properties`:
  ```properties
  server.port=8081  # Use different port
  ```

---

## 🚀 Step 3: Build and Run Backend

### 3.1 Build the Project
```bash
# In the backend directory
mvn clean install
```

**Expected output:**
```
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

**If build fails:**
- Check Java version: `java -version` (must be 17+)
- Check Maven installation: `mvn -version`
- Clear Maven cache: `mvn clean`

### 3.2 Run the Spring Boot Application

**Option A: Using Maven**
```bash
mvn spring-boot:run
```

**Option B: Using Java directly**
```bash
# First build the JAR
mvn clean package

# Then run it
java -jar target/resume-analyzer-1.0.0.jar
```

### 3.3 Verify Backend is Running

Look for this message in console:
```
Started ResumeAnalyzerApplication in X.XXX seconds
```

**Test Backend API:**
- Open browser: `http://localhost:8080`
- You should see a Whitelabel Error Page (this is normal - it means server is running)
- Or test: `http://localhost:8080/api/jobs` (should return `[]`)

**Backend is now running on:** `http://localhost:8080`

**Keep this terminal window open!**

---

## 🎨 Step 4: Frontend Setup

### 4.1 Open New Terminal/Command Prompt

**Important:** Keep backend terminal running, open a NEW terminal window.

### 4.2 Navigate to Frontend Directory
```bash
cd frontend
```

### 4.3 Install Dependencies
```bash
npm install
```

**Expected output:**
```
added XXX packages, and audited XXX packages in XXs
```

**If npm install fails:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### 4.4 Verify Backend Connection

The frontend is configured to connect to `http://localhost:8080` (see `package.json` proxy setting).

**If you changed backend port:**
- Update `frontend/package.json`:
  ```json
  "proxy": "http://localhost:8081"  // Change to your backend port
  ```

---

## 🌐 Step 5: Run Frontend

### 5.1 Start React Development Server
```bash
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view ats-resume-analyzer-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### 5.2 Browser Opens Automatically

If browser doesn't open automatically, navigate to:
```
http://localhost:3000
```

**Frontend is now running on:** `http://localhost:3000`

---

## ✅ Step 6: Verify Everything is Running

### Check Both Servers:
- ✅ **Backend:** Terminal showing Spring Boot logs
- ✅ **Frontend:** Terminal showing React compilation
- ✅ **Browser:** `http://localhost:3000` showing the application

### Quick Test:

1. **Register a new user:**
   - Click "Register here" on login page
   - Fill in details (Role: Candidate or Recruiter)
   - Click "Register"

2. **Login:**
   - Use the credentials you just created
   - You should be redirected to Dashboard

3. **Upload a Resume:**
   - Go to "Upload Resume"
   - Select a PDF/DOC/DOCX file
   - Click "Upload Resume"

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: Port 8080 already in use**
```bash
# Find process using port 8080 (Windows)
netstat -ano | findstr :8080

# Kill the process
taskkill /PID <process_id> /F
```

**Problem: Database connection failed**
- Check MySQL is running
- Verify credentials in `application.properties`
- Test connection manually: `mysql -u root -p`

**Problem: Build fails**
```bash
# Clean and rebuild
mvn clean
mvn install -U
```

### Frontend Issues

**Problem: npm install fails**
```bash
# Use specific Node version
nvm use 16  # If using nvm

# Or clear everything
rm -rf node_modules package-lock.json
npm install
```

**Problem: Cannot connect to backend**
- Verify backend is running on port 8080
- Check browser console for CORS errors
- Verify proxy setting in `package.json`

**Problem: Port 3000 in use**
- React will ask to use different port (press Y)
- Or change port: set `PORT=3001` before `npm start`

---

## 📝 Quick Start Summary

```bash
# Terminal 1 - Backend
cd backend
# Edit application.properties (database credentials)
mvn clean install
mvn spring-boot:run

# Terminal 2 - Frontend (wait for backend to start)
cd frontend
npm install
npm start
```

**Both should be running:**
- Backend: http://localhost:8080
- Frontend: http://localhost:3000

---

## 🎯 Next Steps After Setup

1. **Create a Recruiter Account:**
   - Register with Role: "Recruiter"
   - Go to Admin Panel
   - Create job postings

2. **Create a Candidate Account:**
   - Register with Role: "Candidate"
   - Upload resume
   - Browse jobs and analyze matches

3. **Test Analysis:**
   - Upload a resume (as candidate)
   - Create a job (as recruiter/admin)
   - Analyze resume against job
   - View match percentage and suggestions

---

## 🛑 Stopping the Application

### To Stop:
1. **Frontend:** Press `Ctrl + C` in frontend terminal
2. **Backend:** Press `Ctrl + C` in backend terminal

---

## 📚 Additional Resources

- **Spring Boot Docs:** https://spring.io/projects/spring-boot
- **React Docs:** https://react.dev
- **MySQL Docs:** https://dev.mysql.com/doc/

---

## ⚡ Production Build

### Build Backend for Production:
```bash
cd backend
mvn clean package
# JAR file will be in target/resume-analyzer-1.0.0.jar
```

### Build Frontend for Production:
```bash
cd frontend
npm run build
# Build files will be in frontend/build/
```

---

**Need Help?** Check the main README.md for more details!
