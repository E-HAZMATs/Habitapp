'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    })
    
    await queryInterface.addColumn('Habits', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    })
    
    await queryInterface.addColumn('HabitLogs', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    })
    
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'deletedAt')
    queryInterface.removeColumn('Habits', 'deletedAt')
    queryInterface.removeColumn('HabitLogs', 'deletedAt')
  }
};
