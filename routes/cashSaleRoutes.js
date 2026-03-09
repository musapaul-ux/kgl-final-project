const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const {
    createSale,
    getAllSales,
    getSaleById,
    deleteSale
} = require('../controllers/cashSaleController');

/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               produceName:
 *                 type: string
 *               tonnageKgs:
 *                 type: number
 *               amountPaid:
 *                 type: number
 *               buyerName:
 *                 type: string
 *               salesAgentName:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sale created successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Product not found
 */
router.post('/', auth, role('SalesAgent'), createSale);
router.post('/', auth, role('SalesAgent', 'Manager'), createSale);
router.get('/', auth, role('Manager', 'Director', 'SalesAgent'), getAllSales);
router.get('/:id', auth, role('Manager', 'Director', 'SalesAgent'), getSaleById);
router.delete('/:id', auth, role('Manager'), deleteSale);

module.exports = router;