const { Task } = require('../models');
const { Op } = require('sequelize');

// Получение задач с пагинацией и сортировкой
exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 3;
    const offset = (page - 1) * limit;
    const sortField = req.query.sortField || 'id';
    const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';

    // Разрешённые поля для сортировки
    const allowedSortFields = ['username', 'email', 'status'];
    const order = allowedSortFields.includes(sortField)
      ? [[sortField, sortOrder]]
      : [['id', 'ASC']];

    const { count, rows } = await Task.findAndCountAll({
      limit,
      offset,
      order,
    });

    res.json({
      tasks: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка получения задач' });
  }
};

// Создание новой задачи
exports.createTask = async (req, res) => {
  try {
    const { username, email, text } = req.body;
    if (!username || !email || !text) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }
    // Простейшая email-валидация
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Некорректный email' });
    }
    // XSS: экранируем текст (простейшая защита)
    const sanitizedText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const task = await Task.create({ username, email, text: sanitizedText });
    res.status(201).json({ message: 'Задача успешно создана', task });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка создания задачи' });
  }
};

// Редактирование задачи (только для администратора)
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, status } = req.body;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }
    const updates = {};
    if (text !== undefined) {
      // XSS: экранируем текст
      updates.text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      updates.isEdited = true; // Отмечаем, что задача отредактирована админом
    }
    if (status !== undefined) {
      updates.status = status;
    }
    await task.update(updates);
    res.json({ message: 'Задача успешно обновлена', task });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка обновления задачи' });
  }
}; 