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
router.post('/', auth, role('SalesAgent', 'Manager'), createSale);

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Get all recorded sales
 *     description: Retrieves a list of all sales recorded in the system including the sales agent information.
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all sales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 65f5a5c6a3f9b34c82e1d456
 *                   produceName:
 *                     type: string
 *                     example: Beans
 *                   branchName:
 *                     type: string
 *                     example: Kampala
 *                   tonnageKgs:
 *                     type: number
 *                     example: 120
 *                   amountPaid:
 *                     type: number
 *                     example: 500000
 *                   buyerName:
 *                     type: string
 *                     example: Kato Traders
 *                   salesAgentName:
 *                     type: string
 *                     example: John Peter
 *                   date:
 *                     type: string
 *                     example: 2026-03-10
 *                   time:
 *                     type: string
 *                     example: 10:30
 *                   agent:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: John Peter
 *                       branch:
 *                         type: string
 *                         example: Kampala
 *       500:
 *         description: Server error
 */
router.get('/', auth, role('Manager', 'Director', 'SalesAgent'), getAllSales);

/**
 * @swagger
 * /sales/{id}:
 *   get:
 *     summary: Get a single sale by ID
 *     description: Retrieves details of a specific sale including the sales agent information.
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the sale
 *         schema:
 *           type: string
 *           example: 65f5a5c6a3f9b34c82e1d456
 *     responses:
 *       200:
 *         description: Sale retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 65f5a5c6a3f9b34c82e1d456
 *                 produceName:
 *                   type: string
 *                   example: Beans
 *                 branchName:
 *                   type: string
 *                   example: Kampala
 *                 tonnageKgs:
 *                   type: number
 *                   example: 120
 *                 amountPaid:
 *                   type: number
 *                   example: 500000
 *                 buyerName:
 *                   type: string
 *                   example: Kato Traders
 *                 salesAgentName:
 *                   type: string
 *                   example: John Peter
 *                 date:
 *                   type: string
 *                   example: 2026-03-10
 *                 time:
 *                   type: string
 *                   example: 10:30
 *                 agent:
 *                   type: object
 *                   description: Sales agent information
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                       example: John Peter
 *                     branch:
 *                       type: string
 *                       example: Kampala
 *       404:
 *         description: Sale not found
 *       500:
 *         description: Server error
 */
router.get('/:id', auth, role('Manager', 'Director', 'SalesAgent'), getSaleById);

/**
 * @swagger
 * /sales/{id}:
 *   delete:
 *     summary: Delete a sale and restore stock
 *     description: Deletes a specific sale record and restores the sold quantity back to the product stock in the respective branch.
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the sale to delete
 *         schema:
 *           type: string
 *           example: 65f5a5c6a3f9b34c82e1d456
 *     responses:
 *       200:
 *         description: Sale deleted successfully and stock restored
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sale deleted and stock restored
 *       404:
 *         description: Sale not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sale not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, role('Manager'), deleteSale);

module.exports = router;