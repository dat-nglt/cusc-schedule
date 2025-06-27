'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('class_sections', {
      class_section_id: {
        type: Sequelize.STRING(30),
        primaryKey: true,
        allowNull: false
      },
      max_students: {
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
      class_id: {
        type: Sequelize.STRING(30),
        allowNull: true,
        references: {
          model: 'classes',
          key: 'class_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      subject_id: {
        type: Sequelize.STRING(30),
        allowNull: true,
        references: {
          model: 'subjects',
          key: 'subject_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('class_sections');
  }
};
