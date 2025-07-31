'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('schedule_change_requests', {
      request_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      class_schedule_id: {
        type: Sequelize.STRING(30),
        allowNull: false,
        references: {
          model: 'class_schedules',
          key: 'class_schedule_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      lecturer_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        references: {
          model: 'lecturers',
          key: 'lecturer_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      request_type: {
        type: Sequelize.ENUM('RESCHEDULE', 'CANCEL', 'ROOM_CHANGE', 'TIME_CHANGE', 'MAKEUP_CLASS', 'SUBSTITUTE'),
        allowNull: false
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      // Requested changes
      requested_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      requested_weekday: {
        type: Sequelize.ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'),
        allowNull: true
      },
      requested_week_number: {
        type: Sequelize.SMALLINT,
        allowNull: true
      },
      requested_time_slot_id: {
        type: Sequelize.STRING(30),
        allowNull: true,
        references: {
          model: 'time_slots',
          key: 'slot_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      requested_room_id: {
        type: Sequelize.STRING(30),
        allowNull: true,
        references: {
          model: 'rooms',
          key: 'room_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      // thay đổi giảng viên
      substitute_lecturer_id: {
        type: Sequelize.STRING(50),
        allowNull: true,
        references: {
          model: 'lecturers',
          key: 'lecturer_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELED', 'EXPIRED'),
        defaultValue: 'PENDING',
        allowNull: false
      },
      approved_at: {
        type: Sequelize.DATE,
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
    await queryInterface.addIndex('schedule_change_requests', ['lecturer_id', 'status'], {
      name: 'idx_schedule_requests_lecturer_status'
    });

    await queryInterface.addIndex('schedule_change_requests', ['class_schedule_id'], {
      name: 'idx_schedule_requests_class_schedule'
    });

    await queryInterface.addIndex('schedule_change_requests', ['status', 'created_at'], {
      name: 'idx_schedule_requests_status_created'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('schedule_change_requests');
  }
};
