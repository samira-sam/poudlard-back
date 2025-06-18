'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("utilisateur", "resetPasswordToken", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn("utilisateur", "resetPasswordExpires", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("utilisateur", "resetPasswordToken");
    await queryInterface.removeColumn("utilisateur", "resetPasswordExpires");
  },
};