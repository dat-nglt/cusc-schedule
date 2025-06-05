'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rooms', {
      room_id: {
        type: Sequelize.STRING(30),
        primaryKey: true,
        allowNull: false
      },
      room_name: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      location: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      type: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      note: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rooms');
  }
};
