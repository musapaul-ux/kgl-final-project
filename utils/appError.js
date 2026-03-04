// utils/appError.js

/**
 * Custom Error Class
 * Used to create operational (expected) errors
 * Example: invalid login, product not found, etc.
 */

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;