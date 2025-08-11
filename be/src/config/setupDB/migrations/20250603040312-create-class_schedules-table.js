'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('class_schedules', {
      class_schedule_id: {
        type: Sequelize.STRING(30),
        primaryKey: true,
        allowNull: false
      },
      class_schedule_name: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      day_of_week: {
        type: Sequelize.ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'),
        allowNull: false
      },
      week_number: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        comment: 'Week number in the semester (1-16)'
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
      semester: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      academic_year: {
        type: Sequelize.SMALLINT,
        allowNull: true
      },
      schedule_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
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
        allowNull: false,
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
      slot_id: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
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
      lecturer_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        references: {
          model: 'lecturers',
          key: 'lecturer_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });

    // Add indexes for better query performance

    await queryInterface.addIndex('class_schedules', ['lecturer_id', 'week_number'], {
      name: 'idx_class_schedules_lecturer_week'
    });

    await queryInterface.addIndex('class_schedules', ['room_id', 'weekday', 'slot_id'], {
      name: 'idx_class_schedules_room_schedule'
    });

    await queryInterface.addIndex('class_schedules', ['class_id', 'week_number'], {
      name: 'idx_class_schedules_class_week'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('class_schedules');
  }
};
