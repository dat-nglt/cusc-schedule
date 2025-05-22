const express = require('express');
const { login, register } = require('../controllers/authController');
const { validateLogin, validateRegister } = require('../utils/validation');

const router = express.Router();

// Login route
router.post('/login', validateLogin, login);

// Register route
router.post('/register', validateRegister, register);

module.exports = router;