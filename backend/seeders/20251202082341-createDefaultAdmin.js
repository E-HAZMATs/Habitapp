'use strict';
const bcrypt = require('bcryptjs');
const { v4 } = require('uuid');

// TODO: Add member role? default one for existing users.
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const adminRoleId = v4();
    await queryInterface.bulkInsert('Roles', [{
      id: adminRoleId,
      name: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {
      ignoreDuplicates: true
    });

    const [adminRole] = await queryInterface.sequelize.query(
      `select id from "Roles" where name = 'admin' limit 1;`
    );

    const roleId = adminRole[0]?.id || adminRoleId;

    const defaultAdminId = process.env.DEFAULT_ADMIN_ID || v4();
    const hashedPassword = await bcrypt.hash(
      process.env.DEFAULT_ADMIN_PASSWORD || 'Pa$$w0rd',
      10
    );

    await queryInterface.bulkInsert('Users', [{
      id: defaultAdminId,
      username: 'admin',
      email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com',
      password: hashedPassword,
      roleId: roleId,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {
      ignoreDuplicates: true
    });
  },

  async down(queryInterface, Sequelize) {
    // CHECK: Will this run if user is a system user? I added a hook to prevent deleting sys users.
    await queryInterface.bulkDelete('Users', { username: 'admin' });
  }
};