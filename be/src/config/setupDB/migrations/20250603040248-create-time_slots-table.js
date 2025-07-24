'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('time_slots', {
      slot_id: {
        type: Sequelize.STRING(30),
        primaryKey: true,
        allowNull: false
      },
      slot_name: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      type: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      status: {
        type: Sequelize.STRING(30),
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
    await queryInterface.dropTable('time_slots');
  }
};
