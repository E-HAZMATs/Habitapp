const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Habit = sequelize.define('Habit', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  frequencyType: { type: DataTypes.ENUM('daily', 'weekly', 'monthly'), allowNull: false },
  frequencyAmount: { type: DataTypes.INTEGER, defaultValue: 1 }, 
  dayOfWeek: { type: DataTypes.INTEGER, allowNull: true }, 
  dayOfMonth: { type: DataTypes.INTEGER, allowNull: true }, 
  timeOfDay: { type: DataTypes.TIME, allowNull: true }, 
}, {
  tableName: 'Habits',
  timestamps: true,
});

Habit.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Habit, { foreignKey: 'userId' });

module.exports = Habit;
