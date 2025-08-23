'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('class_sections', {
      class_id: {
        type: Sequelize.STRING(30),
        allowNull: false,
        references: {
          model: 'classes',
          key: 'class_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      subject_id: {
        type: Sequelize.STRING(30),
        allowNull: false,
        references: {
          model: 'subjects',
          key: 'subject_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    });

    await queryInterface.addIndex('class_sections', {
      fields: ['class_id', 'subject_id'],
      type: 'primary key',
      name: 'class_sections_pkey'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('class_sections');
  }
};