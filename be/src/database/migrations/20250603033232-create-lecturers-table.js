'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lecturers', {
      lecturer_id: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(70),
        allowNull: true,
        unique: true
      },
      day_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      gender: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      address: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      phone_number: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      department: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      hire_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      degree: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      google_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true
      },
       status: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lecturers');
  }
};