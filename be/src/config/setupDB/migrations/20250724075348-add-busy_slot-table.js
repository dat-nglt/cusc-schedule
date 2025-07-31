'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('busy_slots', {
      busy_slot_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
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
      slot_id: {
        type: Sequelize.STRING(30),
        allowNull: false,
        references: {
          model: 'time_slots',
          key: 'slot_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      day: {
        type: Sequelize.STRING(10),
        allowNull: false,
        comment: 'Day of week (e.g., "Tue", "Thu")'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('busy_slots');
  }
};
