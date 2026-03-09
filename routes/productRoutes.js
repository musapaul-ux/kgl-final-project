const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const {
    createProduct,
    getProducts, 
    updateProduct,
    deleteProduct
} = require('../controllers/productController');


/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management operations
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     description: Add a new product to the inventory.
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - quantity
 *               - price
 *               - branch
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Beans"
 *               quantity:
 *                 type: number
 *                 example: 1000
 *               price:
 *                 type: number
 *                 example: 350
 *               branch:
 *                 type: string
 *                 example: "Kampala Branch"
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "642f7c5f1a3b2e0012345678"
 *                 name:
 *                   type: string
 *                   example: "Beans"
 *                 quantity:
 *                   type: number
 *                   example: 1000
 *                 price:
 *                   type: number
 *                   example: 350
 *                 branch:
 *                   type: string
 *                   example: "Kampala Branch"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-03-10T14:30:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-03-10T14:30:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while creating product"
 */
router.post('/', auth, role('Manager'), createProduct);


/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management operations
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products in the inventory.
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
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
 *                   name:
 *                     type: string
 *                     example: "Beans"
 *                   quantity:
 *                     type: number
 *                     example: 1000
 *                   price:
 *                     type: number
 *                     example: 350
 *                   branch:
 *                     type: string
 *                     example: "Kampala Branch"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-03-10T14:30:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-03-10T14:30:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching products"
 */
router.get('/', auth, role('Manager', 'Director','SalesAgent'), getProducts);


/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management operations
 */

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Update a product
 *     description: Update a product by its ID.
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID to update
 *         schema:
 *           type: string
 *           example: "642f7c5f1a3b2e0012345678"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Beans"
 *               quantity:
 *                 type: number
 *                 example: 1200
 *               price:
 *                 type: number
 *                 example: 400
 *               branch:
 *                 type: string
 *                 example: "Kampala Branch"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "642f7c5f1a3b2e0012345678"
 *                 name:
 *                   type: string
 *                   example: "Beans"
 *                 quantity:
 *                   type: number
 *                   example: 1200
 *                 price:
 *                   type: number
 *                   example: 400
 *                 branch:
 *                   type: string
 *                   example: "Kampala Branch"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-03-10T14:30:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-03-12T09:15:00.000Z"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating product"
 */
router.patch('/:id', auth, role('Manager'), updateProduct);


/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management operations
 */

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Delete a product from the inventory by its ID.
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID to delete
 *         schema:
 *           type: string
 *           example: "642f7c5f1a3b2e0012345678"
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while deleting product"
 */
router.delete('/:id', auth, role('Manager'), deleteProduct);

module.exports = router;