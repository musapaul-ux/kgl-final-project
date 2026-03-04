const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const {
    createCredit,
    getAllCredits,
    deleteCredit
} = require('../controllers/creditSaleController');

router.post('/', auth, role('SalesAgent', 'Manager'), createCredit);
router.get('/', auth, role('Manager', 'Director', 'SalesAgent'), getAllCredits);
router.delete('/:id', auth, role('Manager'), deleteCredit);

module.exports = router;
