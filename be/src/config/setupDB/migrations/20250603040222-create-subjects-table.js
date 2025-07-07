'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subjects', {
      subject_id: {
        type: Sequelize.STRING(30),
        primaryKey: true,
        allowNull: false
      },
      subject_name: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      credit: {
        type: Sequelize.SMALLINT,
        allowNull: true
      },
      theory_hours: {
        type: Sequelize.SMALLINT,
        allowNull: true
      },
      practice_hours: {
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
      semester_id: {
        type: Sequelize.STRING(30),
        allowNull: true,
        references: {
          model: 'semesters',
          key: 'semester_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subjects');
  }
};
