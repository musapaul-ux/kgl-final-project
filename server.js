require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const seedUsers = require('./config/seed');

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');
const morgan = require('morgan');
const path = require('path');

const app = express();



/*
 TRUST PROXY (for deployment)

*/
app.set('trust proxy', 1);

/*

 DATABASE CONNECTION

*/
connectDB().then(() => {

    // run seed only when enabled
    if (process.env.RUN_SEED === "true") {
        seedUsers();
    }

});

/*

 SECURITY MIDDLEWARE

*/

// Secure HTTP headers
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https://cdn.jsdelivr.net"]
        }
    })
);

// Enable CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://yourdomain.com'
        : '*',
    credentials: true
}));

// General API rate limit
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});

app.use('/api', apiLimiter);

// Stronger login protection
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many login attempts. Please try again later.'
});

app.use('/api/auth', authLimiter);

// Body parser
app.use(express.json({ limit: '10kb' }));

// Prevent NoSQL Injection
// app.use(mongoSanitize());

// Prevent XSS attacks
// app.use(xss());

// Prevent HTTP Parameter Pollution
// app.use(hpp());

/*

 LOGGING (DEV ONLY)

*/
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


// setting up swagger for api documentation
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/*

 STATIC FILES

*/
app.use(express.static(path.join(__dirname, 'public')));


// default home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

/*

 ROUTES

*/

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/sales', require('./routes/cashSaleRoutes'));
app.use('/api/credit', require('./routes/creditSaleRoutes'));
app.use('/api/procurement', require('./routes/procurementRoutes'));
app.use('/api/director', require('./routes/directorRoutes'));

/*

 404 HANDLER

*/

app.use((req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Route ${req.originalUrl} not found`
    });
});

/*

 GLOBAL ERROR HANDLER

*/

app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(err.statusCode || 500).json({
        status: 'error',
        message:
            process.env.NODE_ENV === 'production'
                ? 'Something went wrong'
                : err.message
    });

});

/*

 START SERVER

*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});