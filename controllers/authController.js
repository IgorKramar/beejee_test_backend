const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Логин администратора
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Логин и пароль обязательны' });
    }
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Неверные данные для входа' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Неверные данные для входа' });
    }
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '24h' });
    res.json({ token, message: 'Успешная авторизация' });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка авторизации' });
  }
};

// Проверка токена
exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    res.json({ valid: true, user: decoded });
  } catch (e) {
    res.status(401).json({ message: 'Недействительный токен' });
  }
}; 