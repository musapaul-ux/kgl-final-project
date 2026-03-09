const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const {
    createProcurement,
    getAllProcurement,
    deleteProcurement
} = require('../controllers/procurementController');


/**
 * @swagger
 * tags:
 *   name: Procurement
 *   description: Procurement operations for produce and inventory
 */

/**
 * @swagger
 * /procurement:
 *   post:
 *     summary: Create a new procurement record
 *     description: Create a procurement entry and update the branch inventory accordingly.
 *     tags: [Procurement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produceName
 *               - supplierType
 *               - supplierName
 *               - produceType
 *               - date
 *               - time
 *               - tonnageKgs
 *               - costUgx
 *               - branchName
 *               - contact
 *             properties:
 *               produceName:
 *                 type: string
 *                 example: "Beans"
 *               supplierType:
 *                 type: string
 *                 enum: [Individual, Farm]
 *                 example: "Individual"
 *               supplierName:
 *                 type: string
 *                 example: "John Doe"
 *               produceType:
 *                 type: string
 *                 example: "Grain"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-03-10"
 *               time:
 *                 type: string
 *                 example: "14:30"
 *               tonnageKgs:
 *                 type: number
 *                 example: 1200
 *               costUgx:
 *                 type: number
 *                 example: 300000
 *               branchName:
 *                 type: string
 *                 example: "Kampala Branch"
 *               contact:
 *                 type: string
 *                 example: "0771234567"
 *               PriceToBeSoldAt:
 *                 type: number
 *                 example: 350
 *     responses:
 *       201:
 *         description: Procurement created successfully along with updated product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 procurement:
 *                   type: object
 *                   description: The newly created procurement record
 *                 product:
 *                   type: object
 *                   description: The product record with updated inventory
 *       400:
 *         description: Validation error (e.g., Individual dealer < 1000kg or farm name mismatch)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Individual dealer deliveries must be at least 1000kgs"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while creating procurement"
 */
router.post('/', auth, role('Manager'), createProcurement);



/**
 * @swagger
 * tags:
 *   name: Procurement
 *   description: Procurement operations for produce and inventory
 */

/**
 * @swagger
 * /procurement/all:
 *   get:
 *     summary: Get all procurement records
 *     description: Retrieve all procurement entries with manager information.
 *     tags: [Procurement]
 *     responses:
 *       200:
 *         description: List of all procurement records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "642f7c5f1a3b2e0012345678"
 *                   produceName:
 *                     type: string
 *                     example: "Beans"
 *                   supplierType:
 *                     type: string
 *                     example: "Individual"
 *                   supplierName:
 *                     type: string
 *                     example: "John Doe"
 *                   produceType:
 *                     type: string
 *                     example: "Grain"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2026-03-10"
 *                   time:
 *                     type: string
 *                     example: "14:30"
 *                   tonnageKgs:
 *                     type: number
 *                     example: 1200
 *                   costUgx:
 *                     type: number
 *                     example: 300000
 *                   branchName:
 *                     type: string
 *                     example: "Kampala Branch"
 *                   contact:
 *                     type: string
 *                     example: "0771234567"
 *                   PriceToBeSoldAt:
 *                     type: number
 *                     example: 350
 *                   manager:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Alice Manager"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching procurement records"
 */
router.get('/', auth, role('Manager', 'Director'), getAllProcurement);



/**
 * @swagger
 * tags:
 *   name: Procurement
 *   description: Procurement operations for produce and inventory
 */

/**
 * @swagger
 * /procurement/{id}:
 *   delete:
 *     summary: Delete a procurement record
 *     description: Deletes a procurement record by ID and reverses the stock from the branch inventory.
 *     tags: [Procurement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Procurement record ID
 *         schema:
 *           type: string
 *           example: "642f7c5f1a3b2e0012345678"
 *     responses:
 *       200:
 *         description: Procurement deleted successfully and stock reversed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Procurement deleted and stock reversed"
 *       404:
 *         description: Procurement record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Record not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while deleting procurement"
 */
router.delete('/:id', auth, role('Manager'), deleteProcurement);

module.exports = router;