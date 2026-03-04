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

router.post('/', auth, role('SalesAgent', 'Manager'), createSale);
router.get('/', auth, role('Manager', 'Director', 'SalesAgent'), getAllSales);
router.get('/:id', auth, role('Manager', 'Director', 'SalesAgent'), getSaleById);
router.delete('/:id', auth, role('Manager'), deleteSale);

module.exports = router;