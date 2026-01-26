'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', "timezone", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Asia/Riyadh",
    });

    await queryInterface.addColumn("HabitLogs", "timezone", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Asia/Riyadh",
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'timezone');
    await queryInterface.removeColumn('HabitLogs', 'timezone');
  }
};
