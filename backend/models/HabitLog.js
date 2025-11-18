const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Habit = require('./Habit');

const HabitLog = sequelize.define('HabitLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  habitId: { type: DataTypes.INTEGER, allowNull: false },
  completedAt: { type: DataTypes.DATE, allowNull: false },
}, {
  tableName: 'HabitLogs',
  timestamps: true,
});

HabitLog.belongsTo(Habit, { foreignKey: 'habitId' });
Habit.hasMany(HabitLog, { foreignKey: 'habitId' });

module.exports = HabitLog;
