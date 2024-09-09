const express = require('express');
const { register, login, protect } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);4


module.exports = router;
