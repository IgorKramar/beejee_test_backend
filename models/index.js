const sequelize = require('../db/db');
const Task = require('./task');
const User = require('./user');

const initDb = async () => {
  await sequelize.sync();
};

module.exports = { Task, User, initDb }; 