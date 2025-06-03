'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exam_schedules', {
      exam_schedule_id: {
        type: Sequelize.STRING(30),
        primaryKey: true,
        allowNull: false
      },
      exam_schedule_name: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      method: {
        type: Sequelize.STRING(30),
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
      room_id: {
        type: Sequelize.STRING(30),
        allowNull: true,
        references: {
          model: 'rooms',
          key: 'room_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      break_id: {
        type: Sequelize.STRING(30),
        allowNull: true,
        references: {
          model: 'break_schedule',
          key: 'break_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      time_slot_id: {
        type: Sequelize.STRING(30),
        allowNull: true,
        references: {
          model: 'time_slots',
          key: 'slot_id'
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
      },
      lecturer_id: {
        type: Sequelize.STRING(50),
        allowNull: true,
        references: {
          model: 'lecturers',
          key: 'lecturer_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('exam_schedules');
  }
};
