const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Логин администратора
router.post('/login', authController.login);

// Проверка токена
router.get('/verify', authController.verifyToken);

module.exports = router; 