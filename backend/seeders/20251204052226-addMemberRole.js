"use strict";
const { v4 } = require("uuid");
const { User } = require("../models");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const memberRoleId = v4();
    await queryInterface.bulkInsert(
      "Roles",
      [
        {
          id: memberRoleId,
          name: "member",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {
        ignoreDuplicates: true,
      }
    );

    const [memberRole] = await queryInterface.sequelize.query(
      `select id from "Roles" where name = 'member' limit 1;`
    );
    const savedMemberRoleId = memberRole[0]?.id || memberRoleId;
    // Users should always have a role. Need to set nullable to false in the model.
    await User.update(
      { roleId: savedMemberRoleId },
      { where: { roleId: null }, paranoid: false }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Role", { name: "member" });
  },
};
