const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management operations
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user account. Branch is required for Managers and SalesAgents. Enforces branch-specific limits.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Alice Manager"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "alice@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *               role:
 *                 type: string
 *                 enum: [Admin, Manager, SalesAgent]
 *                 example: "Manager"
 *               branch:
 *                 type: string
 *                 example: "Kampala Branch"
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                   example: "Alice Manager"
 *                 email:
 *                   type: string
 *                   example: "alice@example.com"
 *                 role:
 *                   type: string
 *                   example: "Manager"
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
 *       400:
 *         description: Validation error (branch missing or limit exceeded)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Each branch can have only one manager"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while creating user"
 */
router.post('/',auth,role('Manager'), createUser);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management operations
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users. Passwords are excluded from the response.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
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
 *                     example: "Alice Manager"
 *                   email:
 *                     type: string
 *                     example: "alice@example.com"
 *                   role:
 *                     type: string
 *                     example: "Manager"
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
 *                   example: "An error occurred while fetching users"
 */
router.get('/', auth, role('Manager'), getUsers);


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management operations
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a single user by their ID. Password is excluded from the response.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to retrieve
 *         schema:
 *           type: string
 *           example: "642f7c5f1a3b2e0012345678"
 *     responses:
 *       200:
 *         description: User retrieved successfully
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
 *                   example: "Alice Manager"
 *                 email:
 *                   type: string
 *                   example: "alice@example.com"
 *                 role:
 *                   type: string
 *                   example: "Manager"
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
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching user"
 */
router.get('/:id', auth, role('Manager'), getUserById);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management operations
 */

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update a user by ID. Password is excluded from the response.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to update
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
 *                 example: "Alice Manager"
 *               email:
 *                 type: string
 *                 example: "alice@example.com"
 *               role:
 *                 type: string
 *                 enum: [Admin, Manager, SalesAgent]
 *                 example: "Manager"
 *               branch:
 *                 type: string
 *                 example: "Kampala Branch"
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                   example: "Alice Manager"
 *                 email:
 *                   type: string
 *                   example: "alice@example.com"
 *                 role:
 *                   type: string
 *                   example: "Manager"
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating user"
 */
router.patch('/:id', auth, role('Manager'), updateUser);



/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management operations
 */

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user from the system by their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to delete
 *         schema:
 *           type: string
 *           example: "642f7c5f1a3b2e0012345678"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while deleting user"
 */
router.delete('/:id', auth, role('Manager'), deleteUser);

module.exports = router;