const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const {login} = require('../controllers/authController');

router.post('/login', login);   

module.exports = router;    