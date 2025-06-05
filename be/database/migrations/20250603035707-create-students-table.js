'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('students', {
      student_id: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false
      },
      class: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      admission_year: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      gpa: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true
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
    await queryInterface.dropTable('students');
  }
};