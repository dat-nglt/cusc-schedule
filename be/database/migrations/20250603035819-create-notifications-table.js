'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      noti_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      description: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      type: {
        type: Sequelize.STRING(40),
        allowNull: true
      },
      priority: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      channel: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      send_time: {
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
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notifications');
  }
};
