const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// Получить список задач
router.get('/', taskController.getTasks);

// Создать новую задачу
router.post('/', taskController.createTask);

// Редактировать задачу (только для администратора)
router.put('/:id', authMiddleware, taskController.updateTask);

module.exports = router; 