const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const {
    createProcurement,
    getAllProcurement,
    deleteProcurement
} = require('../controllers/procurementController');

router.post('/', auth, role('Manager'), createProcurement);
router.get('/', auth, role('Manager', 'Director'), getAllProcurement);
router.delete('/:id', auth, role('Manager'), deleteProcurement);

module.exports = router;