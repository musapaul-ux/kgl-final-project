const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const {
    getDashboardSummary,
    getBranchPerformance,
    getMonthlySalesReport
} = require('../controllers/directorController');


// All routes here require Director role
router.use(auth);
router.use(role('Director'));


// Director Dashboard Summary
router.get('/dashboard', getDashboardSummary);

// Branch Performance Report
router.get('/branch-performance', getBranchPerformance);

// Monthly Sales Report
router.get('/monthly-sales', getMonthlySalesReport);

module.exports = router;