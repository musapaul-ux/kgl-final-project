// middleware/notFound.js

const AppError = require('../utils/appError');

/**
 * If no route matches,
 * this middleware creates a 404 error
 */

module.exports = (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};