const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const {
    createCredit,
    getAllCredits,
    deleteCredit
} = require('../controllers/creditSaleController');

/**
 * @swagger
 * /credits:
 *   post:
 *     summary: Create a credit sale
 *     description: Records a credit sale for a buyer and reduces the available stock of the product in the specified branch.
 *     tags:
 *       - Credits
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - buyerName
 *               - amountDue
 *               - produceName
 *               - tonnageKgs
 *               - branchName
 *             properties:
 *               buyerName:
 *                 type: string
 *                 example: Samuel Traders
 *               nationalId:
 *                 type: string
 *                 example: CM12345678ABC
 *               location:
 *                 type: string
 *                 example: Nakawa Market
 *               contact:
 *                 type: string
 *                 example: +256700123456
 *               amountDue:
 *                 type: number
 *                 example: 850000
 *               salesAgentName:
 *                 type: string
 *                 example: Peter Okello
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-04-01
 *               produceName:
 *                 type: string
 *                 example: Beans
 *               produceType:
 *                 type: string
 *                 example: Red Beans
 *               tonnageKgs:
 *                 type: number
 *                 example: 200
 *               dispatchDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-03-10
 *               branchName:
 *                 type: string
 *                 example: Kampala
 *     responses:
 *       201:
 *         description: Credit sale created successfully and stock updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 credit:
 *                   type: object
 *                   description: Created credit record
 *                 product:
 *                   type: object
 *                   description: Updated product stock information
 *       400:
 *         description: Insufficient stock available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Insufficient stock available
 *       404:
 *         description: Product not found for branch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found for branch
 *       500:
 *         description: Server error
 */
router.post('/', auth, role('SalesAgent', 'Manager'), createCredit);

/**
 * @swagger
 * /credits:
 *   get:
 *     summary: Get all credit sales
 *     description: Retrieves a list of all credit transactions including the sales agent information who recorded them.
 *     tags:
 *       - Credits
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all credit sales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 67ce82abf9c34212a78c54f1
 *                   buyerName:
 *                     type: string
 *                     example: Samuel Traders
 *                   nationalId:
 *                     type: string
 *                     example: CM12345678ABC
 *                   location:
 *                     type: string
 *                     example: Nakawa Market
 *                   contact:
 *                     type: string
 *                     example: +256700123456
 *                   amountDue:
 *                     type: number
 *                     example: 850000
 *                   salesAgentName:
 *                     type: string
 *                     example: Peter Okello
 *                   dueDate:
 *                     type: string
 *                     example: 2026-04-01
 *                   produceName:
 *                     type: string
 *                     example: Beans
 *                   produceType:
 *                     type: string
 *                     example: Red Beans
 *                   tonnageKgs:
 *                     type: number
 *                     example: 200
 *                   dispatchDate:
 *                     type: string
 *                     example: 2026-03-10
 *                   branchName:
 *                     type: string
 *                     example: Kampala
 *                   agent:
 *                     type: object
 *                     description: Sales agent who recorded the credit
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Peter Okello
 *                       branch:
 *                         type: string
 *                         example: Kampala
 *       500:
 *         description: Server error
 */
router.get('/', auth, role('Manager', 'Director', 'SalesAgent'), getAllCredits);

/**
 * @swagger
 * /credits/{id}:
 *   delete:
 *     summary: Delete a credit sale record
 *     description: Deletes a credit sale record and restores the deducted stock quantity back to the corresponding product in the branch.
 *     tags:
 *       - Credits
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the credit record
 *         schema:
 *           type: string
 *           example: 67ce82abf9c34212a78c54f1
 *     responses:
 *       200:
 *         description: Credit record deleted successfully and stock restored
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Credit record deleted and stock restored
 *       404:
 *         description: Credit record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Record not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, role('Manager'), deleteCredit);

module.exports = router;
