const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'https://resume-job-fit-analyzer-jdck.vercel.app',
    process.env.CORS_ORIGINS
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins for now, can restrict later
        }
    },
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection Strategy for Serverless
let cachedDb = null;

const connectDB = async () => {
    if (cachedDb) {
        // console.log('Using cached database instance');
        return cachedDb;
    }

    // Check if we have an active connection state
    if (mongoose.connection.readyState === 1) {
        cachedDb = mongoose.connection;
        return cachedDb;
    }

    try {
        console.log('Initiating new MongoDB connection...');
        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 15000, // 15 seconds timeout
            socketTimeoutMS: 45000,
            family: 4, // Use IPv4
            bufferCommands: false // Disable buffering to fail fast if no connection
        });

        cachedDb = conn.connection;
        console.log('✅ MongoDB Connected Successfully');
        return cachedDb;
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        throw err;
    }
};

// Middleware to ensure database is connected before handling requests
app.use(async (req, res, next) => {
    // Skip DB connection for health check and static files
    if (req.path === '/api/health' || req.path.startsWith('/uploads')) {
        return next();
    }

    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resumes', require('./routes/resumes'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/analysis', require('./routes/analysis'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'UP' });
});

app.get('/', (req, res) => {
    res.json({
        message: 'ATS Resume Analyzer API is Running',
        version: '1.0.0',
        documentation: 'Use /api/auth, /api/resumes, /api/jobs endpoints'
    });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
