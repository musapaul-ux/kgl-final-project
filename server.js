require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const path = require('path');

const app = express();



// DATABASE CONNECTION

connectDB();



// SECURITY MIDDLEWARE

//  Set secure HTTP headers
app.use(
helmet.contentSecurityPolicy({
directives: {
defaultSrc: ["'self'"],
scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
styleSrc: ["'self'", "'unsafe-inline'"]
}
})
);

//  Enable CORS (restrict in production)
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://yourdomain.com'
        : '*',
    credentials: true
}));

//  Rate Limiting (prevent brute force)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100, // limit each IP
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Body parser with size limit
app.use(express.json({ limit: '10kb' }));

//  Prevent NoSQL injection
// app.use(mongoSanitize()); // Commented out due to Express 5 compatibility issue with req.query

// Prevent XSS attacks
// app.use(xss()); // Commented out due to Express 5 compatibility issue with req.query

// Prevent HTTP Parameter Pollution
// app.use(hpp()); // Commented out due to Express 5 compatibility issue with req.query



// LOGGING (DEV ONLY

//  STATIC FILES

app.use(express.static(path.join(__dirname, 'public')));


//  ROUTES

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/sales', require('./routes/cashSaleRoutes'));
app.use('/api/credit', require('./routes/creditSaleRoutes')); // credit records for trusted buyers
app.use('/api/procurement', require('./routes/procurementRoutes'));
app.use('/api/director', require('./routes/directorRoutes'));



//  404 HANDLER

app.use((req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Route ${req.originalUrl} not found`
    });
});



//  GLOBAL ERROR HANDLER

app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.statusCode || 500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production'
            ? 'Something went wrong'
            : err.message
    });
});


//  START SERVER

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});