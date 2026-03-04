// utils/catchAsync.js

/**
 * Wrap async functions to automatically catch errors
 * Instead of writing try/catch in every controller
 */

module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};