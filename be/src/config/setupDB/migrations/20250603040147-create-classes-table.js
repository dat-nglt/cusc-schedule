'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('classes', {
      class_id: {
        type: Sequelize.STRING(30),
        primaryKey: true,
        allowNull: false
      },
      class_size: {
        type: Sequelize.SMALLINT,
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
      student_id: {
        type: Sequelize.STRING(30),
        allowNull: true,
        references: {
          model: 'students',
          key: 'student_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      course_id: {
        type: Sequelize.STRING(30),
        allowNull: true,
        references: {
          model: 'courses',
          key: 'course_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('classes');
  }
};
