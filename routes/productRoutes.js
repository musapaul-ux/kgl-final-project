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

router.post('/', auth, role('Manager'), createProduct);
router.get('/', auth, role('Manager', 'Director','SalesAgent'), getProducts);
router.patch('/:id', auth, role('Manager'), updateProduct);
router.delete('/:id', auth, role('Manager'), deleteProduct);

module.exports = router;