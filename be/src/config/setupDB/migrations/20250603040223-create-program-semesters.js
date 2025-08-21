'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('program_semesters', {
      program_semester_id: {
        type: Sequelize.STRING(30),
        primaryKey: true,
        allowNull: false
      },
      program_id: {
        type: Sequelize.STRING(30),
        allowNull: false,
        references: {
          model: 'programs',
          key: 'program_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      semester_id: {
        type: Sequelize.STRING(30),
        allowNull: false,
        references: {
          model: 'semesters',
          key: 'semester_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      semester_number: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable('program_semesters');
  }
};