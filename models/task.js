const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Task = sequelize.define('Task', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // false = не выполнено, true = выполнено
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // true = отредактировано админом
  },
});

module.exports = Task; 