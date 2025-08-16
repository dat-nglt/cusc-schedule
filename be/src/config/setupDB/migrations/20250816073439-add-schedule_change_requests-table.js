'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('schedule_change_requests', {
      request_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      class_schedule_id: {
        type: Sequelize.INTEGER,
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
      requested_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        comment: 'Ngày mới mà giảng viên muốn đổi sang'
      },
      requested_slot: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      requested_room: {
        type: Sequelize.STRING(30),
        allowNull: true,
        references: {
          model: 'rooms',
          key: 'room_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Lý do đổi lịch'
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
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

    // Index để tìm nhanh theo giảng viên và lịch học
    await queryInterface.addIndex('schedule_change_requests', ['lecturer_id']);
    await queryInterface.addIndex('schedule_change_requests', ['class_schedule_id']);
    await queryInterface.addIndex('schedule_change_requests', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('schedule_change_requests');
  }
};
