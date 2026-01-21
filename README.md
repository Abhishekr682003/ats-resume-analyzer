# AI-Based Resume Analyzer and Job Matching System

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

A full-stack web application that functions as a mini Applicant Tracking System (ATS) built with Spring Boot (Java) backend and React.js frontend.

## Features

- **User Authentication**: Secure JWT-based authentication system with role-based access control (Candidate, Recruiter, Admin)
- **Resume Upload**: Support for PDF, DOC, and DOCX file formats
- **Resume Parsing**: Automatic text extraction and skill detection from uploaded resumes
- **Job Management**: Create, update, and manage job postings (Admin/Recruiter only)
- **Resume Analysis**: Automated comparison of resumes against job descriptions
- **Match Scoring**: Calculate match percentage based on skills and requirements
- **Skill Analysis**: Identify matched skills, missing skills, and provide improvement suggestions
- **Interactive Dashboard**: Visual representation of analysis results with charts and graphs

## Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** with JWT
- **Spring Data JPA**
- **MySQL** Database
- **Apache PDFBox** (PDF parsing)
- **Apache POI** (DOC/DOCX parsing)
- **Maven** (Dependency Management)

### Frontend
- **React.js 18**
- **React Router** (Routing)
- **Axios** (HTTP Client)
- **Recharts** (Data Visualization)
- **CSS3** (Styling)

## Prerequisites

Before you begin, ensure you have the following installed:
- Java JDK 17 or higher
- Maven 3.6+
- Node.js 16+ and npm
- MySQL 8.0+
- IDE (IntelliJ IDEA, Eclipse, or VS Code recommended)

## Setup Instructions

### 1. Database Setup

1. Start MySQL server
2. The database `ats_resume_db` will be created automatically on first run, or create it manually:
   ```sql
   CREATE DATABASE ats_resume_db;
   ```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Update database credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. Build the project:
   ```bash
   mvn clean install
   ```

4. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

   The backend server will start on `http://localhost:8080`

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## Usage Guide

### For Candidates

1. **Register/Login**: Create an account or login with existing credentials
2. **Upload Resume**: Upload your resume in PDF, DOC, or DOCX format
3. **Browse Jobs**: View available job postings
4. **Analyze Match**: Select a job and analyze how well your resume matches
5. **View Results**: Review match percentage, matched skills, missing skills, and improvement suggestions

### For Recruiters/Admins

1. **Register/Login**: Create an account with Recruiter or Admin role
2. **Access Admin Panel**: Navigate to the Admin Panel from the navigation menu
3. **Create Jobs**: Add new job postings with required skills, experience, and qualifications
4. **Manage Jobs**: Edit or delete existing job postings

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Resumes
- `POST /api/resumes/upload` - Upload a resume (Authenticated)
- `GET /api/resumes/my-resumes` - Get user's resumes (Authenticated)
- `GET /api/resumes/{id}` - Get a specific resume (Authenticated)

### Jobs
- `GET /api/jobs` - Get all active jobs
- `GET /api/jobs/{id}` - Get a specific job
- `POST /api/jobs` - Create a new job (Recruiter/Admin)
- `PUT /api/jobs/{id}` - Update a job (Recruiter/Admin)
- `DELETE /api/jobs/{id}` - Delete a job (Recruiter/Admin)

### Analysis
- `POST /api/analysis/analyze?resumeId={id}&jobId={id}` - Analyze resume against job (Authenticated)

## Database Schema

- **users**: User accounts with authentication information
- **resumes**: Uploaded resume files and extracted data
- **jobs**: Job postings with requirements and qualifications

## Security Features

- JWT-based authentication
- Password encryption using BCrypt
- Role-based access control (RBAC)
- CORS configuration for frontend-backend communication
- Secure file upload validation

## File Structure

```
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/ats/resumeanalyzer/
│   │   │   │   ├── config/         # Security and CORS configuration
│   │   │   │   ├── controller/     # REST API controllers
│   │   │   │   ├── dto/            # Data Transfer Objects
│   │   │   │   ├── model/          # Entity models
│   │   │   │   ├── repository/     # JPA repositories
│   │   │   │   ├── security/       # JWT filter
│   │   │   │   ├── service/        # Business logic
│   │   │   │   └── util/           # Utility classes
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Page components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Troubleshooting

### Backend Issues
- Ensure MySQL is running and credentials are correct
- Check if port 8080 is available
- Verify Java version is 17 or higher

### Frontend Issues
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Ensure backend is running before starting frontend

### File Upload Issues
- Check file size (max 10MB)
- Verify file format (PDF, DOC, DOCX only)
- Ensure `uploads/resumes/` directory has write permissions

## Future Enhancements

- AI/ML-based skill extraction using NLP
- Advanced matching algorithms
- Resume template suggestions
- Email notifications
- Multi-language support
- Resume versioning
- Advanced analytics and reporting

## License

This project is open source and available for educational purposes.

## Contributing

Contributions, issues, and feature requests are welcome!

## Support

For support, please open an issue in the repository or contact the development team.
