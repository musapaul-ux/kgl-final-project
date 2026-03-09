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
/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get dashboard summary statistics
 *     description: Retrieves key system statistics including total stock across all branches, total revenue from cash sales, and total outstanding credit amounts.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalStock:
 *                   type: number
 *                   description: Total quantity of stock available across all branches
 *                   example: 12000
 *                 totalRevenue:
 *                   type: number
 *                   description: Total revenue generated from cash sales
 *                   example: 35000000
 *                 outstandingCredits:
 *                   type: number
 *                   description: Total amount of unpaid credit sales
 *                   example: 8500000
 *       500:
 *         description: Server error
 */
router.get('/dashboard', getDashboardSummary);

// Branch Performance Report
router.get('/branch-performance', getBranchPerformance);

// Monthly Sales Report
router.get('/monthly-sales', getMonthlySalesReport);

module.exports = router;