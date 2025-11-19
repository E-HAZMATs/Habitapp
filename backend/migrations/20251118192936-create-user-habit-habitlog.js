'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      name: {type: Sequelize.STRING(100), allowNull: false},
      email: {type: Sequelize.STRING, unique: true, allowNull: false},
      password: {type: Sequelize.STRING(250), allowNull: false},
      createdAt: {type: Sequelize.DATE, allowNull: false},
      updatedAt: {type: Sequelize.DATE, allowNull: false}
    });

    await queryInterface.createTable('Habits', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      name: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      frequencyType: { type: Sequelize.STRING(50), allowNull: false }, 
      frequencyAmount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 }, 
      dayOfWeek: { type: Sequelize.INTEGER, allowNull: true }, 
      dayOfMonth: { type: Sequelize.INTEGER, allowNull: true },
      timeOfDay: { type: Sequelize.TIME, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('HabitLogs', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      habitId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Habits', key: 'id' }, onDelete: 'CASCADE' },
      completedAt: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users')
    await queryInterface.dropTable('Habits')
    await queryInterface.dropTable('HabitLogs')
  }
};
