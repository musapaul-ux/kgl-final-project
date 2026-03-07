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

router.post('/',auth,role('Manager'), createUser);
router.get('/', auth, role('Manager'), getUsers);
router.get('/:id', auth, role('Manager'), getUserById);
router.patch('/:id', auth, role('Manager'), updateUser);
router.delete('/:id', auth, role('Manager'), deleteUser);

module.exports = router;