'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lecturer_assignments', {
      lecturer_id: {
        type: Sequelize.STRING(30),
        allowNull: false,
        references: {
          model: 'lecturers',
          key: 'lecturer_id'
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

    // Add composite primary key
    await queryInterface.addConstraint('lecturer_assignments', {
      fields: ['lecturer_id', 'subject_id'],
      type: 'primary key',
      name: 'lecturer_assignments_pkey'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lecturer_assignments');
  }
};
