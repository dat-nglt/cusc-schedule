'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('program_subject_semesters', {
      ps_semester_id: {
        type: Sequelize.STRING(30),
        primaryKey: true,
        allowNull: false
      },
      program_semester_id: {
        type: Sequelize.STRING(30),
        allowNull: false,
        references: {
          model: 'program_semesters',
          key: 'program_semester_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      subject_id: {
        type: Sequelize.STRING(30),
        allowNull: false,
        references: {
          model: 'subjects',
          key: 'subject_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

  down: async (queryInterface) => {
    await queryInterface.dropTable('program_subject_semesters');
  }
};