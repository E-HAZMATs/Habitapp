'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'roleId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'Roles', key: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'roleId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'Roles', key: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
  },
};
