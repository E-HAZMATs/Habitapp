'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Habits', 'lastCompleted');

    await queryInterface.addColumn('Habits', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });

    await queryInterface.addColumn('HabitLogs', 'status', {
      type: Sequelize.ENUM('completed', 'missed', 'skipped'),
      allowNull: false,
      defaultValue: 'completed'
    });

    await queryInterface.addColumn('HabitLogs', 'dueDate', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    await queryInterface.addColumn('HabitLogs', 'nextDueDate', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // FOr older data.
    });

    await queryInterface.addColumn('Habits', "nextDueDate", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('HabitLogs', 'nextDueDate');
    await queryInterface.removeColumn('HabitLogs', 'dueDate');
    await queryInterface.removeColumn('HabitLogs', 'status');
    await queryInterface.removeColumn("Habits", "nextDueDate");
    
    await queryInterface.removeColumn('Habits', 'isActive');
    
    await queryInterface.addColumn('Habits', 'lastCompleted', {
      type: Sequelize.DATE,
      allowNull: true
    });
  }
};