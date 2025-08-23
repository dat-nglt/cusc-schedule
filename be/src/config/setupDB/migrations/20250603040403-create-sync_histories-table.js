'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sync_histories', {
      sync_id: {
        type: Sequelize.STRING(30),
        primaryKey: true,
        allowNull: false
      },
      format: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      data_type: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      data_source: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      parameter: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      auth: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      write_mode: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      sync_time: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('sync_histories');
  }
};
