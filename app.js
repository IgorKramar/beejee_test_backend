require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const { initDb, User } = require('./models');
const bcrypt = require('bcrypt');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(cors());
app.use(bodyParser.json());

// Роуты будут добавлены позже
app.get('/', (req, res) => {
  res.send('API работает');
});

app.use('/tasks', taskRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await initDb();
  // Создаём администратора, если его нет
  const admin = await User.findOne({ where: { username: 'admin' } });
  if (!admin) {
    const hash = await bcrypt.hash('123', 10);
    await User.create({ username: 'admin', password: hash });
    console.log('Администратор создан: admin/123');
  }
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
};

startServer(); 