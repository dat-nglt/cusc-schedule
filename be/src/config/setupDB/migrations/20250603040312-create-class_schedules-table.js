'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('class_schedules', {
      class_schedule_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
      class_id: {
        type: Sequelize.STRING(30),
        allowNull: false,
        references: {
          model: 'classes',
          key: 'class_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: 'Date in YYYY-MM-DD format'
      },
      day: {
        type: Sequelize.ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'),
        allowNull: false
      },
      slot_id: {
        type: Sequelize.STRING(30),
        allowNull: true,
        comment: "C1 C2"
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
      status: {
        type: Sequelize.STRING(20),
        allowNull: true,

      },
      notes: {
        type: Sequelize.TEXT,
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
      }
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('class_schedules', ['semester_id']);
    await queryInterface.addIndex('class_schedules', ['class_id']);
    await queryInterface.addIndex('class_schedules', ['date']);
    await queryInterface.addIndex('class_schedules', ['day']);
    await queryInterface.addIndex('class_schedules', ['subject_id']);
    await queryInterface.addIndex('class_schedules', ['lecturer_id']);
    await queryInterface.addIndex('class_schedules', ['room_id']);

    // Compound indexes for common queries
    await queryInterface.addIndex('class_schedules', ['semester_id', 'class_id']);
    await queryInterface.addIndex('class_schedules', ['class_id', 'date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('class_schedules');
  }
};